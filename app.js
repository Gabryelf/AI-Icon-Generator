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
        this.currentIconData = null;
        this.init();
    }

    init() {
        // Загружаем данные из localStorage
        const saved = this.storage.load('appState');
        if (saved) {
            this.ui.updateStats(saved.stats);
            this.ui.renderHistory(saved.history);
            // Восстанавливаем настройки
            if (saved.settings) {
                document.getElementById('username-input').value = saved.settings.username || '';
            }
        } else {
            // Инициализация по умолчанию
            this.storage.save('appState', {
                stats: { total: 0, styles: 6 },
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

        // Сброс настроек
        document.getElementById('reset-defaults-btn').addEventListener('click', () => {
            this.resetDefaults();
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
            if (!state.settings) state.settings = {};
            state.settings.username = e.target.value;
            this.storage.save('appState', state);
        });

        // Слайдеры (отображение значений)
        document.getElementById('main-size').addEventListener('input', (e) => {
            document.getElementById('main-size-value').textContent = e.target.value + 'px';
        });

        // Показываем/скрываем настройки узора
        document.querySelectorAll('.detail-check').forEach(cb => {
            cb.addEventListener('change', () => {
                const patternChecked = document.querySelector('.detail-check[value="pattern"]').checked;
                document.getElementById('pattern-controls').style.display = patternChecked ? 'block' : 'none';
            });
        });

        // Обработчики экспорта
        document.getElementById('download-png-btn').addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.download('png', this.currentIconData);
            }
        });

        document.getElementById('download-svg-btn').addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.download('svg', this.currentIconData);
            }
        });

        document.getElementById('copy-svg-btn').addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.copySVG(this.currentIconData);
            }
        });

        // Загружаем последнюю иконку в превью
        this.restorePreview();

        console.log('🚀 Neural Icon Forge v2.0 запущен!');
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        document.getElementById(`page-${tab}`)?.classList.add('active-page');

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
            bgColor: document.getElementById('bg-color').value,
            bgStyle: document.getElementById('bg-style').value,
            mainShape: document.getElementById('main-shape').value,
            mainColor: document.getElementById('main-color').value,
            mainSize: parseInt(document.getElementById('main-size').value),
            details: Array.from(document.querySelectorAll('.detail-check:checked')).map(cb => cb.value),
            patternType: document.getElementById('pattern-type').value,
        };

        // Генерируем иконку
        this.currentIconData = this.generator.generate(params);
        
        // Отображаем на канвасе
        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.generator.drawIcon(ctx, canvas.width, canvas.height, this.currentIconData);

        // Обновляем информацию
        document.getElementById('preview-settings').textContent = 
            `Тема: ${params.theme}, Стиль: ${params.style}, Размер: ${params.mainSize}px`;

        // Сохраняем в историю
        const state = this.storage.load('appState') || { stats: { total: 0 }, history: [] };
        state.stats.total += 1;
        state.history.unshift({
            id: Date.now(),
            params: params,
            data: this.currentIconData,
            timestamp: new Date().toLocaleString()
        });
        if (state.history.length > 50) state.history.pop();
        
        this.storage.save('appState', state);
        this.ui.updateStats(state.stats);
        this.ui.renderHistory(state.history);
        this.ui.renderRecent(state.history.slice(0, 6));

        // Анимация кнопки
        const btn = document.getElementById('generate-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-bolt"></i> Сгенерировать';
        }, 400);
    }

    resetDefaults() {
        document.getElementById('theme-select').value = 'abstract';
        document.getElementById('style-select').value = 'minimal';
        document.getElementById('bg-color').value = '#0a0a0f';
        document.getElementById('bg-style').value = 'solid';
        document.getElementById('main-shape').value = 'circle';
        document.getElementById('main-color').value = '#7c3aed';
        document.getElementById('main-size').value = '120';
        document.getElementById('main-size-value').textContent = '120px';
        document.querySelectorAll('.detail-check').forEach(cb => cb.checked = false);
        document.getElementById('pattern-controls').style.display = 'none';
        document.getElementById('pattern-type').value = 'stripes';
    }

    restorePreview() {
        const state = this.storage.load('appState');
        if (state && state.history && state.history.length > 0) {
            const last = state.history[0];
            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            this.currentIconData = last.data;
            this.generator.drawIcon(ctx, canvas.width, canvas.height, last.data);
            document.getElementById('preview-settings').textContent = 
                `Тема: ${last.params?.theme || 'abstract'}, Стиль: ${last.params?.style || 'minimal'}`;
        }
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});