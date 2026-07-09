// ============================================
// ГЛАВНЫЙ КОНТРОЛЛЕР v3.0
// ============================================
import { UIManager } from './modules/UIManager.js';
import { Generator } from './modules/Generator.js';
import { Storage } from './modules/Storage.js';
import { DOMAINS, STYLES, CATEGORIES } from './modules/presets.js';

class App {
    constructor() {
        this.ui = new UIManager();
        this.generator = new Generator();
        this.storage = new Storage();
        this.currentTab = 'dashboard';
        this.currentIconData = null;
        
        // Состояние генератора
        this.state = {
            domain: null,
            style: null,
            category: null,
            config: {}
        };
        
        this.init();
    }

    init() {
        // Загружаем данные из localStorage
        const saved = this.storage.load('appState');
        if (saved) {
            this.ui.updateStats(saved.stats);
            this.ui.renderHistory(saved.history);
            if (saved.settings) {
                document.getElementById('username-input').value = saved.settings.username || '';
            }
            // Восстанавливаем состояние генератора
            if (saved.generatorState) {
                this.state = saved.generatorState;
            }
        } else {
            this.storage.save('appState', {
                stats: { total: 0, styles: 8 },
                history: [],
                settings: { username: 'Дизайнер', theme: 'dark' },
                generatorState: this.state
            });
        }

        // Навигация
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Шаг 1: Выбор домена
        document.querySelectorAll('.domain-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectDomain(card.dataset.domain);
            });
        });

        // Шаг 2: Выбор стиля (динамические)
        // Шаг 3: Выбор категории (динамические)
        // Обработчики для back кнопок
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.dataset.back;
                this.goToStep(step);
            });
        });

        // Генерация
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.handleGenerate();
        });

        // Рандомизация
        document.getElementById('randomize-btn').addEventListener('click', () => {
            this.randomizeConfig();
        });

        // Очистка
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

        // Экспорт
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

        // Восстанавливаем превью
        this.restorePreview();

        // Показываем первый шаг или восстанавливаем состояние
        if (this.state.domain) {
            this.goToStep('step-config');
            this.renderConfig();
            if (this.state.config && Object.keys(this.state.config).length > 0) {
                this.handleGenerate();
            }
        }

        console.log('🚀 Neural Icon Forge v3.0 запущен!');
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

    // ===== ШАГИ ГЕНЕРАТОРА =====
    selectDomain(domain) {
        this.state.domain = domain;
        
        // Обновляем UI
        document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.domain-card[data-domain="${domain}"]`)?.classList.add('selected');

        // Показываем шаг со стилями
        const styles = DOMAINS[domain]?.styles || Object.keys(STYLES);
        this.renderStyles(styles);
        this.goToStep('step-style');
        
        // Сохраняем состояние
        this.saveGeneratorState();
    }

    selectStyle(style) {
        this.state.style = style;
        
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.style-card[data-style="${style}"]`)?.classList.add('selected');

        // Показываем категории
        const domainData = DOMAINS[this.state.domain];
        const categories = domainData?.categories || Object.keys(CATEGORIES);
        this.renderCategories(categories);
        this.goToStep('step-category');
        
        this.saveGeneratorState();
    }

    selectCategory(category) {
        this.state.category = category;
        
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.category-card[data-category="${category}"]`)?.classList.add('selected');

        // Переходим к настройкам
        this.goToStep('step-config');
        this.renderConfig();
        
        // Авто-генерация
        const autoGen = document.getElementById('auto-generate')?.checked;
        if (autoGen !== false) {
            setTimeout(() => this.handleGenerate(), 300);
        }
        
        this.saveGeneratorState();
    }

    goToStep(stepId) {
        // Скрываем все шаги
        document.querySelectorAll('.setup-step').forEach(s => s.style.display = 'none');
        
        // Показываем нужный
        const target = document.getElementById(stepId);
        if (target) {
            target.style.display = 'block';
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    renderStyles(styles) {
        const grid = document.getElementById('style-grid');
        grid.innerHTML = styles.map(styleKey => {
            const style = STYLES[styleKey];
            if (!style) return '';
            return `
                <button class="style-card" data-style="${styleKey}">
                    <i class="${style.icon || 'fas fa-palette'}"></i>
                    <span>${style.name}</span>
                    <small>${style.description || ''}</small>
                </button>
            `;
        }).join('');

        grid.querySelectorAll('.style-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectStyle(card.dataset.style);
            });
        });

        // Если стиль уже выбран
        if (this.state.style) {
            const selected = grid.querySelector(`[data-style="${this.state.style}"]`);
            if (selected) selected.classList.add('selected');
        }
    }

    renderCategories(categories) {
        const grid = document.getElementById('category-grid');
        grid.innerHTML = categories.map(catKey => {
            const cat = CATEGORIES[catKey];
            if (!cat) return '';
            return `
                <button class="category-card" data-category="${catKey}">
                    <i class="${cat.icon || 'fas fa-shapes'}"></i>
                    <span>${cat.name}</span>
                    <small>${cat.description || ''}</small>
                </button>
            `;
        }).join('');

        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectCategory(card.dataset.category);
            });
        });

        if (this.state.category) {
            const selected = grid.querySelector(`[data-category="${this.state.category}"]`);
            if (selected) selected.classList.add('selected');
        }
    }

    renderConfig() {
        const container = document.getElementById('config-container');
        const domainData = DOMAINS[this.state.domain];
        const styleData = STYLES[this.state.style];
        const categoryData = CATEGORIES[this.state.category];
        
        if (!categoryData) {
            container.innerHTML = '<p style="color:var(--text-secondary);">Выберите категорию для настройки</p>';
            return;
        }

        // Получаем параметры для категории
        const config = categoryData.config || {};
        const defaultConfig = categoryData.defaults || {};

        // Строим UI настроек
        let html = `
            <div class="config-group">
                <div class="config-group-title">
                    <i class="fas fa-info-circle"></i> 
                    ${categoryData.name} — ${styleData?.name || 'Стандартный'} стиль
                </div>
                <div style="color:var(--text-secondary);font-size:13px;margin-bottom:12px;">
                    ${categoryData.description || 'Настройте детали вашего элемента'}
                </div>
            </div>
        `;

        // Генерируем элементы настроек
        for (const [key, param] of Object.entries(config)) {
            const value = this.state.config[key] || defaultConfig[key] || param.default || '';
            
            html += `<div class="config-group">`;
            html += `<div class="config-group-title"><i class="${param.icon || 'fas fa-sliders-h'}"></i> ${param.label}</div>`;
            
            if (param.type === 'color') {
                html += `
                    <div class="config-row">
                        <label>Цвет</label>
                        <input type="color" id="cfg-${key}" value="${value || '#7c3aed'}" 
                               data-config-key="${key}">
                        <span class="config-value">${value || '#7c3aed'}</span>
                    </div>
                `;
            } else if (param.type === 'range') {
                html += `
                    <div class="config-row">
                        <label>${param.label}</label>
                        <input type="range" id="cfg-${key}" 
                               min="${param.min || 0}" max="${param.max || 100}" 
                               value="${value || param.default || 50}"
                               data-config-key="${key}">
                        <span class="config-value" id="cfg-${key}-value">${value || param.default || 50}</span>
                    </div>
                `;
            } else if (param.type === 'select') {
                html += `
                    <div class="config-row">
                        <label>${param.label}</label>
                        <select id="cfg-${key}" data-config-key="${key}">
                            ${(param.options || []).map(opt => 
                                `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            } else if (param.type === 'checkbox') {
                html += `
                    <div class="config-row">
                        <label>${param.label}</label>
                        <input type="checkbox" id="cfg-${key}" 
                               ${value ? 'checked' : ''}
                               data-config-key="${key}">
                    </div>
                `;
            } else {
                // text, number
                html += `
                    <div class="config-row">
                        <label>${param.label}</label>
                        <input type="${param.type || 'text'}" id="cfg-${key}" 
                               value="${value || ''}"
                               data-config-key="${key}"
                               style="flex:1;padding:6px 10px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:6px;color:#fff;">
                    </div>
                `;
            }
            
            html += `</div>`;
        }

        container.innerHTML = html;

        // Добавляем обработчики
        container.querySelectorAll('[data-config-key]').forEach(el => {
            const key = el.dataset.configKey;
            
            const handler = () => {
                let value;
                if (el.type === 'checkbox') {
                    value = el.checked;
                } else if (el.type === 'range') {
                    value = parseInt(el.value);
                    const valueDisplay = document.getElementById(`cfg-${key}-value`);
                    if (valueDisplay) valueDisplay.textContent = value;
                } else if (el.type === 'color') {
                    value = el.value;
                    const sibling = el.parentElement.querySelector('.config-value');
                    if (sibling) sibling.textContent = value;
                } else {
                    value = el.value;
                }
                
                this.state.config[key] = value;
                this.saveGeneratorState();
                
                // Авто-генерация
                const autoGen = document.getElementById('auto-generate')?.checked;
                if (autoGen !== false) {
                    clearTimeout(this._genTimeout);
                    this._genTimeout = setTimeout(() => this.handleGenerate(), 300);
                }
            };
            
            el.addEventListener('input', handler);
            el.addEventListener('change', handler);
        });

        // Восстанавливаем значения
        for (const [key, value] of Object.entries(this.state.config)) {
            const el = document.getElementById(`cfg-${key}`);
            if (el) {
                if (el.type === 'checkbox') el.checked = value;
                else if (el.type === 'range') {
                    el.value = value;
                    const display = document.getElementById(`cfg-${key}-value`);
                    if (display) display.textContent = value;
                } else if (el.type === 'color') {
                    el.value = value;
                    const sibling = el.parentElement?.querySelector('.config-value');
                    if (sibling) sibling.textContent = value;
                } else {
                    el.value = value;
                }
            }
        }
    }

    // ===== ГЕНЕРАЦИЯ =====
    handleGenerate() {
        // Собираем все параметры
        const params = {
            domain: this.state.domain,
            style: this.state.style,
            category: this.state.category,
            config: { ...this.state.config }
        };

        // Добавляем настройки из UI
        document.querySelectorAll('[data-config-key]').forEach(el => {
            const key = el.dataset.configKey;
            if (el.type === 'checkbox') {
                params.config[key] = el.checked;
            } else if (el.type === 'range') {
                params.config[key] = parseInt(el.value);
            } else {
                params.config[key] = el.value;
            }
        });

        this.state.config = params.config;
        this.saveGeneratorState();

        // Генерируем
        this.currentIconData = this.generator.generate(params);
        
        // Отрисовываем
        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.generator.drawIcon(ctx, canvas.width, canvas.height, this.currentIconData);

        // Обновляем информацию
        const domainName = DOMAINS[this.state.domain]?.name || this.state.domain;
        const styleName = STYLES[this.state.style]?.name || this.state.style;
        const categoryName = CATEGORIES[this.state.category]?.name || this.state.category;
        document.getElementById('preview-settings').textContent = 
            `${domainName} • ${styleName} • ${categoryName}`;

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

        // Анимация
        const btn = document.getElementById('generate-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-bolt"></i> Сгенерировать';
        }, 400);
    }

    randomizeConfig() {
        // Случайные значения для всех параметров
        document.querySelectorAll('[data-config-key]').forEach(el => {
            const key = el.dataset.configKey;
            const param = CATEGORIES[this.state.category]?.config?.[key];
            if (!param) return;
            
            if (param.type === 'color') {
                const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                el.value = color;
                const sibling = el.parentElement?.querySelector('.config-value');
                if (sibling) sibling.textContent = color;
            } else if (param.type === 'range') {
                const min = param.min || 0;
                const max = param.max || 100;
                const val = Math.floor(Math.random() * (max - min + 1)) + min;
                el.value = val;
                const display = document.getElementById(`cfg-${key}-value`);
                if (display) display.textContent = val;
            } else if (param.type === 'checkbox') {
                el.checked = Math.random() > 0.5;
            } else if (param.type === 'select') {
                const options = param.options || [];
                if (options.length > 0) {
                    const rand = options[Math.floor(Math.random() * options.length)];
                    el.value = rand.value;
                }
            }
            
            // Триггерим событие
            el.dispatchEvent(new Event('change'));
        });
    }

    // ===== СОХРАНЕНИЕ СОСТОЯНИЯ =====
    saveGeneratorState() {
        const state = this.storage.load('appState') || {};
        state.generatorState = {
            domain: this.state.domain,
            style: this.state.style,
            category: this.state.category,
            config: this.state.config
        };
        this.storage.save('appState', state);
    }

    restorePreview() {
        const state = this.storage.load('appState');
        if (state && state.history && state.history.length > 0) {
            const last = state.history[0];
            if (last && last.data) {
                const canvas = document.getElementById('generation-canvas');
                const ctx = canvas.getContext('2d');
                this.currentIconData = last.data;
                this.generator.drawIcon(ctx, canvas.width, canvas.height, last.data);
                document.getElementById('preview-settings').textContent = 
                    last.params?.domain || 'Неизвестно';
            }
        }
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});