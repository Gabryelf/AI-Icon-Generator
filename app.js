// ============================================
// ГЛАВНЫЙ КОНТРОЛЛЕР (Router + State Manager)
// ============================================
import { UIManager } from './modules/UIManager.js';
import { Generator } from './modules/Generator.js';
import { Storage } from './modules/Storage.js';
import { PRESETS } from './modules/presets.js';

class App {
    constructor() {
        this.ui = new UIManager();
        this.generator = new Generator();
        this.storage = new Storage();
        this.currentTab = 'dashboard';
        this.init();
    }

    init() {
        // Загружаем данные из localStorage
        const saved = this.storage.load('appState');
        if (saved) {
            this.ui.updateStats(saved.stats);
            this.ui.renderHistory(saved.history);
        } else {
            // Инициализация по умолчанию
            this.storage.save('appState', {
                stats: { total: 0, styles: 5 },
                history: [],
                settings: { username: 'Дизайнер', theme: 'dark' }
            });
        }

        // Обработчики навигации
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Обработчик генерации
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.handleGenerate();
        });

        // Очистка кэша
        document.getElementById('clear-storage-btn').addEventListener('click', () => {
            if (confirm('Очистить всю историю?')) {
                this.storage.clear();
                location.reload();
            }
        });

        // Настройки
        document.getElementById('username-input')?.addEventListener('change', (e) => {
            const state = this.storage.load('appState');
            state.settings.username = e.target.value;
            this.storage.save('appState', state);
        });

        // Слайдеры (отображение значений)
        document.getElementById('complexity-slider').addEventListener('input', (e) => {
            document.getElementById('complexity-value').textContent = e.target.value;
        });
        document.getElementById('asymmetry-slider').addEventListener('input', (e) => {
            document.getElementById('asymmetry-value').textContent = e.target.value + '%';
        });

        // Загружаем последнюю иконку в превью
        this.restorePreview();

        console.log('🚀 Neural Icon Forge запущен!');
    }

    switchTab(tab) {
        this.currentTab = tab;
        // Меняем активную кнопку
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
        
        // Меняем страницы
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        document.getElementById(`page-${tab}`)?.classList.add('active-page');

        // Меняем заголовок
        const titles = {
            dashboard: 'Дашборд',
            generator: 'Генератор иконок',
            history: 'История',
            settings: 'Настройки'
        };
        document.getElementById('page-title').textContent = titles[tab] || tab;
    }

    handleGenerate() {
        // Собираем параметры
        const params = {
            theme: document.getElementById('theme-select').value,
            style: document.getElementById('style-select').value,
            complexity: parseInt(document.getElementById('complexity-slider').value),
            asymmetry: parseInt(document.getElementById('asymmetry-slider').value)
        };

        // Генерируем иконку
        const iconData = this.generator.generate(params);
        
        // Отображаем на канвасе
        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем сгенерированное (используем метод из Generator)
        this.generator.drawIcon(ctx, canvas.width, canvas.height, iconData);

        // Сохраняем в историю
        const state = this.storage.load('appState') || { stats: { total: 0 }, history: [] };
        state.stats.total += 1;
        state.history.unshift({
            id: Date.now(),
            params: params,
            data: iconData,
            timestamp: new Date().toLocaleString()
        });
        // Ограничиваем историю 50 записями
        if (state.history.length > 50) state.history.pop();
        
        this.storage.save('appState', state);
        this.ui.updateStats(state.stats);
        this.ui.renderHistory(state.history);

        // Обновляем дашборд (последние иконки)
        this.ui.renderRecent(state.history.slice(0, 6));

        // Анимация кнопки
        const btn = document.getElementById('generate-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-bolt"></i> Сгенерировать';
        }, 400);
    }

    restorePreview() {
        const state = this.storage.load('appState');
        if (state && state.history.length > 0) {
            const last = state.history[0];
            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            this.generator.drawIcon(ctx, canvas.width, canvas.height, last.data);
        }
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});