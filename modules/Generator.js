// =============================================================
// ГЕНЕРАТОР v0.0.3 - Полная дифференциация стилей
//           v0.0.4 - Расширение функционала тематик
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
        
        // Загружаем встроенные фигуры как резерв
        if (typeof this.shapeLibrary.loadDefaultShapes === 'function') {
            this.shapeLibrary.loadDefaultShapes();
        } else {
            console.warn('ShapeLibrary.loadDefaultShapes not available, using fallback');
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

        // Специальные генераторы для разных стилей и категорий
        if (style === 'pixel' && (category === 'game_avatar' || category === 'avatar' || category === 'game_character')) {
            icon = this.pixelGenerator.generateAvatar({
                color: config.color || palette.primary || '#7c3aed',
                size: config.size || 16,
                shape: config.shape || 'human',
                skinColor: config.skinColor || '#f5d0b8',
                accessories: this.getAccessories(config)
            });
        }
        else if (category === 'game_character' || category === 'game_avatar') {
            icon = this.characterGenerator.generate({
                style: style,
                color: config.color || palette.primary || '#7c3aed',
                skinColor: config.skinColor || '#f5d0b8',
                eyes: config.eyes || 'simple',
                mouth: config.mouth || 'smile',
                hair: config.hair || 'short',
                accessories: this.getAccessories(config),
                hasWeapon: config.hasWeapon || false,
                hasArmor: config.hasArmor || false
            });
        }
        else {
            icon = this.iconComposer.compose({
                category: category,
                style: style,
                domain: domain,
                config: config,
                palette: palette,
                styleData: styleData
            });
        }

        // Применяем эффекты в зависимости от стиля
        this.applyStyleEffects(icon, style, config);

        return icon;
    }

    getAccessories(config) {
        const accessories = [];
        if (config.hasGlasses) accessories.push('glasses');
        if (config.hasHat) accessories.push('hat');
        if (config.hasCape) accessories.push('cape');
        if (config.hasWeapon) accessories.push('weapon');
        return accessories;
    }

    applyStyleEffects(icon, style, config) {
        if (!icon.effects) icon.effects = [];

        if (style === 'neon' && config.glow) {
            icon.effects.push({
                type: 'glow',
                color: config.color || '#7c3aed',
                intensity: 0.6,
                size: 250
            });
        }

        if (style === 'vintage') {
            icon.effects.push({
                type: 'vintage',
                intensity: 0.3
            });
        }

        if (style === 'cyberpunk') {
            icon.effects.push({
                type: 'glow',
                color: '#ff00ff',
                intensity: 0.5,
                size: 200
            });
            icon.effects.push({
                type: 'scanline',
                intensity: 0.2
            });
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
            style: 'minimal',
            domain: 'unknown',
            category: 'unknown',
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
        ctx.font = `${text.weight || 'bold'} ${text.size || 60}px Arial`;
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

    drawPixelAvatar(ctx, layer) {
        // Отрисовка пиксельного аватара
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

    drawStarFallback(ctx, params) {
        const { x, y, size, points, color } = params;
        const outerRadius = size || 20;
        const innerRadius = outerRadius * 0.4;
        const spikes = points || 5;
        
        ctx.save();
        ctx.translate(x || 0, y || 0);
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

    applyEffect(ctx, effect, width, height) {
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
        }
    }

    applyVintageEffect(ctx, width, height, intensity = 0.3) {
        // Эффект старения
        ctx.save();
        ctx.globalAlpha = intensity * 0.2;
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    applyScanlineEffect(ctx, width, height, intensity = 0.2) {
        // Эффект сканирующих линий
        ctx.save();
        ctx.globalAlpha = intensity;
        for (let y = 0; y < height; y += 4) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, y, width, 1);
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
            // Для пиксельных аватаров SVG экспорт
            let svg = '';
            const { pixels, pixelSize, size: avatarSize } = item;
            if (!pixels) return '';
            
            for (let y = 0; y < pixels.length; y++) {
                for (let x = 0; x < pixels[y].length; x++) {
                    const color = pixels[y][x];
                    if (color && color !== 0 && color !== 'transparent') {
                        const px = x * pixelSize + (size - avatarSize * pixelSize) / 2;
                        const py = y * pixelSize + (size - avatarSize * pixelSize) / 2;
                        svg += `<rect x="${px}" y="${py}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
                    }
                }
            }
            return svg;
        }
        return '';
    }
}