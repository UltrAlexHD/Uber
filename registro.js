// Escuchamos el evento de "submit" del formulario para validar los datos
document.getElementById("register-form").addEventListener("submit", function (event) {
    const password = document.getElementById("password-register").value;
    const confirmPassword = document.getElementById("password-confirm").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const cardNumber = document.getElementById("card-number").value;
    const profilePic = document.getElementById("profile-pic").files[0];
    const termsAccepted = document.getElementById("terms").checked;

    // Validar contraseñas
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        event.preventDefault();
        return;
    }

    // Validar número de teléfono (solo dígitos y longitud entre 7 y 15)
    if (!/^\d{7,15}$/.test(phoneNumber)) {
        alert("El número de teléfono debe contener entre 7 y 15 dígitos.");
        event.preventDefault();
        return;
    }

    // Validar número de tarjeta (opcional pero debe ser de 16 dígitos si se ingresa)
    if (cardNumber && !/^\d{16}$/.test(cardNumber)) {
        alert("El número de tarjeta de crédito/débito debe tener exactamente 16 dígitos.");
        event.preventDefault();
        return;
    }

    // Validar que la imagen de perfil (si es subida) sea de un tipo de archivo permitido
    if (profilePic) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(profilePic.type)) {
            alert("Solo se permiten imágenes en formato JPG, PNG o GIF.");
            event.preventDefault();
            return;
        }
    }

    // Validar que los términos sean aceptados
    if (!termsAccepted) {
        alert("Debes aceptar los términos y condiciones.");
        event.preventDefault();
        return;
    }
});

// Barra de progreso
const inputs = document.querySelectorAll('input');
const progress = document.getElementById('progress');
inputs.forEach(input => {
    input.addEventListener('input', updateProgress);
});

function updateProgress() {
    const filledFields = [...inputs].filter(input => input.value !== '').length;
    const totalFields = inputs.length;
    const percentage = (filledFields / totalFields) * 100;
    progress.style.width = `${percentage}%`;
}
