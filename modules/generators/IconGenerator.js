// =============================================================
// ГЕНЕРАТОР ИКОНОК - Качественная отрисовка с деталями
// =============================================================

import { STYLES } from '../presets.js';

export class IconGenerator {
    constructor(shapeLibrary, colorPalette, fontLibrary) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
        this.fontLibrary = fontLibrary;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'icon');
        const styleData = STYLES[style];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';
        const size = config.size || 120;
        const bgColor = config.bgColor || 'transparent';
        const glow = config.glow !== false;
        const complexity = config.complexity || 5;
        const strokeWidth = config.strokeWidth || 2;

        const layers = [];

        // Фон
        layers.push({
            type: 'background',
            style: bgColor === 'gradient' ? 'gradient' : 'solid',
            color: bgColor === 'transparent' ? 'transparent' : (bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Основная форма с контуром
        layers.push({
            type: 'icon_main',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            strokeWidth: strokeWidth,
            strokeColor: this.darkenColor(color, 30),
            glow: glow,
            style: style
        });

        // Детали в зависимости от сложности и стиля
        if (complexity > 3 && style !== 'pixel') {
            // Внутренние элементы
            const innerSize = size * 0.5;
            layers.push({
                type: 'icon_inner',
                shape: this.getInnerShape(shape),
                color: this.lightenColor(color, 30),
                size: innerSize,
                x: 250,
                y: 250,
                opacity: 0.6
            });

            // Дополнительные декоративные элементы
            const count = Math.min(complexity, 8);
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const r = size * 0.5 + 10;
                layers.push({
                    type: 'decorative_dot',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 3 + (i / count) * 4,
                    color: this.lightenColor(color, 20 + i * 5),
                    opacity: 0.3 + (i / count) * 0.4
                });
            }
        }

        // Стилистические особенности
        if (style === 'pixel') {
            // Пиксельная сетка
            const ps = 4;
            const gridSize = Math.floor(size / ps);
            layers.push({
                type: 'pixel_grid',
                size: size,
                pixelSize: ps,
                gridSize: gridSize,
                color: color,
                x: 250,
                y: 250,
                complexity: complexity
            });
        }

        if (style === 'cartoon') {
            // Мультяшные глаза
            layers.push({
                type: 'cartoon_face',
                color: '#ffffff',
                pupilColor: '#2d3436',
                size: size * 0.25,
                x: 250,
                y: 250
            });
        }

        if (style === 'fantasy') {
            // Магические руны
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const r = size * 0.65;
                layers.push({
                    type: 'rune',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 8 + (i % 3) * 4,
                    color: '#ffd700',
                    opacity: 0.3 + (i / 6) * 0.3
                });
            }
        }

        if (style === 'cyberpunk') {
            // Неоновые линии
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
                const r = size * 0.5;
                layers.push({
                    type: 'neon_line',
                    x1: 250,
                    y1: 250,
                    x2: 250 + Math.cos(angle) * r,
                    y2: 250 + Math.sin(angle) * r,
                    color: '#00ffff',
                    width: 2,
                    opacity: 0.3 + i * 0.1
                });
            }
        }

        return {
            layers: layers,
            effects: this.getEffects(style, color),
            style: style,
            category: 'icon',
            config: config
        };
    }

    getInnerShape(shape) {
        const map = {
            'circle': 'circle',
            'square': 'circle',
            'hexagon': 'circle',
            'shield': 'circle',
            'diamond': 'circle',
            'star': 'circle'
        };
        return map[shape] || 'circle';
    }

    getEffects(style, color) {
        const effects = [];
        if (style === 'neon' || style === 'cyberpunk') {
            effects.push({ type: 'glow', color: color, intensity: 0.5 });
        }
        if (style === 'fantasy') {
            effects.push({ type: 'glow', color: '#ffd700', intensity: 0.2 });
            effects.push({ type: 'particles', count: 8 });
        }
        return effects;
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
}