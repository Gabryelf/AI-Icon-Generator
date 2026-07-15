// modules/AvatarGenerator.js (обновленный)

import { STYLES } from '../presets.js';

export class AvatarGenerator {
    constructor(shapeLibrary, colorPalette, fontLibrary) {
        this.shapeLibrary = shapeLibrary;
        this.colorPalette = colorPalette;
        this.fontLibrary = fontLibrary;
    }

    generate(style, config, spriteLoader) {
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

        // Основа лица (оставляем как есть — это простой овал)
        layers.push({
            type: 'face_base',
            color: skinColor,
            size: size,
            x: 250,
            y: 250,
            shape: 'ellipse',
            width: size * 0.85,
            height: size * 0.95
        });

        // ------------------ НОВЫЙ ПОДХОД: ИСПОЛЬЗУЕМ СПРАЙТЫ ------------------
        
        // 1. Глаза — загружаем из спрайтов
        const eyeConfig = this.selectEyeSprite(eyeStyle, spriteLoader);
        if (eyeConfig) {
            layers.push({
                type: 'sprite',
                spriteConfig: eyeConfig,
                x: 250,
                y: 250 - size * 0.1,
                scale: size / 200,
                tint: eyeColor // тонируем цветом глаз
            });
        }

        // 2. Брови — можно рисовать простыми линиями или тоже спрайтами
        // Для простоты оставляем как есть, но в будущем можно заменить на спрайты
        layers.push({
            type: 'eyebrows',
            color: hairColor,
            size: size * 0.12,
            x: 250,
            y: 250 - size * 0.2,
            style: this.getEyebrowStyle(style)
        });

        // 3. Рот — из спрайтов
        const mouthConfig = this.selectMouthSprite(expression, spriteLoader);
        if (mouthConfig) {
            layers.push({
                type: 'sprite',
                spriteConfig: mouthConfig,
                x: 250,
                y: 250 + size * 0.2,
                scale: size / 200
            });
        }

        // 4. Волосы — из спрайтов
        const hairConfig = this.selectHairSprite(hairStyle, spriteLoader);
        if (hairConfig) {
            layers.push({
                type: 'sprite',
                spriteConfig: hairConfig,
                x: 250,
                y: 250 - size * 0.25,
                scale: size / 200,
                color: hairColor // замена цвета
            });
        }

        // 5. Аксессуары — из спрайтов
        if (accessory !== 'none') {
            const accConfig = this.selectAccessorySprite(accessory, spriteLoader);
            if (accConfig) {
                layers.push({
                    type: 'sprite',
                    spriteConfig: accConfig,
                    x: 250,
                    y: 250 - size * 0.25,
                    scale: size / 200
                });
            }
        }

        // 6. Щеки (румянец) — из спрайтов
        if (style === 'chibi' || style === 'anime' || style === 'cartoon') {
            const blushConfig = this.selectBlushSprite(style, spriteLoader);
            if (blushConfig) {
                layers.push({
                    type: 'sprite',
                    spriteConfig: blushConfig,
                    x: 250,
                    y: 250 + size * 0.08,
                    scale: size / 200,
                    opacity: style === 'chibi' ? 0.4 : 0.2
                });
            }
        }

        // 7. Особенности стиля (эльфийские уши, магия и т.д.)
        if (style === 'fantasy') {
            const earConfig = this.selectFantasyEarSprite(spriteLoader);
            if (earConfig) {
                layers.push({
                    type: 'sprite',
                    spriteConfig: earConfig,
                    x: 250,
                    y: 250 - size * 0.05,
                    scale: size / 200,
                    color: skinColor
                });
            }
        }

        if (style === 'pixel') {
            // Пиксельные детали — можно использовать специальные спрайты
            const pixelConfig = this.selectPixelDetailSprite(spriteLoader);
            if (pixelConfig) {
                layers.push({
                    type: 'sprite',
                    spriteConfig: pixelConfig,
                    x: 250,
                    y: 250,
                    scale: size / 200,
                    opacity: 0.3
                });
            }
        }

        return {
            layers: layers,
            effects: this.getEffects(style),
            style: style,
            category: 'avatar',
            config: config,
            // Добавляем информацию о спрайтах для отладки
            spriteInfo: {
                eye: eyeConfig?.id,
                mouth: mouthConfig?.id,
                hair: hairConfig?.id,
                accessory: accessory
            }
        };
    }

    // ===== МЕТОДЫ ВЫБОРА СПРАЙТОВ =====

    selectEyeSprite(eyeStyle, spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('eyes');
        if (!configs || configs.length === 0) return null;
        
        // Фильтруем по стилю
        const filtered = configs.filter(c => c.style === eyeStyle || c.style === 'all' || !c.style);
        if (filtered.length === 0) return null;
        
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    selectMouthSprite(expression, spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('mouths');
        if (!configs || configs.length === 0) return null;
        
        const filtered = configs.filter(c => c.expression === expression || c.expression === 'all' || !c.expression);
        if (filtered.length === 0) return null;
        
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    selectHairSprite(hairStyle, spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('hairs');
        if (!configs || configs.length === 0) return null;
        
        const filtered = configs.filter(c => c.style === hairStyle || c.style === 'all' || !c.style);
        if (filtered.length === 0) return null;
        
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    selectAccessorySprite(accessory, spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('accessories');
        if (!configs || configs.length === 0) return null;
        
        const filtered = configs.filter(c => c.id === accessory || c.tags?.includes(accessory));
        if (filtered.length === 0) return null;
        
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    selectBlushSprite(style, spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('blushes');
        if (!configs || configs.length === 0) return null;
        
        const filtered = configs.filter(c => c.style === style || c.style === 'all' || !c.style);
        if (filtered.length === 0) return null;
        
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    selectFantasyEarSprite(spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('fantasy_ears');
        if (!configs || configs.length === 0) return null;
        return configs[Math.floor(Math.random() * configs.length)];
    }

    selectPixelDetailSprite(spriteLoader) {
        const configs = spriteLoader.getSpriteConfigs('pixel_details');
        if (!configs || configs.length === 0) return null;
        return configs[Math.floor(Math.random() * configs.length)];
    }

    // ===== ОСТАВШИЕСЯ МЕТОДЫ (без изменений) =====
    
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
}