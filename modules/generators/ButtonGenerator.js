// =============================================================
// ГЕНЕРАТОР КНОПОК - Качественная отрисовка с текстом
// =============================================================

import { STYLES } from '../presets.js';

export class ButtonGenerator {
    constructor(shapeLibrary, colorPalette, fontLibrary) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
        this.fontLibrary = fontLibrary;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'button');
        const styleData = STYLES[style];
        const text = config.text || 'Кнопка';
        const color = config.color || palette.primary || '#7c3aed';
        const size = config.size || 120;
        const cornerRadius = config.cornerRadius || 20;
        const bgColor = config.bgColor || 'transparent';
        const glow = config.glow !== false;
        const borderWidth = config.borderWidth || 2;

        const layers = [];
        
        // Фон
        layers.push({
            type: 'background',
            style: bgColor === 'gradient' ? 'gradient' : 'solid',
            color: bgColor === 'transparent' ? 'transparent' : (bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Основная кнопка с текстом
        layers.push({
            type: 'button_main',
            color: color,
            text: text,
            size: size,
            cornerRadius: cornerRadius,
            x: 250,
            y: 250,
            textColor: '#ffffff',
            font: styleData?.font || 'Arial',
            glow: glow,
            borderWidth: borderWidth,
            borderColor: this.lightenColor(color, 20),
            shadow: true,
            style: style
        });

        // Эффекты в зависимости от стиля
        if (style === 'neon' || style === 'cyberpunk') {
            layers.push({
                type: 'glow_layer',
                color: color,
                size: size * 0.7,
                x: 250,
                y: 250
            });
        }

        if (style === 'fantasy') {
            // Декоративные элементы для фэнтези
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
                const r = size * 0.5;
                layers.push({
                    type: 'decorative_element',
                    x: 250 + Math.cos(angle) * r,
                    y: 250 + Math.sin(angle) * r,
                    size: 6,
                    color: '#ffd700',
                    shape: 'diamond'
                });
            }
        }

        if (style === 'pixel') {
            // Пиксельные уголки
            const ps = 4;
            const offset = size * 0.4;
            for (let dx of [-1, 1]) {
                for (let dy of [-1, 1]) {
                    layers.push({
                        type: 'pixel_corner',
                        x: 250 + dx * offset,
                        y: 250 + dy * offset,
                        size: ps * 3,
                        color: this.lightenColor(color, 30),
                        direction: { dx, dy }
                    });
                }
            }
        }

        if (style === 'cartoon') {
            // Блик на кнопке
            layers.push({
                type: 'highlight',
                x: 250,
                y: 230,
                width: size * 0.4,
                height: size * 0.15,
                color: 'rgba(255,255,255,0.3)',
                rotation: -0.2
            });
        }

        return {
            layers: layers,
            effects: this.getEffects(style, color),
            style: style,
            category: 'button',
            config: config
        };
    }

    getEffects(style, color) {
        const effects = [];
        if (style === 'neon' || style === 'cyberpunk') {
            effects.push({ type: 'glow', color: color, intensity: 0.4 });
        }
        if (style === 'fantasy') {
            effects.push({ type: 'glow', color: '#ffd700', intensity: 0.2 });
        }
        if (style === 'cyberpunk') {
            effects.push({ type: 'scanline', intensity: 0.05 });
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
}