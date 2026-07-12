// ============================================
// ГЕНЕРАТОР v4.0 - С поддержкой CSV и расширенными возможностями
// ============================================

import { DOMAINS, STYLES, CATEGORIES } from './presets.js';
import { ShapeLibrary } from './ShapeLibrary.js';
import { ColorPalette } from './ColorPalette.js';
import { TextureGenerator } from './TextureGenerator.js';
import { IconComposer } from './IconComposer.js';

export class Generator {
    constructor() {
        this.shapeLibrary = new ShapeLibrary();
        this.colorPalette = new ColorPalette();
        this.textureGenerator = new TextureGenerator();
        this.iconComposer = new IconComposer();
        this.cache = new Map();
        
        // Загружаем встроенные фигуры как резерв
        this.shapeLibrary.loadDefaultShapes();
    }

    generate(params) {
        const { domain, style, category, config } = params;
        
        // Получаем данные о категории
        const categoryData = CATEGORIES[category];
        if (!categoryData) {
            return this.generateFallback(config);
        }

        // Получаем данные о стиле
        const styleData = STYLES[style] || STYLES.minimal;

        // Получаем цветовую палитру
        const palette = this.colorPalette.getPalette(style, domain);

        // Создаем иконку через композитор
        const icon = this.iconComposer.compose({
            category: category,
            style: style,
            domain: domain,
            config: config,
            palette: palette,
            styleData: styleData
        });

        // Применяем финальные эффекты
        this.applyEffects(icon, config);

        return icon;
    }

    applyEffects(icon, config) {
        // Добавляем тени и свечения в зависимости от конфигурации
        if (config.glow) {
            icon.effects = icon.effects || [];
            icon.effects.push({
                type: 'glow',
                color: config.color || '#7c3aed',
                intensity: 0.4
            });
        }

        // Добавляем текстуру если нужно
        if (config.texture) {
            icon.texture = this.textureGenerator.generate(config.texture);
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
        
        // Отрисовываем каждый слой
        data.layers.forEach(layer => {
            if (Array.isArray(layer)) {
                layer.forEach(item => this.drawLayer(ctx, item, width, height));
            } else {
                this.drawLayer(ctx, layer, width, height);
            }
        });

        // Применяем эффекты
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
                this.shapeLibrary.drawStar(ctx, layer);
                break;
            case 'healthbar':
                this.drawHealthBar(ctx, layer);
                break;
            case 'bar':
                this.drawBar(ctx, layer);
                break;
            default:
                // Игнорируем неизвестные слои
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

        // Рисуем скругленный прямоугольник
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

        // Текст
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

        // Основная форма
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

        // Фон полосы
        ctx.fillStyle = '#333';
        ctx.fillRect(x - w/2, y - h/2, w, h);
        
        // Заполненная часть
        const grad = ctx.createLinearGradient(x - w/2, y - h/2, x - w/2 + w * value, y - h/2);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '80');
        ctx.fillStyle = grad;
        ctx.fillRect(x - w/2, y - h/2, w * value, h);

        // Рамка
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

    applyEffect(ctx, effect, width, height) {
        switch (effect.type) {
            case 'glow':
                this.drawGlow(ctx, effect, width, height);
                break;
            case 'shadow':
                // Применение тени
                break;
            case 'blur':
                // Применение размытия
                break;
        }
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
        return '';
    }
}