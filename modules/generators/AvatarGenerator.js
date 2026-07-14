// =============================================================
// ГЕНЕРАТОР АВАТАРОВ - Качественные портреты
// =============================================================

import { STYLES } from '../presets.js';

export class AvatarGenerator {
    constructor(shapeLibrary, colorPalette, fontLibrary) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
        this.fontLibrary = fontLibrary;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'avatar');
        const styleData = STYLES[style];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;
        const bgColor = config.bgColor || 'transparent';
        const hairStyle = config.hairStyle || 'short';
        const expression = config.expression || 'smile';
        const eyeStyle = config.eyeStyle || 'anime';
        const accessory = config.accessory || 'none';

        const layers = [];

        // Фон
        layers.push({
            type: 'background',
            style: bgColor === 'gradient' ? 'gradient' : 'solid',
            color: bgColor === 'transparent' ? 'transparent' : (bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Основа лица
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'ellipse',
            width: size * 0.85,
            height: size * 0.95,
            shadow: true
        });

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.12,
            x: 250,
            y: 250 - size * 0.2,
            style: this.getEyebrowStyle(style)
        });

        // Глаза в зависимости от стиля
        const eyeLayers = this.createEyes(style, eyeStyle, eyeColor, size);
        layers.push(...eyeLayers);

        // Нос
        layers.push({
            type: 'nose',
            color: this.darkenColor(skinColor, 10),
            size: size * 0.06,
            x: 250,
            y: 250 + size * 0.05,
            style: this.getNoseStyle(style)
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.1,
            x: 250,
            y: 250 + size * 0.2,
            expression: expression,
            style: this.getMouthStyle(style)
        });

        // Волосы
        layers.push(this.createHair(style, hairColor, hairStyle, size));

        // Щеки (румянец) для некоторых стилей
        if (style === 'chibi' || style === 'anime' || style === 'cartoon') {
            layers.push({
                type: 'blush',
                color: '#ff6b6b',
                size: size * 0.12,
                x: 250,
                y: 250 + size * 0.08,
                opacity: style === 'chibi' ? 0.4 : 0.2
            });
        }

        // Аксессуары
        if (accessory !== 'none') {
            layers.push(this.createAccessory(accessory, style, size));
        }

        // Особенности стиля
        if (style === 'fantasy') {
            // Эльфийские уши
            layers.push({
                type: 'elven_ears',
                color: skinColor,
                size: size * 0.15,
                x: 250,
                y: 250 - size * 0.05
            });
            
            // Магический блеск в глазах
            layers.push({
                type: 'magic_sparkle',
                color: '#ffd700',
                size: size * 0.05,
                x: 250,
                y: 250 - size * 0.22,
                opacity: 0.6
            });
        }

        if (style === 'pixel') {
            // Пиксельные детали
            layers.push({
                type: 'pixel_details',
                size: size,
                pixelSize: 4,
                x: 250,
                y: 250,
                color: '#2d3436',
                opacity: 0.3
            });
        }

        if (style === 'chibi') {
            // Глаза-звездочки
            layers.push({
                type: 'chibi_sparkle',
                color: '#ffffff',
                size: size * 0.05,
                x: 250,
                y: 250 - size * 0.18
            });
        }

        return {
            layers: layers,
            effects: this.getEffects(style),
            style: style,
            category: 'avatar',
            config: config
        };
    }

    createEyes(style, eyeStyle, eyeColor, size) {
        const layers = [];
        const eyeSize = size * (style === 'chibi' ? 0.3 : style === 'anime' ? 0.2 : 0.15);
        const yOffset = size * (style === 'chibi' ? 0.08 : style === 'anime' ? 0.12 : 0.1);
        const xOffset = eyeSize * (style === 'chibi' ? 1.2 : 1.0);

        // Белки глаз
        for (let side of [-1, 1]) {
            layers.push({
                type: 'eye_white',
                x: 250 + side * xOffset,
                y: 250 - yOffset,
                width: eyeSize * 1.4,
                height: eyeSize * (style === 'chibi' ? 1.2 : 1.0),
                color: '#ffffff',
                style: style
            });
        }

        // Радужка
        for (let side of [-1, 1]) {
            layers.push({
                type: 'iris',
                x: 250 + side * xOffset,
                y: 250 - yOffset,
                size: eyeSize * 0.6,
                color: eyeColor,
                style: style
            });
        }

        // Зрачки
        for (let side of [-1, 1]) {
            layers.push({
                type: 'pupil',
                x: 250 + side * xOffset,
                y: 250 - yOffset,
                size: eyeSize * 0.3,
                color: '#2d3436'
            });
        }

        // Блики в глазах
        if (style === 'anime' || style === 'chibi') {
            for (let side of [-1, 1]) {
                layers.push({
                    type: 'eye_highlight',
                    x: 250 + side * (xOffset + eyeSize * 0.3),
                    y: 250 - yOffset - eyeSize * 0.3,
                    size: eyeSize * 0.2,
                    color: '#ffffff',
                    opacity: 0.8
                });
                layers.push({
                    type: 'eye_highlight',
                    x: 250 + side * (xOffset - eyeSize * 0.1),
                    y: 250 - yOffset + eyeSize * 0.2,
                    size: eyeSize * 0.1,
                    color: '#ffffff',
                    opacity: 0.5
                });
            }
        }

        // Ресницы для аниме
        if (style === 'anime') {
            for (let side of [-1, 1]) {
                layers.push({
                    type: 'eyelashes',
                    x: 250 + side * xOffset,
                    y: 250 - yOffset - eyeSize * 0.4,
                    size: eyeSize * 0.3,
                    color: '#2d3436',
                    side: side
                });
            }
        }

        return layers;
    }

    createHair(style, color, hairStyle, size) {
        const hairLayers = [];
        
        // Базовая прическа
        const baseHair = {
            type: 'hair_base',
            color: color,
            size: size,
            x: 250,
            y: 250 - size * 0.2,
            style: hairStyle,
            category: style
        };
        hairLayers.push(baseHair);

        // Челка
        if (hairStyle !== 'bald' && hairStyle !== 'short') {
            hairLayers.push({
                type: 'hair_bangs',
                color: this.lightenColor(color, 10),
                size: size * 0.3,
                x: 250,
                y: 250 - size * 0.35,
                style: hairStyle
            });
        }

        // Дополнительные элементы для длинных волос
        if (hairStyle === 'long' || hairStyle === 'ponytail') {
            hairLayers.push({
                type: 'hair_tail',
                color: this.lightenColor(color, 5),
                size: size * 0.4,
                x: 250 + (hairStyle === 'ponytail' ? size * 0.2 : 0),
                y: 250 + size * 0.1,
                style: hairStyle
            });
        }

        return hairLayers;
    }

    createAccessory(accessory, style, size) {
        const accessories = {
            'glasses': {
                type: 'glasses',
                color: '#2d3436',
                size: size * 0.25,
                x: 250,
                y: 250 - size * 0.05,
                style: style
            },
            'hat': {
                type: 'hat',
                color: '#2d3436',
                size: size * 0.35,
                x: 250,
                y: 250 - size * 0.4,
                style: style
            },
            'crown': {
                type: 'crown',
                color: '#ffd700',
                size: size * 0.3,
                x: 250,
                y: 250 - size * 0.42,
                style: style
            },
            'headphones': {
                type: 'headphones',
                color: '#2d3436',
                size: size * 0.3,
                x: 250,
                y: 250 - size * 0.2,
                style: style
            },
            'bow': {
                type: 'bow',
                color: '#ff6b6b',
                size: size * 0.15,
                x: 250 + size * 0.25,
                y: 250 - size * 0.3,
                style: style
            }
        };

        return accessories[accessory] || accessories['glasses'];
    }

    getEyebrowStyle(style) {
        const styles = {
            'anime': 'anime',
            'chibi': 'chibi',
            'cartoon': 'cartoon',
            'fantasy': 'arched',
            'pixel': 'simple',
            'casual': 'natural'
        };
        return styles[style] || 'natural';
    }

    getNoseStyle(style) {
        const styles = {
            'anime': 'small',
            'chibi': 'tiny',
            'cartoon': 'simple',
            'fantasy': 'delicate',
            'pixel': 'dot',
            'casual': 'natural'
        };
        return styles[style] || 'natural';
    }

    getMouthStyle(style) {
        const styles = {
            'anime': 'small',
            'chibi': 'cute',
            'cartoon': 'wide',
            'fantasy': 'delicate',
            'pixel': 'simple',
            'casual': 'natural'
        };
        return styles[style] || 'natural';
    }

    getEffects(style) {
        const effects = [];
        if (style === 'fantasy') {
            effects.push({ type: 'glow', color: '#ffd700', intensity: 0.15 });
        }
        if (style === 'anime') {
            effects.push({ type: 'glow', color: '#ff6b6b', intensity: 0.1 });
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