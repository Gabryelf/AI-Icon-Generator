// =============================================================
// ГЕНЕРАТОР ПЕРСОНАЖЕЙ - Качественные персонажи в полный рост
// =============================================================

import { STYLES } from '../presets.js';

export class CharacterGenerator {
    constructor(shapeLibrary, colorPalette, fontLibrary) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
        this.fontLibrary = fontLibrary;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'character');
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#7c3aed';
        const size = config.size || 250;
        const bgColor = config.bgColor || 'transparent';
        const hairStyle = config.hairStyle || 'short';
        const expression = config.expression || 'smile';
        const eyeStyle = config.eyeStyle || 'anime';
        const bodyType = config.bodyType || 'normal';
        const pose = config.pose || 'standing';
        const accessory = config.accessory || 'none';
        const weapon = config.weapon || 'none';

        const layers = [];

        // Фон
        layers.push({
            type: 'background',
            style: bgColor === 'gradient' ? 'gradient' : 'solid',
            color: bgColor === 'transparent' ? 'transparent' : (bgColor || 'transparent'),
            gradientColor: palette.secondary || '#1a1a3e'
        });

        // Тело
        const bodyLayers = this.createBody(style, outfitColor, skinColor, size, bodyType, pose);
        layers.push(...bodyLayers);

        // Голова
        const headLayers = this.createHead(style, skinColor, hairColor, eyeColor, size, hairStyle, expression, eyeStyle);
        layers.push(...headLayers);

        // Руки
        const armLayers = this.createArms(style, skinColor, outfitColor, size, pose);
        layers.push(...armLayers);

        // Ноги
        const legLayers = this.createLegs(style, outfitColor, size, pose);
        layers.push(...legLayers);

        // Обувь
        const shoeLayers = this.createShoes(style, outfitColor, size);
        layers.push(...shoeLayers);

        // Аксессуары
        if (accessory !== 'none') {
            layers.push(this.createAccessory(accessory, style, size));
        }

        // Оружие
        if (weapon !== 'none') {
            layers.push(this.createWeapon(weapon, style, size, pose));
        }

        // Особенности стиля
        if (style === 'fantasy') {
            // Плащ
            layers.push({
                type: 'cape',
                color: this.darkenColor(outfitColor, 20),
                size: size * 0.6,
                x: 250,
                y: 250 + size * 0.1,
                opacity: 0.8
            });
            // Магический эффект
            layers.push({
                type: 'magic_aura',
                color: '#ffd700',
                size: size * 0.8,
                x: 250,
                y: 250,
                opacity: 0.1
            });
        }

        if (style === 'chibi') {
            // Чиби-пропорции - большая голова
            layers.push({
                type: 'chibi_proportions',
                size: size,
                x: 250,
                y: 250
            });
        }

        if (style === 'pixel') {
            // Пиксельный контур
            layers.push({
                type: 'pixel_outline',
                size: size,
                pixelSize: 4,
                x: 250,
                y: 250,
                color: '#2d3436',
                opacity: 0.3
            });
        }

        return {
            layers: layers,
            effects: this.getEffects(style),
            style: style,
            category: 'character',
            config: config
        };
    }

    createBody(style, outfitColor, skinColor, size, bodyType, pose) {
        const layers = [];
        const bodyHeight = size * (style === 'chibi' ? 0.25 : 0.4);
        const bodyWidth = size * (bodyType === 'slim' ? 0.25 : bodyType === 'muscular' ? 0.4 : 0.3);
        const yOffset = size * 0.05;

        // Торс
        layers.push({
            type: 'torso',
            color: outfitColor,
            width: bodyWidth,
            height: bodyHeight,
            x: 250,
            y: 250 + yOffset,
            shape: bodyType === 'muscular' ? 'muscular' : 'normal',
            style: style
        });

        // Шея
        layers.push({
            type: 'neck',
            color: skinColor,
            size: size * 0.06,
            x: 250,
            y: 250 - size * 0.15
        });

        return layers;
    }

    createHead(style, skinColor, hairColor, eyeColor, size, hairStyle, expression, eyeStyle) {
        const layers = [];
        const headSize = style === 'chibi' ? size * 0.35 : size * 0.28;
        const yOffset = style === 'chibi' ? size * 0.3 : size * 0.2;

        // Основа головы
        layers.push({
            type: 'head_base',
            color: skinColor,
            size: headSize,
            x: 250,
            y: 250 - yOffset,
            shape: style === 'chibi' ? 'circle' : 'ellipse',
            width: headSize * (style === 'chibi' ? 1 : 0.85),
            height: headSize * (style === 'chibi' ? 1 : 0.95)
        });

        // Глаза
        const eyeLayers = this.createEyes(style, eyeStyle, eyeColor, headSize, 250, 250 - yOffset);
        layers.push(...eyeLayers);

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: headSize * 0.2,
            x: 250,
            y: 250 - yOffset - headSize * 0.15,
            style: this.getEyebrowStyle(style)
        });

        // Нос
        layers.push({
            type: 'nose',
            color: this.darkenColor(skinColor, 10),
            size: headSize * 0.08,
            x: 250,
            y: 250 - yOffset + headSize * 0.05,
            style: this.getNoseStyle(style)
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: headSize * 0.12,
            x: 250,
            y: 250 - yOffset + headSize * 0.2,
            expression: expression,
            style: this.getMouthStyle(style)
        });

        // Волосы
        const hairLayers = this.createHair(style, hairColor, hairStyle, headSize, 250, 250 - yOffset);
        layers.push(...hairLayers);

        return layers;
    }

    createEyes(style, eyeStyle, eyeColor, headSize, cx, cy) {
        const layers = [];
        const eyeSize = headSize * (style === 'chibi' ? 0.35 : style === 'anime' ? 0.25 : 0.2);
        const yOffset = headSize * (style === 'chibi' ? 0.05 : 0.1);
        const xOffset = eyeSize * (style === 'chibi' ? 1.1 : 1.0);

        // Белки
        for (let side of [-1, 1]) {
            layers.push({
                type: 'eye_white',
                x: cx + side * xOffset,
                y: cy - yOffset,
                width: eyeSize * 1.3,
                height: eyeSize * (style === 'chibi' ? 1.2 : 1.0),
                color: '#ffffff',
                style: style
            });
        }

        // Радужка
        for (let side of [-1, 1]) {
            layers.push({
                type: 'iris',
                x: cx + side * xOffset,
                y: cy - yOffset,
                size: eyeSize * 0.6,
                color: eyeColor,
                style: style
            });
        }

        // Зрачки
        for (let side of [-1, 1]) {
            layers.push({
                type: 'pupil',
                x: cx + side * xOffset,
                y: cy - yOffset,
                size: eyeSize * 0.3,
                color: '#2d3436'
            });
        }

        // Блики
        if (style === 'anime' || style === 'chibi') {
            for (let side of [-1, 1]) {
                layers.push({
                    type: 'eye_highlight',
                    x: cx + side * (xOffset + eyeSize * 0.3),
                    y: cy - yOffset - eyeSize * 0.3,
                    size: eyeSize * 0.2,
                    color: '#ffffff',
                    opacity: 0.8
                });
            }
        }

        return layers;
    }

    createHair(style, color, hairStyle, headSize, cx, cy) {
        const layers = [];
        const yOffset = headSize * 0.5;

        // Базовая прическа
        layers.push({
            type: 'hair_base',
            color: color,
            size: headSize * 0.6,
            x: cx,
            y: cy - yOffset,
            style: hairStyle,
            category: style
        });

        // Челка
        if (hairStyle !== 'bald') {
            layers.push({
                type: 'hair_bangs',
                color: this.lightenColor(color, 10),
                size: headSize * 0.4,
                x: cx,
                y: cy - yOffset * 0.7,
                style: hairStyle
            });
        }

        // Хвост или длинные волосы
        if (hairStyle === 'long' || hairStyle === 'ponytail') {
            layers.push({
                type: 'hair_tail',
                color: this.lightenColor(color, 5),
                size: headSize * 0.5,
                x: cx + (hairStyle === 'ponytail' ? headSize * 0.3 : 0),
                y: cy + headSize * 0.3,
                style: hairStyle
            });
        }

        return layers;
    }

    createArms(style, skinColor, outfitColor, size, pose) {
        const layers = [];
        const armLength = size * 0.3;
        const armWidth = size * 0.06;
        const yOffset = size * 0.05;

        // Левая рука
        layers.push({
            type: 'arm',
            color: skinColor,
            x1: 250 - size * 0.2,
            y1: 250 + yOffset,
            x2: 250 - size * (pose === 'fighting' ? 0.35 : 0.25),
            y2: 250 + size * (pose === 'fighting' ? 0.1 : 0.25),
            width: armWidth,
            style: style
        });

        // Правая рука
        layers.push({
            type: 'arm',
            color: skinColor,
            x1: 250 + size * 0.2,
            y1: 250 + yOffset,
            x2: 250 + size * (pose === 'fighting' ? 0.35 : 0.25),
            y2: 250 + size * (pose === 'fighting' ? 0.1 : 0.25),
            width: armWidth,
            style: style
        });

        return layers;
    }

    createLegs(style, outfitColor, size, pose) {
        const layers = [];
        const legLength = size * 0.3;
        const legWidth = size * 0.08;
        const yOffset = size * 0.3;

        const stance = pose === 'fighting' ? 0.2 : 0.1;

        // Левая нога
        layers.push({
            type: 'leg',
            color: outfitColor,
            x1: 250 - size * 0.08,
            y1: 250 + yOffset,
            x2: 250 - size * 0.12 + stance * size,
            y2: 250 + yOffset + legLength,
            width: legWidth,
            style: style
        });

        // Правая нога
        layers.push({
            type: 'leg',
            color: outfitColor,
            x1: 250 + size * 0.08,
            y1: 250 + yOffset,
            x2: 250 + size * 0.12 - stance * size,
            y2: 250 + yOffset + legLength,
            width: legWidth,
            style: style
        });

        return layers;
    }

    createShoes(style, outfitColor, size) {
        const layers = [];
        const yOffset = size * 0.6;

        // Левая обувь
        layers.push({
            type: 'shoe',
            color: this.darkenColor(outfitColor, 30),
            x: 250 - size * 0.12,
            y: 250 + yOffset,
            width: size * 0.1,
            height: size * 0.06,
            style: style
        });

        // Правая обувь
        layers.push({
            type: 'shoe',
            color: this.darkenColor(outfitColor, 30),
            x: 250 + size * 0.12,
            y: 250 + yOffset,
            width: size * 0.1,
            height: size * 0.06,
            style: style
        });

        return layers;
    }

    createAccessory(accessory, style, size) {
        const accessories = {
            'glasses': {
                type: 'glasses',
                color: '#2d3436',
                size: size * 0.15,
                x: 250,
                y: 250 - size * 0.12,
                style: style
            },
            'hat': {
                type: 'hat',
                color: '#2d3436',
                size: size * 0.25,
                x: 250,
                y: 250 - size * 0.35,
                style: style
            },
            'crown': {
                type: 'crown',
                color: '#ffd700',
                size: size * 0.2,
                x: 250,
                y: 250 - size * 0.35,
                style: style
            },
            'cape': {
                type: 'cape',
                color: this.darkenColor('#7c3aed', 20),
                size: size * 0.5,
                x: 250,
                y: 250 + size * 0.1,
                style: style
            },
            'backpack': {
                type: 'backpack',
                color: '#2d3436',
                size: size * 0.2,
                x: 250,
                y: 250 + size * 0.05,
                style: style
            }
        };

        return accessories[accessory] || accessories['glasses'];
    }

    createWeapon(weapon, style, size, pose) {
        const weapons = {
            'sword': {
                type: 'sword',
                color: '#c0c0c0',
                size: size * 0.3,
                x: 250 + size * 0.3,
                y: 250 - size * 0.15,
                style: style
            },
            'staff': {
                type: 'staff',
                color: '#8b7355',
                size: size * 0.4,
                x: 250 + size * 0.25,
                y: 250 - size * 0.1,
                style: style
            },
            'bow': {
                type: 'bow',
                color: '#8b7355',
                size: size * 0.3,
                x: 250 + size * 0.3,
                y: 250 - size * 0.1,
                style: style
            },
            'gun': {
                type: 'gun',
                color: '#2d3436',
                size: size * 0.15,
                x: 250 + size * 0.35,
                y: 250 - size * 0.05,
                style: style
            },
            'shield': {
                type: 'shield',
                color: '#c0c0c0',
                size: size * 0.2,
                x: 250 - size * 0.25,
                y: 250 + size * 0.05,
                style: style
            }
        };

        return weapons[weapon] || weapons['sword'];
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
            effects.push({ type: 'particles', count: 10 });
        }
        if (style === 'anime') {
            effects.push({ type: 'glow', color: '#ff6b6b', intensity: 0.1 });
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

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
}