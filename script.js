document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });

    // Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...';
        submitBtn.style.opacity = "0.7";

       setTimeout(() => {

    window.location.href = "dashboard.html";

}, 1500);
    });
});