// =============================================================
// ГЕНЕРАТОР КНОПОК - Уникальные стили для каждой категории
// =============================================================

import { STYLES } from '../presets.js';

export class ButtonGenerator {
    constructor(shapeLibrary, colorPalette) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'button');
        const styleData = STYLES[style];
        
        let layers = [];
        let effects = [];

        // Базовый фон
        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Выбор уникального алгоритма для каждого стиля
        switch (style) {
            case 'pixel':
                return this.generatePixelButton(config, palette, styleData);
            case 'cartoon':
                return this.generateCartoonButton(config, palette, styleData);
            case 'cyberpunk':
                return this.generateCyberpunkButton(config, palette, styleData);
            case 'fantasy':
                return this.generateFantasyButton(config, palette, styleData);
            default:
                return this.generateDefaultButton(config, palette);
        }
    }

    // ===== ПИКСЕЛЬНАЯ КНОПКА =====
    generatePixelButton(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b6b';
        const text = config.text || 'PIXEL';

        // Пиксельный фон
        layers.push({
            type: 'background',
            style: 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || '#1a1a2e')
        });

        // Пиксельная кнопка (квадратная с пиксельными краями)
        const size = config.size || 120;
        const pixelSize = 4;
        const buttonSize = Math.floor(size / pixelSize) * pixelSize;
        
        layers.push({
            type: 'pixel_button',
            color: color,
            text: text,
            size: buttonSize,
            pixelSize: pixelSize,
            x: 250,
            y: 250,
            textColor: '#ffffff',
            font: styleData.font || 'Press Start 2P'
        });

        // Пиксельные рамки
        for (let i = 0; i < 3; i++) {
            const offset = 4 + i * 4;
            layers.push({
                type: 'pixel_border',
                color: this.lightenColor(color, 20 + i * 10),
                size: buttonSize + offset * 2,
                pixelSize: pixelSize,
                x: 250,
                y: 250,
                opacity: 0.3 - i * 0.1
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'pixel',
            category: 'button',
            config: config
        };
    }

    // ===== МУЛЬТЯШНАЯ КНОПКА =====
    generateCartoonButton(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b6b';
        const text = config.text || 'КНОПКА';

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Мультяшная кнопка с жирной обводкой
        const size = config.size || 120;
        const radius = config.cornerRadius || 20;

        layers.push({
            type: 'cartoon_button',
            color: color,
            text: text,
            size: size,
            radius: radius,
            x: 250,
            y: 250,
            borderColor: '#2d3436',
            borderWidth: 6,
            textColor: '#ffffff',
            font: styleData.font || 'Fredoka One',
            shadow: true,
            glow: config.glow
        });

        // Блик на кнопке
        layers.push({
            type: 'highlight',
            color: '#ffffff',
            x: 250,
            y: 230,
            size: size * 0.3,
            opacity: 0.3,
            shape: 'ellipse'
        });

        return {
            layers: layers,
            effects: [],
            style: 'cartoon',
            category: 'button',
            config: config
        };
    }

    // ===== КИБЕРПАНК КНОПКА =====
    generateCyberpunkButton(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff00ff';
        const text = config.text || 'CYBER';

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || '#0a0a0f')
        });

        const size = config.size || 120;

        // Неоновая кнопка с киберпанк стилем
        layers.push({
            type: 'cyber_button',
            color: color,
            text: text,
            size: size,
            x: 250,
            y: 250,
            borderColor: '#00ffff',
            borderWidth: 3,
            textColor: '#00ffff',
            font: styleData.font || 'Orbitron',
            glow: true
        });

        // Хакерские линии
        for (let i = 0; i < 3; i++) {
            layers.push({
                type: 'scanline',
                y: 220 + i * 30,
                width: size * 0.8,
                color: '#00ffff',
                opacity: 0.1 + i * 0.05
            });
        }

        // Неоновое свечение
        layers.push({
            type: 'glow',
            color: color,
            size: size * 1.5,
            intensity: 0.6
        });

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.1 }
            ],
            style: 'cyberpunk',
            category: 'button',
            config: config
        };
    }

    // ===== ФЭНТЕЗИ КНОПКА =====
    generateFantasyButton(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const text = config.text || 'МАГИЯ';

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        const size = config.size || 120;

        // Фэнтези кнопка с золотым орнаментом
        layers.push({
            type: 'fantasy_button',
            color: color,
            text: text,
            size: size,
            x: 250,
            y: 250,
            borderColor: '#ffd700',
            borderWidth: 3,
            textColor: '#ffd700',
            font: styleData.font || 'MedievalSharp',
            glow: true,
            ornament: true
        });

        // Магический орнамент
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = size * 0.5;
            layers.push({
                type: 'magic_rune',
                x: 250 + Math.cos(angle) * r,
                y: 250 + Math.sin(angle) * r,
                size: 8,
                color: '#ffd700',
                opacity: 0.3 + Math.sin(i * 1.5) * 0.2
            });
        }

        // Магическое свечение
        layers.push({
            type: 'glow',
            color: '#ffd700',
            size: size * 1.8,
            intensity: 0.3
        });

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: '#ffd700', intensity: 0.3 },
                { type: 'particles', count: 10 }
            ],
            style: 'fantasy',
            category: 'button',
            config: config
        };
    }

    generateDefaultButton(config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const text = config.text || 'Кнопка';

        layers.push({
            type: 'background',
            style: 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        layers.push({
            type: 'button',
            color: color,
            text: text,
            size: config.size || 120,
            x: 250,
            y: 250,
            radius: config.cornerRadius || 20,
            textColor: '#ffffff'
        });

        return {
            layers: layers,
            effects: [],
            style: 'default',
            category: 'button',
            config: config
        };
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