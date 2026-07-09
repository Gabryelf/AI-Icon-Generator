// API_URL убрал, так как все на одном сервере
// Используем относительные пути с версии 0.0.2

async function apiRequest(endpoint, method = "GET", body = null) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(endpoint, {  // ← endpoint относительный
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка запроса");
    }
    return res.json();
}