let mainMap;
let originMarker;
let destinationMarker;
let directionsService;
let primaryDirectionsRenderer;
let geocoder;
let autocompleteLocation;
let autocompleteDestination;

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    // Manejo de login, registro, y logout
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameBtn = document.getElementById('user-name-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'confirmacion.html';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'registro.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (userNameBtn) {
        userNameBtn.addEventListener('click', toggleUserDropdown);
    }

    initMap(); // Inicializa el mapa al cargar la página
});

function checkSessionAndRedirect() {
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = 'viaje.html';
    } else {
        window.location.href = 'confirmacion.html';
    }
}

function checkSession() {
    const user = localStorage.getItem('user');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (loginBtn && registerBtn && userDropdown) {
        if (user) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            userDropdown.style.display = 'block';
            document.getElementById('user-name-btn').innerText = `${JSON.parse(user).name} ▼`;
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.reload();
}

function toggleUserDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }
}

// Funciones del mapa y lógica relacionada
function initMap() {
    const initialCoordinates = { lat: 28.188347, lng: -105.557424 };
    mainMap = new google.maps.Map(document.getElementById('map'), {
        center: initialCoordinates,
        zoom: 15,
    });

    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    primaryDirectionsRenderer = new google.maps.DirectionsRenderer({
        map: mainMap,
        suppressMarkers: true,
        polylineOptions: { strokeColor: 'green', strokeWeight: 6 }
    });

    originMarker = new google.maps.Marker({ map: mainMap, position: initialCoordinates, draggable: true, title: "Origen" });
    destinationMarker = new google.maps.Marker({ map: mainMap, draggable: true, title: "Destino", visible: false });

    setupAutocomplete();

    const useLocationBtn = document.getElementById('use-location');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', useCurrentLocation);
    }

    originMarker.addListener('dragend', () => {
        updateLocationAddress(originMarker.getPosition(), 'location');
        calculateAndDisplayRoute();
        calculateCost();
    });

    destinationMarker.addListener('dragend', () => {
        updateLocationAddress(destinationMarker.getPosition(), 'destination');
        calculateAndDisplayRoute();
        calculateCost();
    });

    window.addEventListener('resize', () => google.maps.event.trigger(mainMap, 'resize'));
}

function validateForm() {
    const location = document.getElementById('location')?.value;
    const destination = document.getElementById('destination')?.value;

    if (!location || !destination) {
        alert("Por favor, ingresa tanto la ubicación como el destino.");
        return false;
    }
    return true;
}

function calculateAndDisplayRoute() {
    const origin = originMarker.getPosition();
    const destination = destinationMarker.getPosition();

    if (!origin || !destination) {
        alert("Por favor, ingresa tanto la ubicación como el destino.");
        return;
    }

    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
    }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            primaryDirectionsRenderer.setDirections(response);
        } else {
            alert('Error al calcular la ruta: ' + status);
        }
    });
}

function calculateCost() {
    const origin = originMarker.getPosition();
    const destination = destinationMarker.getPosition();

    if (origin && destination) {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                const element = response.rows[0].elements[0];
                const distance = element.distance.value / 1000;
                const duration = element.duration.value / 60;
                const cost = Math.floor(distance * 10);

                document.getElementById('cost-result').innerHTML = `
                    <div class="cost-item">
                        <i class="fas fa-money-bill-wave"></i> 
                        <p>Costo estimado del viaje: <strong>${cost} pesos</strong></p>
                    </div>
                    <div class="cost-item">
                        <i class="fas fa-road"></i> 
                        <p>Distancia: <strong>${distance.toFixed(2)} km</strong></p>
                    </div>
                    <div class="cost-item">
                        <i class="fas fa-clock"></i> 
                        <p>Tiempo estimado de llegada: <strong>${duration.toFixed(0)} minutos</strong></p>
                    </div>
                `;
            } else {
                alert("Error al calcular la distancia: " + status);
            }
        });
    }
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            mainMap.setCenter(pos);
            originMarker.setPosition(pos);
            updateLocationAddress(pos, 'location');
        });
    } else {
        alert("Tu navegador no soporta la geolocalización.");
    }
}

function updateLocationAddress(position, inputId) {
    geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.value = results[0].formatted_address;
            }
        } else {
            alert("No se pudo obtener la dirección de la ubicación.");
        }
    });
}

function setupAutocomplete() {
    const bounds = { north: 28.3600, south: 27.9400, west: -105.6000, east: -105.1000 };
    const locationInput = document.getElementById('location');
    const destinationInput = document.getElementById('destination');

    if (locationInput && destinationInput) {
        autocompleteLocation = new google.maps.places.Autocomplete(locationInput, {
            bounds: bounds,
            componentRestrictions: { country: 'mx' }
        });

        autocompleteDestination = new google.maps.places.Autocomplete(destinationInput, {
            bounds: bounds,
            componentRestrictions: { country: 'mx' }
        });

        autocompleteLocation.addListener('place_changed', () => {
            const place = autocompleteLocation.getPlace();
            if (place.geometry) {
                originMarker.setPosition(place.geometry.location);
                mainMap.setCenter(place.geometry.location);
                calculateAndDisplayRoute();
                calculateCost();
            }
        });

        autocompleteDestination.addListener('place_changed', () => {
            const place = autocompleteDestination.getPlace();
            if (place.geometry) {
                destinationMarker.setPosition(place.geometry.location);
                destinationMarker.setVisible(true);
                calculateAndDisplayRoute();
                calculateCost();
            }
        });
    } else {
        console.error("Los campos de entrada para ubicación o destino no existen.");
    }
}

// Modal handling
const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('modal').style.display = 'none';
    }
});

const modal = document.querySelector('.modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('modal').style.display = 'none';
        }
    });
}

window.onload = initMap;
