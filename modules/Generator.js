// ============================================
// ГЕНЕРАТОР - Осмысленное создание иконок
// ============================================
import { PRESETS } from './presets.js';

export class Generator {
    constructor() {
        this.presets = PRESETS;
    }

    /**
     * Генерирует иконку на основе настроек пользователя
     */
    generate(params) {
        const { 
            theme, style, bgColor, bgStyle, 
            mainShape, mainColor, mainSize, 
            details, patternType 
        } = params;

        // Создаем слои иконки
        const layers = [];

        // 1. Фон
        layers.push(this.createBackground(bgColor, bgStyle));

        // 2. Узор (если выбран)
        if (details && details.includes('pattern')) {
            layers.push(this.createPattern(patternType, mainColor, mainSize));
        }

        // 3. Основная фигура
        layers.push(this.createMainShape(mainShape, mainColor, mainSize));

        // 4. Дополнительные элементы
        if (details && details.includes('dots')) {
            layers.push(this.createDots(mainColor, mainSize));
        }
        if (details && details.includes('lines')) {
            layers.push(this.createLines(mainColor, mainSize));
        }
        if (details && details.includes('glow')) {
            layers.push(this.createGlow(mainColor, mainSize));
        }
        if (details && details.includes('shadow')) {
            layers.push(this.createShadow(mainSize));
        }

        // 5. Применяем стилистику
        const styleConfig = this.presets.styles[style] || this.presets.styles.minimal;
        const themeConfig = this.presets.themes[theme] || this.presets.themes.abstract;

        return {
            layers: layers,
            style: style,
            theme: theme,
            styleConfig: styleConfig,
            themeConfig: themeConfig,
            width: 400,
            height: 400
        };
    }

    createBackground(color, style) {
        const bg = {
            type: 'background',
            color: color || '#0a0a0f',
            style: style || 'solid'
        };

        if (style === 'gradient') {
            bg.gradientColors = [
                color || '#0a0a0f',
                this.adjustColor(color, 30) || '#1a1a3e'
            ];
        }

        return bg;
    }

    createPattern(type, color, size) {
        return {
            type: 'pattern',
            patternType: type || 'stripes',
            color: color || '#7c3aed',
            size: size || 120,
            opacity: 0.15
        };
    }

    createMainShape(shape, color, size) {
        return {
            type: 'main',
            shape: shape || 'circle',
            color: color || '#7c3aed',
            size: size || 120,
            x: 200,
            y: 200,
            rotation: 0
        };
    }

    createDots(color, size) {
        const dots = [];
        const count = 8 + Math.floor(Math.random() * 8);
        const radius = size / 2 + 20;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = radius + (Math.random() - 0.5) * 20;
            dots.push({
                type: 'dot',
                x: 200 + Math.cos(angle) * r,
                y: 200 + Math.sin(angle) * r,
                size: 4 + Math.random() * 6,
                color: color || '#7c3aed',
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        return dots;
    }

    createLines(color, size) {
        const lines = [];
        const count = 4 + Math.floor(Math.random() * 4);
        const radius = size / 2 + 10;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
            lines.push({
                type: 'line',
                x1: 200,
                y1: 200,
                x2: 200 + Math.cos(angle) * radius * 1.5,
                y2: 200 + Math.sin(angle) * radius * 1.5,
                color: color || '#7c3aed',
                width: 2 + Math.random() * 3,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
        return lines;
    }

    createGlow(color, size) {
        return {
            type: 'glow',
            color: color || '#7c3aed',
            size: size * 0.8,
            intensity: 0.3
        };
    }

    createShadow(size) {
        return {
            type: 'shadow',
            size: size,
            blur: 20,
            offsetX: 5,
            offsetY: 5,
            opacity: 0.3
        };
    }

    /**
     * Отрисовка иконки на canvas
     */
    drawIcon(ctx, width, height, data) {
        if (!data || !data.layers) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // Проходим по всем слоям
        data.layers.forEach(layer => {
            if (Array.isArray(layer)) {
                // Группа элементов (например, точки)
                layer.forEach(item => this.drawLayerItem(ctx, item, width, height));
            } else {
                this.drawLayerItem(ctx, layer, width, height);
            }
        });
    }

    drawLayerItem(ctx, item, width, height) {
        const cx = width / 2;
        const cy = height / 2;

        switch (item.type) {
            case 'background':
                this.drawBackground(ctx, item, width, height);
                break;
            case 'pattern':
                this.drawPattern(ctx, item, cx, cy);
                break;
            case 'main':
                this.drawMainShape(ctx, item, cx, cy);
                break;
            case 'dot':
                ctx.save();
                ctx.globalAlpha = item.opacity || 0.8;
                ctx.fillStyle = item.color || '#7c3aed';
                ctx.shadowColor = item.color + '60';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(item.x, item.y, item.size || 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
            case 'line':
                ctx.save();
                ctx.globalAlpha = item.opacity || 0.5;
                ctx.strokeStyle = item.color || '#7c3aed';
                ctx.lineWidth = item.width || 2;
                ctx.shadowColor = item.color + '40';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.stroke();
                ctx.restore();
                break;
            case 'glow':
                ctx.save();
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, item.size || 100);
                grad.addColorStop(0, item.color + '80');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.globalCompositeOperation = 'screen';
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
                break;
            case 'shadow':
                ctx.save();
                ctx.shadowColor = '#000000' + Math.round(item.opacity * 255).toString(16).padStart(2, '0');
                ctx.shadowBlur = item.blur || 20;
                ctx.shadowOffsetX = item.offsetX || 5;
                ctx.shadowOffsetY = item.offsetY || 5;
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, 1, 1);
                ctx.restore();
                break;
        }
    }

    drawBackground(ctx, bg, width, height) {
        if (bg.style === 'gradient') {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            const colors = bg.gradientColors || ['#0a0a0f', '#1a1a3e'];
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(1, colors[1]);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = bg.color || '#0a0a0f';
        }
        ctx.fillRect(0, 0, width, height);
    }

    drawPattern(ctx, pattern, cx, cy) {
        ctx.save();
        ctx.globalAlpha = pattern.opacity || 0.15;
        ctx.strokeStyle = pattern.color || '#7c3aed';
        ctx.fillStyle = pattern.color || '#7c3aed';
        ctx.lineWidth = 2;

        const size = pattern.size || 120;
        const spacing = 20;

        switch (pattern.patternType) {
            case 'stripes':
                for (let x = -size; x < size; x += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(cx + x, cy - size);
                    ctx.lineTo(cx + x, cy + size);
                    ctx.stroke();
                }
                break;
            case 'grid':
                for (let x = -size; x < size; x += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(cx + x, cy - size);
                    ctx.lineTo(cx + x, cy + size);
                    ctx.stroke();
                }
                for (let y = -size; y < size; y += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(cx - size, cy + y);
                    ctx.lineTo(cx + size, cy + y);
                    ctx.stroke();
                }
                break;
            case 'waves':
                for (let x = -size; x < size; x += 2) {
                    const y = Math.sin(x / 15) * 20;
                    ctx.fillRect(cx + x, cy + y, 2, 2);
                }
                break;
            case 'dots':
                for (let x = -size; x < size; x += spacing) {
                    for (let y = -size; y < size; y += spacing) {
                        if (Math.random() > 0.3) {
                            ctx.beginPath();
                            ctx.arc(cx + x, cy + y, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                break;
        }
        ctx.restore();
    }

    drawMainShape(ctx, shape, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(shape.rotation || 0);
        
        const size = shape.size || 120;
        const color = shape.color || '#7c3aed';
        
        ctx.fillStyle = color;
        ctx.shadowColor = color + '40';
        ctx.shadowBlur = 20;

        switch (shape.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-size/2, -size/2, size, size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -size/2);
                ctx.lineTo(-size/2, size/2);
                ctx.lineTo(size/2, size/2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                this.drawStar(ctx, 0, 0, 5, size/2, size/4);
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const r = size/2;
                    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'custom':
                // Пользовательская форма - комбинация
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const r = size/2 * (0.6 + Math.sin(i * 3) * 0.4);
                    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = -Math.PI / 2;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx + outerRadius * Math.cos(rot), cy + outerRadius * Math.sin(rot));
        for (let i = 1; i <= spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = rot + i * step;
            ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();
    }

    adjustColor(color, percent) {
        // Упрощенная регулировка яркости цвета
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + percent);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
        const b = Math.min(255, (num & 0x0000FF) + percent);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Скачивание иконки в PNG или SVG
     */
    download(format, data) {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Масштабируем данные под новый размер
        const scaledData = this.scaleData(data, size);
        this.drawIcon(ctx, size, size, scaledData);

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `icon-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else if (format === 'svg') {
            const svg = this.toSVG(scaledData, size);
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

    scaleData(data, newSize) {
        const scale = newSize / 400;
        const scaled = JSON.parse(JSON.stringify(data));
        
        scaled.layers = scaled.layers.map(layer => {
            if (Array.isArray(layer)) {
                return layer.map(item => {
                    if (item.x) item.x *= scale;
                    if (item.y) item.y *= scale;
                    if (item.x1) item.x1 *= scale;
                    if (item.y1) item.y1 *= scale;
                    if (item.x2) item.x2 *= scale;
                    if (item.y2) item.y2 *= scale;
                    if (item.size) item.size *= scale;
                    return item;
                });
            } else {
                if (layer.x) layer.x *= scale;
                if (layer.y) layer.y *= scale;
                if (layer.size) layer.size *= scale;
                return layer;
            }
        });
        
        return scaled;
    }

    toSVG(data, size) {
        // Генерация SVG из данных (упрощенная версия)
        let shapes = '';
        
        data.layers.forEach(layer => {
            if (Array.isArray(layer)) {
                layer.forEach(item => {
                    shapes += this.layerToSVG(item);
                });
            } else {
                shapes += this.layerToSVG(layer);
            }
        });

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            ${shapes}
        </svg>`;
    }

    layerToSVG(item) {
        // Упрощенная конвертация слоя в SVG
        if (item.type === 'background') {
            if (item.style === 'gradient') {
                return `<rect width="100%" height="100%" fill="url(#grad)" />
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${item.gradientColors?.[0] || '#0a0a0f'}" />
                        <stop offset="100%" stop-color="${item.gradientColors?.[1] || '#1a1a3e'}" />
                    </linearGradient></defs>`;
            }
            return `<rect width="100%" height="100%" fill="${item.color || '#0a0a0f'}" />`;
        }
        if (item.type === 'main') {
            const cx = item.x || 200;
            const cy = item.y || 200;
            const r = item.size/2 || 60;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="0.8" />`;
        }
        if (item.type === 'dot') {
            return `<circle cx="${item.x}" cy="${item.y}" r="${item.size}" fill="${item.color}" opacity="${item.opacity}" />`;
        }
        return '';
    }
}