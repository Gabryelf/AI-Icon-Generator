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
        if (this.statsEl.total) this.statsEl.total.textContent = stats?.total || 0;
        if (this.statsEl.styles) this.statsEl.styles.textContent = stats?.styles || 8;
    }

    renderHistory(history) {
        const container = document.getElementById('history-list');
        if (!container) return;

        if (!history || history.length === 0) {
            container.innerHTML = `<div class="empty-state">Пока нет сохраненных иконок</div>`;
            return;
        }

        container.innerHTML = history.map((item, index) => {
            if (!item || !item.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            return `
                <div class="history-item">
                    <canvas width="60" height="60" data-icon="${dataStr}"></canvas>
                    <div class="info">
                        <h4>${item.params?.domain || 'unknown'} / ${item.params?.category || 'unknown'}</h4>
                        <p>${item.timestamp || 'Нет даты'} • ${item.params?.style || 'default'}</p>
                    </div>
                    <div class="actions">
                        <button class="icon-btn" data-action="download-png" data-icon="${dataStr}">
                            <i class="fas fa-image"></i>
                        </button>
                        <button class="icon-btn" data-action="download-svg" data-icon="${dataStr}">
                            <i class="fas fa-code"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Отрисовываем миниатюры
        container.querySelectorAll('.history-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                if (window.app && window.app.generator) {
                    window.app.generator.drawIcon(ctx, 60, 60, data);
                }
            } catch (e) {
                console.warn('Не удалось отрисовать миниатюру:', e);
            }
        });
    }

    renderRecent(items) {
        const grid = document.getElementById('recent-grid');
        if (!grid) return;
        
        if (!items || items.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Нет недавних иконок</div>`;
            return;
        }

        grid.innerHTML = items.map(item => {
            if (!item || !item.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            return `
                <div class="recent-item" data-icon="${dataStr}">
                    <canvas width="80" height="80" data-icon="${dataStr}"></canvas>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.recent-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                if (window.app && window.app.generator) {
                    window.app.generator.drawIcon(ctx, 80, 80, data);
                }
            } catch (e) {
                console.warn('Не удалось отрисовать миниатюру:', e);
            }
        });

        grid.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                try {
                    const data = JSON.parse(decodeURIComponent(item.dataset.icon));
                    const canvas = document.getElementById('generation-canvas');
                    const ctx = canvas.getContext('2d');
                    if (window.app && window.app.generator) {
                        window.app.generator.drawIcon(ctx, canvas.width, canvas.height, data);
                        window.app.currentIconData = data;
                    }
                } catch (e) {
                    console.error('Ошибка загрузки иконки:', e);
                }
            });
        });
    }
}