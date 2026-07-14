// =============================================================
// ГЕНЕРАТОР АВАТАРОВ - Портреты и лица в разных стилях
// =============================================================

import { STYLES } from '../presets.js';

export class AvatarGenerator {
    constructor(shapeLibrary, colorPalette) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'avatar');
        const styleData = STYLES[style];

        switch (style) {
            case 'fantasy':
                return this.generateFantasyAvatar(config, palette, styleData);
            case 'pixel':
                return this.generatePixelAvatar(config, palette, styleData);
            case 'chibi':
                return this.generateChibiAvatar(config, palette, styleData);
            case 'anime':
                return this.generateAnimeAvatar(config, palette, styleData);
            case 'casual':
                return this.generateCasualAvatar(config, palette, styleData);
            default:
                return this.generateDefaultAvatar(config, palette);
        }
    }

    // ===== ФЭНТЕЗИ АВАТАР =====
    generateFantasyAvatar(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Основа лица (эллипс)
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'ellipse',
            width: size * 0.8,
            height: size * 0.95
        });

        // Глаза (эльфийские)
        layers.push({
            type: 'fantasy_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.2,
            x: 250,
            y: 250 - size * 0.1,
            style: 'elven'
        });

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.15,
            x: 250,
            y: 250 - size * 0.2,
            style: 'arched'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.15,
            x: 250,
            y: 250 + size * 0.2,
            expression: config.expression || 'smile'
        });

        // Волосы (эльфийские)
        layers.push({
            type: 'elven_hair',
            color: hairColor,
            size: size,
            x: 250,
            y: 250 - size * 0.2,
            style: config.hairStyle || 'long'
        });

        // Эльфийские уши
        layers.push({
            type: 'elven_ears',
            color: skinColor,
            size: size * 0.15,
            x: 250,
            y: 250 - size * 0.05
        });

        // Магические элементы
        if (config.accessory === 'crown' || config.accessory === 'tiara') {
            layers.push({
                type: 'crown',
                color: '#ffd700',
                size: size * 0.3,
                x: 250,
                y: 250 - size * 0.4,
                style: 'elven'
            });
        }

        // Магическое свечение
        if (config.glow) {
            layers.push({
                type: 'glow',
                color: '#ffd700',
                size: size * 1.5,
                intensity: 0.2
            });
        }

        return {
            layers: layers,
            effects: [{ type: 'glow', color: '#ffd700', intensity: 0.2 }],
            style: 'fantasy',
            category: 'avatar',
            config: config
        };
    }

    // ===== ПИКСЕЛЬНЫЙ АВАТАР =====
    generatePixelAvatar(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;
        const pixelSize = Math.max(4, Math.floor(size / 40));

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Пиксельное лицо (8-бит стиль)
        layers.push({
            type: 'pixel_face',
            skinColor: skinColor,
            hairColor: hairColor,
            eyeColor: eyeColor,
            size: size,
            pixelSize: pixelSize,
            x: 250,
            y: 250,
            expression: config.expression || 'smile',
            hairStyle: config.hairStyle || 'short'
        });

        // Пиксельный контур
        layers.push({
            type: 'pixel_border',
            color: '#2d3436',
            size: size + 8,
            pixelSize: pixelSize,
            x: 250,
            y: 250,
            opacity: 0.3
        });

        return {
            layers: layers,
            effects: [],
            style: 'pixel',
            category: 'avatar',
            config: config
        };
    }

    // ===== ЧИБИ АВАТАР =====
    generateChibiAvatar(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Круглая голова чиби
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'circle'
        });

        // Огромные глаза чиби
        layers.push({
            type: 'chibi_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.35,
            x: 250,
            y: 250 - size * 0.05,
            sparkle: true
        });

        // Маленький рот
        layers.push({
            type: 'mouth',
            color: '#ff6b6b',
            size: size * 0.08,
            x: 250,
            y: 250 + size * 0.25,
            expression: 'happy'
        });

        // Щечки (румянец)
        layers.push({
            type: 'blush',
            color: '#ff6b6b',
            size: size * 0.15,
            x: 250,
            y: 250 + size * 0.1,
            opacity: 0.3
        });

        // Волосы чиби
        layers.push({
            type: 'chibi_hair',
            color: hairColor,
            size: size,
            x: 250,
            y: 250 - size * 0.2,
            style: config.hairStyle || 'short'
        });

        // Аксессуары
        if (config.accessory === 'bow') {
            layers.push({
                type: 'bow',
                color: '#ff6b6b',
                size: size * 0.2,
                x: 250 + size * 0.3,
                y: 250 - size * 0.3
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'chibi',
            category: 'avatar',
            config: config
        };
    }

    // ===== АНИМЕ АВАТАР =====
    generateAnimeAvatar(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Лицо
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'anime_face',
            width: size * 0.85,
            height: size * 0.95
        });

        // Аниме глаза (большие, выразительные)
        layers.push({
            type: 'anime_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.25,
            x: 250,
            y: 250 - size * 0.1,
            style: 'sparkle',
            highlight: true
        });

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.12,
            x: 250,
            y: 250 - size * 0.2,
            style: 'anime'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.1,
            x: 250,
            y: 250 + size * 0.2,
            expression: config.expression || 'smile'
        });

        // Нос (маленький)
        layers.push({
            type: 'nose',
            color: this.darkenColor(skinColor, 10),
            size: size * 0.05,
            x: 250,
            y: 250 + size * 0.05
        });

        // Волосы аниме
        layers.push({
            type: 'anime_hair',
            color: hairColor,
            size: size,
            x: 250,
            y: 250 - size * 0.2,
            style: config.hairStyle || 'long',
            hasBangs: true
        });

        // Аксессуары
        if (config.accessory === 'glasses') {
            layers.push({
                type: 'glasses',
                color: '#2d3436',
                size: size * 0.25,
                x: 250,
                y: 250 - size * 0.05,
                style: 'anime'
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'anime',
            category: 'avatar',
            config: config
        };
    }

    // ===== КАЗУАЛЬНЫЙ АВАТАР =====
    generateCasualAvatar(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Лицо
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'ellipse',
            width: size * 0.85,
            height: size * 0.9
        });

        // Глаза (естественные)
        layers.push({
            type: 'casual_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.15,
            x: 250,
            y: 250 - size * 0.1,
            style: 'natural'
        });

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.12,
            x: 250,
            y: 250 - size * 0.18,
            style: 'natural'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.1,
            x: 250,
            y: 250 + size * 0.2,
            expression: config.expression || 'smile'
        });

        // Волосы (повседневные)
        layers.push({
            type: 'casual_hair',
            color: hairColor,
            size: size,
            x: 250,
            y: 250 - size * 0.2,
            style: config.hairStyle || 'short'
        });

        return {
            layers: layers,
            effects: [],
            style: 'casual',
            category: 'avatar',
            config: config
        };
    }

    generateDefaultAvatar(config, palette) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const size = config.size || 200;

        layers.push({
            type: 'background',
            style: 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'circle'
        });

        return {
            layers: layers,
            effects: [],
            style: 'default',
            category: 'avatar',
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