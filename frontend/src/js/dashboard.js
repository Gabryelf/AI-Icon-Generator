async function generateIcon() {
    const config = {
        style: document.getElementById("style").value,
        shape: document.getElementById("shape").value,
        color: document.getElementById("color").value,
    };
    try {
        const data = await apiRequest("/icons/generate", "POST", config);
        document.getElementById("result").innerHTML = data.svg_code;
        loadHistory();
    } catch (e) {
        alert(e.message);
    }
}

async function loadHistory() {
    const history = await apiRequest("/icons/history");
    const list = document.getElementById("history-list");
    list.innerHTML = history.map(icon => `
        <div class="history-item" onclick="showIcon('${icon.svg_code}')">
            ${icon.svg_code}
            <small>${new Date(icon.created_at).toLocaleDateString()}</small>
        </div>
    `).join("");
}

function showIcon(svg) {
    document.getElementById("result").innerHTML = svg;
}

// Загрузка истории при открытии дашборда
loadHistory();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}