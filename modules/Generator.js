// ============================================
// ГЕНЕРАТОР v3.0 - Полная реорганизация
// ============================================
import { DOMAINS, STYLES, CATEGORIES } from './presets.js';

export class Generator {
    constructor() {
        this.cache = new Map();
    }

    generate(params) {
        const { domain, style, category, config } = params;
        
        // Получаем данные о категории
        const categoryData = CATEGORIES[category];
        if (!categoryData) {
            return this.generateFallback(config);
        }

        // Получаем стиль
        const styleData = STYLES[style] || STYLES.minimal;

        // Создаем иконку на основе категории
        let icon = {
            layers: [],
            style: style,
            domain: domain,
            category: category,
            config: config
        };

        // В зависимости от категории строим иконку
        switch (category) {
            case 'game_icon':
                icon = this.generateGameIcon(icon, config, styleData);
                break;
            case 'game_button':
                icon = this.generateGameButton(icon, config, styleData);
                break;
            case 'game_avatar':
                icon = this.generateGameAvatar(icon, config, styleData);
                break;
            case 'game_emblem':
                icon = this.generateGameEmblem(icon, config, styleData);
                break;
            case 'game_ui':
                icon = this.generateGameUI(icon, config, styleData);
                break;
            case 'logo':
                icon = this.generateLogo(icon, config, styleData);
                break;
            case 'emblem':
                icon = this.generateEmblem(icon, config, styleData);
                break;
            case 'ui_icon':
                icon = this.generateUIIcon(icon, config, styleData);
                break;
            case 'ui_button':
                icon = this.generateUIButton(icon, config, styleData);
                break;
            case 'avatar':
                icon = this.generateAvatar(icon, config, styleData);
                break;
            case 'sticker':
                icon = this.generateSticker(icon, config, styleData);
                break;
            case 'icon_set':
                icon = this.generateIconSet(icon, config, styleData);
                break;
            case 'infographic':
                icon = this.generateInfographic(icon, config, styleData);
                break;
            default:
                icon = this.generateFallback(config);
        }

        // Применяем стилистику ко всем слоям
        icon = this.applyStyle(icon, styleData);
        
        return icon;
    }

    // ===== ГЕНЕРАТОРЫ ДЛЯ РАЗНЫХ КАТЕГОРИЙ =====

    generateGameIcon(icon, config, style) {
        const { shape, color, size, bgColor, glow, strokeWidth, complexity } = config;
        
        // Фон
        icon.layers.push({
            type: 'background',
            color: bgColor || '#0a0a0f',
            style: 'solid'
        });

        // Основная фигура
        icon.layers.push({
            type: 'main',
            shape: shape || 'circle',
            color: color || '#7c3aed',
            size: size || 120,
            x: 250,
            y: 250,
            strokeWidth: strokeWidth || 3,
            rotation: 0
        });

        // Детали
        if (complexity > 3) {
            const count = Math.min(complexity, 10);
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const r = (size / 2) * 0.8;
                icon.layers.push({
                    type: 'dot',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 3 + Math.random() * 5,
                    color: color || '#7c3aed',
                    opacity: 0.3 + Math.random() * 0.4
                });
            }
        }

        // Свечение
        if (glow) {
            icon.layers.push({
                type: 'glow',
                color: color || '#7c3aed',
                size: size * 0.7,
                intensity: 0.4
            });
        }

        return icon;
    }

    generateGameButton(icon, config, style) {
        const { shape, color, text, glow, cornerRadius } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'button',
            shape: shape || 'rounded',
            color: color || '#7c3aed',
            text: text || 'PLAY',
            cornerRadius: cornerRadius || 20,
            x: 250,
            y: 250,
            width: 200,
            height: 80
        });

        if (glow) {
            icon.layers.push({
                type: 'glow',
                color: color || '#7c3aed',
                size: 150,
                intensity: 0.5
            });
        }

        return icon;
    }

    generateGameAvatar(icon, config, style) {
        const { shape, color, bgColor, hasBorder, borderColor } = config;
        
        icon.layers.push({
            type: 'background',
            color: bgColor || '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'avatar',
            shape: shape || 'circle',
            color: color || '#7c3aed',
            x: 250,
            y: 250,
            size: 160,
            hasBorder: hasBorder || false,
            borderColor: borderColor || '#ffffff'
        });

        // Глаза
        icon.layers.push({
            type: 'avatar_eyes',
            color: '#ffffff',
            x: 250,
            y: 230
        });

        return icon;
    }

    generateGameEmblem(icon, config, style) {
        const { shape, color, stars, hasRibbon } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'main',
            shape: shape || 'shield',
            color: color || '#7c3aed',
            size: 180,
            x: 250,
            y: 250,
            strokeWidth: 4
        });

        // Звезды
        if (stars) {
            const starCount = Math.min(stars || 3, 5);
            for (let i = 0; i < starCount; i++) {
                const angle = -Math.PI / 2 + (i / starCount) * Math.PI;
                const r = 60;
                icon.layers.push({
                    type: 'star',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 20 + Math.random() * 10,
                    color: '#ffd700',
                    points: 5
                });
            }
        }

        return icon;
    }

    generateGameUI(icon, config, style) {
        const { style: uiStyle, color, healthBar } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        // Полоса здоровья
        if (healthBar) {
            icon.layers.push({
                type: 'healthbar',
                color: color || '#7c3aed',
                x: 250,
                y: 250,
                width: 200,
                height: 20,
                value: 0.7
            });
        }

        return icon;
    }

    generateLogo(icon, config, style) {
        const { shape, color, letter, bgColor } = config;
        
        if (bgColor && bgColor !== 'transparent') {
            icon.layers.push({
                type: 'background',
                color: bgColor,
                style: 'solid'
            });
        }

        icon.layers.push({
            type: 'main',
            shape: shape || 'circle',
            color: color || '#7c3aed',
            size: 140,
            x: 250,
            y: 250,
            opacity: 0.9
        });

        if (letter) {
            icon.layers.push({
                type: 'text',
                text: letter || 'A',
                color: '#ffffff',
                x: 250,
                y: 260,
                size: 60,
                weight: 'bold'
            });
        }

        return icon;
    }

    generateEmblem(icon, config, style) {
        const { shape, color, borderWidth } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'main',
            shape: shape || 'shield',
            color: color || '#7c3aed',
            size: 160,
            x: 250,
            y: 250,
            strokeWidth: borderWidth || 4,
            strokeColor: '#ffffff'
        });

        return icon;
    }

    generateUIIcon(icon, config, style) {
        const { style: iconStyle, color, size } = config;
        
        icon.layers.push({
            type: 'background',
            color: 'transparent',
            style: 'none'
        });

        icon.layers.push({
            type: 'ui_icon',
            style: iconStyle || 'minimal',
            color: color || '#7c3aed',
            size: size || 64,
            x: 250,
            y: 250
        });

        return icon;
    }

    generateUIButton(icon, config, style) {
        const { style: btnStyle, color, text, cornerRadius } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'button',
            shape: 'rounded',
            color: color || '#7c3aed',
            text: text || 'Button',
            cornerRadius: cornerRadius || 8,
            x: 250,
            y: 250,
            width: 180,
            height: 60,
            style: btnStyle || 'flat'
        });

        return icon;
    }

    generateAvatar(icon, config, style) {
        const { style: avatarStyle, color, hasGlow } = config;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        icon.layers.push({
            type: 'main',
            shape: 'circle',
            color: color || '#7c3aed',
            size: 160,
            x: 250,
            y: 250
        });

        if (hasGlow) {
            icon.layers.push({
                type: 'glow',
                color: color || '#7c3aed',
                size: 200,
                intensity: 0.3
            });
        }

        return icon;
    }

    generateSticker(icon, config, style) {
        const { style: stickerStyle, color, hasOutline } = config;
        
        icon.layers.push({
            type: 'background',
            color: 'transparent',
            style: 'none'
        });

        icon.layers.push({
            type: 'main',
            shape: 'circle',
            color: color || '#7c3aed',
            size: 180,
            x: 250,
            y: 250
        });

        if (hasOutline) {
            icon.layers.push({
                type: 'stroke',
                color: '#000000',
                width: 3,
                x: 250,
                y: 250,
                size: 180
            });
        }

        return icon;
    }

    generateIconSet(icon, config, style) {
        const { count, style: setStyle, color, size } = config;
        const total = Math.min(count || 4, 8);
        const cols = Math.ceil(Math.sqrt(total));
        const rows = Math.ceil(total / cols);
        const spacing = 350 / Math.max(cols, rows);
        const startX = 500/2 - (cols-1) * spacing / 2;
        const startY = 500/2 - (rows-1) * spacing / 2;

        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        for (let i = 0; i < total; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            icon.layers.push({
                type: 'main',
                shape: ['circle', 'square', 'triangle', 'star', 'hexagon'][i % 5],
                color: color || '#7c3aed',
                size: size || 48,
                x: startX + col * spacing,
                y: startY + row * spacing,
                opacity: 0.7 + Math.random() * 0.3
            });
        }

        return icon;
    }

    generateInfographic(icon, config, style) {
        const { type: infType, color, dataPoints } = config;
        const points = dataPoints || 5;
        
        icon.layers.push({
            type: 'background',
            color: '#0a0a0f',
            style: 'solid'
        });

        if (infType === 'chart') {
            for (let i = 0; i < points; i++) {
                const x = 50 + (i / (points - 1)) * 400;
                const height = 30 + Math.random() * 150;
                icon.layers.push({
                    type: 'bar',
                    x: x,
                    y: 400 - height,
                    width: 30,
                    height: height,
                    color: color || '#7c3aed',
                    opacity: 0.5 + (i / points) * 0.5
                });
            }
        }

        return icon;
    }

    generateFallback(config) {
        // Если категория не найдена
        return {
            layers: [
                { type: 'background', color: '#0a0a0f', style: 'solid' },
                { type: 'main', shape: 'circle', color: '#7c3aed', size: 120, x: 250, y: 250 }
            ],
            style: 'minimal',
            domain: 'unknown',
            category: 'unknown',
            config: config || {}
        };
    }

    // ===== ПРИМЕНЕНИЕ СТИЛЯ =====
    applyStyle(icon, styleData) {
        // Применяем стилистику ко всем слоям
        icon.layers = icon.layers.map(layer => {
            if (layer.type === 'background' && styleData.background) {
                layer.color = styleData.background;
            }
            if (layer.type === 'main' && styleData.colorModifier) {
                // Можно модифицировать цвет в зависимости от стиля
            }
            return layer;
        });
        return icon;
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
    }

    drawLayer(ctx, layer, width, height) {
        const cx = width / 2;
        const cy = height / 2;

        switch (layer.type) {
            case 'background':
                if (layer.style === 'gradient') {
                    const grad = ctx.createLinearGradient(0, 0, width, height);
                    grad.addColorStop(0, layer.color || '#0a0a0f');
                    grad.addColorStop(1, layer.gradientColor || '#1a1a3e');
                    ctx.fillStyle = grad;
                } else if (layer.style === 'none') {
                    return;
                } else {
                    ctx.fillStyle = layer.color || '#0a0a0f';
                }
                ctx.fillRect(0, 0, width, height);
                break;

            case 'main':
                this.drawMainShape(ctx, layer, cx, cy);
                break;

            case 'button':
                this.drawButton(ctx, layer, cx, cy);
                break;

            case 'avatar':
                this.drawAvatar(ctx, layer, cx, cy);
                break;

            case 'avatar_eyes':
                ctx.save();
                ctx.fillStyle = layer.color || '#ffffff';
                ctx.beginPath();
                ctx.arc(layer.x - 25, layer.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(layer.x + 25, layer.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;

            case 'dot':
                ctx.save();
                ctx.globalAlpha = layer.opacity || 0.8;
                ctx.fillStyle = layer.color || '#7c3aed';
                ctx.shadowColor = layer.color + '60';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(layer.x, layer.y, layer.size || 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;

            case 'star':
                this.drawStar(ctx, layer.x, layer.y, layer.points || 5, layer.size || 20, (layer.size || 20) * 0.4, layer.color);
                break;

            case 'glow':
                ctx.save();
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, layer.size || 150);
                grad.addColorStop(0, layer.color + '80');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.globalCompositeOperation = 'screen';
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
                break;

            case 'healthbar':
                ctx.save();
                ctx.fillStyle = '#333';
                ctx.fillRect(layer.x - layer.width/2, layer.y - layer.height/2, layer.width, layer.height);
                ctx.fillStyle = layer.color || '#7c3aed';
                ctx.fillRect(layer.x - layer.width/2, layer.y - layer.height/2, layer.width * (layer.value || 0.7), layer.height);
                ctx.restore();
                break;

            case 'text':
                ctx.save();
                ctx.fillStyle = layer.color || '#ffffff';
                ctx.font = `${layer.weight || 'bold'} ${layer.size || 60}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(layer.text || 'A', layer.x || 250, layer.y || 260);
                ctx.restore();
                break;

            case 'stroke':
                ctx.save();
                ctx.strokeStyle = layer.color || '#000000';
                ctx.lineWidth = layer.width || 3;
                ctx.beginPath();
                ctx.arc(layer.x || 250, layer.y || 250, (layer.size || 180) / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                break;

            case 'bar':
                ctx.save();
                ctx.globalAlpha = layer.opacity || 0.8;
                ctx.fillStyle = layer.color || '#7c3aed';
                ctx.fillRect(layer.x - layer.width/2, layer.y, layer.width, layer.height);
                ctx.restore();
                break;

            default:
                // Игнорируем неизвестные слои
                break;
        }
    }

    drawMainShape(ctx, shape, cx, cy) {
        ctx.save();
        ctx.translate(shape.x || cx, shape.y || cy);
        ctx.rotate(shape.rotation || 0);
        
        const size = shape.size || 120;
        const color = shape.color || '#7c3aed';
        
        ctx.fillStyle = color;
        ctx.shadowColor = color + '40';
        ctx.shadowBlur = 20;

        if (shape.strokeWidth) {
            ctx.strokeStyle = shape.strokeColor || '#ffffff';
            ctx.lineWidth = shape.strokeWidth;
        }

        const shapeType = shape.shape || 'circle';
        this.drawShape(ctx, shapeType, size);

        if (shape.strokeWidth) {
            ctx.stroke();
        }
        ctx.fill();
        ctx.restore();
    }

    drawShape(ctx, type, size) {
        const half = size / 2;
        switch (type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, half, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.fillRect(-half, -half, size, size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -half);
                ctx.lineTo(-half, half);
                ctx.lineTo(half, half);
                ctx.closePath();
                break;
            case 'star':
                this.drawStar(ctx, 0, 0, 5, half, half * 0.4);
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const r = half;
                    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                break;
            case 'shield':
                ctx.beginPath();
                ctx.moveTo(0, -half);
                ctx.quadraticCurveTo(half, -half, half, 0);
                ctx.quadraticCurveTo(half, half, 0, half);
                ctx.quadraticCurveTo(-half, half, -half, 0);
                ctx.quadraticCurveTo(-half, -half, 0, -half);
                ctx.closePath();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -half);
                ctx.lineTo(half, 0);
                ctx.lineTo(0, half);
                ctx.lineTo(-half, 0);
                ctx.closePath();
                break;
            case 'crest':
                ctx.beginPath();
                ctx.moveTo(0, -half);
                ctx.lineTo(half, -half * 0.6);
                ctx.lineTo(half * 0.6, half * 0.6);
                ctx.lineTo(0, half);
                ctx.lineTo(-half * 0.6, half * 0.6);
                ctx.lineTo(-half, -half * 0.6);
                ctx.closePath();
                break;
            default:
                ctx.beginPath();
                ctx.arc(0, 0, half, 0, Math.PI * 2);
        }
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
        this.drawShape(ctx, avatar.shape || 'circle', size);

        if (avatar.hasBorder) {
            ctx.strokeStyle = avatar.borderColor || '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        ctx.fill();

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = -Math.PI / 2;
        const step = Math.PI / spikes;
        ctx.save();
        ctx.fillStyle = color || '#ffd700';
        ctx.shadowColor = (color || '#ffd700') + '60';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(cx + outerRadius * Math.cos(rot), cy + outerRadius * Math.sin(rot));
        for (let i = 1; i <= spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = rot + i * step;
            ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();
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
            if (item.style === 'none') return '';
            return `<rect width="100%" height="100%" fill="${item.color || '#0a0a0f'}" />`;
        }
        if (item.type === 'main') {
            const cx = item.x || 250;
            const cy = item.y || 250;
            const r = item.size/2 || 60;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="${item.opacity || 1}" />`;
        }
        if (item.type === 'dot') {
            return `<circle cx="${item.x}" cy="${item.y}" r="${item.size}" fill="${item.color}" opacity="${item.opacity}" />`;
        }
        if (item.type === 'text') {
            return `<text x="${item.x}" y="${item.y}" fill="${item.color}" font-size="${item.size}" font-weight="${item.weight}" text-anchor="middle" dominant-baseline="middle">${item.text}</text>`;
        }
        return '';
    }
}