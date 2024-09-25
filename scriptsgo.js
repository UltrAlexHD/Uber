// Función para manejar el inicio de sesión
function login() {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    if (!email || !password) {
        alert("Por favor, ingrese su correo electrónico y contraseña.");
        return;
    }

    const loginData = { email, password };

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('user', JSON.stringify({ name: data.name, email }));
            alert('Inicio de sesión exitoso. Redirigiendo...');
            // Redirigir a la página de viaje (formulario)
            window.location.href = 'index.html';  // Asegúrate de que "index.html" sea la página de ubicación y destino
        } else {
            alert(data.message);
        }
    })
    .catch(error => alert('Ocurrió un error durante el inicio de sesión.'));
}

// Función para continuar sin iniciar sesión (modo invitado)
function submitForm() {
    const phone = document.getElementById('phone').value;
    if (!phone) {
        alert('El número de teléfono es obligatorio.');
        return;
    }

    const userData = { name: document.getElementById('name').value || 'Anónimo', phone };
    localStorage.setItem('user', JSON.stringify(userData));
    alert('Datos guardados. Redirigiendo...');
    // Redirigir a la página de viaje (formulario)
    window.location.href = 'index.html';  // Asegúrate de que "index.html" sea la página de ubicación y destino
}
