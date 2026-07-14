// =============================================================
// APP - Главный контроллер приложения
// =============================================================

import { Router } from './Router.js';
import { UIManager } from './UIManager.js';
import { Storage } from './Storage.js';
import { CATEGORIES, STYLES, CATEGORY_CONFIGS } from '../presets.js';
import { ShapeLibrary } from '../libraries/ShapeLibrary.js';
import { ColorPalette } from '../libraries/ColorPalette.js';
import { FontLibrary } from '../libraries/FontLibrary.js';
import { ButtonGenerator } from '../generators/ButtonGenerator.js';
import { IconGenerator } from '../generators/IconGenerator.js';
import { AvatarGenerator } from '../generators/AvatarGenerator.js';
import { CharacterGenerator } from '../generators/CharacterGenerator.js';

export class App {
    constructor() {
        // Инициализация базовых модулей
        this.storage = new Storage('nif_');
        this.ui = new UIManager();
        this.router = new Router();
        this.shapeLibrary = new ShapeLibrary();
        this.colorPalette = new ColorPalette();
        this.fontLibrary = new FontLibrary();
        
        // Инициализация генераторов
        this.buttonGenerator = new ButtonGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.iconGenerator = new IconGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.avatarGenerator = new AvatarGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.characterGenerator = new CharacterGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);

        // Состояние приложения
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

        // Регистрация маршрутов
        this.router.register('dashboard', () => this.showDashboard());
        this.router.register('generator', () => this.showGenerator());
        this.router.register('history', () => this.showHistory());
        this.router.register('profile', () => this.showProfile());
        this.router.register('settings', () => this.showSettings());

        this.init();
    }

    async init() {
        console.log('🚀 Neural Icon Forge v4.0 инициализация...');
        
        this.applyTheme(this.state.theme);
        await this.loadShapeData();
        await this.fontLibrary.loadFonts();
        
        this.setupUI();
        this.updateStats();
        this.renderAll();
        this.setupEventListeners();
        this.loadSettings();

        // Навигация по умолчанию
        this.router.navigate('dashboard');

        console.log('✅ Neural Icon Forge v4.0 готов к работе');
        console.log(`📦 Категории: ${Object.keys(CATEGORIES).length}`);
        console.log(`🎨 Стили: ${Object.keys(STYLES).length}`);
        console.log(`💾 Сохранено: ${this.state.saved.length}`);
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
            console.warn('⚠️ Не удалось загрузить CSV, используем встроенные фигуры');
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

    renderAll() {
        this.ui.renderHistory(this.state.history);
        this.ui.renderRecent(this.state.recent);
        this.renderSavedIcons();
        this.renderDashboardPreview();
    }

    renderDashboardPreview() {
        if (this.state.history.length > 0) {
            const container = document.querySelector('#page-dashboard .recent-grid');
            if (container) {
                const items = this.state.history.slice(0, 6).map(item => {
                    if (!item || !item.data) return '';
                    const dataStr = encodeURIComponent(JSON.stringify(item.data));
                    return `
                        <div class="recent-item" data-icon="${dataStr}">
                            <canvas width="80" height="80" data-icon="${dataStr}"></canvas>
                        </div>
                    `;
                }).join('');
                container.innerHTML = items || '<div class="empty-state">Нет недавних иконок</div>';
                
                container.querySelectorAll('.recent-item canvas').forEach(canvas => {
                    try {
                        const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                        const ctx = canvas.getContext('2d');
                        this.drawIcon(ctx, 80, 80, data);
                    } catch (e) {
                        console.warn('Ошибка отрисовки миниатюры:', e);
                    }
                });
            }
        }
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
        if (!item || !item.data) return;

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

    // ===== ВЫБОР КАТЕГОРИИ И СТИЛЯ =====
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
    }

    // ===== ГЕНЕРАЦИЯ =====
    generateIcon() {
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
            const params = { category, style, config };
            let iconData = null;
            
            switch (category) {
                case 'button':
                    iconData = this.buttonGenerator.generate(style, config);
                    break;
                case 'icon':
                    iconData = this.iconGenerator.generate(style, config);
                    break;
                case 'avatar':
                    iconData = this.avatarGenerator.generate(style, config);
                    break;
                case 'character':
                    iconData = this.characterGenerator.generate(style, config);
                    break;
                default:
                    throw new Error('Неизвестная категория');
            }

            if (!iconData) throw new Error('Ошибка генерации');

            this.state.currentIconData = iconData;
            this.state.currentParams = params;

            // Отрисовка
            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            this.drawIcon(ctx, canvas.width, canvas.height, iconData);

            const categoryName = CATEGORIES[category]?.name || category;
            const styleName = STYLES[style]?.name || style;
            document.getElementById('preview-settings').textContent = `${categoryName} / ${styleName}`;

            // Сохранение
            this.saveToHistory(iconData, params);
            this.updateStats();

            if (this.state.autoSaveProfile) {
                this.saveToProfile(iconData, params);
                document.getElementById('save-status').textContent = '✅ Авто-сохранено в профиль';
                document.getElementById('save-status').style.color = '#10b981';
            } else {
                document.getElementById('save-status').textContent = '💾 Нажмите "Сохранить в профиль" чтобы сохранить';
                document.getElementById('save-status').style.color = '#f59e0b';
            }
        } catch (error) {
            console.error('Ошибка генерации:', error);
            document.getElementById('preview-settings').textContent = '❌ Ошибка генерации';
        } finally {
            this.state.isGenerating = false;
            document.getElementById('generate-btn').disabled = false;
        }
    }

    drawIcon(ctx, width, height, data) {
        if (!data || !data.layers) return;
        
        ctx.clearRect(0, 0, width, height);
        
        data.layers.forEach(layer => {
            if (Array.isArray(layer)) {
                layer.forEach(item => this.drawLayer(ctx, item, width, height));
            } else {
                this.drawLayer(ctx, layer, width, height);
            }
        });

        if (data.effects) {
            data.effects.forEach(effect => {
                this.applyEffect(ctx, effect, width, height);
            });
        }
    }

    drawLayer(ctx, layer, width, height) {
        const cx = width / 2;
        const cy = height / 2;

        switch (layer.type) {
            case 'background':
                this.drawBackground(ctx, layer, width, height);
                break;
            case 'face_base':
                this.drawFaceBase(ctx, layer, cx, cy);
                break;
            case 'fantasy_eyes':
            case 'anime_eyes':
            case 'chibi_eyes':
            case 'casual_eyes':
                this.drawEyes(ctx, layer, cx, cy);
                break;
            case 'mouth':
                this.drawMouth(ctx, layer, cx, cy);
                break;
            case 'eyebrows':
                this.drawEyebrows(ctx, layer, cx, cy);
                break;
            case 'blush':
                this.drawBlush(ctx, layer, cx, cy);
                break;
            case 'glow':
                this.drawGlow(ctx, layer, width, height);
                break;
            case 'pixel_button':
            case 'pixel_icon':
            case 'pixel_face':
            case 'pixel_character':
                this.drawPixelLayer(ctx, layer);
                break;
            case 'text':
                this.drawText(ctx, layer, cx, cy);
                break;
            default:
                // Игнорируем неизвестные типы
                break;
        }
    }

    drawBackground(ctx, layer, width, height) {
        if (layer.style === 'none' || layer.color === 'transparent') return;

        if (layer.style === 'gradient') {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, layer.color || '#0a0a0f');
            grad.addColorStop(1, layer.gradientColor || '#1a1a3e');
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = layer.color || '#0a0a0f';
        }
        ctx.fillRect(0, 0, width, height);
    }

    drawFaceBase(ctx, layer, cx, cy) {
        ctx.save();
        const size = layer.size || 100;
        const color = layer.color || '#f5d0b8';
        const shape = layer.shape || 'ellipse';
        
        ctx.fillStyle = color;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;

        if (shape === 'ellipse' || shape === 'anime_face') {
            const w = layer.width || size * 0.85;
            const h = layer.height || size * 0.95;
            ctx.beginPath();
            ctx.ellipse(cx, cy, w/2, h/2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawEyes(ctx, layer, cx, cy) {
        ctx.save();
        const size = layer.size || 20;
        const color = layer.color || '#ffffff';
        const pupilColor = layer.pupilColor || '#2d3436';
        
        // Левое глаз
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx - size * 0.8, cy, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Правое глаз
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx + size * 0.8, cy, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Зрачки
        ctx.fillStyle = pupilColor;
        ctx.beginPath();
        ctx.arc(cx - size * 0.8, cy + 2, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + size * 0.8, cy + 2, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Блик
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(cx - size * 0.65, cy - size * 0.3, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + size * 0.95, cy - size * 0.3, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawMouth(ctx, layer, cx, cy) {
        ctx.save();
        const size = layer.size || 10;
        const color = layer.color || '#e17055';
        const expression = layer.expression || 'smile';
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.fillStyle = color;
        
        if (expression === 'smile' || expression === 'happy') {
            ctx.beginPath();
            ctx.arc(cx, cy - size * 0.2, size * 0.6, 0.1, Math.PI - 0.1);
            ctx.stroke();
        } else if (expression === 'surprised') {
            ctx.beginPath();
            ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (expression === 'sad') {
            ctx.beginPath();
            ctx.arc(cx, cy + size * 0.3, size * 0.5, Math.PI + 0.1, -0.1);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy, size * 0.3, 0, Math.PI);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawEyebrows(ctx, layer, cx, cy) {
        ctx.save();
        const size = layer.size || 10;
        const color = layer.color || '#2d3436';
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Левая бровь
        ctx.beginPath();
        ctx.moveTo(cx - size * 1.2, cy);
        ctx.quadraticCurveTo(cx - size * 0.8, cy - size * 0.7, cx - size * 0.3, cy - size * 0.2);
        ctx.stroke();
        
        // Правая бровь
        ctx.beginPath();
        ctx.moveTo(cx + size * 1.2, cy);
        ctx.quadraticCurveTo(cx + size * 0.8, cy - size * 0.7, cx + size * 0.3, cy - size * 0.2);
        ctx.stroke();
        
        ctx.restore();
    }

    drawBlush(ctx, layer, cx, cy) {
        ctx.save();
        const size = layer.size || 10;
        const color = layer.color || '#ff6b6b';
        const opacity = layer.opacity || 0.3;
        
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
        // Левая щека
        ctx.beginPath();
        ctx.ellipse(cx - size * 1.4, cy + size * 0.3, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Правая щека
        ctx.beginPath();
        ctx.ellipse(cx + size * 1.4, cy + size * 0.3, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawGlow(ctx, layer, width, height) {
        ctx.save();
        const cx = width / 2;
        const cy = height / 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, layer.size || 150);
        grad.addColorStop(0, layer.color + '80');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    drawPixelLayer(ctx, layer) {
        ctx.save();
        const size = layer.size || 100;
        const pixelSize = layer.pixelSize || 4;
        const color = layer.color || '#7c3aed';
        const x = layer.x || 250;
        const y = layer.y || 250;
        
        const gridSize = Math.floor(size / pixelSize);
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (Math.random() > 0.3) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + i * pixelSize, offsetY + j * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        ctx.restore();
    }

    drawText(ctx, layer, cx, cy) {
        ctx.save();
        ctx.fillStyle = layer.color || '#ffffff';
        ctx.font = `${layer.weight || 'bold'} ${layer.size || 60}px ${layer.font || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.text || 'A', layer.x || cx, layer.y || cy);
        ctx.restore();
    }

    applyEffect(ctx, effect, width, height) {
        switch (effect.type) {
            case 'glow':
                this.drawGlow(ctx, effect, width, height);
                break;
            case 'scanline':
                this.applyScanline(ctx, width, height, effect.intensity);
                break;
            case 'particles':
                this.applyParticles(ctx, width, height, effect.count);
                break;
        }
    }

    applyScanline(ctx, width, height, intensity = 0.1) {
        ctx.save();
        ctx.globalAlpha = intensity;
        for (let y = 0; y < height; y += 4) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, y, width, 1);
        }
        ctx.restore();
    }

    applyParticles(ctx, width, height, count = 10) {
        ctx.save();
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 1 + Math.random() * 3;
            const color = ['#ffd700', '#ff6b6b', '#4d96ff', '#6bcb77'][Math.floor(Math.random() * 4)];
            ctx.globalAlpha = 0.1 + Math.random() * 0.3;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // ===== СОХРАНЕНИЕ =====
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
                const texts = ['Star', 'Hero', 'Pro', 'Max', 'Ultra', 'Prime', 'Core', 'Neon', 'Pixel', 'Magic', 'Cyber', 'Chibi', 'Anime', 'Casual'];
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

    // ===== СТАТИСТИКА =====
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

    // ===== НАВИГАЦИЯ =====
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

    // ===== НАСТРОЙКИ =====
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

    // ===== ЭКСПОРТ =====
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
            alert('SVG код скопирован в буфер обмена!');
        }).catch(() => {
            alert('Не удалось скопировать SVG');
        });
    }

    toSVG(data, size) {
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
            if (item.style === 'none' || item.color === 'transparent') return '';
            return `<rect width="100%" height="100%" fill="${item.color || '#0a0a0f'}" />`;
        }
        if (item.type === 'face_base') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size/2 || 100;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" />`;
        }
        if (item.type === 'fantasy_eyes' || item.type === 'anime_eyes' || item.type === 'chibi_eyes') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const s = item.size || 20;
            return `
                <ellipse cx="${cx - s*0.8}" cy="${cy}" rx="${s*0.6}" ry="${s*0.8}" fill="${item.color}" />
                <ellipse cx="${cx + s*0.8}" cy="${cy}" rx="${s*0.6}" ry="${s*0.8}" fill="${item.color}" />
                <circle cx="${cx - s*0.8}" cy="${cy + 2}" r="${s*0.3}" fill="${item.pupilColor}" />
                <circle cx="${cx + s*0.8}" cy="${cy + 2}" r="${s*0.3}" fill="${item.pupilColor}" />
            `;
        }
        if (item.type === 'mouth') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const s = item.size || 10;
            return `<path d="M${cx - s*0.6},${cy - s*0.2} Q${cx},${cy + s*0.3} ${cx + s*0.6},${cy - s*0.2}" stroke="${item.color}" stroke-width="2" fill="none" />`;
        }
        if (item.type === 'glow') {
            const cx = 250;
            const cy = 250;
            const r = item.size || 150;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="0.3" filter="blur(20px)" />`;
        }
        return '';
    }

    // ===== СОБЫТИЯ =====
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.router.navigate(tab);
            });
        });

        // Генерация
        document.getElementById('generate-btn')?.addEventListener('click', () => {
            this.generateIcon();
        });

        document.getElementById('randomize-btn')?.addEventListener('click', () => {
            this.randomizeConfig();
        });

        document.getElementById('save-to-profile-btn')?.addEventListener('click', () => {
            this.saveToProfile();
        });

        // Назад
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.back;
                if (target) {
                    this.ui.showStep(target);
                }
            });
        });

        // Экспорт
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
            }
        });

        // Настройки
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

        // Глобальные события
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

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            // Можем добавить адаптивность
        });
    }
}