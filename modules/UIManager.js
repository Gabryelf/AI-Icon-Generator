// ============================================
// UI МЕНЕДЖЕР - Рендеринг и обновление DOM
// ============================================
export class UIManager {
    constructor() {
        this.statsEl = {
            total: document.getElementById('stat-total'),
            styles: document.getElementById('stat-styles')
        };
    }

    updateStats(stats) {
        if (this.statsEl.total) this.statsEl.total.textContent = stats.total || 0;
        if (this.statsEl.styles) this.statsEl.styles.textContent = stats.styles || 5;
    }

    renderHistory(history) {
        const container = document.getElementById('history-list');
        if (!container) return;

        if (!history || history.length === 0) {
            container.innerHTML = `<div class="empty-state">Пока нет сохраненных иконок</div>`;
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item">
                <canvas width="50" height="50" data-icon="${encodeURIComponent(JSON.stringify(item.data))}"></canvas>
                <div class="info">
                    <h4>${item.params.theme} / ${item.params.style}</h4>
                    <p>${item.timestamp} • Сложность: ${item.params.complexity}</p>
                </div>
                <button class="icon-btn" onclick="window.app.generator.download('png', '${encodeURIComponent(JSON.stringify(item.data))}')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');

        // Отрисовываем миниатюры в истории
        container.querySelectorAll('.history-item canvas').forEach(canvas => {
            const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
            const ctx = canvas.getContext('2d');
            window.app.generator.drawIcon(ctx, 50, 50, data);
        });
    }

    renderRecent(items) {
        const grid = document.getElementById('recent-grid');
        if (!grid) return;
        if (!items || items.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Нет недавних иконок</div>`;
            return;
        }

        grid.innerHTML = items.map(item => `
            <div class="recent-item">
                <canvas width="80" height="80" data-icon="${encodeURIComponent(JSON.stringify(item.data))}"></canvas>
            </div>
        `).join('');

        grid.querySelectorAll('.recent-item canvas').forEach(canvas => {
            const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
            const ctx = canvas.getContext('2d');
            window.app.generator.drawIcon(ctx, 80, 80, data);
        });
    }
}