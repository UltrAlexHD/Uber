let mainMap;
let driverMarker;
let progressBar;
let progress = 0;
let isMapFullscreen = false; // Control para saber si el mapa está en pantalla completa o no

// Inicializar el mapa y los elementos al cargar la página
window.onload = function() {
    initMap();
    loadTripData();
    progressBar = document.getElementById("progress-bar");
    updateProgressBar();
};

function initMap() {
    const clientLocation = { lat: 19.432608, lng: -99.133209 }; // Ciudad de México
    mainMap = new google.maps.Map(document.getElementById('map'), {
        center: clientLocation,
        zoom: 14
    });

    driverMarker = new google.maps.Marker({
        map: mainMap,
        title: "Conductor",
        icon: 'car-icon.png', // Ícono del coche, asegúrate de tener este archivo
        visible: false
    });

    // Llama a fetchDriverLocation cada 5 segundos para actualizar la ubicación del conductor
    setInterval(fetchDriverLocation, 5000); 
}

// Cargar los datos del viaje almacenados en localStorage (ubicación, destino, etc.)
function loadTripData() {
    const location = localStorage.getItem('location');
    const destination = localStorage.getItem('destination');
    const costResult = localStorage.getItem('costResult');
    const durationResult = localStorage.getItem('durationResult');

    if (location && destination) {
        document.getElementById('trip-location').textContent = location;
        document.getElementById('trip-destination').textContent = destination;
        if (costResult && durationResult) {
            document.getElementById('cost-result').innerHTML = `
                <div class="cost-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <p>Costo estimado del viaje: <strong>${costResult} pesos</strong></p>
                </div>
                <div class="cost-item">
                    <i class="fas fa-clock"></i>
                    <p>Tiempo estimado de llegada: <strong>${durationResult} minutos</strong></p>
                </div>
            `;
        }
        calculateAndDisplayRoute();
    }
}

// Función para calcular y mostrar la ruta en el mapa
function calculateAndDisplayRoute() {
    const origin = localStorage.getItem('locationCoords'); // Coordenadas de origen almacenadas
    const destination = localStorage.getItem('destinationCoords'); // Coordenadas de destino almacenadas

    if (origin && destination) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({ map: mainMap });

        const request = {
            origin: JSON.parse(origin), // Convertir las coordenadas desde JSON
            destination: JSON.parse(destination), // Convertir las coordenadas desde JSON
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result); // Mostrar la ruta en el mapa
            } else {
                console.error('Error al calcular la ruta: ' + status);
            }
        });
    }
}

// Simula la barra de progreso del viaje
function updateProgressBar() {
    if (progress < 100) {
        progress += 20;
        progressBar.style.width = progress + "%";
        setTimeout(updateProgressBar, 1000); // Actualiza cada segundo
    } else {
        document.getElementById("status-message").textContent = "Conductor en camino...";
        document.getElementById("driver-info").classList.remove("hidden"); // Muestra la información del conductor cuando esté en camino
    }
}

// Obtener la ubicación del conductor desde el servidor cada 5 segundos
function fetchDriverLocation() {
    const tripId = new URLSearchParams(window.location.search).get('tripId'); // Obtener tripId desde los parámetros de la URL

    fetch(`fetch_driver_location.php?tripId=${tripId}`) // Ruta al archivo PHP para obtener la ubicación del conductor
        .then(response => response.json())
        .then(data => {
            if (data.driverAccepted) {
                const driverPosition = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
                driverMarker.setPosition(driverPosition); // Actualiza la posición del marcador del conductor
                driverMarker.setVisible(true); // Muestra el marcador del conductor
                mainMap.setCenter(driverPosition); // Centra el mapa en la ubicación del conductor

                // Muestra la información del conductor
                document.getElementById('driver-name').textContent = "Juan Pérez"; // Información simulada del conductor
                document.getElementById('driver-location').textContent = `Lat: ${driverPosition.lat}, Lng: ${driverPosition.lng}`;
                document.getElementById('eta').textContent = "5 minutos";
            }
        })
        .catch(error => console.error('Error obteniendo la ubicación del conductor:', error));
}

// Función para cancelar el viaje
function cancelTrip() {
    if (confirm("¿Estás seguro de que quieres cancelar el viaje?")) {
        alert("Tu viaje ha sido cancelado.");
        window.location.href = 'index.html'; // Redirige al inicio
    }
}

// Alternar entre mapa en tamaño normal y pantalla completa
function toggleMapSize() {
    const mapContainer = document.getElementById('map-container');
    if (!isMapFullscreen) {
        mapContainer.classList.add('map-fullscreen'); // Agrega la clase que hace el mapa a pantalla completa
        isMapFullscreen = true;
    } else {
        mapContainer.classList.remove('map-fullscreen'); // Remueve la clase para volver al tamaño original
        isMapFullscreen = false;
    }
}
