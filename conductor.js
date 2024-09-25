let map;
let passengerMarker;

// Cargar los detalles del viaje desde localStorage o desde una API (simulado aquí)
window.onload = function () {
    loadTripDetails();
    initMap();
};

// Cargar los detalles del viaje simulados desde localStorage
function loadTripDetails() {
    const tripDetails = JSON.parse(localStorage.getItem('tripDetails'));
    if (tripDetails) {
        document.getElementById('passenger-phone').textContent = tripDetails.phone;
        document.getElementById('trip-location').textContent = tripDetails.location;
        document.getElementById('trip-destination').textContent = tripDetails.destination;
        document.getElementById('distance-to-passenger').textContent = tripDetails.distance;
        document.getElementById('trip-cost').textContent = tripDetails.cost + ' pesos';
    } else {
        alert("No hay detalles del viaje disponibles.");
    }
}

// Inicializar el mapa con la ubicación del pasajero
function initMap() {
    const passengerLocation = JSON.parse(localStorage.getItem('tripDetails')).locationCoords; // Coordenadas almacenadas

    map = new google.maps.Map(document.getElementById('map'), {
        center: passengerLocation,
        zoom: 14,
    });

    passengerMarker = new google.maps.Marker({
        position: passengerLocation,
        map: map,
        title: "Ubicación del Pasajero",
    });
}

// Aceptar el viaje (puede enviar los datos a una API o backend)
document.getElementById('accept-trip-btn').addEventListener('click', () => {
    alert('Viaje aceptado. Por favor dirígete a la ubicación del pasajero.');
    // Aquí podrías hacer una llamada AJAX o fetch para actualizar el estado del viaje en la base de datos
    // fetch('/update_trip_status', { method: 'POST', body: JSON.stringify({ tripId: '...', status: 'accepted' }) })
});
