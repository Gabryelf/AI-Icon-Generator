// =============================================================
// ГЕНЕРАТОР v0.0.3 - Полная дифференциация стилей
//           v0.0.4 - Расширение функционала тематик
//           v0.0.5 - Уникальные алгоритмы для каждого стиля
// =============================================================

import { DOMAINS, STYLES, CATEGORIES } from './presets.js';
import { ShapeLibrary } from './ShapeLibrary.js';
import { ColorPalette } from './ColorPalette.js';
import { TextureGenerator } from './TextureGenerator.js';
import { IconComposer } from './IconComposer.js';
import { PixelGenerator } from './PixelGenerator.js';
import { CharacterGenerator } from './CharacterGenerator.js';

export class Generator {
    constructor() {
        this.shapeLibrary = new ShapeLibrary();
        this.colorPalette = new ColorPalette();
        this.textureGenerator = new TextureGenerator();
        this.iconComposer = new IconComposer();
        this.pixelGenerator = new PixelGenerator();
        this.characterGenerator = new CharacterGenerator();
        this.cache = new Map();
        
        if (typeof this.shapeLibrary.loadDefaultShapes === 'function') {
            this.shapeLibrary.loadDefaultShapes();
        } else {
            this.loadFallbackShapes();
        }
    }

    loadFallbackShapes() {
        const defaultShapes = [
            { name: 'circle', type: 'basic', path: 'M0,0 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0', defaultColor: '#7c3aed', tags: 'basic,geometric' },
            { name: 'square', type: 'basic', path: 'M-1,-1 L1,-1 L1,1 L-1,1 Z', defaultColor: '#3b82f6', tags: 'basic,geometric' },
            { name: 'triangle', type: 'basic', path: 'M0,-1 L-1,1 L1,1 Z', defaultColor: '#ef4444', tags: 'basic,geometric' },
            { name: 'star', type: 'basic', path: 'M0,-1 L0.3,-0.3 L1,-0.3 L0.4,0.1 L0.6,0.8 L0,0.4 L-0.6,0.8 L-0.4,0.1 L-1,-0.3 L-0.3,-0.3', defaultColor: '#f59e0b', tags: 'basic,geometric' },
            { name: 'hexagon', type: 'basic', path: 'M0,-1 L0.866,-0.5 L0.866,0.5 L0,1 L-0.866,0.5 L-0.866,-0.5 Z', defaultColor: '#10b981', tags: 'basic,geometric' }
        ];
        
        this.shapeLibrary.shapes = this.shapeLibrary.shapes || { basic: [], organic: [], geometric: [] };
        this.shapeLibrary.shapes.basic = defaultShapes;
        this.shapeLibrary.loaded = true;
    }

    generate(params) {
        const { domain, style, category, config } = params;
        
        const categoryData = CATEGORIES[category];
        if (!categoryData) {
            return this.generateFallback(config);
        }

        const styleData = STYLES[style] || STYLES.minimal;
        const palette = this.colorPalette.getPalette(style, domain);

        let icon = null;

        // ===== ВЫБОР АЛГОРИТМА В ЗАВИСИМОСТИ ОТ СТИЛЯ =====
        switch (style) {
            case 'minimal':
                icon = this.generateMinimalist(category, config, palette);
                break;
            case 'pixel':
                icon = this.generatePixelStyle(category, config, palette);
                break;
            case 'neon':
                icon = this.generateNeonStyle(category, config, palette);
                break;
            case 'fantasy':
                icon = this.generateFantasyStyle(category, config, palette);
                break;
            case 'vintage':
                icon = this.generateVintageStyle(category, config, palette);
                break;
            case 'cyberpunk':
                icon = this.generateCyberpunkStyle(category, config, palette);
                break;
            case 'cartoon':
                icon = this.generateCartoonStyle(category, config, palette);
                break;
            case 'vibrant':
                icon = this.generateVibrantStyle(category, config, palette);
                break;
            case 'geometric':
                icon = this.generateGeometricStyle(category, config, palette);
                break;
            case 'organic':
                icon = this.generateOrganicStyle(category, config, palette);
                break;
            default:
                icon = this.generateDefaultStyle(category, config, palette);
        }

        // Применяем эффекты
        this.applyStyleEffects(icon, style, config);

        return icon;
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: МИНИМАЛИЗМ =====
    generateMinimalist(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = this.getShapeForCategory(category, config);

        // Только основная фигура, без деталей
        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: 1,
            opacity: 1
        });

        // Текст только если нужен
        if (config.text && category !== 'ui_icon') {
            layers.push({
                type: 'text',
                text: config.text,
                color: color,
                size: 32,
                x: 250,
                y: 320,
                weight: '300'
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'minimal',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ПИКСЕЛЬНЫЙ =====
    generatePixelStyle(category, config, palette) {
        // Используем PixelGenerator для создания пиксельных спрайтов
        const pixelParams = {
            color: config.color || palette.primary || '#7c3aed',
            size: config.size || 16,
            shape: config.shape || 'human',
            skinColor: config.skinColor || '#f5d0b8',
            accessories: this.getAccessories(config),
            style: config.style || 'default'
        };

        // Для разных категорий выбираем разные типы персонажей
        if (category === 'game_character') {
            pixelParams.shape = config.characterType || 'knight';
        } else if (category === 'game_avatar' || category === 'avatar') {
            pixelParams.shape = config.avatarType || 'human';
        } else if (category === 'game_item') {
            pixelParams.shape = 'item';
            pixelParams.itemType = config.type || 'weapon';
        }

        const icon = this.pixelGenerator.generateAvatar(pixelParams);
        icon.style = 'pixel';
        icon.category = category;
        icon.config = config;
        return icon;
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: НЕОН =====
    generateNeonStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#ff00ff';
        const shape = this.getShapeForCategory(category, config);

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Основная фигура с неоновой обводкой
        layers.push({
            type: 'main',
            shape: shape,
            color: 'transparent',
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: 4,
            strokeColor: color,
            glow: true
        });

        // Внутренняя заливка (полупрозрачная)
        layers.push({
            type: 'main',
            shape: shape,
            color: color + '30',
            size: (config.size || 120) * 0.8,
            x: 250,
            y: 250,
            opacity: 0.3
        });

        // Неоновый глитч-эффект
        layers.push({
            type: 'glow',
            color: color,
            size: 200,
            intensity: 0.8
        });

        // Глитч-линии
        for (let i = 0; i < 3; i++) {
            const yOffset = 100 + Math.random() * 200;
            layers.push({
                type: 'glitch_line',
                color: color,
                y: yOffset,
                width: 10 + Math.random() * 30,
                opacity: 0.1 + Math.random() * 0.2
            });
        }

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: color, intensity: 0.8 },
                { type: 'glitch', intensity: 0.15 }
            ],
            style: 'neon',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ФЭНТЕЗИ =====
    generateFantasyStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = this.getShapeForCategory(category, config);

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Основная фигура с золотой обводкой
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 130,
            x: 250,
            y: 250,
            strokeWidth: 3,
            strokeColor: '#ffd700'
        });

        // Магические элементы
        if (config.complexity > 3) {
            // Звезды вокруг
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const r = 120 + Math.random() * 30;
                layers.push({
                    type: 'star',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 8 + Math.random() * 12,
                    color: '#ffd700',
                    points: 5,
                    opacity: 0.5 + Math.random() * 0.3
                });
            }
        }

        // Крылья (если это персонаж)
        if (category === 'game_character' || category === 'game_avatar') {
            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < 3; i++) {
                    const yOffset = 180 + i * 30;
                    layers.push({
                        type: 'main',
                        shape: 'leaf',
                        color: color + '60',
                        size: 40 + i * 10,
                        x: 250 + side * (100 + i * 20),
                        y: yOffset,
                        rotation: side * 0.5,
                        opacity: 0.6 - i * 0.1
                    });
                }
            }
        }

        // Магический шар
        if (config.hasGlow !== false) {
            layers.push({
                type: 'glow',
                color: '#ffd700',
                size: 180,
                intensity: 0.3
            });
        }

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: '#ffd700', intensity: 0.3 },
                { type: 'particles', count: 15 }
            ],
            style: 'fantasy',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ВИНТАЖ =====
    generateVintageStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#8b7355';
        const shape = this.getShapeForCategory(category, config);

        // Винтажный фон (теплый)
        layers.push({
            type: 'background',
            style: 'solid',
            color: '#f5e6d3',
            opacity: 0.9
        });

        // Основная фигура с винтажной цветовой гаммой
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: 2,
            strokeColor: '#d4a574',
            opacity: 0.9
        });

        // Винтажный узор
        if (config.complexity > 4) {
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const r = 60 + Math.random() * 40;
                layers.push({
                    type: 'dot',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 3 + Math.random() * 5,
                    color: '#d4a574',
                    opacity: 0.2 + Math.random() * 0.3
                });
            }
        }

        // Текст (если есть)
        if (config.text) {
            layers.push({
                type: 'text',
                text: config.text,
                color: '#8b7355',
                size: 28,
                x: 250,
                y: 330,
                weight: '400',
                font: 'Georgia'
            });
        }

        return {
            layers: layers,
            effects: [
                { type: 'vintage', intensity: 0.4 }
            ],
            style: 'vintage',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: КИБЕРПАНК =====
    generateCyberpunkStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#ff00ff';

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        const shape = this.getShapeForCategory(category, config);

        // Основная фигура с хакерским стилем
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: 2,
            strokeColor: '#00ffff'
        });

        // Хакерские линии
        for (let i = 0; i < 8; i++) {
            const x = 50 + i * 55;
            const height = 50 + Math.random() * 100;
            layers.push({
                type: 'bar',
                x: x,
                y: 350 - height,
                width: 4,
                height: height,
                color: '#00ffff',
                opacity: 0.1 + Math.random() * 0.2
            });
        }

        // Матрица (точки)
        for (let i = 0; i < 20; i++) {
            layers.push({
                type: 'dot',
                x: Math.random() * 500,
                y: Math.random() * 500,
                size: 2 + Math.random() * 3,
                color: '#00ff00',
                opacity: 0.05 + Math.random() * 0.15
            });
        }

        // Неоновое свечение
        layers.push({
            type: 'glow',
            color: '#ff00ff',
            size: 180,
            intensity: 0.4
        });

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: '#ff00ff', intensity: 0.5 },
                { type: 'scanline', intensity: 0.15 },
                { type: 'glitch', intensity: 0.1 }
            ],
            style: 'cyberpunk',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: МУЛЬТЯШНЫЙ =====
    generateCartoonStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b81';
        const shape = this.getShapeForCategory(category, config);

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Основная фигура с жирной обводкой
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: 5,
            strokeColor: '#2d3436'
        });

        // Мультяшные глаза (если это персонаж)
        if (category === 'avatar' || category === 'game_avatar') {
            layers.push({
                type: 'text',
                text: '◉‿◉',
                color: '#ffffff',
                size: 40,
                x: 250,
                y: 235
            });
            layers.push({
                type: 'text',
                text: '◉',
                color: '#2d3436',
                size: 12,
                x: 236,
                y: 238
            });
            layers.push({
                type: 'text',
                text: '◉',
                color: '#2d3436',
                size: 12,
                x: 264,
                y: 238
            });
        }

        // Улыбка
        if (config.mouth !== 'none') {
            layers.push({
                type: 'text',
                text: '⌣',
                color: '#2d3436',
                size: 30,
                x: 250,
                y: 265
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'cartoon',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ЯРКИЙ =====
    generateVibrantStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b6b';
        const shape = this.getShapeForCategory(category, config);

        layers.push({
            type: 'background',
            style: 'solid',
            color: '#0a0a0f'
        });

        // Основная фигура с ярким градиентом
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 130,
            x: 250,
            y: 250,
            strokeWidth: 0
        });

        // Второй слой для градиентного эффекта
        layers.push({
            type: 'main',
            shape: shape,
            color: this.lightenColor(color, 40),
            size: (config.size || 130) * 0.7,
            x: 250,
            y: 250,
            opacity: 0.6
        });

        // Яркие акценты
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = 80 + Math.random() * 30;
            layers.push({
                type: 'dot',
                x: 250 + Math.cos(angle) * r,
                y: 250 + Math.sin(angle) * r,
                size: 5 + Math.random() * 8,
                color: this.randomBrightColor(),
                opacity: 0.5 + Math.random() * 0.4
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'vibrant',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ГЕОМЕТРИЧЕСКИЙ =====
    generateGeometricStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#3b82f6';
        const shapes = ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'octagon'];

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Несколько геометрических фигур
        const count = Math.min(config.complexity || 5, 8);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = 40 + (i / count) * 100;
            const shape = shapes[i % shapes.length];
            const size = 20 + (i / count) * 60;
            const opacity = 0.3 + (i / count) * 0.5;
            
            layers.push({
                type: 'main',
                shape: shape,
                color: color,
                size: size,
                x: 250 + Math.cos(angle) * r,
                y: 250 + Math.sin(angle) * r,
                opacity: opacity,
                rotation: angle
            });
        }

        // Центральная фигура
        layers.push({
            type: 'main',
            shape: config.shape || 'circle',
            color: color,
            size: 80,
            x: 250,
            y: 250,
            strokeWidth: 2,
            strokeColor: '#ffffff',
            opacity: 0.9
        });

        return {
            layers: layers,
            effects: [],
            style: 'geometric',
            category: category,
            config: config
        };
    }

    // ===== УНИКАЛЬНЫЙ АЛГОРИТМ: ОРГАНИЧЕСКИЙ =====
    generateOrganicStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#10b981';
        const shape = config.shape || 'leaf';

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Основная органическая форма
        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 140,
            x: 250,
            y: 250,
            opacity: 0.9
        });

        // Органические ответвления
        if (config.complexity > 3) {
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
                const r = 60 + Math.random() * 40;
                const organicShapes = ['leaf', 'drop', 'flower', 'heart'];
                const subShape = organicShapes[i % organicShapes.length];
                const size = 20 + Math.random() * 30;
                
                layers.push({
                    type: 'main',
                    shape: subShape,
                    color: this.lightenColor(color, 20 + Math.random() * 30),
                    size: size,
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    opacity: 0.4 + Math.random() * 0.4,
                    rotation: angle
                });
            }
        }

        // Природные текстуры
        if (config.texture !== 'none') {
            const texture = this.textureGenerator.generate('dots', {
                color: color,
                opacity: 0.1,
                dotSize: 2,
                spacing: 15
            });
            layers.push({
                type: 'texture',
                canvas: texture,
                opacity: 0.3
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'organic',
            category: category,
            config: config
        };
    }

    // ===== ДЕФОЛТНЫЙ АЛГОРИТМ =====
    generateDefaultStyle(category, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = this.getShapeForCategory(category, config);

        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: config.strokeWidth || 0,
            opacity: 1
        });

        return {
            layers: layers,
            effects: [],
            style: 'default',
            category: category,
            config: config
        };
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====

    getShapeForCategory(category, config) {
        const shapeMap = {
            'game_icon': config.shape || 'circle',
            'game_button': config.shape || 'rounded',
            'game_avatar': config.shape || 'circle',
            'game_emblem': config.shape || 'shield',
            'game_ui': config.shape || 'rounded',
            'game_item': config.shape || 'shield',
            'logo': config.shape || 'circle',
            'emblem': config.shape || 'shield',
            'ui_icon': 'circle',
            'ui_button': 'rounded',
            'avatar': config.shape || 'circle',
            'sticker': 'circle',
            'icon_set': 'circle',
            'infographic': 'bar',
            'game_character': config.shape || 'circle',
            default: 'circle'
        };
        return shapeMap[category] || 'circle';
    }

    getAccessories(config) {
        const accessories = [];
        if (config.hasGlasses) accessories.push('glasses');
        if (config.hasHat) accessories.push('hat');
        if (config.hasCape) accessories.push('cape');
        if (config.hasWeapon) accessories.push('weapon');
        if (config.hasShield) accessories.push('shield');
        return accessories;
    }

    applyStyleEffects(icon, style, config) {
        if (!icon.effects) icon.effects = [];

        // Стилистические эффекты
        switch (style) {
            case 'neon':
                icon.effects.push({ type: 'glow', color: config.color || '#ff00ff', intensity: 0.8 });
                break;
            case 'fantasy':
                icon.effects.push({ type: 'glow', color: '#ffd700', intensity: 0.3 });
                icon.effects.push({ type: 'particles', count: 15 });
                break;
            case 'vintage':
                icon.effects.push({ type: 'vintage', intensity: 0.4 });
                break;
            case 'cyberpunk':
                icon.effects.push({ type: 'glow', color: '#ff00ff', intensity: 0.5 });
                icon.effects.push({ type: 'scanline', intensity: 0.15 });
                break;
            case 'pixel':
                // Пиксельный эффект уже в PixelGenerator
                break;
            default:
                if (config.glow) {
                    icon.effects.push({ type: 'glow', color: config.color || '#7c3aed', intensity: 0.4 });
                }
        }

        return icon;
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    randomBrightColor() {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43', '#00d2d3', '#f368e0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateFallback(config) {
        return {
            layers: [
                { type: 'background', color: 'transparent', style: 'none' },
                { type: 'main', shape: 'circle', color: '#7c3aed', size: 120, x: 250, y: 250 }
            ],
            effects: [],
            style: 'fallback',
            category: 'unknown',
            config: config || {}
        };
    }

    // ===== ОТРИСОВКА (ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ) =====
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
                this.applyEffectToCanvas(ctx, effect, width, height);
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
            case 'main':
                this.shapeLibrary.drawShape(ctx, layer, cx, cy);
                break;
            case 'button':
                this.drawButton(ctx, layer, cx, cy);
                break;
            case 'avatar':
                this.drawAvatar(ctx, layer, cx, cy);
                break;
            case 'text':
                this.drawText(ctx, layer, cx, cy);
                break;
            case 'glow':
                this.drawGlow(ctx, layer, width, height);
                break;
            case 'star':
                if (typeof this.shapeLibrary.drawStar === 'function') {
                    this.shapeLibrary.drawStar(ctx, layer);
                } else {
                    this.drawStarFallback(ctx, layer);
                }
                break;
            case 'healthbar':
                this.drawHealthBar(ctx, layer);
                break;
            case 'bar':
                this.drawBar(ctx, layer);
                break;
            case 'stroke':
                this.drawStroke(ctx, layer, cx, cy);
                break;
            case 'dot':
                this.drawDot(ctx, layer);
                break;
            case 'pixel_avatar':
                this.drawPixelAvatar(ctx, layer);
                break;
            case 'glitch_line':
                this.drawGlitchLine(ctx, layer, width, height);
                break;
            case 'texture':
                if (layer.canvas) {
                    ctx.save();
                    ctx.globalAlpha = layer.opacity || 0.3;
                    ctx.drawImage(layer.canvas, 0, 0, width, height);
                    ctx.restore();
                }
                break;
            default:
                break;
        }
    }

    drawGlitchLine(ctx, layer, width, height) {
        ctx.save();
        ctx.globalAlpha = layer.opacity || 0.15;
        ctx.fillStyle = layer.color || '#ff00ff';
        ctx.fillRect(0, layer.y, width, layer.width || 15);
        ctx.restore();
    }

    drawPixelAvatar(ctx, layer) {
        const { pixels, pixelSize, size } = layer;
        if (!pixels) return;

        ctx.save();
        const totalSize = pixelSize * size;
        const offsetX = (500 - totalSize) / 2;
        const offsetY = (500 - totalSize) / 2;

        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
                const color = pixels[y][x];
                if (color && color !== 0 && color !== 'transparent') {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        ctx.restore();
    }

    // Другие методы отрисовки (drawBackground, drawButton, etc.) остаются без изменений
    // из предыдущей версии...

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

    drawButton(ctx, button, cx, cy) {
        ctx.save();
        const x = button.x || cx;
        const y = button.y || cy;
        const w = button.width || 180;
        const h = button.height || 60;
        const r = button.cornerRadius || 8;
        const color = button.color || '#7c3aed';

        ctx.shadowColor = color + '40';
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(x - w/2 + r, y - h/2);
        ctx.lineTo(x + w/2 - r, y - h/2);
        ctx.quadraticCurveTo(x + w/2, y - h/2, x + w/2, y - h/2 + r);
        ctx.lineTo(x + w/2, y + h/2 - r);
        ctx.quadraticCurveTo(x + w/2, y + h/2, x + w/2 - r, y + h/2);
        ctx.lineTo(x - w/2 + r, y + h/2);
        ctx.quadraticCurveTo(x - w/2, y + h/2, x - w/2, y + h/2 - r);
        ctx.lineTo(x - w/2, y - h/2 + r);
        ctx.quadraticCurveTo(x - w/2, y - h/2, x - w/2 + r, y - h/2);
        ctx.closePath();
        ctx.fill();

        if (button.text) {
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.text, x, y + 2);
        }

        ctx.restore();
    }

    drawAvatar(ctx, avatar, cx, cy) {
        ctx.save();
        const size = avatar.size || 160;
        const color = avatar.color || '#7c3aed';
        
        ctx.shadowColor = color + '40';
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;

        this.shapeLibrary.drawShape(ctx, {
            shape: avatar.shape || 'circle',
            size: size,
            x: cx,
            y: cy
        });

        if (avatar.hasBorder) {
            ctx.strokeStyle = avatar.borderColor || '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();
        }

        ctx.restore();
    }

    drawText(ctx, text, cx, cy) {
        ctx.save();
        ctx.fillStyle = text.color || '#ffffff';
        ctx.font = `${text.weight || 'bold'} ${text.size || 60}px ${text.font || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.text || 'A', text.x || cx, text.y || cy);
        ctx.restore();
    }

    drawGlow(ctx, glow, width, height) {
        ctx.save();
        const cx = width / 2;
        const cy = height / 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glow.size || 150);
        grad.addColorStop(0, glow.color + '80');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    drawHealthBar(ctx, healthbar) {
        ctx.save();
        const x = healthbar.x || 250;
        const y = healthbar.y || 250;
        const w = healthbar.width || 200;
        const h = healthbar.height || 20;
        const color = healthbar.color || '#7c3aed';
        const value = healthbar.value || 0.7;

        ctx.fillStyle = '#333';
        ctx.fillRect(x - w/2, y - h/2, w, h);
        
        const grad = ctx.createLinearGradient(x - w/2, y - h/2, x - w/2 + w * value, y - h/2);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '80');
        ctx.fillStyle = grad;
        ctx.fillRect(x - w/2, y - h/2, w * value, h);

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - w/2, y - h/2, w, h);

        ctx.restore();
    }

    drawBar(ctx, bar) {
        ctx.save();
        ctx.globalAlpha = bar.opacity || 0.8;
        ctx.fillStyle = bar.color || '#7c3aed';
        ctx.fillRect(bar.x - bar.width/2, bar.y, bar.width, bar.height);
        ctx.restore();
    }

    drawStroke(ctx, stroke, cx, cy) {
        ctx.save();
        ctx.strokeStyle = stroke.color || '#ffffff';
        ctx.lineWidth = stroke.width || 3;
        ctx.beginPath();
        ctx.arc(stroke.x || cx, stroke.y || cy, (stroke.size || 180) / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    drawDot(ctx, dot) {
        ctx.save();
        ctx.globalAlpha = dot.opacity || 0.8;
        ctx.fillStyle = dot.color || '#7c3aed';
        ctx.shadowColor = dot.color + '60';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size || 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawStarFallback(ctx, params) {
        const { x, y, size, points, color, opacity } = params;
        const outerRadius = size || 20;
        const innerRadius = outerRadius * 0.4;
        const spikes = points || 5;
        
        ctx.save();
        ctx.translate(x || 0, y || 0);
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || '#f59e0b';
        ctx.shadowColor = (color || '#f59e0b') + '60';
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    applyEffectToCanvas(ctx, effect, width, height) {
        switch (effect.type) {
            case 'glow':
                this.drawGlow(ctx, effect, width, height);
                break;
            case 'vintage':
                this.applyVintageEffect(ctx, width, height, effect.intensity);
                break;
            case 'scanline':
                this.applyScanlineEffect(ctx, width, height, effect.intensity);
                break;
            case 'glitch':
                this.applyGlitchEffect(ctx, width, height, effect.intensity);
                break;
            case 'particles':
                this.applyParticlesEffect(ctx, width, height, effect.count || 15);
                break;
        }
    }

    applyVintageEffect(ctx, width, height, intensity = 0.3) {
        ctx.save();
        ctx.globalAlpha = intensity * 0.2;
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    applyScanlineEffect(ctx, width, height, intensity = 0.15) {
        ctx.save();
        ctx.globalAlpha = intensity;
        for (let y = 0; y < height; y += 4) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, y, width, 1);
        }
        ctx.restore();
    }

    applyGlitchEffect(ctx, width, height, intensity = 0.1) {
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

    applyParticlesEffect(ctx, width, height, count = 15) {
        ctx.save();
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 1 + Math.random() * 3;
            const color = ['#ffd700', '#ff6b6b', '#4d96ff', '#6bcb77', '#ff9f43'][Math.floor(Math.random() * 5)];
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
        if (item.type === 'main') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size/2 || 60;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="${item.opacity || 1}" />`;
        }
        if (item.type === 'text') {
            return `<text x="${item.x}" y="${item.y}" fill="${item.color}" font-size="${item.size}" font-weight="${item.weight}" text-anchor="middle" dominant-baseline="middle">${item.text}</text>`;
        }
        if (item.type === 'pixel_avatar') {
            let svg = '';
            const { pixels, pixelSize, size: avatarSize } = item;
            if (!pixels) return '';
            const totalSize = pixelSize * avatarSize;
            const offsetX = (size - totalSize) / 2;
            const offsetY = (size - totalSize) / 2;
            
            for (let y = 0; y < pixels.length; y++) {
                for (let x = 0; x < pixels[y].length; x++) {
                    const color = pixels[y][x];
                    if (color && color !== 0 && color !== 'transparent') {
                        svg += `<rect x="${offsetX + x * pixelSize}" y="${offsetY + y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
                    }
                }
            }
            return svg;
        }
        if (item.type === 'dot') {
            return `<circle cx="${item.x}" cy="${item.y}" r="${item.size}" fill="${item.color}" opacity="${item.opacity}" />`;
        }
        if (item.type === 'star') {
            // Простая SVG звезда
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size || 20;
            return `<polygon points="${cx},${cy-r} ${cx+r*0.3},${cy-r*0.3} ${cx+r},${cy-r*0.3} ${cx+r*0.4},${cy+r*0.1} ${cx+r*0.6},${cy+r*0.8} ${cx},${cy+r*0.4} ${cx-r*0.6},${cy+r*0.8} ${cx-r*0.4},${cy+r*0.1} ${cx-r},${cy-r*0.3} ${cx-r*0.3},${cy-r*0.3}" fill="${item.color}" opacity="${item.opacity || 1}" />`;
        }
        return '';
    }
}