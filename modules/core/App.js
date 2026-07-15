// modules/core/App.js

import { Router } from './Router.js';
import { ConfigManager } from './ConfigManager.js';
import { SpriteLoader } from './SpriteLoader.js';
import { UIManager } from './UIManager.js';
import { Storage } from './Storage.js';
import { CATEGORIES, STYLES, CATEGORY_CONFIGS } from '../configs/presets.js';
import { ButtonGenerator } from '../generators/ButtonGenerator.js';
import { IconGenerator } from '../generators/IconGenerator.js';
import { AvatarGenerator } from '../generators/AvatarGenerator.js';
import { CharacterGenerator } from '../generators/CharacterGenerator.js';

export class App {
    constructor() {
        // ===== ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ =====
        this.storage = new Storage('nif_');
        this.configManager = new ConfigManager();
        this.spriteLoader = new SpriteLoader();
        this.ui = new UIManager();
        this.router = new Router();
        
        // Инициализация генераторов
        this.generators = {
            button: new ButtonGenerator(this.spriteLoader, this.configManager),
            icon: new IconGenerator(this.spriteLoader, this.configManager),
            avatar: new AvatarGenerator(this.spriteLoader, this.configManager),
            character: new CharacterGenerator(this.spriteLoader, this.configManager)
        };

        // ===== СОСТОЯНИЕ =====
        this.state = {
            currentTab: 'dashboard',
            selectedCategory: null,
            selectedStyle: null,
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
            isGenerating: false
        };

        // ===== РЕГИСТРАЦИЯ МАРШРУТОВ =====
        this.router
            .register('dashboard', () => this.showDashboard())
            .register('generator', () => this.showGenerator())
            .register('history', () => this.showHistory())
            .register('profile', () => this.showProfile())
            .register('settings', () => this.showSettings());

        // ===== ЗАПУСК =====
        this.init();
    }

    // =============================================================
    // ИНИЦИАЛИЗАЦИЯ
    // =============================================================

    async init() {
        console.log('🚀 Neural Icon Forge v4.0 инициализация...');
        console.log('📦 Загрузка конфигураций и спрайтов...');
        
        try {
            // Загружаем конфигурации
            await this.configManager.init();
            console.log('✅ ConfigManager загружен');
            
            // Загружаем спрайты
            await this.spriteLoader.init();
            console.log('✅ SpriteLoader загружен');
            
            // Применяем тему
            this.applyTheme(this.state.theme);
            
            // Настраиваем UI
            this.setupUI();
            this.updateStats();
            this.renderAll();
            this.setupEventListeners();
            this.loadSettings();

            // Переходим на дашборд
            this.router.navigate('dashboard');

            console.log('✅ Neural Icon Forge v4.0 готов к работе');
            console.log(`📦 Категории: ${Object.keys(CATEGORIES).length}`);
            console.log(`🎨 Стили: ${Object.keys(STYLES).length}`);
            console.log(`💾 Сохранено: ${this.state.saved.length}`);
            
            // Выводим информацию о доступных спрайтах
            this.logSpriteInfo();
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.ui.showNotification('Ошибка загрузки приложения', 'error');
        }
    }

    logSpriteInfo() {
        console.log('📊 Доступные спрайты:');
        Object.keys(CATEGORIES).forEach(category => {
            Object.keys(STYLES).forEach(style => {
                const map = this.spriteLoader.getSpriteMap(category, style);
                if (map) {
                    const parts = Object.keys(map.parts || {});
                    console.log(`  - ${category}/${style}: ${parts.length} частей`);
                }
            });
        });
    }

    // =============================================================
    // НАСТРОЙКА UI
    // =============================================================

    setupUI() {
        this.renderCategories();
        this.renderStyles();
    }

    renderCategories() {
        const grid = document.getElementById('category-grid');
        if (!grid) return;

        grid.innerHTML = '';
        Object.entries(CATEGORIES).forEach(([key, category]) => {
            const card = document.createElement('button');
            card.className = 'category-card';
            card.dataset.category = key;
            card.innerHTML = `
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
                <small>${category.description}</small>
            `;
            card.addEventListener('click', () => this.selectCategory(key));
            grid.appendChild(card);
        });
    }

    renderStyles() {
        const grid = document.getElementById('style-grid');
        if (!grid) return;

        const category = this.state.selectedCategory;
        const availableStyles = CATEGORIES[category]?.styles || [];

        grid.innerHTML = '';
        Object.entries(STYLES)
            .filter(([key]) => availableStyles.includes(key))
            .forEach(([key, style]) => {
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

        const desc = document.getElementById('style-desc');
        if (desc) {
            desc.textContent = `Выберите стиль для категории "${CATEGORIES[category]?.name || ''}"`;
        }
    }

    // =============================================================
    // ВЫБОР КАТЕГОРИИ И СТИЛЯ
    // =============================================================

    selectCategory(category) {
        this.state.selectedCategory = category;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.category-card[data-category="${category}"]`)?.classList.add('selected');
        this.renderStyles();
        this.ui.showStep('step-style');
    }

    selectStyle(style) {
        this.state.selectedStyle = style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.style-card[data-style="${style}"]`)?.classList.add('selected');
        this.loadCategoryConfig();
        this.ui.showStep('step-config');
    }

    loadCategoryConfig() {
        const category = this.state.selectedCategory;
        const style = this.state.selectedStyle;
        
        if (!category || !style) return;

        const categoryConfig = CATEGORY_CONFIGS[category];
        if (!categoryConfig) return;

        const container = document.getElementById('config-container');
        if (!container) return;

        container.innerHTML = '';
        const groups = this.ui.groupConfigFields(categoryConfig.config);

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
                const row = this.ui.createConfigRow(field, categoryConfig.defaults, (key, value) => {
                    this.state.config[key] = value;
                    if (this.state.autoGenerate) this.generateIcon();
                });
                groupDiv.appendChild(row);
            });

            container.appendChild(groupDiv);
        });

        this.ui.setConfigDefaults(categoryConfig.defaults, this.state.config);
        this.state.config.category = category;
        this.state.config.style = style;

        const desc = document.getElementById('config-desc');
        if (desc) {
            const styleName = STYLES[style]?.name || style;
            const categoryName = CATEGORIES[category]?.name || category;
            desc.textContent = `Настройка ${categoryName} в стиле "${styleName}"`;
        }

        if (this.state.autoGenerate) {
            setTimeout(() => this.generateIcon(), 300);
        }
    }

    // =============================================================
    // ГЕНЕРАЦИЯ
    // =============================================================

    async generateIcon() {
        if (this.state.isGenerating) return;
        
        const category = this.state.selectedCategory;
        const style = this.state.selectedStyle;
        const config = this.state.config;

        if (!category || !style) {
            document.getElementById('preview-settings').textContent = 'Выберите категорию и стиль';
            return;
        }

        this.state.isGenerating = true;
        document.getElementById('generate-btn').disabled = true;

        try {
            // Получаем генератор для категории
            const generator = this.generators[category];
            if (!generator) {
                throw new Error(`Генератор для категории "${category}" не найден`);
            }

            // Устанавливаем конфигурацию
            generator.setConfig(category, style, config);
            
            // Генерируем иконку
            const iconData = await generator.generate();

            if (!iconData) throw new Error('Ошибка генерации');

            this.state.currentIconData = iconData;
            this.state.currentParams = { category, style, config };

            // Отрисовка
            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            await this.drawIcon(ctx, canvas.width, canvas.height, iconData);

            const categoryName = CATEGORIES[category]?.name || category;
            const styleName = STYLES[style]?.name || style;
            document.getElementById('preview-settings').textContent = `${categoryName} / ${styleName}`;

            // Сохраняем в историю
            this.saveToHistory(iconData, { category, style, config });
            this.updateStats();

            // Авто-сохранение в профиль
            if (this.state.autoSaveProfile) {
                this.saveToProfile(iconData, { category, style, config });
                document.getElementById('save-status').textContent = '✅ Авто-сохранено в профиль';
                document.getElementById('save-status').style.color = '#10b981';
            } else {
                document.getElementById('save-status').textContent = '💾 Нажмите "Сохранить в профиль"';
                document.getElementById('save-status').style.color = '#f59e0b';
            }
        } catch (error) {
            console.error('Ошибка генерации:', error);
            document.getElementById('preview-settings').textContent = '❌ Ошибка генерации';
            document.getElementById('save-status').textContent = '❌ ' + error.message;
            document.getElementById('save-status').style.color = '#ef4444';
        } finally {
            this.state.isGenerating = false;
            document.getElementById('generate-btn').disabled = false;
        }
    }

    // =============================================================
    // ОТРИСОВКА
    // =============================================================

    async drawIcon(ctx, width, height, data) {
        if (!data?.layers) return;
        
        ctx.clearRect(0, 0, width, height);
        
        for (const layer of data.layers) {
            if (Array.isArray(layer)) {
                for (const item of layer) {
                    await this.drawLayer(ctx, item, width, height);
                }
            } else {
                await this.drawLayer(ctx, layer, width, height);
            }
        }
    }

    async drawLayer(ctx, layer, width, height) {
        if (!layer || !layer.type) {
            console.warn('⚠️ Слой без типа:', layer);
            return;
        }

        switch (layer.type) {
            case 'sprite':
                await this.drawSpriteLayer(ctx, layer);
                break;
            case 'background':
                this.drawBackground(ctx, layer, width, height);
                break;
            case 'text':
                this.drawTextLayer(ctx, layer);
                break;
            default:
                console.warn('⚠️ Неизвестный тип слоя:', layer.type);
        }
    }

    async drawSpriteLayer(ctx, layer) {
        const { path, x, y, scale = 1, rotation = 0, opacity = 1, color, tint } = layer;
        
        if (!path) return;
        
        const img = await this.spriteLoader.loadSprite(path);
        if (!img) return;
        
        const w = img.width * scale;
        const h = img.height * scale;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x || 250, y || 250);
        ctx.rotate(rotation || 0);
        
        if (color) {
            // Для спрайтов с прозрачным фоном меняем цвет
            ctx.drawImage(img, -w/2, -h/2, w, h);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = color;
            ctx.fillRect(-w/2, -h/2, w, h);
        } else if (tint) {
            ctx.drawImage(img, -w/2, -h/2, w, h);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = tint;
            ctx.fillRect(-w/2, -h/2, w, h);
        } else {
            ctx.drawImage(img, -w/2, -h/2, w, h);
        }
        
        ctx.restore();
    }

    drawBackground(ctx, layer, width, height) {
        if (!layer.color || layer.color === 'transparent') return;
        
        try {
            ctx.fillStyle = layer.color;
            ctx.fillRect(0, 0, width, height);
        } catch (e) {
            console.warn('Ошибка отрисовки фона:', e);
        }
    }

    drawTextLayer(ctx, layer) {
        ctx.save();
        ctx.fillStyle = layer.color || '#ffffff';
        ctx.font = `${layer.weight || 'bold'} ${layer.size || 24}px ${layer.font || 'Arial'}`;
        ctx.textAlign = layer.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.text || '', layer.x || 250, layer.y || 250);
        ctx.restore();
    }

    // =============================================================
    // РЕНДЕРИНГ
    // =============================================================

    renderAll() {
        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
        this.renderSavedIcons();
        this.renderDashboardPreview();
    }

    renderDashboardPreview() {
        const container = document.querySelector('#page-dashboard .recent-grid');
        if (!container) return;

        if (!this.state.history || this.state.history.length === 0) {
            container.innerHTML = '<div class="empty-state">Нет недавних иконок</div>';
            return;
        }

        container.innerHTML = this.state.history.slice(0, 6).map(item => {
            if (!item?.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            return `
                <div class="recent-item" data-icon="${dataStr}">
                    <canvas width="80" height="80" data-icon="${dataStr}"></canvas>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.recent-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                this.drawIcon(ctx, 80, 80, data);
            } catch (e) {
                console.warn('Ошибка отрисовки миниатюры:', e);
            }
        });

        container.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                try {
                    const data = JSON.parse(decodeURIComponent(item.dataset.icon));
                    const canvas = document.getElementById('generation-canvas');
                    const ctx = canvas.getContext('2d');
                    this.drawIcon(ctx, canvas.width, canvas.height, data);
                    this.state.currentIconData = data;
                    this.router.navigate('generator');
                } catch (e) {
                    console.error('Ошибка загрузки иконки:', e);
                }
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
            if (!item?.data) return '';
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
                this.drawIcon(ctx, 80, 80, data);
            } catch (e) {
                console.warn('Ошибка отрисовки миниатюры:', e);
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
        if (!item?.data) return;

        const canvas = document.getElementById('generation-canvas');
        const ctx = canvas.getContext('2d');
        this.drawIcon(ctx, canvas.width, canvas.height, item.data);
        this.state.currentIconData = item.data;
        this.state.currentParams = item.params;

        const categoryName = CATEGORIES[item.params?.category]?.name || item.params?.category || 'unknown';
        const styleName = STYLES[item.params?.style]?.name || item.params?.style || 'unknown';
        document.getElementById('preview-settings').textContent = `${categoryName} / ${styleName}`;
        
        this.router.navigate('generator');
    }

    removeSavedIcon(index) {
        if (confirm('Удалить эту иконку из сохраненных?')) {
            this.state.saved.splice(index, 1);
            this.storage.save('saved', this.state.saved);
            this.renderSavedIcons();
            this.updateStats();
        }
    }

    // =============================================================
    // СОХРАНЕНИЕ
    // =============================================================

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
        this.renderDashboardPreview();
    }

    saveToProfile(iconData = null, params = null) {
        const data = iconData || this.state.currentIconData;
        const p = params || this.state.currentParams;

        if (!data || !p) {
            alert('Сначала сгенерируйте иконку!');
            return;
        }

        const isDuplicate = this.state.saved.some(item => 
            item.params?.category === p.category && 
            item.params?.style === p.style &&
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
        
        setTimeout(() => {
            document.getElementById('save-status').textContent = '';
        }, 3000);
    }

    randomizeConfig() {
        const category = this.state.selectedCategory;
        const categoryConfig = CATEGORY_CONFIGS[category];
        if (!categoryConfig) return;

        const config = this.state.config;
        Object.keys(categoryConfig.config).forEach(key => {
            const field = categoryConfig.config[key];
            if (field.type === 'range') {
                const min = field.min || 0;
                const max = field.max || 100;
                config[key] = Math.floor(Math.random() * (max - min + 1)) + min;
            } else if (field.type === 'color') {
                const colors = ['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f97316', '#22c55e', '#ff6b6b', '#ffd93d', '#4d96ff'];
                config[key] = colors[Math.floor(Math.random() * colors.length)];
            } else if (field.type === 'select') {
                const options = field.options || [];
                if (options.length) {
                    config[key] = options[Math.floor(Math.random() * options.length)].value;
                }
            } else if (field.type === 'checkbox') {
                config[key] = Math.random() > 0.5;
            } else if (field.type === 'text') {
                const texts = ['Star', 'Hero', 'Pro', 'Max', 'Ultra', 'Prime', 'Core', 'Neon', 'Pixel', 'Magic', 'Cyber', 'Chibi', 'Anime', 'Casual', 'Quantum', 'Nova', 'Apex', 'Zen', 'Void', 'Eclipse'];
                config[key] = texts[Math.floor(Math.random() * texts.length)];
            }
        });

        Object.keys(categoryConfig.config).forEach(key => {
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

    // =============================================================
    // СТАТИСТИКА
    // =============================================================

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

    // =============================================================
    // НАВИГАЦИЯ
    // =============================================================

    showDashboard() {
        this.renderDashboardPreview();
    }

    showGenerator() {
        if (this.state.selectedCategory && this.state.selectedStyle) {
            this.ui.showStep('step-config');
        } else if (this.state.selectedCategory) {
            this.ui.showStep('step-style');
        } else {
            this.ui.showStep('step-category');
        }
    }

    showHistory() {
        this.ui.renderHistory(this.state.history);
    }

    showProfile() {
        this.renderSavedIcons();
    }

    showSettings() {
        this.loadSettings();
    }

    // =============================================================
    // НАСТРОЙКИ
    // =============================================================

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

        // Создаем ZIP архив с иконками
        const zip = { files: [] };
        zip.add = function(name, data) { this.files.push({ name, data }); };
        zip.generate = function() { return JSON.stringify(this.files); };

        this.state.saved.forEach((item, index) => {
            const canvas = document.createElement('canvas');
            const size = this.state.exportQuality || 512;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            this.drawIcon(ctx, size, size, item.data);
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

    // =============================================================
    // ЭКСПОРТ
    // =============================================================

    download(format, data) {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        this.drawIcon(ctx, size, size, data);

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `icon-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else if (format === 'svg') {
            const svg = this.toSVG(data, size);
            const blob = new Blob([svg], {type: 'image/svg+xml'});
            const link = document.createElement('a');
            link.download = `icon-${Date.now()}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
        }
    }

    copySVG(data) {
        const svg = this.toSVG(data, 512);
        navigator.clipboard.writeText(svg).then(() => {
            alert('✅ SVG код скопирован в буфер обмена!');
        }).catch(() => {
            alert('❌ Не удалось скопировать SVG');
        });
    }

    toSVG(data, size) {
        // Простая конвертация в SVG (только для базовых слоев)
        let shapes = '';
        data.layers.forEach(layer => {
            if (Array.isArray(layer)) {
                layer.forEach(item => {
                    shapes += this.layerToSVG(item, size);
                });
            } else {
                shapes += this.layerToSVG(layer, size);
            }
        });

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            ${shapes}
        </svg>`;
    }

    layerToSVG(item, size) {
        if (item.type === 'background') {
            if (!item.color || item.color === 'transparent') return '';
            return `<rect width="100%" height="100%" fill="${item.color}" />`;
        }
        if (item.type === 'sprite') {
            // Для спрайтов сложно сделать SVG, поэтому возвращаем placeholder
            return `<rect x="${(item.x || 250) - 50}" y="${(item.y || 250) - 50}" width="100" height="100" fill="${item.color || '#7c3aed'}" opacity="${item.opacity || 1}" />`;
        }
        if (item.type === 'text') {
            return `<text x="${item.x || 250}" y="${item.y || 250}" fill="${item.color || '#ffffff'}" font-size="${item.size || 24}" text-anchor="middle" dominant-baseline="middle">${item.text || ''}</text>`;
        }
        return '';
    }

    // =============================================================
    // СОБЫТИЯ
    // =============================================================

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.router.navigate(tab);
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
                    this.ui.showStep(target);
                }
            });
        });

        document.getElementById('download-png-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.download('png', this.state.currentIconData);
            }
        });

        document.getElementById('download-svg-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.download('svg', this.state.currentIconData);
            }
        });

        document.getElementById('copy-svg-btn')?.addEventListener('click', () => {
            if (this.state.currentIconData) {
                this.copySVG(this.state.currentIconData);
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
                this.renderAll();
                this.updateStats();
                const canvas = document.getElementById('generation-canvas');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.getElementById('preview-settings').textContent = 'Данные очищены';
                this.ui.showNotification('Все данные очищены', 'info');
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
        });

        document.getElementById('export-quality')?.addEventListener('change', (e) => {
            this.state.exportQuality = parseInt(e.target.value);
            this.storage.save('exportQuality', parseInt(e.target.value));
        });

        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (target) {
                const action = target.dataset.action;
                if (action === 'download-png' || action === 'download-svg') {
                    try {
                        const data = JSON.parse(decodeURIComponent(target.dataset.icon));
                        const format = action === 'download-png' ? 'png' : 'svg';
                        this.download(format, data);
                    } catch (error) {
                        console.error('Ошибка скачивания:', error);
                    }
                }
            }
        });

        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter - генерация
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.generateIcon();
            }
            // Ctrl+R - рандомизация
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.randomizeConfig();
            }
            // Ctrl+S - сохранение
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveToProfile();
            }
        });
    }
}