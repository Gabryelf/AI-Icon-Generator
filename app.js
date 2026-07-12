// ============================================
// ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ - Инициализация и роутинг
// ============================================

import { UIManager } from './modules/UIManager.js';
import { Generator } from './modules/Generator.js';
import { Storage } from './modules/Storage.js';
import { DOMAINS, STYLES, CATEGORIES } from './modules/presets.js';
import { ShapeLibrary } from './modules/ShapeLibrary.js';
import { ColorPalette } from './modules/ColorPalette.js';
import { TextureGenerator } from './modules/TextureGenerator.js';
import { IconComposer } from './modules/IconComposer.js';

class App {
    constructor() {
        // Инициализация модулей
        this.storage = new Storage('nif_');
        this.generator = new Generator();
        this.ui = new UIManager();
        this.shapeLibrary = new ShapeLibrary();
        this.colorPalette = new ColorPalette();
        this.textureGenerator = new TextureGenerator();
        this.iconComposer = new IconComposer();

        // Состояние
        this.state = {
            currentTab: 'dashboard',
            selectedDomain: null,
            selectedStyle: null,
            selectedCategory: null,
            config: {},
            history: this.storage.load('history', []),
            recent: this.storage.load('recent', [])
        };

        // Ссылка на текущие данные иконки
        this.currentIconData = null;

        // Инициализация
        this.init();
    }

    async init() {
        // Загружаем данные из CSV
        await this.loadShapeData();
        
        // Настройка UI
        this.setupUI();
        
        // Обновление статистики
        this.updateStats();
        
        // Рендеринг истории и последних иконок
        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
        
        // Генерация превью для дашборда
        this.generateDashboardPreview();

        // Обработчики событий
        this.setupEventListeners();

        console.log('🧠 Neural Icon Forge v3.0 инициализирован');
    }

    async loadShapeData() {
        try {
            // Загрузка CSV файлов
            const basicShapes = await this.loadCSV('/assets/shapes/basic_shapes.csv');
            const organicShapes = await this.loadCSV('/assets/shapes/organic_shapes.csv');
            const geometricShapes = await this.loadCSV('/assets/shapes/geometric_shapes.csv');
            
            this.shapeLibrary.loadShapes({
                basic: basicShapes,
                organic: organicShapes,
                geometric: geometricShapes
            });
            
            console.log('✅ Загружены фигуры из CSV');
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить CSV файлы, используем встроенные фигуры');
            // Используем встроенные фигуры как fallback
            this.shapeLibrary.loadDefaultShapes();
        }
    }

    loadCSV(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('CSV not found');
                return response.text();
            })
            .then(text => {
                const lines = text.split('\n').filter(line => line.trim());
                const headers = lines[0].split(',').map(h => h.trim());
                const data = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    if (values.length === headers.length) {
                        const obj = {};
                        headers.forEach((h, idx) => {
                            obj[h] = values[idx];
                        });
                        data.push(obj);
                    }
                }
                return data;
            });
    }

    setupUI() {
        // Настройка панелей
        this.renderStyles();
        this.renderCategories();
        this.renderDomainGrid();
    }

    renderStyles() {
        const grid = document.getElementById('style-grid');
        if (!grid) return;

        grid.innerHTML = '';
        Object.entries(STYLES).forEach(([key, style]) => {
            const card = document.createElement('button');
            card.className = 'style-card';
            card.dataset.style = key;
            card.innerHTML = `
                <i class="${style.icon}"></i>
                <span>${style.name}</span>
                <small>${style.description}</small>
            `;
            card.addEventListener('click', () => this.selectStyle(key));
            grid.appendChild(card);
        });
    }

    renderCategories() {
        const grid = document.getElementById('category-grid');
        if (!grid) return;

        grid.innerHTML = '';
        Object.entries(CATEGORIES).forEach(([key, cat]) => {
            const card = document.createElement('button');
            card.className = 'category-card';
            card.dataset.category = key;
            card.innerHTML = `
                <i class="${cat.icon}"></i>
                <span>${cat.name}</span>
                <small>${cat.description}</small>
            `;
            card.addEventListener('click', () => this.selectCategory(key));
            grid.appendChild(card);
        });
    }

    renderDomainGrid() {
        const grid = document.getElementById('domain-grid');
        if (!grid) return;

        grid.querySelectorAll('.domain-card').forEach(card => {
            card.addEventListener('click', () => {
                const domain = card.dataset.domain;
                this.selectDomain(domain);
            });
        });
    }

    // ===== ВЫБОР ПАРАМЕТРОВ =====

    selectDomain(domain) {
        this.state.selectedDomain = domain;
        document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.domain-card[data-domain="${domain}"]`)?.classList.add('selected');
        
        // Показать следующий шаг
        this.showStep('step-style');
    }

    selectStyle(style) {
        this.state.selectedStyle = style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.style-card[data-style="${style}"]`)?.classList.add('selected');
        
        // Фильтруем категории по домену
        this.filterCategoriesByDomain();
        
        // Показать следующий шаг
        this.showStep('step-category');
    }

    selectCategory(category) {
        this.state.selectedCategory = category;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.category-card[data-category="${category}"]`)?.classList.add('selected');
        
        // Загрузить настройки для категории
        this.loadCategoryConfig(category);
        
        // Показать следующий шаг
        this.showStep('step-config');
    }

    filterCategoriesByDomain() {
        const domain = this.state.selectedDomain;
        if (!domain) return;

        const domainData = DOMAINS[domain];
        if (!domainData) return;

        const allowedCategories = domainData.categories || [];
        const grid = document.getElementById('category-grid');
        
        grid.querySelectorAll('.category-card').forEach(card => {
            const catKey = card.dataset.category;
            const show = allowedCategories.includes(catKey);
            card.style.display = show ? '' : 'none';
        });
    }

    loadCategoryConfig(category) {
        const catData = CATEGORIES[category];
        if (!catData) return;

        const container = document.getElementById('config-container');
        if (!container) return;

        // Очищаем контейнер
        container.innerHTML = '';

        // Создаем группы настроек
        const groups = this.groupConfigFields(catData.config);

        groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'config-group';
            
            if (group.title) {
                const title = document.createElement('div');
                title.className = 'config-group-title';
                title.innerHTML = `<i class="fas fa-${group.icon || 'sliders'}"></i> ${group.title}`;
                groupDiv.appendChild(title);
            }

            group.fields.forEach(field => {
                const row = this.createConfigRow(field, catData.defaults);
                groupDiv.appendChild(row);
            });

            container.appendChild(groupDiv);
        });

        // Устанавливаем значения по умолчанию
        this.setConfigDefaults(catData.defaults);
    }

    groupConfigFields(config) {
        // Группируем настройки по логическим блокам
        const groups = [];
        
        // Базовая группа
        const basicFields = ['shape', 'size', 'color', 'bgColor'];
        const basic = {
            title: 'Основные параметры',
            icon: 'pencil',
            fields: []
        };
        
        // Стиль
        const styleFields = ['style', 'glow', 'hasBorder', 'borderColor'];
        const style = {
            title: 'Стиль и эффекты',
            icon: 'paintbrush',
            fields: []
        };
        
        // Детали
        const detailFields = ['complexity', 'stars', 'details', 'hasRibbon'];
        const details = {
            title: 'Детализация',
            icon: 'layer-group',
            fields: []
        };
        
        // Текст
        const textFields = ['text', 'letter'];
        const text = {
            title: 'Текст',
            icon: 'font',
            fields: []
        };

        Object.entries(config).forEach(([key, field]) => {
            if (basicFields.includes(key)) basic.fields.push({key, ...field});
            else if (styleFields.includes(key)) style.fields.push({key, ...field});
            else if (detailFields.includes(key)) details.fields.push({key, ...field});
            else if (textFields.includes(key)) text.fields.push({key, ...field});
            else {
                // Остальные поля в базовую группу
                basic.fields.push({key, ...field});
            }
        });

        if (basic.fields.length) groups.push(basic);
        if (style.fields.length) groups.push(style);
        if (details.fields.length) groups.push(details);
        if (text.fields.length) groups.push(text);

        return groups;
    }

    createConfigRow(field, defaults) {
        const row = document.createElement('div');
        row.className = 'config-row';

        const label = document.createElement('label');
        label.textContent = field.label;
        row.appendChild(label);

        const value = field.default || defaults[field.key] || '';
        this.state.config[field.key] = value;

        let input;
        switch (field.type) {
            case 'select':
                input = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (opt.value === value) option.selected = true;
                    input.appendChild(option);
                });
                break;
            case 'color':
                input = document.createElement('input');
                input.type = 'color';
                input.value = value;
                break;
            case 'range':
                input = document.createElement('input');
                input.type = 'range';
                input.min = field.min || 0;
                input.max = field.max || 100;
                input.value = value;
                
                const display = document.createElement('span');
                display.className = 'config-value';
                display.textContent = value;
                row.appendChild(display);
                
                input.addEventListener('input', () => {
                    display.textContent = input.value;
                    this.state.config[field.key] = parseFloat(input.value);
                });
                break;
            case 'checkbox':
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = value === true || value === 'true';
                break;
            case 'text':
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                break;
        }

        input.id = `config-${field.key}`;
        input.addEventListener('change', () => {
            const val = input.type === 'checkbox' ? input.checked : input.value;
            this.state.config[field.key] = val;
            
            // Авто-генерация
            if (document.getElementById('auto-generate')?.checked) {
                this.generateIcon();
            }
        });

        row.appendChild(input);
        return row;
    }

    setConfigDefaults(defaults) {
        if (!defaults) return;
        Object.entries(defaults).forEach(([key, value]) => {
            if (!(key in this.state.config)) {
                this.state.config[key] = value;
            }
            const input = document.getElementById(`config-${key}`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value === true || value === 'true';
                } else if (input.type === 'range') {
                    input.value = value;
                } else {
                    input.value = value;
                }
            }
        });
    }

    // ===== ШАГИ =====

    showStep(stepId) {
        document.querySelectorAll('.setup-step').forEach(el => el.style.display = 'none');
        const step = document.getElementById(stepId);
        if (step) step.style.display = 'block';
        
        // Если переходим на шаг конфигурации, генерируем иконку
        if (stepId === 'step-config') {
            setTimeout(() => this.generateIcon(), 300);
        }
    }

    // ===== ГЕНЕРАЦИЯ ИКОНКИ =====

    generateIcon() {
        const params = {
            domain: this.state.selectedDomain,
            style: this.state.selectedStyle,
            category: this.state.selectedCategory,
            config: this.state.config
        };

        // Проверяем, что все параметры выбраны
        if (!params.domain || !params.style || !params.category) {
            document.getElementById('preview-info').textContent = 'Выберите все параметры для генерации';
            return;
        }

        // Генерируем иконку
        const iconData = this.generator.generate(params);
        this.currentIconData = iconData;

        // Отрисовываем на canvas
        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        this.generator.drawIcon(ctx, canvas.width, canvas.height, iconData);

        // Обновляем информацию
        const info = document.getElementById('preview-settings');
        info.textContent = `${params.domain} / ${params.style} / ${params.category}`;

        // Сохраняем в историю
        this.saveToHistory(iconData, params);
        this.updateStats();
    }

    randomizeConfig() {
        // Рандомизация настроек
        const categoryData = CATEGORIES[this.state.selectedCategory];
        if (!categoryData) return;

        const config = this.state.config;
        Object.keys(categoryData.config).forEach(key => {
            const field = categoryData.config[key];
            if (field.type === 'range') {
                const min = field.min || 0;
                const max = field.max || 100;
                config[key] = Math.floor(Math.random() * (max - min + 1)) + min;
            } else if (field.type === 'color') {
                const colors = ['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                config[key] = colors[Math.floor(Math.random() * colors.length)];
            } else if (field.type === 'select') {
                const options = field.options || [];
                if (options.length) {
                    config[key] = options[Math.floor(Math.random() * options.length)].value;
                }
            } else if (field.type === 'checkbox') {
                config[key] = Math.random() > 0.5;
            } else if (field.type === 'text') {
                const texts = ['Star', 'Hero', 'Pro', 'Max', 'Ultra', 'Prime', 'Core'];
                config[key] = texts[Math.floor(Math.random() * texts.length)];
            }
        });

        // Обновляем UI
        Object.keys(categoryData.config).forEach(key => {
            const input = document.getElementById(`config-${key}`);
            if (input) {
                const val = config[key];
                if (input.type === 'checkbox') {
                    input.checked = val;
                } else if (input.type === 'range') {
                    input.value = val;
                    const display = input.parentElement.querySelector('.config-value');
                    if (display) display.textContent = val;
                } else {
                    input.value = val;
                }
            }
        });

        this.generateIcon();
    }

    // ===== СОХРАНЕНИЕ =====

    saveToHistory(iconData, params) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            data: iconData,
            params: params
        };

        // Добавляем в историю (максимум 50)
        this.state.history.unshift(entry);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        this.storage.save('history', this.state.history);

        // Добавляем в последние (максимум 6)
        this.state.recent.unshift(entry);
        if (this.state.recent.length > 6) {
            this.state.recent = this.state.recent.slice(0, 6);
        }
        this.storage.save('recent', this.state.recent);

        // Обновляем UI
        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
    }

    // ===== СТАТИСТИКА =====

    updateStats() {
        const stats = {
            total: this.state.history.length,
            styles: Object.keys(STYLES).length
        };
        this.ui.updateStats(stats);
    }

    // ===== ДАШБОРД =====

    generateDashboardPreview() {
        // Если есть иконки в истории, показываем первую как превью на дашборде
        if (this.state.history.length > 0) {
            const canvas = document.querySelector('#page-dashboard canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.generator.drawIcon(ctx, canvas.width, canvas.height, this.state.history[0].data);
            }
        }
    }

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Генерация
        document.getElementById('generate-btn')?.addEventListener('click', () => {
            this.generateIcon();
        });

        // Рандомизация
        document.getElementById('randomize-btn')?.addEventListener('click', () => {
            this.randomizeConfig();
        });

        // Кнопки назад
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.back;
                if (target) {
                    this.showStep(target);
                }
            });
        });

        // Экспорт
        document.getElementById('download-png-btn')?.addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.download('png', this.currentIconData);
            }
        });

        document.getElementById('download-svg-btn')?.addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.download('svg', this.currentIconData);
            }
        });

        document.getElementById('copy-svg-btn')?.addEventListener('click', () => {
            if (this.currentIconData) {
                this.generator.copySVG(this.currentIconData);
            }
        });

        // Очистка кэша
        document.getElementById('clear-storage-btn')?.addEventListener('click', () => {
            if (confirm('Очистить все данные?')) {
                this.storage.clear();
                this.state.history = [];
                this.state.recent = [];
                this.ui.renderHistory([]);
                this.ui.renderRecent([]);
                this.updateStats();
                document.getElementById('generation-canvas').getContext('2d').clearRect(0, 0, 500, 500);
            }
        });

        // Глобальные обработчики для истории
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (target) {
                const action = target.dataset.action;
                if (action === 'download-png' || action === 'download-svg') {
                    try {
                        const data = JSON.parse(decodeURIComponent(target.dataset.icon));
                        const format = action === 'download-png' ? 'png' : 'svg';
                        this.generator.download(format, data);
                    } catch (error) {
                        console.error('Ошибка скачивания:', error);
                    }
                }
            }
        });

        // Настройки
        document.getElementById('username-input')?.addEventListener('change', (e) => {
            this.storage.save('username', e.target.value);
        });

        document.getElementById('theme-ui-select')?.addEventListener('change', (e) => {
            // Логика смены темы (будет добавлена позже)
        });

        // Загрузка сохраненных настроек
        const savedUsername = this.storage.load('username', '');
        if (savedUsername) {
            document.getElementById('username-input').value = savedUsername;
        }
    }

    // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====

    switchTab(tab) {
        this.state.currentTab = tab;
        
        // Обновляем навигацию
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tab);
        });

        // Обновляем страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active-page', page.id === `page-${tab}`);
        });

        // Обновляем заголовок
        const titles = {
            dashboard: 'Дашборд',
            generator: 'Генератор',
            history: 'История',
            settings: 'Настройки'
        };
        document.getElementById('page-title').textContent = titles[tab] || tab;

        // Специальная логика для некоторых вкладок
        if (tab === 'generator') {
            // Проверяем, все ли параметры выбраны
            if (this.state.selectedDomain && this.state.selectedStyle && this.state.selectedCategory) {
                this.showStep('step-config');
            } else if (this.state.selectedDomain && this.state.selectedStyle) {
                this.showStep('step-category');
            } else if (this.state.selectedDomain) {
                this.showStep('step-style');
            } else {
                this.showStep('step-domain');
            }
        }
    }
}

// Инициализация приложения
const app = new App();
window.app = app;