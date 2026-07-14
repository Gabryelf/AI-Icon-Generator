// =============================================================
// ГЕНЕРАТОР v0.0.3 - Полная дифференциация стилей
//           v0.0.4 - Расширение функционала тематик
//           v0.0.5 - Поддержка компонентов и стилей
// =============================================================

import { COMPONENTS, STYLES, CATEGORY_CONFIGS } from './presets.js';
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

    generateComponent(params) {
        const { component, style, config } = params;
        
        const componentData = COMPONENTS[component];
        const styleData = STYLES[style];
        const palette = this.colorPalette.getPalette(style, component);

        if (!componentData) {
            return this.generateFallback(config);
        }

        let icon = null;

        // Выбор алгоритма в зависимости от компонента и стиля
        switch (component) {
            case 'button':
                icon = this.generateButton(style, config, palette);
                break;
            case 'icon':
                icon = this.generateIcon(style, config, palette);
                break;
            case 'avatar':
                // Аватары обрабатываются в PixelGenerator
                icon = this.pixelGenerator.generateAvatar({
                    color: config.color,
                    size: config.size || 16,
                    shape: 'human',
                    skinColor: config.skinColor,
                    accessories: config.accessories ? config.accessories.split(',').map(a => a.trim()) : [],
                    style: style
                });
                break;
            case 'character':
                // Персонажи обрабатываются в CharacterGenerator
                icon = this.characterGenerator.generate({
                    style: style,
                    color: config.color,
                    skinColor: config.skinColor,
                    eyes: config.eyes,
                    mouth: config.mouth,
                    hair: config.hair,
                    accessories: config.accessories ? config.accessories.split(',').map(a => a.trim()) : [],
                    hasWeapon: config.hasWeapon || false,
                    hasArmor: config.hasArmor || false
                });
                break;
            default:
                icon = this.generateDefaultComponent(component, style, config, palette);
        }

        // Применяем эффекты в зависимости от стиля
        this.applyStyleEffects(icon, style, config);

        return icon;
    }

    // ===== ГЕНЕРАЦИЯ КНОПКИ =====
    generateButton(style, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'rounded';
        const text = config.text || 'Кнопка';

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Кнопка с учетом стиля
        const buttonLayer = {
            type: 'button',
            shape: shape,
            color: color,
            text: text,
            cornerRadius: config.cornerRadius || 20,
            x: 250,
            y: 250,
            width: 180,
            height: 60,
            glow: config.glow
        };

        // Добавляем стилистические особенности
        if (style === 'neon') {
            buttonLayer.glow = true;
            buttonLayer.borderColor = color;
            buttonLayer.borderWidth = 3;
        } else if (style === 'vintage') {
            buttonLayer.color = this.darkenColor(color, 20);
            buttonLayer.texture = 'vintage';
        } else if (style === 'cyberpunk') {
            buttonLayer.glow = true;
            buttonLayer.borderColor = '#00ffff';
            buttonLayer.borderWidth = 2;
        }

        layers.push(buttonLayer);

        return {
            layers: layers,
            effects: this.getStyleEffects(style, config),
            style: style,
            component: 'button',
            config: config
        };
    }

    // ===== ГЕНЕРАЦИЯ ИКОНКИ =====
    generateIcon(style, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Основная фигура
        const mainLayer = {
            type: 'main',
            shape: shape,
            color: color,
            size: config.size || 120,
            x: 250,
            y: 250,
            strokeWidth: config.strokeWidth || 0,
            opacity: 1
        };

        layers.push(mainLayer);

        // Детали в зависимости от стиля
        if (style === 'geometric' && config.complexity > 3) {
            // Добавляем геометрические элементы
            for (let i = 0; i < Math.min(config.complexity, 8); i++) {
                const angle = (i / Math.min(config.complexity, 8)) * Math.PI * 2;
                const r = 40 + (i / Math.min(config.complexity, 8)) * 80;
                layers.push({
                    type: 'main',
                    shape: ['circle', 'square', 'triangle', 'hexagon'][i % 4],
                    color: this.lightenColor(color, 20 + i * 5),
                    size: 15 + i * 5,
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    opacity: 0.3 + (i / Math.min(config.complexity, 8)) * 0.4
                });
            }
        }

        if (style === 'neon') {
            layers.push({
                type: 'glow',
                color: color,
                size: 200,
                intensity: 0.8
            });
            // Глитч-линии
            for (let i = 0; i < 3; i++) {
                layers.push({
                    type: 'glitch_line',
                    color: color,
                    y: 100 + Math.random() * 300,
                    width: 10 + Math.random() * 30,
                    opacity: 0.1 + Math.random() * 0.2
                });
            }
        }

        if (style === 'fantasy') {
            // Магические звезды
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const r = 100 + Math.random() * 40;
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

        return {
            layers: layers,
            effects: this.getStyleEffects(style, config),
            style: style,
            component: 'icon',
            config: config
        };
    }

    // ===== ДЕФОЛТНАЯ ГЕНЕРАЦИЯ =====
    generateDefaultComponent(component, style, config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';

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
            effects: this.getStyleEffects(style, config),
            style: style,
            component: component,
            config: config
        };
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====

    getStyleEffects(style, config) {
        const effects = [];

        switch (style) {
            case 'neon':
                effects.push({ type: 'glow', color: config.color || '#ff00ff', intensity: 0.8 });
                break;
            case 'fantasy':
                effects.push({ type: 'glow', color: '#ffd700', intensity: 0.3 });
                effects.push({ type: 'particles', count: 15 });
                break;
            case 'vintage':
                effects.push({ type: 'vintage', intensity: 0.4 });
                break;
            case 'cyberpunk':
                effects.push({ type: 'glow', color: '#ff00ff', intensity: 0.5 });
                effects.push({ type: 'scanline', intensity: 0.15 });
                break;
            case 'pixel':
                // Пиксельный эффект уже в PixelGenerator
                break;
            default:
                if (config.glow) {
                    effects.push({ type: 'glow', color: config.color || '#7c3aed', intensity: 0.4 });
                }
        }

        return effects;
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

    generateFallback(config) {
        return {
            layers: [
                { type: 'background', color: 'transparent', style: 'none' },
                { type: 'main', shape: 'circle', color: '#7c3aed', size: 120, x: 250, y: 250 }
            ],
            effects: [],
            style: 'fallback',
            component: 'unknown',
            config: config || {}
        };
    }

    // ===== ОТРИСОВКА =====
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
            case 'dot':
                this.drawDot(ctx, layer);
                break;
            case 'glitch_line':
                this.drawGlitchLine(ctx, layer, width, height);
                break;
            case 'pixel_avatar':
                this.drawPixelAvatar(ctx, layer);
                break;
            default:
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

    drawButton(ctx, button, cx, cy) {
        ctx.save();
        const x = button.x || cx;
        const y = button.y || cy;
        const w = button.width || 180;
        const h = button.height || 60;
        const r = button.cornerRadius || 8;
        const color = button.color || '#7c3aed';

        // Тень
        if (button.glow) {
            ctx.shadowColor = color + '60';
            ctx.shadowBlur = 30;
        }

        ctx.fillStyle = color;

        // Рисуем кнопку в зависимости от формы
        const shape = button.shape || 'rounded';
        ctx.beginPath();
        if (shape === 'circle') {
            ctx.arc(x, y, Math.min(w, h) / 2, 0, Math.PI * 2);
        } else if (shape === 'pill') {
            const r2 = h / 2;
            ctx.moveTo(x - w/2 + r2, y - h/2);
            ctx.lineTo(x + w/2 - r2, y - h/2);
            ctx.quadraticCurveTo(x + w/2, y - h/2, x + w/2, y - h/2 + r2);
            ctx.lineTo(x + w/2, y + h/2 - r2);
            ctx.quadraticCurveTo(x + w/2, y + h/2, x + w/2 - r2, y + h/2);
            ctx.lineTo(x - w/2 + r2, y + h/2);
            ctx.quadraticCurveTo(x - w/2, y + h/2, x - w/2, y + h/2 - r2);
            ctx.lineTo(x - w/2, y - h/2 + r2);
            ctx.quadraticCurveTo(x - w/2, y - h/2, x - w/2 + r2, y - h/2);
        } else {
            // rounded или square
            ctx.moveTo(x - w/2 + r, y - h/2);
            ctx.lineTo(x + w/2 - r, y - h/2);
            ctx.quadraticCurveTo(x + w/2, y - h/2, x + w/2, y - h/2 + r);
            ctx.lineTo(x + w/2, y + h/2 - r);
            ctx.quadraticCurveTo(x + w/2, y + h/2, x + w/2 - r, y + h/2);
            ctx.lineTo(x - w/2 + r, y + h/2);
            ctx.quadraticCurveTo(x - w/2, y + h/2, x - w/2, y + h/2 - r);
            ctx.lineTo(x - w/2, y - h/2 + r);
            ctx.quadraticCurveTo(x - w/2, y - h/2, x - w/2 + r, y - h/2);
        }
        ctx.closePath();
        ctx.fill();

        // Обводка
        if (button.borderColor && button.borderWidth) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.strokeStyle = button.borderColor;
            ctx.lineWidth = button.borderWidth;
            ctx.stroke();
        }

        // Текст
        if (button.text) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.text, x, y + 2);
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

    drawGlitchLine(ctx, layer, width, height) {
        ctx.save();
        ctx.globalAlpha = layer.opacity || 0.15;
        ctx.fillStyle = layer.color || '#ff00ff';
        ctx.fillRect(0, layer.y, width, layer.width || 15);
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

    // ===== ЦВЕТОВЫЕ УТИЛИТЫ =====

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
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size || 20;
            return `<polygon points="${cx},${cy-r} ${cx+r*0.3},${cy-r*0.3} ${cx+r},${cy-r*0.3} ${cx+r*0.4},${cy+r*0.1} ${cx+r*0.6},${cy+r*0.8} ${cx},${cy+r*0.4} ${cx-r*0.6},${cy+r*0.8} ${cx-r*0.4},${cy+r*0.1} ${cx-r},${cy-r*0.3} ${cx-r*0.3},${cy-r*0.3}" fill="${item.color}" opacity="${item.opacity || 1}" />`;
        }
        return '';
    }
}