async function register() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        await apiRequest("/auth/register", "POST", { email, password });
        alert("Регистрация успешна! Теперь войдите.");
    } catch (e) {
        alert(e.message);
    }
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const data = await apiRequest("/auth/login", "POST", { email, password });
        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";  // ← относительный путь
    } catch (e) {
        alert(e.message);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";  // ← относительный путь
}