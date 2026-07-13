// ============================================
// ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ v3.1 - Инициализация и роутинг
// ============================================

import { UIManager } from './modules/UIManager.js';
import { Generator } from './modules/Generator.js';
import { Storage } from './modules/Storage.js';
import { DOMAINS, STYLES, CATEGORIES } from './modules/presets.js';
import { ShapeLibrary } from './modules/ShapeLibrary.js';
import { ColorPalette } from './modules/ColorPalette.js';
import { TextureGenerator } from './modules/TextureGenerator.js';
import { IconComposer } from './modules/IconComposer.js';
import { PixelGenerator } from './modules/PixelGenerator.js';
import { CharacterGenerator } from './modules/CharacterGenerator.js';

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
        this.pixelGenerator = new PixelGenerator();
        this.characterGenerator = new CharacterGenerator();

        // Состояние
        this.state = {
            currentTab: 'dashboard',
            selectedDomain: null,
            selectedStyle: null,
            selectedCategory: null,
            config: {},
            history: this.storage.load('history', []),
            recent: this.storage.load('recent', []),
            saved: this.storage.load('saved', []),
            theme: this.storage.load('theme', 'purple'),
            username: this.storage.load('username', ''),
            autoGenerate: this.storage.load('autoGenerate', true),
            autoSaveProfile: this.storage.load('autoSaveProfile', false),
            exportQuality: this.storage.load('exportQuality', 512),
            currentIconData: null,
            currentParams: null,
            lastGeneratedId: null
        };

        // Инициализация
        this.init();
    }

    async init() {
        this.applyTheme(this.state.theme);
        await this.loadShapeData();
        this.setupUI();
        this.updateStats();
        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
        this.renderSavedIcons();
        this.generateDashboardPreview();
        this.setupEventListeners();
        this.loadSettings();

        console.log('🧠 Neural Icon Forge v3.2 инициализирован');
    }

    async loadShapeData() {
        try {
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

    renderSavedIcons() {
        const grid = document.getElementById('saved-icons-grid');
        if (!grid) return;

        if (!this.state.saved || this.state.saved.length === 0) {
            grid.innerHTML = `<div class="empty-state">Нет сохраненных иконок</div>`;
            return;
        }

        grid.innerHTML = this.state.saved.map((item, index) => {
            if (!item || !item.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            return `
                <div class="saved-item" data-index="${index}">
                    <canvas width="80" height="80" data-icon="${dataStr}"></canvas>
                    <button class="remove-btn" data-index="${index}">✕</button>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.saved-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                this.generator.drawIcon(ctx, 80, 80, data);
            } catch (e) {
                console.warn('Не удалось отрисовать миниатюру:', e);
            }
        });

        grid.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeSavedIcon(index);
            });
        });

        grid.querySelectorAll('.saved-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadSavedIcon(index);
            });
        });

        document.getElementById('profile-saved').textContent = this.state.saved.length;
        document.getElementById('profile-total').textContent = this.state.history.length;
    }

    loadSavedIcon(index) {
        const item = this.state.saved[index];
        if (!item || !item.data) return;

        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        this.generator.drawIcon(ctx, canvas.width, canvas.height, item.data);
        this.state.currentIconData = item.data;
        this.state.currentParams = item.params;

        document.getElementById('preview-settings').textContent = 
            `${item.params?.domain || 'unknown'} / ${item.params?.style || 'unknown'} / ${item.params?.category || 'unknown'}`;
        
        this.switchTab('generator');
    }

    removeSavedIcon(index) {
        if (confirm('Удалить эту иконку из сохраненных?')) {
            this.state.saved.splice(index, 1);
            this.storage.save('saved', this.state.saved);
            this.renderSavedIcons();
            this.updateStats();
        }
    }

    selectDomain(domain) {
        this.state.selectedDomain = domain;
        document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.domain-card[data-domain="${domain}"]`)?.classList.add('selected');
        this.showStep('step-style');
    }

    selectStyle(style) {
        this.state.selectedStyle = style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.style-card[data-style="${style}"]`)?.classList.add('selected');
        this.filterCategoriesByDomain();
        this.showStep('step-category');
    }

    selectCategory(category) {
        this.state.selectedCategory = category;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.category-card[data-category="${category}"]`)?.classList.add('selected');
        this.loadCategoryConfig(category);
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

        container.innerHTML = '';
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

        this.setConfigDefaults(catData.defaults);
    }

    groupConfigFields(config) {
        const groups = [];
        const basicFields = ['shape', 'size', 'color', 'bgColor', 'skinColor'];
        const styleFields = ['style', 'glow', 'hasBorder', 'borderColor'];
        const detailFields = ['complexity', 'stars', 'details', 'hasRibbon', 'eyes', 'mouth', 'hair'];
        const textFields = ['text', 'letter'];
        
        const basic = { title: 'Основные параметры', icon: 'pencil', fields: [] };
        const style = { title: 'Стиль и эффекты', icon: 'paintbrush', fields: [] };
        const details = { title: 'Детализация', icon: 'layer-group', fields: [] };
        const text = { title: 'Текст', icon: 'font', fields: [] };

        Object.entries(config).forEach(([key, field]) => {
            if (basicFields.includes(key)) basic.fields.push({key, ...field});
            else if (styleFields.includes(key)) style.fields.push({key, ...field});
            else if (detailFields.includes(key)) details.fields.push({key, ...field});
            else if (textFields.includes(key)) text.fields.push({key, ...field});
            else {
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
                    if (this.state.autoGenerate) this.generateIcon();
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
            if (this.state.autoGenerate) {
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

    showStep(stepId) {
        document.querySelectorAll('.setup-step').forEach(el => el.style.display = 'none');
        const step = document.getElementById(stepId);
        if (step) step.style.display = 'block';
        if (stepId === 'step-config') {
            setTimeout(() => this.generateIcon(), 300);
        }
    }

    // ===== ГЕНЕРАЦИЯ ИКОНКИ (НОВАЯ ЛОГИКА СОХРАНЕНИЯ) =====

    generateIcon() {
        const params = {
            domain: this.state.selectedDomain,
            style: this.state.selectedStyle,
            category: this.state.selectedCategory,
            config: this.state.config
        };

        if (!params.domain || !params.style || !params.category) {
            document.getElementById('preview-info').textContent = 'Выберите все параметры для генерации';
            return;
        }

        const iconData = this.generator.generate(params);
        this.state.currentIconData = iconData;
        this.state.currentParams = params;

        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        this.generator.drawIcon(ctx, canvas.width, canvas.height, iconData);

        const info = document.getElementById('preview-settings');
        info.textContent = `${params.domain} / ${params.style} / ${params.category}`;

        // ВСЕГДА сохраняем в историю (показ последних генераций)
        this.saveToHistory(iconData, params);
        this.updateStats();

        // Сохранение в профиль - ТОЛЬКО если включено авто-сохранение
        if (this.state.autoSaveProfile) {
            this.saveToProfile(iconData, params);
            document.getElementById('save-status').textContent = '✅ Авто-сохранено в профиль';
            document.getElementById('save-status').style.color = '#10b981';
        } else {
            document.getElementById('save-status').textContent = '💾 Нажмите "Сохранить в профиль" чтобы сохранить';
            document.getElementById('save-status').style.color = '#f59e0b';
        }

        this.state.lastGeneratedId = Date.now();
    }

    saveToHistory(iconData, params) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            data: iconData,
            params: params
        };

        this.state.history.unshift(entry);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        this.storage.save('history', this.state.history);

        this.state.recent.unshift(entry);
        if (this.state.recent.length > 6) {
            this.state.recent = this.state.recent.slice(0, 6);
        }
        this.storage.save('recent', this.state.recent);

        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
    }

    // ===== СОХРАНЕНИЕ В ПРОФИЛЬ (ТОЛЬКО ПО КНОПКЕ) =====

    saveToProfile(iconData = null, params = null) {
        const data = iconData || this.state.currentIconData;
        const p = params || this.state.currentParams;

        if (!data || !p) {
            alert('Сначала сгенерируйте иконку!');
            return;
        }

        // Проверяем, не сохранена ли уже такая иконка
        const isDuplicate = this.state.saved.some(item => 
            item.params?.domain === p.domain && 
            item.params?.style === p.style && 
            item.params?.category === p.category &&
            JSON.stringify(item.data) === JSON.stringify(data)
        );

        if (isDuplicate) {
            alert('⚠️ Эта иконка уже сохранена в профиле!');
            return;
        }

        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            data: data,
            params: p
        };

        this.state.saved.push(entry);
        this.storage.save('saved', this.state.saved);
        this.renderSavedIcons();
        this.updateStats();
        
        document.getElementById('save-status').textContent = '✅ Сохранено в профиль!';
        document.getElementById('save-status').style.color = '#10b981';
        
        // Показываем уведомление
        setTimeout(() => {
            document.getElementById('save-status').textContent = '';
        }, 3000);
    }

    randomizeConfig() {
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
                const colors = ['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f97316', '#22c55e'];
                config[key] = colors[Math.floor(Math.random() * colors.length)];
            } else if (field.type === 'select') {
                const options = field.options || [];
                if (options.length) {
                    config[key] = options[Math.floor(Math.random() * options.length)].value;
                }
            } else if (field.type === 'checkbox') {
                config[key] = Math.random() > 0.5;
            } else if (field.type === 'text') {
                const texts = ['Star', 'Hero', 'Pro', 'Max', 'Ultra', 'Prime', 'Core', 'Neon', 'Pixel'];
                config[key] = texts[Math.floor(Math.random() * texts.length)];
            }
        });

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

    updateStats() {
        const stats = {
            total: this.state.history.length,
            styles: Object.keys(STYLES).length,
            saved: this.state.saved.length
        };
        this.ui.updateStats(stats);
        
        document.getElementById('stat-saved').textContent = stats.saved;
        document.getElementById('profile-saved').textContent = stats.saved;
        document.getElementById('profile-total').textContent = stats.total;
        
        if (this.state.history.length > 0) {
            document.getElementById('profile-last').textContent = this.state.history[0].timestamp;
        }
    }

    generateDashboardPreview() {
        if (this.state.history.length > 0) {
            const canvas = document.querySelector('#page-dashboard canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.generator.drawIcon(ctx, canvas.width, canvas.height, this.state.history[0].data);
            }
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        this.storage.save('theme', theme);
        const select = document.getElementById('theme-select');
        if (select) select.value = theme;
    }

    loadSettings() {
        document.getElementById('username-input').value = this.state.username || '';
        document.getElementById('theme-select').value = this.state.theme || 'purple';
        document.getElementById('auto-generate').checked = this.state.autoGenerate !== false;
        document.getElementById('auto-save-profile').checked = this.state.autoSaveProfile || false;
        document.getElementById('export-quality').value = this.state.exportQuality || 512;
    }

    exportAll() {
        if (this.state.saved.length === 0) {
            alert('Нет сохраненных иконок для экспорта');
            return;
        }

        const zip = { files: [] };
        zip.add = function(name, data) { this.files.push({ name, data }); };
        zip.generate = function() { return JSON.stringify(this.files); };

        this.state.saved.forEach((item, index) => {
            const canvas = document.createElement('canvas');
            const size = this.state.exportQuality || 512;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            this.generator.drawIcon(ctx, size, size, item.data);
            const dataUrl = canvas.toDataURL('image/png');
            zip.add(`icon-${index + 1}.png`, dataUrl);
        });

        const blob = new Blob([zip.generate()], {type: 'application/json'});
        const link = document.createElement('a');
        link.download = `icons-${Date.now()}.json`;
        link.href = URL.createObjectURL(blob);
        link.click();
        alert('✅ Экспорт завершен!');
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });

        document.getElementById('generate-btn')?.addEventListener('click', () => {
            this.generateIcon();
        });

        document.getElementById('randomize-btn')?.addEventListener('click', () => {
            this.randomizeConfig();
        });

        document.getElementById('save-to-profile-btn')?.addEventListener('click', () => {
            this.saveToProfile();
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.back;
                if (target) {
                    this.showStep(target);
                }
            });
        });

        document.getElementById('download-png-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.generator.download('png', this.state.currentIconData);
            }
        });

        document.getElementById('download-svg-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.generator.download('svg', this.state.currentIconData);
            }
        });

        document.getElementById('copy-svg-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.generator.copySVG(this.state.currentIconData);
            }
        });

        document.getElementById('export-all-btn')?.addEventListener('click', () => {
            this.exportAll();
        });

        document.getElementById('clear-storage-btn')?.addEventListener('click', () => {
            if (confirm('Очистить все данные?')) {
                this.storage.clear();
                this.state.history = [];
                this.state.recent = [];
                this.state.saved = [];
                this.ui.renderHistory([]);
                this.ui.renderRecent([]);
                this.renderSavedIcons();
                this.updateStats();
                document.getElementById('generation-canvas').getContext('2d').clearRect(0, 0, 500, 500);
            }
        });

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

        document.getElementById('username-input')?.addEventListener('change', (e) => {
            this.state.username = e.target.value;
            this.storage.save('username', e.target.value);
        });

        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        document.getElementById('auto-generate')?.addEventListener('change', (e) => {
            this.state.autoGenerate = e.target.checked;
            this.storage.save('autoGenerate', e.target.checked);
        });

        document.getElementById('auto-save-profile')?.addEventListener('change', (e) => {
            this.state.autoSaveProfile = e.target.checked;
            this.storage.save('autoSaveProfile', e.target.checked);
            document.getElementById('save-status').textContent = e.target.checked ? 
                '✅ Авто-сохранение включено' : 
                '💾 Авто-сохранение отключено';
        });

        document.getElementById('export-quality')?.addEventListener('change', (e) => {
            this.state.exportQuality = parseInt(e.target.value);
            this.storage.save('exportQuality', parseInt(e.target.value));
        });
    }

    switchTab(tab) {
        this.state.currentTab = tab;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tab);
        });

        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active-page', page.id === `page-${tab}`);
        });

        const titles = {
            dashboard: 'Дашборд',
            generator: 'Генератор',
            history: 'История',
            profile: 'Мой профиль',
            settings: 'Настройки'
        };
        document.getElementById('page-title').textContent = titles[tab] || tab;

        if (tab === 'generator') {
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
        
        if (tab === 'profile') {
            this.renderSavedIcons();
        }
    }
}

const app = new App();
window.app = app;