// =============================================================
// APP - Главный контроллер приложения v4.0
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
        // ===== ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ =====
        this.storage = new Storage('nif_');
        this.ui = new UIManager();
        this.router = new Router();
        this.shapeLibrary = new ShapeLibrary();
        this.colorPalette = new ColorPalette();
        this.fontLibrary = new FontLibrary();
        
        // Генераторы
        this.buttonGenerator = new ButtonGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.iconGenerator = new IconGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.avatarGenerator = new AvatarGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);
        this.characterGenerator = new CharacterGenerator(this.shapeLibrary, this.colorPalette, this.fontLibrary);

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
        
        this.applyTheme(this.state.theme);
        await this.loadShapeData();
        await this.fontLibrary.loadFonts();
        
        this.setupUI();
        this.updateStats();
        this.renderAll();
        this.setupEventListeners();
        this.loadSettings();

        this.router.navigate('dashboard');

        console.log('✅ Neural Icon Forge v4.0 готов к работе');
        console.log(`📦 Категории: ${Object.keys(CATEGORIES).length}`);
        console.log(`🎨 Стили: ${Object.keys(STYLES).length}`);
        console.log(`💾 Сохранено: ${this.state.saved.length}`);
    }

    // =============================================================
    // ЗАГРУЗКА ДАННЫХ
    // =============================================================

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
                    throw new Error(`Неизвестная категория: ${category}`);
            }

            if (!iconData) throw new Error('Ошибка генерации');

            this.state.currentIconData = iconData;
            this.state.currentParams = params;

            const canvas = document.getElementById('generation-canvas');
            const ctx = canvas.getContext('2d');
            this.drawIcon(ctx, canvas.width, canvas.height, iconData);

            const categoryName = CATEGORIES[category]?.name || category;
            const styleName = STYLES[style]?.name || style;
            document.getElementById('preview-settings').textContent = `${categoryName} / ${styleName}`;

            this.saveToHistory(iconData, params);
            this.updateStats();

            if (this.state.autoSaveProfile) {
                this.saveToProfile(iconData, params);
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
    // ОТРИСОВКА ИКОНОК
    // =============================================================

    drawIcon(ctx, width, height, data) {
        if (!data?.layers) return;
        
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
        // Защита от undefined/null
        if (!layer || !layer.type) {
            console.warn('⚠️ Слой без типа:', layer);
            return;
        }
        
        const cx = width / 2;
        const cy = height / 2;

        switch (layer.type) {
            case 'background':
                this.drawBackground(ctx, layer, width, height);
                break;
            case 'button_main':
                this.drawButtonMain(ctx, layer, cx, cy);
                break;
            case 'icon_main':
                this.drawIconMain(ctx, layer);
                break;
            case 'face_base':
                this.drawFaceBase(ctx, layer, cx, cy);
                break;
            case 'eye_white':
                this.drawEyeWhite(ctx, layer);
                break;
            case 'iris':
                this.drawIris(ctx, layer);
                break;
            case 'pupil':
                this.drawPupil(ctx, layer);
                break;
            case 'eye_highlight':
                this.drawEyeHighlight(ctx, layer);
                break;
            case 'eyebrows':
                this.drawEyebrows(ctx, layer, cx, cy);
                break;
            case 'nose':
                this.drawNose(ctx, layer, cx, cy);
                break;
            case 'mouth':
                this.drawMouth(ctx, layer, cx, cy);
                break;
            case 'blush':
                this.drawBlush(ctx, layer, cx, cy);
                break;
            case 'hair_base':
            case 'hair_bangs':
            case 'hair_tail':
                this.drawHair(ctx, layer);
                break;
            case 'elven_ears':
                this.drawElvenEars(ctx, layer);
                break;
            case 'magic_sparkle':
                this.drawMagicSparkle(ctx, layer);
                break;
            case 'chibi_sparkle':
                this.drawChibiSparkle(ctx, layer);
                break;
            case 'torso':
                this.drawTorso(ctx, layer);
                break;
            case 'neck':
                this.drawNeck(ctx, layer);
                break;
            case 'head_base':
                this.drawHeadBase(ctx, layer);
                break;
            case 'arm':
                this.drawArm(ctx, layer);
                break;
            case 'leg':
                this.drawLeg(ctx, layer);
                break;
            case 'shoe':
                this.drawShoe(ctx, layer);
                break;
            case 'cape':
                this.drawCape(ctx, layer);
                break;
            case 'magic_aura':
                this.drawMagicAura(ctx, layer);
                break;
            case 'glasses':
                this.drawGlasses(ctx, layer);
                break;
            case 'hat':
                this.drawHat(ctx, layer);
                break;
            case 'crown':
                this.drawCrown(ctx, layer);
                break;
            case 'headphones':
                this.drawHeadphones(ctx, layer);
                break;
            case 'bow':
                this.drawBow(ctx, layer);
                break;
            case 'backpack':
                this.drawBackpack(ctx, layer);
                break;
            case 'sword':
                this.drawSword(ctx, layer);
                break;
            case 'staff':
                this.drawStaff(ctx, layer);
                break;
            case 'bow_weapon':
                this.drawBowWeapon(ctx, layer);
                break;
            case 'gun':
                this.drawGun(ctx, layer);
                break;
            case 'shield_weapon':
                this.drawShieldWeapon(ctx, layer);
                break;
            case 'glow_layer':
                this.drawGlowLayer(ctx, layer, width, height);
                break;
            case 'decorative_element':
                this.drawDecorativeElement(ctx, layer);
                break;
            case 'highlight':
                this.drawHighlight(ctx, layer);
                break;
            case 'decorative_dot':
                this.drawDot(ctx, layer);
                break;
            case 'rune':
                this.drawRune(ctx, layer);
                break;
            case 'neon_line':
                this.drawNeonLine(ctx, layer);
                break;
            case 'pixel_sprite':
                this.drawPixelSprite(ctx, layer);
                break;
            case 'pixel_button':
                this.drawPixelButton(ctx, layer);
                break;
            case 'pixel_icon':
                this.drawPixelIcon(ctx, layer);
                break;
            case 'pixel_border':
                this.drawPixelBorder(ctx, layer);
                break;
            case 'pixel_corner':
                this.drawPixelCorner(ctx, layer);
                break;
            case 'pixel_outline':
                this.drawPixelOutline(ctx, layer);
                break;
            case 'pixel_details':
                this.drawPixelDetails(ctx, layer);
                break;
            case 'text':
                this.drawText(ctx, layer, cx, cy);
                break;
            default:
                console.warn('⚠️ Неизвестный тип слоя:', layer.type);
        }
    }

    // =============================================================
    // ИСПРАВЛЕННЫЙ МЕТОД drawBackground
    // =============================================================

    drawBackground(ctx, layer, width, height) {
        // Проверяем, что слой существует и имеет нужные свойства
        if (!layer) return;
        
        // Если цвет прозрачный или стиль none - ничего не рисуем
        if (layer.style === 'none' || layer.color === 'transparent') return;
        
        // Если это градиент
        if (layer.style === 'gradient' && layer.color && layer.gradientColor) {
            try {
                const grad = ctx.createLinearGradient(0, 0, width, height);
                grad.addColorStop(0, layer.color);
                grad.addColorStop(1, layer.gradientColor);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
                return;
            } catch (e) {
                console.warn('⚠️ Ошибка создания градиента:', e);
                // Если градиент не получился, используем сплошной цвет
                if (layer.color && layer.color !== 'gradient' && layer.color !== 'transparent') {
                    ctx.fillStyle = layer.color;
                    ctx.fillRect(0, 0, width, height);
                }
                return;
            }
        }
        
        // Сплошной цвет - проверяем, что это валидный цвет
        if (layer.color && layer.color !== 'gradient' && layer.color !== 'transparent') {
            try {
                ctx.fillStyle = layer.color;
                ctx.fillRect(0, 0, width, height);
            } catch (e) {
                console.warn('⚠️ Ошибка установки цвета фона:', e);
                // Используем цвет по умолчанию
                ctx.fillStyle = '#0a0a0f';
                ctx.fillRect(0, 0, width, height);
            }
        }
    }

    // =============================================================
    // ОСТАЛЬНЫЕ МЕТОДЫ ОТРИСОВКИ (сокращенные)
    // =============================================================

    drawButtonMain(ctx, layer, cx, cy) {
        const { color, text, size, cornerRadius, x, y, textColor, font, glow, borderWidth, borderColor } = layer;
        const w = size * 1.5;
        const h = size * 0.5;
        const r = cornerRadius || 20;
        const px = x || cx;
        const py = y || cy;

        ctx.save();
        if (glow) {
            ctx.shadowColor = color + '60';
            ctx.shadowBlur = 30;
        }
        ctx.fillStyle = color;
        this.roundRect(ctx, px - w/2, py - h/2, w, h, r);
        ctx.fill();

        if (borderWidth > 0) {
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = borderColor || this.lightenColor(color, 20);
            ctx.lineWidth = borderWidth;
            this.roundRect(ctx, px - w/2, py - h/2, w, h, r);
            ctx.stroke();
        }

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = textColor || '#ffffff';
        ctx.font = `bold ${size * 0.2}px ${font || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text || 'Кнопка', px, py + 2);
        ctx.restore();
    }

    drawIconMain(ctx, layer) {
        const { shape, color, size, x, y, strokeWidth, strokeColor, glow } = layer;
        const cx = x || 250;
        const cy = y || 250;
        const radius = size / 2;

        ctx.save();
        if (glow) {
            ctx.shadowColor = color + '60';
            ctx.shadowBlur = 30;
        }
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        this.drawShape(ctx, shape, cx, cy, radius);
        if (strokeWidth > 0) {
            ctx.strokeStyle = strokeColor || this.darkenColor(color, 30);
            ctx.lineWidth = strokeWidth;
            this.drawShape(ctx, shape, cx, cy, radius);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawShape(ctx, shape, cx, cy, radius) {
        ctx.beginPath();
        switch(shape) {
            case 'circle':
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(cx - radius, cy - radius, radius * 2, radius * 2);
                break;
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy + Math.sin(angle) * radius;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            case 'shield':
                ctx.moveTo(cx, cy - radius);
                ctx.quadraticCurveTo(cx + radius, cy - radius * 0.6, cx + radius * 0.8, cy + radius * 0.4);
                ctx.quadraticCurveTo(cx, cy + radius, cx - radius * 0.8, cy + radius * 0.4);
                ctx.quadraticCurveTo(cx - radius, cy - radius * 0.6, cx, cy - radius);
                ctx.closePath();
                break;
            case 'diamond':
                ctx.moveTo(cx, cy - radius);
                ctx.lineTo(cx + radius, cy);
                ctx.lineTo(cx, cy + radius);
                ctx.lineTo(cx - radius, cy);
                ctx.closePath();
                break;
            default:
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        }
    }

    // --- Базовые методы отрисовки ---
    drawFaceBase(ctx, layer, cx, cy) {
        const { color, size, shape, width, height, x, y } = layer;
        const px = x || cx;
        const py = y || cy;
        ctx.save();
        ctx.fillStyle = color || '#f5d0b8';
        if (shape === 'ellipse' || shape === 'anime_face') {
            const w = width || size * 0.85;
            const h = height || size * 0.95;
            ctx.beginPath();
            ctx.ellipse(px, py, w/2, h/2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(px, py, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawEyeWhite(ctx, layer) {
        const { x, y, width, height, color } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawIris(ctx, layer) {
        const { x, y, size, color } = layer;
        ctx.save();
        ctx.fillStyle = color || '#4d96ff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawPupil(ctx, layer) {
        const { x, y, size, color } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawEyeHighlight(ctx, layer) {
        const { x, y, size, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.8;
        ctx.fillStyle = color || '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawEyebrows(ctx, layer, cx, cy) {
        const { color, size, x, y } = layer;
        const bx = x || cx;
        const by = y || cy;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 2;
        const leftX = bx - size * 1.2;
        const rightX = bx + size * 1.2;
        ctx.beginPath();
        ctx.moveTo(leftX, by);
        ctx.quadraticCurveTo(leftX + size * 0.5, by - size * 0.5, leftX + size * 0.8, by - size * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rightX, by);
        ctx.quadraticCurveTo(rightX - size * 0.5, by - size * 0.5, rightX - size * 0.8, by - size * 0.1);
        ctx.stroke();
        ctx.restore();
    }

    drawNose(ctx, layer, cx, cy) {
        const { color, size, x, y } = layer;
        const nx = x || cx;
        const ny = y || cy;
        ctx.save();
        ctx.fillStyle = color || '#e8c4a8';
        ctx.beginPath();
        ctx.arc(nx, ny, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawMouth(ctx, layer, cx, cy) {
        const { color, size, x, y, expression } = layer;
        const mx = x || cx;
        const my = y || cy;
        ctx.save();
        ctx.strokeStyle = color || '#e17055';
        ctx.lineWidth = 2;
        if (expression === 'smile' || expression === 'happy') {
            ctx.beginPath();
            ctx.arc(mx, my - size * 0.2, size * 0.5, 0.1, Math.PI - 0.1);
            ctx.stroke();
        } else if (expression === 'surprised') {
            ctx.fillStyle = color || '#e17055';
            ctx.beginPath();
            ctx.arc(mx, my, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(mx, my, size * 0.3, 0, Math.PI);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawBlush(ctx, layer, cx, cy) {
        const { color, size, x, y, opacity } = layer;
        const bx = x || cx;
        const by = y || cy;
        ctx.save();
        ctx.globalAlpha = opacity || 0.3;
        ctx.fillStyle = color || '#ff6b6b';
        ctx.beginPath();
        ctx.ellipse(bx - size * 1.4, by + size * 0.2, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bx + size * 1.4, by + size * 0.2, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawHair(ctx, layer) {
        const { color, size, x, y, type } = layer;
        const cx = x || 250;
        const cy = y || 250;
        ctx.save();
        ctx.fillStyle = color;
        if (type === 'hair_base') {
            ctx.beginPath();
            ctx.ellipse(cx, cy, size * 0.55, size * 0.4, 0, Math.PI, Math.PI * 2);
            ctx.fill();
        } else if (type === 'hair_bangs') {
            ctx.fillRect(cx - size * 0.25, cy - size * 0.5, size * 0.5, size * 0.3);
        } else if (type === 'hair_tail') {
            ctx.beginPath();
            ctx.ellipse(cx + size * 0.3, cy + size * 0.2, size * 0.2, size * 0.4, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawElvenEars(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - size * 1.2, y);
        ctx.quadraticCurveTo(x - size * 1.6, y - size * 0.8, x - size * 1.0, y - size * 0.3);
        ctx.quadraticCurveTo(x - size * 1.1, y - size * 0.1, x - size * 1.2, y);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + size * 1.2, y);
        ctx.quadraticCurveTo(x + size * 1.6, y - size * 0.8, x + size * 1.0, y - size * 0.3);
        ctx.quadraticCurveTo(x + size * 1.1, y - size * 0.1, x + size * 1.2, y);
        ctx.fill();
        ctx.restore();
    }

    drawMagicSparkle(ctx, layer) {
        const { color, size, x, y, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.6;
        ctx.fillStyle = color || '#ffd700';
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 15;
        const points = 4;
        const outer = size;
        const inner = size * 0.3;
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawChibiSparkle(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffffff';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawTorso(ctx, layer) {
        const { color, width, height, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color;
        const w = width || 60;
        const h = height || 100;
        ctx.beginPath();
        ctx.moveTo(x - w/2, y - h/2);
        ctx.quadraticCurveTo(x - w/2 - 5, y + h/4, x - w/2 + 5, y + h/2);
        ctx.lineTo(x + w/2 - 5, y + h/2);
        ctx.quadraticCurveTo(x + w/2 + 5, y + h/4, x + w/2, y - h/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawNeck(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(x - size/2, y, size, size * 1.2);
        ctx.restore();
    }

    drawHeadBase(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#f5d0b8';
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawArm(ctx, layer) {
        const { color, x1, y1, x2, y2, width } = layer;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    drawLeg(ctx, layer) {
        const { color, x1, y1, x2, y2, width } = layer;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    drawShoe(ctx, layer) {
        const { color, x, y, width, height } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawCape(ctx, layer) {
        const { color, size, x, y, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y - size * 0.4);
        ctx.quadraticCurveTo(x - size * 0.7, y + size * 0.2, x - size * 0.4, y + size * 0.6);
        ctx.quadraticCurveTo(x, y + size * 0.7, x + size * 0.4, y + size * 0.6);
        ctx.quadraticCurveTo(x + size * 0.7, y + size * 0.2, x + size * 0.3, y - size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawMagicAura(ctx, layer) {
        const { color, size, x, y, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.1;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, color + '60');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawGlasses(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.ellipse(x - size * 0.8, y, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + size * 0.8, y, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y);
        ctx.lineTo(x + size * 0.3, y);
        ctx.stroke();
        ctx.restore();
    }

    drawHat(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.beginPath();
        ctx.ellipse(x, y + size * 0.1, size * 0.8, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - size * 0.4, y + size * 0.1);
        ctx.quadraticCurveTo(x - size * 0.3, y - size * 0.4, x, y - size * 0.5);
        ctx.quadraticCurveTo(x + size * 0.3, y - size * 0.4, x + size * 0.4, y + size * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawCrown(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffd700';
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 15;
        const w = size * 0.7;
        const h = size * 0.4;
        ctx.beginPath();
        ctx.moveTo(x - w/2, y + h/2);
        for (let i = 0; i < 5; i++) {
            const px = x - w/2 + (i / 4) * w;
            const py = i % 2 === 0 ? y - h/2 : y + h/2;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(x + w/2, y + h/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawHeadphones(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 4;
        ctx.fillStyle = color || '#2d3436';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.1, size * 0.4, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y + size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + size * 0.3, y + size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBow(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.quadraticCurveTo(x - size * 0.3, y - size, x, y);
        ctx.quadraticCurveTo(x + size * 0.3, y - size, x + size, y);
        ctx.quadraticCurveTo(x + size * 0.3, y + size, x, y);
        ctx.quadraticCurveTo(x - size * 0.3, y + size, x - size, y);
        ctx.fill();
        ctx.restore();
    }

    drawBackpack(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        this.roundRect(ctx, x - size/2, y - size/2, size, size * 0.8, 5);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - size * 0.2, y - size/2);
        ctx.lineTo(x - size * 0.4, y + size * 0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + size * 0.2, y - size/2);
        ctx.lineTo(x + size * 0.4, y + size * 0.2);
        ctx.stroke();
        ctx.restore();
    }

    drawSword(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#c0c0c0';
        ctx.beginPath();
        ctx.moveTo(x - size * 0.05, y - size);
        ctx.lineTo(x + size * 0.05, y - size);
        ctx.lineTo(x + size * 0.03, y + size * 0.2);
        ctx.lineTo(x - size * 0.03, y + size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x - size * 0.04, y + size * 0.2, size * 0.08, size * 0.15);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x - size * 0.12, y + size * 0.18, size * 0.24, size * 0.03);
        ctx.restore();
    }

    drawStaff(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#8b7355';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.5);
        ctx.lineTo(x, y - size * 0.5);
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.5, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4d96ff';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.5, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBowWeapon(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#8b7355';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y + size * 0.2, size * 0.4, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - size * 0.35, y + size * 0.1);
        ctx.lineTo(x + size * 0.35, y + size * 0.1);
        ctx.stroke();
        ctx.restore();
    }

    drawGun(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.fillRect(x - size * 0.05, y - size * 0.3, size * 0.1, size * 0.6);
        ctx.beginPath();
        ctx.moveTo(x - size * 0.12, y + size * 0.3);
        ctx.quadraticCurveTo(x, y + size * 0.5, x + size * 0.12, y + size * 0.3);
        ctx.fill();
        ctx.fillRect(x - size * 0.02, y + size * 0.25, size * 0.04, size * 0.08);
        ctx.restore();
    }

    drawShieldWeapon(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color || '#c0c0c0';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.quadraticCurveTo(x + size/2, y - size/3, x + size/2 * 0.8, y + size/3);
        ctx.quadraticCurveTo(x, y + size/2, x - size/2 * 0.8, y + size/3);
        ctx.quadraticCurveTo(x - size/2, y - size/3, x, y - size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawGlowLayer(ctx, layer, width, height) {
        const { color, size, x, y } = layer;
        const cx = x || width / 2;
        const cy = y || height / 2;
        ctx.save();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size || 100);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(0.5, color + '20');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    drawDecorativeElement(ctx, layer) {
        const { x, y, size, color, shape } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffd700';
        ctx.globalAlpha = 0.6;
        if (shape === 'diamond') {
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-size/2, -size/2, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawHighlight(ctx, layer) {
        const { x, y, width, height, color, rotation } = layer;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation || 0);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color || 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(0, -height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawDot(ctx, layer) {
        const { x, y, size, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.8;
        ctx.fillStyle = color || '#7c3aed';
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawRune(ctx, layer) {
        const { x, y, size, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.5;
        ctx.strokeStyle = color || '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - size/2, y);
        ctx.lineTo(x + size/2, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x, y + size/2);
        ctx.stroke();
        ctx.restore();
    }

    drawNeonLine(ctx, layer) {
        const { x1, y1, x2, y2, color, width, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.5;
        ctx.strokeStyle = color || '#00ffff';
        ctx.lineWidth = width || 2;
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    // =============================================================
    // ПИКСЕЛЬНЫЕ МЕТОДЫ
    // =============================================================

    drawPixelSprite(ctx, layer) {
        const { pixels, pixelSize, x, y } = layer;
        if (!pixels || !pixels.length) return;
        
        const size = pixels.length;
        const totalSize = size * pixelSize;
        const offsetX = x - totalSize / 2;
        const offsetY = y - totalSize / 2;
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const color = pixels[row][col];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + col * pixelSize, offsetY + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    drawPixelButton(ctx, layer) {
        const { color, text, w, h, pixelSize, x, y, textColor } = layer;
        const offsetX = x - w / 2;
        const offsetY = y - h / 2;
        
        for (let row = 0; row < h / pixelSize; row++) {
            for (let col = 0; col < w / pixelSize; col++) {
                const isBorder = row === 0 || row === h/pixelSize - 1 || col === 0 || col === w/pixelSize - 1;
                ctx.fillStyle = isBorder ? this.lightenColor(color, 20) : color;
                ctx.fillRect(offsetX + col * pixelSize, offsetY + row * pixelSize, pixelSize, pixelSize);
            }
        }
        
        if (text) {
            ctx.fillStyle = textColor || '#ffffff';
            ctx.font = `${Math.min(w, h) * 0.15}px 'Press Start 2P'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y + 2);
        }
    }

    drawPixelIcon(ctx, layer) {
        const { shape, color, gridSize, pixelSize, x, y, complexity } = layer;
        const size = gridSize * pixelSize;
        const offsetX = x - size / 2;
        const offsetY = y - size / 2;
        const density = 0.3 + (complexity / 10) * 0.5;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const dx = i - gridSize/2;
                const dy = j - gridSize/2;
                const dist = Math.sqrt(dx*dx + dy*dy);
                let fill = false;
                
                switch(shape) {
                    case 'circle': fill = dist < gridSize * 0.4; break;
                    case 'square': fill = Math.abs(dx) < gridSize * 0.4 && Math.abs(dy) < gridSize * 0.4; break;
                    case 'hexagon': fill = Math.abs(dx) < gridSize * 0.4 && Math.abs(dy) < gridSize * 0.4 && Math.abs(dx + dy) < gridSize * 0.5; break;
                    case 'shield': fill = dist < gridSize * 0.5 && Math.abs(dy) < gridSize * 0.3 || dist < gridSize * 0.3; break;
                    case 'diamond': fill = Math.abs(dx) + Math.abs(dy) < gridSize * 0.4; break;
                    default: fill = dist < gridSize * 0.4;
                }
                
                if (fill && Math.random() < density) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + i * pixelSize, offsetY + j * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    drawPixelBorder(ctx, layer) {
        const { color, w, h, pixelSize, x, y, opacity } = layer;
        const offsetX = x - w / 2;
        const offsetY = y - h / 2;
        
        ctx.save();
        ctx.globalAlpha = opacity || 0.5;
        for (let row = 0; row < h / pixelSize; row++) {
            for (let col = 0; col < w / pixelSize; col++) {
                const isBorder = row === 0 || row === h/pixelSize - 1 || col === 0 || col === w/pixelSize - 1;
                if (isBorder) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + col * pixelSize, offsetY + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        ctx.restore();
    }

    drawPixelCorner(ctx, layer) {
        const { x, y, size, color, direction } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        const dx = direction.dx || 1;
        const dy = direction.dy || 1;
        for (let i = 0; i < size; i += 4) {
            for (let j = 0; j < size - i; j += 4) {
                ctx.fillRect(x + dx * i, y + dy * j, 4, 4);
            }
        }
        ctx.restore();
    }

    drawPixelOutline(ctx, layer) {
        const { size, pixelSize, x, y, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.3;
        ctx.fillStyle = color || '#2d3436';
        const gridSize = Math.floor(size / pixelSize);
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const isBorder = i === 0 || i === gridSize - 1 || j === 0 || j === gridSize - 1;
                if (isBorder) {
                    ctx.fillRect(offsetX + i * pixelSize, offsetY + j * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        ctx.restore();
    }

    drawPixelDetails(ctx, layer) {
        const { size, pixelSize, x, y, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.3;
        ctx.fillStyle = color || '#2d3436';
        const gridSize = Math.floor(size / pixelSize);
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        for (let i = 0; i < gridSize; i += 2) {
            for (let j = 0; j < gridSize; j += 2) {
                const dx = i - gridSize/2;
                const dy = j - gridSize/2;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (Math.abs(dist - gridSize * 0.45) < 3) {
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

    // =============================================================
    // ЭФФЕКТЫ
    // =============================================================

    applyEffect(ctx, effect, width, height) {
        switch (effect.type) {
            case 'glow':
                this.drawGlowEffect(ctx, effect, width, height);
                break;
            case 'scanline':
                this.applyScanline(ctx, width, height, effect.intensity);
                break;
            case 'particles':
                this.applyParticles(ctx, width, height, effect.count);
                break;
            case 'glitch':
                this.applyGlitch(ctx, width, height, effect.intensity);
                break;
            case 'vintage':
                this.applyVintage(ctx, width, height, effect.intensity);
                break;
        }
    }

    drawGlowEffect(ctx, effect, width, height) {
        const cx = width / 2;
        const cy = height / 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, effect.size || 150);
        grad.addColorStop(0, effect.color + '60');
        grad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
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
        const colors = ['#ffd700', '#ff6b6b', '#4d96ff', '#6bcb77', '#ff9f43'];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 1 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.globalAlpha = 0.1 + Math.random() * 0.3;
            ctx.fillStyle = color;
            ctx.shadowColor = color + '60';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    applyGlitch(ctx, width, height, intensity = 0.05) {
        if (Math.random() > 0.7) {
            ctx.save();
            const offset = Math.random() * 20 - 10;
            const y = Math.random() * height;
            const h = 5 + Math.random() * 20;
            ctx.globalAlpha = intensity;
            ctx.drawImage(ctx.canvas, offset, y, width, h, 0, y, width, h);
            ctx.restore();
        }
    }

    applyVintage(ctx, width, height, intensity = 0.2) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    // =============================================================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // =============================================================

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
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
        if (item.type === 'face_base' || item.type === 'head_base') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size/2 || 100;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" />`;
        }
        if (item.type === 'mouth') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const s = item.size || 10;
            return `<path d="M${cx - s*0.6},${cy - s*0.2} Q${cx},${cy + s*0.3} ${cx + s*0.6},${cy - s*0.2}" stroke="${item.color}" stroke-width="2" fill="none" />`;
        }
        if (item.type === 'glow' || item.type === 'glow_layer') {
            const cx = 250;
            const cy = 250;
            const r = item.size || 150;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="0.3" filter="blur(20px)" />`;
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
    }
}