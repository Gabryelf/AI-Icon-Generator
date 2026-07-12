// ============================================
// КОМПОЗИТОР ИКОНОК - Сборка из слоев
// ============================================

import { ShapeLibrary } from './ShapeLibrary.js';

export class IconComposer {
    constructor() {
        this.shapeLibrary = new ShapeLibrary();
    }

    compose(params) {
        const { category, style, domain, config, palette, styleData } = params;
        const layers = [];

        // 1. Базовый слой (фон)
        const bgLayer = this.createBackground(config, palette);
        if (bgLayer) layers.push(bgLayer);

        // 2. Основной контент (в зависимости от категории)
        const contentLayers = this.createContent(category, config, palette);
        layers.push(...contentLayers);

        // 3. Детали (уровень сложности)
        const detailLayers = this.createDetails(category, config, palette);
        if (detailLayers.length) layers.push(...detailLayers);

        // 4. Спецэффекты
        const effectLayers = this.createEffects(config, palette);
        if (effectLayers.length) layers.push(...effectLayers);

        // 5. Рамка/обводка
        const borderLayer = this.createBorder(config, palette);
        if (borderLayer) layers.push(borderLayer);

        // Возвращаем скомпонованную иконку
        return {
            layers: layers,
            effects: this.collectEffects(config, palette),
            style: style,
            domain: domain,
            category: category,
            config: config
        };
    }

    createBackground(config, palette) {
        const bgType = config.bgColor || 'transparent';
        
        if (bgType === 'transparent') {
            return { type: 'background', style: 'none', color: 'transparent' };
        }

        if (bgType === 'gradient') {
            return {
                type: 'background',
                style: 'gradient',
                color: palette.primary || '#0a0a0f',
                gradientColor: palette.secondary || '#1a1a3e'
            };
        }

        return {
            type: 'background',
            style: 'solid',
            color: bgType || palette.background || '#0a0a0f'
        };
    }

    createContent(category, config, palette) {
        const layers = [];

        switch (category) {
            case 'game_icon':
            case 'game_emblem':
                layers.push(this.createMainShape(config, palette));
                break;
            case 'game_character':
                layers.push(this.createCharacter(config, palette));
                break;
            case 'game_item':
                layers.push(this.createItem(config, palette));
                break;
            case 'game_button':
            case 'ui_button':
                layers.push(this.createButton(config, palette));
                break;
            case 'game_avatar':
            case 'avatar':
                layers.push(this.createAvatar(config, palette));
                layers.push(...this.createFaceFeatures(config, palette));
                break;
            case 'logo':
                layers.push(this.createLogo(config, palette));
                break;
            case 'ui_icon':
                layers.push(this.createUIIcon(config, palette));
                break;
            case 'sticker':
                layers.push(this.createSticker(config, palette));
                break;
            case 'icon_set':
                layers.push(...this.createIconSet(config, palette));
                break;
            case 'infographic':
                layers.push(...this.createInfographic(config, palette));
                break;
            default:
                layers.push(this.createMainShape(config, palette));
        }

        return layers;
    }

    createMainShape(config, palette) {
        const shape = config.shape || 'circle';
        const color = config.color || palette.primary || '#7c3aed';
        const size = config.size || 120;

        return {
            type: 'main',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            strokeWidth: config.strokeWidth || 0,
            opacity: 1
        };
    }

    createCharacter(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const style = config.style || 'fantasy';

        return {
            type: 'main',
            shape: 'circle',
            color: color,
            size: 150,
            x: 250,
            y: 250,
            strokeWidth: 2,
            strokeColor: '#ffffff'
        };
    }

    createItem(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const type = config.type || 'weapon';

        // В зависимости от типа предмета создаем разные формы
        let shape = 'shield';
        if (type === 'weapon') shape = 'shield';
        else if (type === 'armor') shape = 'circle';
        else if (type === 'potion') shape = 'circle';
        else if (type === 'artifact') shape = 'diamond';
        else if (type === 'resource') shape = 'hexagon';

        return {
            type: 'main',
            shape: shape,
            color: color,
            size: 130,
            x: 250,
            y: 250,
            strokeWidth: 2
        };
    }

    createButton(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const text = config.text || 'Button';
        const cornerRadius = config.cornerRadius || 8;

        return {
            type: 'button',
            shape: config.shape || 'rounded',
            color: color,
            text: text,
            cornerRadius: cornerRadius,
            x: 250,
            y: 250,
            width: 180,
            height: 60
        };
    }

    createAvatar(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';
        const size = config.size || 160;

        return {
            type: 'avatar',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            hasBorder: config.hasBorder || false,
            borderColor: config.borderColor || '#ffffff'
        };
    }

    createFaceFeatures(config, palette) {
        const layers = [];
        const eyesType = config.eyes || 'simple';
        const mouthType = config.mouth || 'smile';

        // Глаза
        if (eyesType !== 'none') {
            layers.push({
                type: 'text',
                text: eyesType === 'anime' ? '◕‿◕' : '•‿•',
                color: '#ffffff',
                size: 30,
                x: 250,
                y: 240
            });
        }

        // Рот
        if (mouthType !== 'none') {
            const mouthSymbols = {
                'smile': '⌣',
                'open': 'O',
                'neutral': '—'
            };
            layers.push({
                type: 'text',
                text: mouthSymbols[mouthType] || '⌣',
                color: '#ffffff',
                size: 20,
                x: 250,
                y: 280
            });
        }

        return layers;
    }

    createLogo(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const letter = config.letter || 'A';
        const shape = config.shape || 'circle';

        return {
            type: 'main',
            shape: shape,
            color: color,
            size: 140,
            x: 250,
            y: 250
        };
    }

    createUIIcon(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';
        const size = config.size || 64;

        return {
            type: 'main',
            shape: 'circle',
            color: color,
            size: size,
            x: 250,
            y: 250
        };
    }

    createSticker(config, palette) {
        const color = config.color || palette.primary || '#7c3aed';

        return {
            type: 'main',
            shape: 'circle',
            color: color,
            size: 180,
            x: 250,
            y: 250
        };
    }

    createIconSet(config, palette) {
        const layers = [];
        const count = Math.min(config.count || 4, 8);
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const spacing = 350 / Math.max(cols, rows);
        const startX = 500/2 - (cols-1) * spacing / 2;
        const startY = 500/2 - (rows-1) * spacing / 2;
        const color = config.color || palette.primary || '#7c3aed';
        const size = config.size || 48;
        const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon', 'diamond', 'shield', 'crest'];

        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const shape = shapes[i % shapes.length];
            
            layers.push({
                type: 'main',
                shape: shape,
                color: color,
                size: size,
                x: startX + col * spacing,
                y: startY + row * spacing,
                opacity: 0.7 + Math.random() * 0.3
            });
        }

        return layers;
    }

    createInfographic(config, palette) {
        const layers = [];
        const points = config.dataPoints || 5;
        const color = config.color || palette.primary || '#7c3aed';
        const type = config.type || 'chart';

        if (type === 'chart' || type === 'bar') {
            for (let i = 0; i < points; i++) {
                const x = 50 + (i / (points - 1)) * 400;
                const height = 30 + Math.random() * 150;
                layers.push({
                    type: 'bar',
                    x: x,
                    y: 400 - height,
                    width: 30,
                    height: height,
                    color: color,
                    opacity: 0.5 + (i / points) * 0.5
                });
            }
        } else if (type === 'pie') {
            // Круговая диаграмма
            layers.push({
                type: 'main',
                shape: 'circle',
                color: color,
                size: 150,
                x: 250,
                y: 250
            });
        }

        return layers;
    }

    createDetails(category, config, palette) {
        const layers = [];
        const complexity = config.complexity || 0;
        const color = config.color || palette.primary || '#7c3aed';

        // Добавляем детали в зависимости от сложности
        if (complexity > 3) {
            const count = Math.min(complexity, 10);
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const r = 80 + Math.random() * 40;
                layers.push({
                    type: 'dot',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 3 + Math.random() * 5,
                    color: color,
                    opacity: 0.3 + Math.random() * 0.4
                });
            }
        }

        // Звезды для эмблем
        if (category === 'game_emblem' && config.stars) {
            const starCount = Math.min(config.stars || 3, 5);
            for (let i = 0; i < starCount; i++) {
                const angle = -Math.PI / 2 + (i / starCount) * Math.PI;
                const r = 60;
                layers.push({
                    type: 'star',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 20 + Math.random() * 10,
                    color: '#ffd700',
                    points: 5
                });
            }
        }

        return layers;
    }

    createEffects(config, palette) {
        const effects = [];

        // Свечение
        if (config.glow) {
            effects.push({
                type: 'glow',
                color: config.color || palette.primary || '#7c3aed',
                size: 200,
                intensity: 0.4
            });
        }

        return effects;
    }

    createBorder(config, palette) {
        if (!config.hasBorder) return null;

        return {
            type: 'stroke',
            color: config.borderColor || '#ffffff',
            width: config.strokeWidth || 3,
            x: 250,
            y: 250,
            size: config.size || 160
        };
    }

    collectEffects(config, palette) {
        const effects = [];

        if (config.glow) {
            effects.push({
                type: 'glow',
                color: config.color || palette.primary || '#7c3aed',
                intensity: 0.4
            });
        }

        return effects;
    }
}