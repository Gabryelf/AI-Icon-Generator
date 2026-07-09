// ============================================
// ГЕНЕРАТОР - Алгоритмическое создание иконок
// ============================================
import { PRESETS } from './presets.js';

export class Generator {
    constructor() {
        this.presets = PRESETS;
    }

    /**
     * Генерирует данные иконки на основе параметров
     * @param {Object} params - { theme, style, complexity, asymmetry }
     * @returns {Object} - данные для отрисовки
     */
    generate(params) {
        const themeData = this.presets.themes[params.theme] || this.presets.themes.abstract;
        const styleData = this.presets.styles[params.style] || this.presets.styles.minimalist;
        
        // Создаем композицию из фигур
        const count = Math.floor(3 + (params.complexity / 10) * 7); // от 3 до 10 фигур
        const shapes = [];
        
        for (let i = 0; i < count; i++) {
            const shape = this.createShape(themeData, styleData, params, i, count);
            shapes.push(shape);
        }

        return {
            shapes: shapes,
            background: styleData.background || '#0a0a0f',
            theme: params.theme,
            style: params.style
        };
    }

    createShape(themeData, styleData, params, index, total) {
        const types = ['circle', 'rect', 'triangle', 'star', 'path'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Размер зависит от сложности и индекса
        const sizeBase = 30 + (params.complexity * 6);
        const size = sizeBase * (0.5 + Math.random() * 0.5);
        
        // Позиция с учетом асимметрии
        const asymmetryFactor = params.asymmetry / 100;
        const x = (Math.random() - 0.3 * asymmetryFactor) * 200 + 150;
        const y = (Math.random() + 0.3 * asymmetryFactor) * 200 + 150;
        
        // Цвет из палитры темы
        const colorPalette = themeData.colors || ['#7c3aed', '#8b5cf6', '#a78bfa'];
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        
        // Угол поворота
        const rotation = Math.random() * Math.PI * 2;

        return {
            type,
            x, y,
            size,
            color,
            rotation,
            opacity: 0.6 + Math.random() * 0.4,
            blendMode: index % 2 === 0 ? 'source-over' : 'lighter'
        };
    }

    /**
     * Отрисовка иконки на canvas
     */
    drawIcon(ctx, width, height, data) {
        if (!data || !data.shapes) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // Заливка фона
        ctx.fillStyle = data.background || '#0a0a0f';
        ctx.fillRect(0, 0, width, height);

        // Рисуем фигуры
        data.shapes.forEach(shape => {
            ctx.save();
            ctx.globalAlpha = shape.opacity || 0.8;
            ctx.globalCompositeOperation = shape.blendMode || 'source-over';
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation || 0);
            
            ctx.fillStyle = shape.color || '#7c3aed';
            ctx.shadowColor = shape.color + '60';
            ctx.shadowBlur = 20;

            const s = shape.size / 2;
            
            switch (shape.type) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, s, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'rect':
                    ctx.fillRect(-s, -s, s * 2, s * 2);
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(0, -s);
                    ctx.lineTo(-s, s);
                    ctx.lineTo(s, s);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'star':
                    this.drawStar(ctx, 0, 0, 5, s, s * 0.5);
                    break;
                case 'path':
                    // Произвольная кривая
                    ctx.beginPath();
                    ctx.moveTo(-s, 0);
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const r = s * (0.5 + Math.random() * 0.5);
                        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    }
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
            ctx.restore();
        });

        // Эффект свечения (глобальный)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        grad.addColorStop(0, '#7c3aed10');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
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

    /**
     * Скачивание иконки в PNG или SVG
     */
    download(format, encodedData) {
        const data = JSON.parse(decodeURIComponent(encodedData));
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        this.drawIcon(ctx, 512, 512, data);

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `icon-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else if (format === 'svg') {
            // Упрощенный SVG экспорт (можно улучшить)
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                <rect width="512" height="512" fill="${data.background || '#0a0a0f'}" />
                ${data.shapes.map(s => {
                    const r = s.size/2;
                    let shapeEl = '';
                    switch(s.type) {
                        case 'circle': shapeEl = `<circle cx="${s.x}" cy="${s.y}" r="${r}" fill="${s.color}" opacity="${s.opacity}" />`; break;
                        case 'rect': shapeEl = `<rect x="${s.x-r}" y="${s.y-r}" width="${s.size}" height="${s.size}" fill="${s.color}" opacity="${s.opacity}" transform="rotate(${s.rotation*180/Math.PI} ${s.x} ${s.y})" />`; break;
                        default: shapeEl = `<circle cx="${s.x}" cy="${s.y}" r="${r}" fill="${s.color}" opacity="${s.opacity}" />`;
                    }
                    return shapeEl;
                }).join('')}
            </svg>`;
            const blob = new Blob([svg], {type: 'image/svg+xml'});
            const link = document.createElement('a');
            link.download = `icon-${Date.now()}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
        }
    }
}