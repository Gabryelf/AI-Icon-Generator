// =============================================================
// ГЕНЕРАТОР ПЕРСОНАЖЕЙ - Полноценные персонажи в разных стилях
// =============================================================

import { STYLES } from '../presets.js';

export class CharacterGenerator {
    constructor(shapeLibrary, colorPalette) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
    }

    generate(style, config) {
        const palette = this.colorPalette.getPalette(style, 'character');
        const styleData = STYLES[style];

        switch (style) {
            case 'fantasy':
                return this.generateFantasyCharacter(config, palette, styleData);
            case 'pixel':
                return this.generatePixelCharacter(config, palette, styleData);
            case 'chibi':
                return this.generateChibiCharacter(config, palette, styleData);
            case 'anime':
                return this.generateAnimeCharacter(config, palette, styleData);
            case 'casual':
                return this.generateCasualCharacter(config, palette, styleData);
            default:
                return this.generateDefaultCharacter(config, palette);
        }
    }

    // ===== ФЭНТЕЗИ ПЕРСОНАЖ =====
    generateFantasyCharacter(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || '#7c3aed';
        const size = config.size || 250;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Тело
        layers.push({
            type: 'body',
            color: outfitColor,
            size: size * 0.4,
            x: 250,
            y: 250 + size * 0.15,
            shape: 'torso',
            bodyType: config.bodyType || 'normal'
        });

        // Голова
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size * 0.35,
            x: 250,
            y: 250 - size * 0.25,
            shape: 'ellipse'
        });

        // Глаза
        layers.push({
            type: 'fantasy_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.07,
            x: 250,
            y: 250 - size * 0.3,
            style: 'elven'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.04,
            x: 250,
            y: 250 - size * 0.15,
            expression: config.expression || 'smile'
        });

        // Волосы
        layers.push({
            type: 'fantasy_hair',
            color: hairColor,
            size: size * 0.35,
            x: 250,
            y: 250 - size * 0.4,
            style: config.hairStyle || 'long'
        });

        // Руки
        layers.push({
            type: 'arms',
            color: skinColor,
            size: size * 0.25,
            x: 250,
            y: 250 + size * 0.05,
            pose: config.pose || 'standing'
        });

        // Ноги
        layers.push({
            type: 'legs',
            color: outfitColor,
            size: size * 0.3,
            x: 250,
            y: 250 + size * 0.35,
            pose: config.pose || 'standing'
        });

        // Плащ (для фэнтези)
        if (config.accessory === 'cape') {
            layers.push({
                type: 'cape',
                color: this.darkenColor(outfitColor, 20),
                size: size * 0.5,
                x: 250,
                y: 250 + size * 0.1
            });
        }

        // Оружие
        if (config.weapon && config.weapon !== 'none') {
            layers.push({
                type: 'weapon',
                color: '#c0c0c0',
                size: size * 0.25,
                x: 250 + size * 0.3,
                y: 250 - size * 0.1,
                weaponType: config.weapon
            });
        }

        return {
            layers: layers,
            effects: [{ type: 'glow', color: '#ffd700', intensity: 0.2 }],
            style: 'fantasy',
            category: 'character',
            config: config
        };
    }

    // ===== ПИКСЕЛЬНЫЙ ПЕРСОНАЖ =====
    generatePixelCharacter(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || '#7c3aed';
        const size = config.size || 250;
        const pixelSize = Math.max(4, Math.floor(size / 50));

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Пиксельный персонаж (спрайт)
        layers.push({
            type: 'pixel_character',
            skinColor: skinColor,
            hairColor: hairColor,
            eyeColor: eyeColor,
            outfitColor: outfitColor,
            size: size,
            pixelSize: pixelSize,
            x: 250,
            y: 250,
            expression: config.expression || 'smile',
            hairStyle: config.hairStyle || 'short',
            bodyType: config.bodyType || 'normal',
            pose: config.pose || 'standing',
            weapon: config.weapon || 'none'
        });

        return {
            layers: layers,
            effects: [],
            style: 'pixel',
            category: 'character',
            config: config
        };
    }

    // ===== ЧИБИ ПЕРСОНАЖ =====
    generateChibiCharacter(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || '#7c3aed';
        const size = config.size || 250;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Тело чиби (маленькое, круглое)
        layers.push({
            type: 'chibi_body',
            color: outfitColor,
            size: size * 0.35,
            x: 250,
            y: 250 + size * 0.2,
            shape: 'round'
        });

        // Голова чиби (большая)
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size * 0.4,
            x: 250,
            y: 250 - size * 0.2,
            shape: 'circle'
        });

        // Огромные глаза чиби
        layers.push({
            type: 'chibi_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.18,
            x: 250,
            y: 250 - size * 0.25,
            sparkle: true
        });

        // Маленький рот
        layers.push({
            type: 'mouth',
            color: '#ff6b6b',
            size: size * 0.04,
            x: 250,
            y: 250 - size * 0.1,
            expression: 'happy'
        });

        // Щечки
        layers.push({
            type: 'blush',
            color: '#ff6b6b',
            size: size * 0.08,
            x: 250,
            y: 250 - size * 0.12,
            opacity: 0.3
        });

        // Волосы чиби
        layers.push({
            type: 'chibi_hair',
            color: hairColor,
            size: size * 0.4,
            x: 250,
            y: 250 - size * 0.4,
            style: config.hairStyle || 'short'
        });

        // Маленькие ручки и ножки
        layers.push({
            type: 'chibi_limbs',
            color: skinColor,
            size: size * 0.15,
            x: 250,
            y: 250 + size * 0.3
        });

        return {
            layers: layers,
            effects: [],
            style: 'chibi',
            category: 'character',
            config: config
        };
    }

    // ===== АНИМЕ ПЕРСОНАЖ =====
    generateAnimeCharacter(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || '#7c3aed';
        const size = config.size || 250;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Тело аниме (стройное)
        layers.push({
            type: 'anime_body',
            color: outfitColor,
            size: size * 0.4,
            x: 250,
            y: 250 + size * 0.15,
            shape: 'slim',
            bodyType: config.bodyType || 'normal'
        });

        // Голова аниме
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size * 0.3,
            x: 250,
            y: 250 - size * 0.25,
            shape: 'anime_face'
        });

        // Аниме глаза (большие, выразительные)
        layers.push({
            type: 'anime_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.1,
            x: 250,
            y: 250 - size * 0.3,
            style: 'sparkle',
            highlight: true
        });

        // Брови
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.05,
            x: 250,
            y: 250 - size * 0.35,
            style: 'anime'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.04,
            x: 250,
            y: 250 - size * 0.15,
            expression: config.expression || 'smile'
        });

        // Волосы аниме
        layers.push({
            type: 'anime_hair',
            color: hairColor,
            size: size * 0.35,
            x: 250,
            y: 250 - size * 0.4,
            style: config.hairStyle || 'long',
            hasBangs: true
        });

        // Руки и ноги
        layers.push({
            type: 'anime_limbs',
            color: skinColor,
            size: size * 0.25,
            x: 250,
            y: 250 + size * 0.05,
            pose: config.pose || 'standing'
        });

        // Аксессуары
        if (config.accessory === 'glasses') {
            layers.push({
                type: 'glasses',
                color: '#2d3436',
                size: size * 0.1,
                x: 250,
                y: 250 - size * 0.28,
                style: 'anime'
            });
        }

        return {
            layers: layers,
            effects: [],
            style: 'anime',
            category: 'character',
            config: config
        };
    }

    // ===== КАЗУАЛЬНЫЙ ПЕРСОНАЖ =====
    generateCasualCharacter(config, palette, styleData) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || '#7c3aed';
        const size = config.size || 250;

        layers.push({
            type: 'background',
            style: config.bgColor === 'gradient' ? 'gradient' : 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        // Тело
        layers.push({
            type: 'casual_body',
            color: outfitColor,
            size: size * 0.4,
            x: 250,
            y: 250 + size * 0.15,
            shape: 'normal',
            bodyType: config.bodyType || 'normal'
        });

        // Голова
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size * 0.3,
            x: 250,
            y: 250 - size * 0.25,
            shape: 'ellipse'
        });

        // Естественные глаза
        layers.push({
            type: 'casual_eyes',
            color: '#ffffff',
            pupilColor: eyeColor,
            size: size * 0.07,
            x: 250,
            y: 250 - size * 0.3,
            style: 'natural'
        });

        // Рот
        layers.push({
            type: 'mouth',
            color: '#e17055',
            size: size * 0.04,
            x: 250,
            y: 250 - size * 0.15,
            expression: config.expression || 'smile'
        });

        // Волосы (повседневные)
        layers.push({
            type: 'casual_hair',
            color: hairColor,
            size: size * 0.3,
            x: 250,
            y: 250 - size * 0.4,
            style: config.hairStyle || 'short'
        });

        // Руки и ноги
        layers.push({
            type: 'casual_limbs',
            color: skinColor,
            size: size * 0.25,
            x: 250,
            y: 250 + size * 0.05,
            pose: config.pose || 'standing'
        });

        return {
            layers: layers,
            effects: [],
            style: 'casual',
            category: 'character',
            config: config
        };
    }

    generateDefaultCharacter(config, palette) {
        const layers = [];
        const skinColor = config.skinColor || '#f5d0b8';
        const size = config.size || 250;

        layers.push({
            type: 'background',
            style: 'solid',
            color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
        });

        layers.push({
            type: 'stickman',
            color: skinColor,
            size: size,
            x: 250,
            y: 250
        });

        return {
            layers: layers,
            effects: [],
            style: 'default',
            category: 'character',
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