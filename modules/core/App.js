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
                
            // Кнопки
            case 'button_main':
                this.drawButtonMain(ctx, layer, cx, cy);
                break;
            case 'glow_layer':
                this.drawGlowLayer(ctx, layer, width, height);
                break;
            case 'decorative_element':
                this.drawDecorativeElement(ctx, layer);
                break;
            case 'pixel_corner':
                this.drawPixelCorner(ctx, layer);
                break;
            case 'highlight':
                this.drawHighlight(ctx, layer);
                break;
                
            // Иконки
            case 'icon_main':
                this.drawIconMain(ctx, layer);
                break;
            case 'icon_inner':
                this.drawIconInner(ctx, layer);
                break;
            case 'decorative_dot':
                this.drawDot(ctx, layer);
                break;
            case 'pixel_grid':
                this.drawPixelGrid(ctx, layer);
                break;
            case 'cartoon_face':
                this.drawCartoonFace(ctx, layer);
                break;
            case 'rune':
                this.drawRune(ctx, layer);
                break;
            case 'neon_line':
                this.drawNeonLine(ctx, layer);
                break;
                
            // Аватары и персонажи
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
            case 'eyelashes':
                this.drawEyelashes(ctx, layer);
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
            case 'pixel_details':
                this.drawPixelDetails(ctx, layer);
                break;
                
            // Персонажи
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
            case 'chibi_proportions':
                // Пропорции чиби уже учтены в размерах
                break;
            case 'pixel_outline':
                this.drawPixelOutline(ctx, layer);
                break;
                
            // Аксессуары
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
                
            // Оружие
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
                
            default:
                console.warn('Неизвестный тип слоя:', layer.type);
        }
    }

    // =============================================================
    // МЕТОДЫ ОТРИСОВКИ - Полная реализация всех типов слоев
    // =============================================================

    // ---- КНОПКИ ----

    drawButtonMain(ctx, layer, cx, cy) {
        const { color, text, size, cornerRadius, x, y, textColor, font, glow, borderWidth, borderColor, shadow, style } = layer;
        const w = size * 1.5;
        const h = size * 0.5;
        const r = cornerRadius || 20;
        const px = x || cx;
        const py = y || cy;

        ctx.save();

        // Тень
        if (shadow) {
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 4;
        }

        // Свечение
        if (glow) {
            ctx.shadowColor = color + '60';
            ctx.shadowBlur = 30;
        }

        // Основная форма
        ctx.fillStyle = color;
        this.roundRect(ctx, px - w/2, py - h/2, w, h, r);
        ctx.fill();

        // Контур
        if (borderWidth > 0) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.strokeStyle = borderColor || this.lightenColor(color, 20);
            ctx.lineWidth = borderWidth;
            this.roundRect(ctx, px - w/2, py - h/2, w, h, r);
            ctx.stroke();
        }

        // Текст
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = textColor || '#ffffff';
        ctx.font = `bold ${size * 0.2}px ${font || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, px, py + 2);

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

    drawPixelCorner(ctx, layer) {
        const { x, y, size, color, direction } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        
        const dx = direction.dx || 1;
        const dy = direction.dy || 1;
        
        for (let i = 0; i < size; i += 4) {
            for (let j = 0; j < size - i; j += 4) {
                ctx.fillRect(
                    x + dx * i,
                    y + dy * j,
                    4, 4
                );
            }
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

    // ---- ИКОНКИ ----

    drawIconMain(ctx, layer) {
        const { shape, color, size, x, y, strokeWidth, strokeColor, glow, style } = layer;
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
        ctx.shadowBlur = 0;

        // Отрисовка формы
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
            case 'star':
                this.drawStarPath(ctx, cx, cy, radius);
                break;
            default:
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        }
    }

    drawStarPath(ctx, cx, cy, radius) {
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    drawIconInner(ctx, layer) {
        const { shape, color, size, x, y, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.6;
        ctx.fillStyle = color;
        this.drawShape(ctx, shape, x, y, size / 2);
        ctx.fill();
        ctx.restore();
    }

    drawPixelGrid(ctx, layer) {
        const { size, pixelSize, gridSize, color, x, y, complexity } = layer;
        ctx.save();
        
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        const density = 0.3 + (complexity / 10) * 0.5;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const dx = i - gridSize/2;
                const dy = j - gridSize/2;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const fill = dist < gridSize * 0.4 && Math.random() < density;
                
                if (fill) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + i * pixelSize, offsetY + j * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        ctx.restore();
    }

    drawCartoonFace(ctx, layer) {
        const { color, pupilColor, size, x, y } = layer;
        ctx.save();
        
        // Глаза
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
        for (let side of [-1, 1]) {
            ctx.beginPath();
            ctx.ellipse(x + side * size * 0.8, y, size * 0.5, size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = pupilColor;
            ctx.beginPath();
            ctx.arc(x + side * size * 0.8, y + 2, size * 0.2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = color;
        }
        
        // Улыбка
        ctx.strokeStyle = pupilColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y + size * 0.2, size * 0.3, 0.1, Math.PI - 0.1);
        ctx.stroke();
        
        ctx.restore();
    }

    drawRune(ctx, layer) {
        const { x, y, size, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.5;
        ctx.strokeStyle = color || '#ffd700';
        ctx.lineWidth = 2;
        
        // Простая руна в виде круга с крестом
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

    // ---- АВАТАРЫ И ПЕРСОНАЖИ ----

    drawFaceBase(ctx, layer, cx, cy) {
        const { color, size, shape, width, height, shadow } = layer;
        const x = layer.x || cx;
        const y = layer.y || cy;
        
        ctx.save();
        
        if (shadow) {
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = 4;
        }
        
        ctx.fillStyle = color || '#f5d0b8';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        if (shape === 'ellipse' || shape === 'anime_face') {
            const w = width || size * 0.85;
            const h = height || size * 0.95;
            ctx.beginPath();
            ctx.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawEyeWhite(ctx, layer) {
        const { x, y, width, height, color, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffffff';
        ctx.shadowColor = 'transparent';
        
        ctx.beginPath();
        ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Контур для некоторых стилей
        if (style === 'anime' || style === 'cartoon') {
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawIris(ctx, layer) {
        const { x, y, size, color, style } = layer;
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
        ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawEyelashes(ctx, layer) {
        const { x, y, size, color, side } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'transparent';
        
        const count = 4;
        for (let i = 0; i < count; i++) {
            const angle = -0.3 + (i / (count - 1)) * 0.6;
            const len = size * (0.5 + i / count * 0.5);
            ctx.beginPath();
            ctx.moveTo(x + side * size * 0.4, y - size * 0.2);
            ctx.lineTo(
                x + side * size * 0.4 + Math.sin(angle) * len * side,
                y - size * 0.2 - Math.cos(angle) * len
            );
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawEyebrows(ctx, layer, cx, cy) {
        const { color, size, x, y, style } = layer;
        const bx = x || cx;
        const by = y || cy;
        
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'transparent';
        
        const leftX = bx - size * 1.2;
        const rightX = bx + size * 1.2;
        
        if (style === 'anime' || style === 'arched') {
            // Аниме брови - изогнутые
            ctx.beginPath();
            ctx.moveTo(leftX, by);
            ctx.quadraticCurveTo(leftX + size * 0.5, by - size * 0.6, leftX + size * 0.8, by - size * 0.2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(rightX, by);
            ctx.quadraticCurveTo(rightX - size * 0.5, by - size * 0.6, rightX - size * 0.8, by - size * 0.2);
            ctx.stroke();
        } else if (style === 'chibi') {
            // Чиби брови - маленькие точки
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(leftX + size * 0.3, by - size * 0.3, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rightX - size * 0.3, by - size * 0.3, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Естественные брови
            ctx.beginPath();
            ctx.moveTo(leftX, by);
            ctx.quadraticCurveTo(leftX + size * 0.5, by - size * 0.3, leftX + size, by);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(rightX, by);
            ctx.quadraticCurveTo(rightX - size * 0.5, by - size * 0.3, rightX - size, by);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawNose(ctx, layer, cx, cy) {
        const { color, size, x, y, style } = layer;
        const nx = x || cx;
        const ny = y || cy;
        
        ctx.save();
        ctx.fillStyle = color || '#e8c4a8';
        ctx.shadowColor = 'transparent';
        
        if (style === 'tiny' || style === 'small') {
            // Маленький носик
            ctx.beginPath();
            ctx.arc(nx, ny, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (style === 'simple') {
            // Простой носик
            ctx.beginPath();
            ctx.moveTo(nx, ny - size * 0.3);
            ctx.lineTo(nx - size * 0.3, ny + size * 0.3);
            ctx.lineTo(nx + size * 0.3, ny + size * 0.3);
            ctx.closePath();
            ctx.fill();
        } else {
            // Естественный носик
            ctx.beginPath();
            ctx.moveTo(nx, ny - size * 0.5);
            ctx.quadraticCurveTo(nx - size * 0.5, ny, nx, ny + size * 0.3);
            ctx.quadraticCurveTo(nx + size * 0.5, ny, nx, ny - size * 0.5);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawMouth(ctx, layer, cx, cy) {
        const { color, size, x, y, expression, style } = layer;
        const mx = x || cx;
        const my = y || cy;
        
        ctx.save();
        ctx.strokeStyle = color || '#e17055';
        ctx.fillStyle = color || '#e17055';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'transparent';
        
        if (expression === 'smile' || expression === 'happy') {
            if (style === 'cute' || style === 'small') {
                // Маленькая улыбка
                ctx.beginPath();
                ctx.arc(mx, my - size * 0.2, size * 0.4, 0.1, Math.PI - 0.1);
                ctx.stroke();
            } else {
                // Широкая улыбка
                ctx.beginPath();
                ctx.arc(mx, my - size * 0.1, size * 0.6, 0.1, Math.PI - 0.1);
                ctx.stroke();
                
                // Заполнение для широкой улыбки
                ctx.beginPath();
                ctx.arc(mx, my - size * 0.1, size * 0.6, 0.1, Math.PI - 0.1);
                ctx.fillStyle = '#e17055';
                ctx.fill();
            }
        } else if (expression === 'surprised') {
            ctx.beginPath();
            ctx.arc(mx, my, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (expression === 'sad') {
            ctx.beginPath();
            ctx.arc(mx, my + size * 0.2, size * 0.4, Math.PI + 0.1, -0.1);
            ctx.stroke();
        } else {
            // Нейтральный
            ctx.beginPath();
            ctx.moveTo(mx - size * 0.4, my);
            ctx.lineTo(mx + size * 0.4, my);
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
        ctx.shadowColor = 'transparent';
        
        // Левая щека
        ctx.beginPath();
        ctx.ellipse(bx - size * 1.4, by + size * 0.2, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Правая щека
        ctx.beginPath();
        ctx.ellipse(bx + size * 1.4, by + size * 0.2, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawHair(ctx, layer) {
        const { color, size, x, y, style, category } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
        const cx = x || 250;
        const cy = y || 250;
        const type = layer.type || 'hair_base';
        
        if (type === 'hair_base') {
            // Основная прическа
            if (style === 'short') {
                ctx.beginPath();
                ctx.ellipse(cx, cy, size * 0.6, size * 0.4, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            } else if (style === 'long') {
                ctx.beginPath();
                ctx.ellipse(cx, cy, size * 0.55, size * 0.5, 0, Math.PI, Math.PI * 2);
                ctx.fill();
                // Длинные волосы по бокам
                ctx.fillRect(cx - size * 0.4, cy, size * 0.15, size * 0.5);
                ctx.fillRect(cx + size * 0.25, cy, size * 0.15, size * 0.5);
            } else if (style === 'ponytail') {
                ctx.beginPath();
                ctx.ellipse(cx, cy, size * 0.6, size * 0.35, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            } else if (style === 'bald') {
                // Лысый - ничего не рисуем
            } else {
                // Средняя прическа
                ctx.beginPath();
                ctx.ellipse(cx, cy, size * 0.6, size * 0.4, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            }
        } else if (type === 'hair_bangs') {
            // Челка
            const bangsSize = size * 0.6;
            if (style === 'long' || style === 'ponytail') {
                ctx.fillRect(cx - bangsSize * 0.6, cy - size * 0.5, bangsSize, size * 0.3);
                // Неровная челка
                for (let i = 0; i < 5; i++) {
                    const xOff = -bangsSize * 0.5 + i * bangsSize * 0.25;
                    ctx.fillRect(cx + xOff, cy - size * 0.5 + Math.sin(i * 0.8) * 5, bangsSize * 0.15, size * 0.2);
                }
            } else {
                ctx.fillRect(cx - bangsSize * 0.5, cy - size * 0.5, bangsSize, size * 0.3);
            }
        } else if (type === 'hair_tail') {
            // Хвост
            if (style === 'ponytail') {
                ctx.beginPath();
                ctx.ellipse(cx + size * 0.4, cy + size * 0.3, size * 0.25, size * 0.5, 0.3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(cx, cy + size * 0.2, size * 0.4, size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }

    drawElvenEars(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(x - size * 1.2, y);
        ctx.quadraticCurveTo(x - size * 1.6, y - size * 0.8, x - size * 1.0, y - size * 0.3);
        ctx.quadraticCurveTo(x - size * 1.1, y - size * 0.1, x - size * 1.2, y);
        ctx.fill();
        
        // Правое ухо
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
        
        // Звездочка
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
        ctx.shadowColor = 'transparent';
        
        // Звездочка в глазе
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

    drawPixelDetails(ctx, layer) {
        const { size, pixelSize, x, y, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.3;
        ctx.fillStyle = color || '#2d3436';
        
        const gridSize = Math.floor(size / pixelSize);
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        
        // Пиксельный контур лица
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

    // ---- ПЕРСОНАЖИ ----

    drawTorso(ctx, layer) {
        const { color, width, height, x, y, shape, style } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
        const w = width || 60;
        const h = height || 100;
        
        if (shape === 'muscular') {
            // Мускулистое тело
            ctx.beginPath();
            ctx.moveTo(x - w/2, y - h/2);
            ctx.quadraticCurveTo(x - w/2 - 10, y, x - w/2 + 5, y + h/2);
            ctx.lineTo(x + w/2 - 5, y + h/2);
            ctx.quadraticCurveTo(x + w/2 + 10, y, x + w/2, y - h/2);
            ctx.closePath();
            ctx.fill();
        } else {
            // Нормальное тело
            ctx.beginPath();
            ctx.moveTo(x - w/2, y - h/2);
            ctx.quadraticCurveTo(x - w/2 - 5, y + h/4, x - w/2 + 5, y + h/2);
            ctx.lineTo(x + w/2 - 5, y + h/2);
            ctx.quadraticCurveTo(x + w/2 + 5, y + h/4, x + w/2, y - h/2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawNeck(ctx, layer) {
        const { color, size, x, y } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        ctx.fillRect(x - size/2, y, size, size * 1.2);
        ctx.restore();
    }

    drawHeadBase(ctx, layer) {
        const { color, size, x, y, shape, width, height } = layer;
        ctx.save();
        ctx.fillStyle = color || '#f5d0b8';
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 10;
        
        const w = width || size;
        const h = height || size;
        
        if (shape === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawArm(ctx, layer) {
        const { color, x1, y1, x2, y2, width, style } = layer;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 8;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'transparent';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        ctx.restore();
    }

    drawLeg(ctx, layer) {
        const { color, x1, y1, x2, y2, width, style } = layer;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width || 12;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'transparent';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        ctx.restore();
    }

    drawShoe(ctx, layer) {
        const { color, x, y, width, height, style } = layer;
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'transparent';
        
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
        ctx.shadowColor = 'transparent';
        
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

    drawPixelOutline(ctx, layer) {
        const { size, pixelSize, x, y, color, opacity } = layer;
        ctx.save();
        ctx.globalAlpha = opacity || 0.3;
        ctx.fillStyle = color || '#2d3436';
        
        const gridSize = Math.floor(size / pixelSize);
        const offsetX = x - (gridSize * pixelSize) / 2;
        const offsetY = y - (gridSize * pixelSize) / 2;
        
        // Контур персонажа
        const bodyShape = [
            [0, 2, 2, 2, 2, 0],
            [2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2],
            [0, 2, 2, 2, 2, 0],
            [0, 2, 0, 0, 2, 0],
            [0, 2, 0, 0, 2, 0]
        ];
        
        const centerX = offsetX + (gridSize - 6) / 2 * pixelSize;
        const centerY = offsetY + (gridSize - 6) / 2 * pixelSize;
        
        for (let i = 0; i < bodyShape.length; i++) {
            for (let j = 0; j < bodyShape[i].length; j++) {
                if (bodyShape[i][j] === 2) {
                    ctx.fillRect(centerX + j * pixelSize, centerY + i * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        ctx.restore();
    }

    // ---- АКСЕССУАРЫ ----

    drawGlasses(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        
        // Левая линза
        ctx.beginPath();
        ctx.ellipse(x - size * 0.8, y, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        
        // Правая линза
        ctx.beginPath();
        ctx.ellipse(x + size * 0.8, y, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        
        // Дужка
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y);
        ctx.lineTo(x + size * 0.3, y);
        ctx.stroke();
        
        ctx.restore();
    }

    drawHat(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.shadowColor = 'transparent';
        
        // Поля шляпы
        ctx.beginPath();
        ctx.ellipse(x, y + size * 0.1, size * 0.8, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Тулья
        ctx.beginPath();
        ctx.moveTo(x - size * 0.4, y + size * 0.1);
        ctx.quadraticCurveTo(x - size * 0.3, y - size * 0.4, x, y - size * 0.5);
        ctx.quadraticCurveTo(x + size * 0.3, y - size * 0.4, x + size * 0.4, y + size * 0.1);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    drawCrown(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ffd700';
        ctx.shadowColor = color + '60';
        ctx.shadowBlur = 15;
        
        // Основа короны
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
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#2d3436';
        ctx.lineWidth = 4;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = color || '#2d3436';
        
        // Дужка
        ctx.beginPath();
        ctx.arc(x, y - size * 0.1, size * 0.4, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        
        // Наушники
        ctx.beginPath();
        ctx.ellipse(x - size * 0.3, y + size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + size * 0.3, y + size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawBow(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#ff6b6b';
        ctx.shadowColor = 'transparent';
        
        // Бант
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
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.shadowColor = 'transparent';
        
        ctx.beginPath();
        ctx.roundRect(x - size/2, y - size/2, size, size * 0.8, 5);
        ctx.fill();
        
        // Лямки
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

    // ---- ОРУЖИЕ ----

    drawSword(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#c0c0c0';
        ctx.shadowColor = 'transparent';
        
        // Клинок
        ctx.beginPath();
        ctx.moveTo(x - size * 0.05, y - size);
        ctx.lineTo(x + size * 0.05, y - size);
        ctx.lineTo(x + size * 0.03, y + size * 0.2);
        ctx.lineTo(x - size * 0.03, y + size * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Рукоять
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x - size * 0.04, y + size * 0.2, size * 0.08, size * 0.15);
        
        // Гарда
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x - size * 0.12, y + size * 0.18, size * 0.24, size * 0.03);
        
        ctx.restore();
    }

    drawStaff(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#8b7355';
        ctx.lineWidth = 4;
        ctx.shadowColor = 'transparent';
        
        // Посох
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.5);
        ctx.lineTo(x, y - size * 0.5);
        ctx.stroke();
        
        // Навершие
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.5, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        // Камень
        ctx.fillStyle = '#4d96ff';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.5, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawBowWeapon(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.strokeStyle = color || '#8b7355';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'transparent';
        
        // Лук
        ctx.beginPath();
        ctx.arc(x, y + size * 0.2, size * 0.4, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
        
        // Тетива
        ctx.beginPath();
        ctx.moveTo(x - size * 0.35, y + size * 0.1);
        ctx.lineTo(x + size * 0.35, y + size * 0.1);
        ctx.stroke();
        
        ctx.restore();
    }

    drawGun(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#2d3436';
        ctx.shadowColor = 'transparent';
        
        // Ствол
        ctx.fillRect(x - size * 0.05, y - size * 0.3, size * 0.1, size * 0.6);
        
        // Рукоять
        ctx.beginPath();
        ctx.moveTo(x - size * 0.12, y + size * 0.3);
        ctx.quadraticCurveTo(x, y + size * 0.5, x + size * 0.12, y + size * 0.3);
        ctx.fill();
        
        // Курок
        ctx.fillRect(x - size * 0.02, y + size * 0.25, size * 0.04, size * 0.08);
        
        ctx.restore();
    }

    drawShieldWeapon(ctx, layer) {
        const { color, size, x, y, style } = layer;
        ctx.save();
        ctx.fillStyle = color || '#c0c0c0';
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        
        // Щит
        ctx.beginPath();
        ctx.moveTo(x, y - size/2);
        ctx.quadraticCurveTo(x + size/2, y - size/3, x + size/2 * 0.8, y + size/3);
        ctx.quadraticCurveTo(x, y + size/2, x - size/2 * 0.8, y + size/3);
        ctx.quadraticCurveTo(x - size/2, y - size/3, x, y - size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Символ на щите
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    // ---- ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ----

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