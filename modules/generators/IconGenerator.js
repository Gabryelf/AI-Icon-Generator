// =============================================================
// ГЕНЕРАТОР ИКОНОК - Уникальные стили для каждой категории
// =============================================================

import { STYLES } from '../presets.js';

export class IconGenerator {
    constructor(shapeLibrary, colorPalette) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'icon');
        const styleData = STYLES[style];

        switch (style) {
            case 'pixel':
                return this.generatePixelIcon(config, palette, styleData);
            case 'cartoon':
                return this.generateCartoonIcon(config, palette, styleData);
            case 'cyberpunk':
                return this.generateCyberpunkIcon(config, palette, styleData);
            case 'fantasy':
                return this.generateFantasyIcon(config, palette, styleData);
            default:
                return this.generateDefaultIcon(config, palette);
        }
    }

    // ===== ПИКСЕЛЬНАЯ ИКОНКА =====
    generatePixelIcon(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b6b';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Пиксельная иконка (8-бит стиль)
        const pixelSize = 4;
        const gridSize = Math.floor(size / pixelSize);
        
        layers.push({
            type: 'pixel_icon',
            shape: shape,
            color: color,
            size: size,
            pixelSize: pixelSize,
            gridSize: gridSize,
            x: 250,
            y: 250,
            complexity: config.complexity || 5
        });

        // Пиксельный контур
        layers.push({
            type: 'pixel_border',
            color: this.darkenColor(color, 30),
            size: size + 8,
            pixelSize: pixelSize,
            x: 250,
            y: 250,
            opacity: 0.5
        });

        return {
            layers: layers,
            effects: [],
            style: 'pixel',
            category: 'icon',
            config: config
        };
    }

    // ===== МУЛЬТЯШНАЯ ИКОНКА =====
    generateCartoonIcon(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff6b6b';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Мультяшная иконка с жирной обводкой
        layers.push({
            type: 'cartoon_icon',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            borderColor: '#2d3436',
            borderWidth: 6,
            glow: config.glow
        });

        // Мультяшные детали (глаза для персонажей)
        if (config.complexity > 3) {
            layers.push({
                type: 'cartoon_eyes',
                color: '#ffffff',
                pupilColor: '#2d3436',
                size: size * 0.3,
                x: 250,
                y: 250 - size * 0.1
            });
            layers.push({
                type: 'cartoon_mouth',
                color: '#2d3436',
                size: size * 0.2,
                x: 250,
                y: 250 + size * 0.2,
                expression: 'smile'
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'cartoon',
            category: 'icon',
            config: config
        };
    }

    // ===== КИБЕРПАНК ИКОНКА =====
    generateCyberpunkIcon(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#ff00ff';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || '#0a0a0f')
        });

        // Киберпанк иконка с неоновым эффектом
        layers.push({
            type: 'cyber_icon',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            borderColor: '#00ffff',
            borderWidth: 3,
            glow: true
        });

        // Хакерские элементы
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = size * 0.5 + 10;
            layers.push({
                type: 'cyber_dot',
                x: 250 + Math.cos(angle) * r,
                y: 250 + Math.sin(angle) * r,
                size: 4,
                color: '#00ffff',
                opacity: 0.3 + Math.sin(i * 1.5) * 0.2
            });
        }

        // Неоновое свечение
        layers.push({
            type: 'glow',
            color: color,
            size: size * 1.8,
            intensity: 0.6
        });

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.1 }
            ],
            style: 'cyberpunk',
            category: 'icon',
            config: config
        };
    }

    // ===== ФЭНТЕЗИ ИКОНКА =====
    generateFantasyIcon(config, palette, styleData) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Фэнтези иконка с магическими элементами
        layers.push({
            type: 'fantasy_icon',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250,
            borderColor: '#ffd700',
            borderWidth: 3,
            glow: config.glow
        });

        // Магические руны вокруг
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const r = size * 0.6;
            layers.push({
                type: 'magic_rune',
                x: 250 + Math.cos(angle) * r,
                y: 250 + Math.sin(angle) * r,
                size: 12,
                color: '#ffd700',
                opacity: 0.3 + Math.sin(i * 1.2) * 0.2
            });
        }

        // Магическое свечение
        layers.push({
            type: 'glow',
            color: '#ffd700',
            size: size * 2,
            intensity: 0.3
        });

        return {
            layers: layers,
            effects: [
                { type: 'glow', color: '#ffd700', intensity: 0.3 },
                { type: 'particles', count: 8 }
            ],
            style: 'fantasy',
            category: 'icon',
            config: config
        };
    }

    generateDefaultIcon(config, palette) {
        const layers = [];
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        layers.push({
            type: 'main',
            shape: shape,
            color: color,
            size: size,
            x: 250,
            y: 250
        });

        return {
            layers: layers,
            effects: [],
            style: 'default',
            category: 'icon',
            config: config
        };
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