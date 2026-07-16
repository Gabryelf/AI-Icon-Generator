// ===============================================================
// ГЛАВНОЕ ПРИЛОЖЕНИЕ
// ===============================================================

import { Router } from './Router.js';
import { ConfigManager } from './ConfigManager.js';
import { SpriteLoader } from './SpriteLoader.js';
import { UIManager } from './UIManager.js';
import { Storage } from './Storage.js';
import { AssetManager } from './AssetManager.js';
import { Composer } from './Composer.js';
import { IconGenerator } from '../generators/IconGenerator.js';
import { ICON_CATEGORIES, ICON_STYLES, ICON_CONFIG, CONFIG_GROUPS } from '../configs/icon_config.js';

export class App {
    constructor() {
        // ===== МОДУЛИ =====
        this.storage = new Storage('nif_');
        this.configManager = new ConfigManager();
        this.spriteLoader = new SpriteLoader();
        this.assetManager = new AssetManager();
        this.composer = new Composer(this.assetManager);
        this.ui = new UIManager();
        this.router = new Router();
        
        // Генератор иконок
        this.iconGenerator = new IconGenerator(this.assetManager, this.composer);

        // ===== СОСТОЯНИЕ =====
        this.state = {
            currentTab: 'dashboard',
            selectedCategory: null,
            selectedStyle: null,
            config: { ...ICON_CONFIG.defaults },
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

        // ===== МАРШРУТЫ =====
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
        console.log('🚀 Neural Icon Forge v4.0 (Icon Only)');
        
        try {
            // Инициализация модулей
            await this.assetManager.init();
            console.log('✅ AssetManager загружен');
            
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

            console.log('✅ Neural Icon Forge v4.0 готов');
            console.log(`📦 Категории: ${Object.keys(ICON_CATEGORIES).length}`);
            console.log(`🎨 Стили: ${Object.keys(ICON_STYLES).length}`);
            console.log(`💾 Сохранено: ${this.state.saved.length}`);
            console.log(`🖼️ Ассетов: ${this.assetManager.getTotalAssets()}`);
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.ui.showNotification('Ошибка загрузки приложения', 'error');
        }
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
        Object.entries(ICON_CATEGORIES).forEach(([key, category]) => {
            const card = document.createElement('button');
            card.className = 'category-card';
            card.dataset.category = key;
            card.innerHTML = `
                <i class="fas ${category.icon}"></i>
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

        grid.innerHTML = '';
        Object.entries(ICON_STYLES).forEach(([key, style]) => {
            const card = document.createElement('button');
            card.className = 'style-card';
            card.dataset.style = key;
            card.innerHTML = `
                <i class="fas ${style.icon}"></i>
                <span>${style.name}</span>
                <small>${style.description}</small>
            `;
            card.addEventListener('click', () => this.selectStyle(key));
            grid.appendChild(card);
        });

        const desc = document.getElementById('style-desc');
        if (desc) {
            desc.textContent = 'Выберите стиль для генерации иконок';
        }
    }

    // =============================================================
    // ВЫБОР КАТЕГОРИИ И СТИЛЯ
    // =============================================================

    selectCategory(category) {
        this.state.selectedCategory = category;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.category-card[data-category="${category}"]`)?.classList.add('selected');
        this.ui.showStep('step-style');
    }

    selectStyle(style) {
        this.state.selectedStyle = style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.style-card[data-style="${style}"]`)?.classList.add('selected');
        this.loadConfig();
        this.ui.showStep('step-config');
    }

    loadConfig() {
        const container = document.getElementById('config-container');
        if (!container) return;

        container.innerHTML = '';

        // Группировка настроек
        CONFIG_GROUPS.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'config-group';
            
            const title = document.createElement('div');
            title.className = 'config-group-title';
            title.innerHTML = `<i class="fas fa-${group.icon}"></i> ${group.title}`;
            groupDiv.appendChild(title);

            group.fields.forEach(fieldKey => {
                const field = ICON_CONFIG.config[fieldKey];
                if (!field) return;
                
                const row = this.ui.createConfigRow(field, ICON_CONFIG.defaults, (key, value) => {
                    this.state.config[key] = value;
                    if (this.state.autoGenerate) this.generateIcon();
                });
                groupDiv.appendChild(row);
            });

            container.appendChild(groupDiv);
        });

        this.ui.setConfigDefaults(ICON_CONFIG.defaults, this.state.config);
        this.state.config.category = this.state.selectedCategory;
        this.state.config.style = this.state.selectedStyle;

        const desc = document.getElementById('config-desc');
        if (desc) {
            const styleName = ICON_STYLES[this.state.selectedStyle]?.name || this.state.selectedStyle;
            const categoryName = ICON_CATEGORIES[this.state.selectedCategory]?.name || this.state.selectedCategory;
            desc.textContent = `Генерация иконок в стиле "${styleName}" (${categoryName})`;
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
            // Устанавливаем конфигурацию
            this.iconGenerator.setConfig(category, style, config);
            
            // Генерируем иконку
            const iconData = await this.iconGenerator.generate();

            if (!iconData) throw new Error('Ошибка генерации');

            this.state.currentIconData = iconData;
            this.state.currentParams = { category, style, config };

            // Отрисовка
            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            await this.drawIcon(ctx, canvas.width, canvas.height, iconData);

            const categoryName = ICON_CATEGORIES[category]?.name || category;
            const styleName = ICON_STYLES[style]?.name || style;
            document.getElementById('preview-settings').textContent = `${categoryName} / ${styleName}`;

            // Сохраняем в историю
            this.saveToHistory(iconData, { category, style, config });
            this.updateStats();

            // Авто-сохранение
            if (this.state.autoSaveProfile) {
                this.saveToProfile(iconData, { category, style, config });
                document.getElementById('save-status').textContent = '✅ Авто-сохранено';
                document.getElementById('save-status').style.color = '#10b981';
            } else {
                document.getElementById('save-status').textContent = '💾 Нажмите "Сохранить"';
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
        
        // Сортируем слои по zIndex
        const sortedLayers = [...data.layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        
        for (const layer of sortedLayers) {
            await this.drawLayer(ctx, layer, width, height);
        }
    }

    async drawLayer(ctx, layer, width, height) {
        if (!layer) return;

        switch (layer.type) {
            case 'background':
                this.drawBackground(ctx, layer, width, height);
                break;
            case 'sprite':
                await this.drawSprite(ctx, layer);
                break;
            case 'text':
                this.drawText(ctx, layer);
                break;
            default:
                console.warn('⚠️ Неизвестный тип слоя:', layer.type);
        }
    }

    drawBackground(ctx, layer, width, height) {
        if (layer.color === 'transparent') return;
        
        if (layer.gradient) {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            const colors = layer.gradient.colors || ['#7c3aed', '#4d96ff'];
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(1, colors[1] || colors[0]);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = layer.color || '#0a0a0f';
        }
        ctx.fillRect(0, 0, width, height);
    }

    async drawSprite(ctx, layer) {
        const { image, x, y, width: w, height: h, rotation = 0, opacity = 1, color } = layer;
        
        if (!image) return;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x || 250, y || 250);
        ctx.rotate((rotation || 0) * Math.PI / 180);
        
        const drawW = w || image.width;
        const drawH = h || image.height;
        
        if (color) {
            // Рисуем с цветной заливкой
            ctx.drawImage(image, -drawW/2, -drawH/2, drawW, drawH);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = color;
            ctx.fillRect(-drawW/2, -drawH/2, drawW, drawH);
        } else {
            ctx.drawImage(image, -drawW/2, -drawH/2, drawW, drawH);
        }
        
        ctx.restore();
    }

    drawText(ctx, layer) {
        if (!layer.text) return;
        
        ctx.save();
        ctx.fillStyle = layer.color || '#ffffff';
        ctx.font = `${layer.weight || 'bold'} ${layer.size || 24}px ${layer.font || 'Arial'}`;
        ctx.textAlign = layer.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.text, layer.x || 250, layer.y || 250);
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

        const categoryName = ICON_CATEGORIES[item.params?.category]?.name || item.params?.category || 'unknown';
        const styleName = ICON_STYLES[item.params?.style]?.name || item.params?.style || 'unknown';
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
            this.ui.showNotification('Сначала сгенерируйте иконку!', 'warning');
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
        
        this.ui.showNotification('✅ Иконка сохранена в профиль!', 'success');
    }

    randomizeConfig() {
        const config = this.state.config;
        
        // Случайные цвета
        const colors = ['#7c3aed', '#4d96ff', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4', '#10b981'];
        config.primaryColor = colors[Math.floor(Math.random() * colors.length)];
        config.secondaryColor = colors[Math.floor(Math.random() * colors.length)];
        config.accentColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Случайный размер
        config.size = Math.floor(Math.random() * 200) + 100;
        
        // Случайная сложность
        config.complexity = Math.floor(Math.random() * 4) + 1;
        
        // Случайная композиция
        const compositions = ['centered', 'top', 'bottom', 'left', 'right', 'diagonal', 'scattered'];
        config.composition = compositions[Math.floor(Math.random() * compositions.length)];
        
        // Обновляем UI
        Object.keys(ICON_CONFIG.config).forEach(key => {
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
            styles: Object.keys(ICON_STYLES).length,
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

    // =============================================================
    // ЭКСПОРТ
    // =============================================================

    download(format, data) {
        const canvas = document.createElement('canvas');
        const size = this.state.exportQuality || 512;
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
            this.ui.showNotification('✅ SVG скопирован в буфер обмена!', 'success');
        }).catch(() => {
            this.ui.showNotification('❌ Не удалось скопировать SVG', 'error');
        });
    }

    toSVG(data, size) {
        let shapes = '';
        const layers = data.layers || [];
        
        layers.forEach(layer => {
            if (layer.type === 'background') {
                if (layer.color && layer.color !== 'transparent') {
                    shapes += `<rect width="100%" height="100%" fill="${layer.color}" />`;
                }
            }
            if (layer.type === 'text') {
                shapes += `<text x="${layer.x || size/2}" y="${layer.y || size/2}" fill="${layer.color || '#ffffff'}" font-size="${layer.size || 24}" font-family="${layer.font || 'Arial'}" text-anchor="${layer.align || 'center'}" dominant-baseline="middle">${layer.text || ''}</text>`;
            }
            if (layer.type === 'sprite') {
                // Для спрайтов используем цветной прямоугольник как placeholder
                const w = layer.width || size * 0.4;
                const h = layer.height || size * 0.4;
                const x = (layer.x || size/2) - w/2;
                const y = (layer.y || size/2) - h/2;
                shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${layer.color || '#7c3aed'}" opacity="${layer.opacity || 1}" transform="rotate(${layer.rotation || 0}, ${layer.x || size/2}, ${layer.y || size/2})" />`;
            }
        });

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            ${shapes}
        </svg>`;
    }

    exportAll() {
        if (this.state.saved.length === 0) {
            this.ui.showNotification('Нет сохраненных иконок', 'warning');
            return;
        }

        // Создаем архив с иконками
        const data = this.state.saved.map((item, index) => ({
            name: `icon-${index + 1}`,
            data: item.data,
            params: item.params
        }));

        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const link = document.createElement('a');
        link.download = `icons-export-${Date.now()}.json`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        this.ui.showNotification(`✅ Экспортировано ${data.length} иконок`, 'success');
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

        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.generateIcon();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.randomizeConfig();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveToProfile();
            }
        });
    }
}