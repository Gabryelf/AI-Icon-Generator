// modules/generators/AvatarGenerator.js

import { BaseGenerator } from './BaseGenerator.js';

export class AvatarGenerator extends BaseGenerator {
    constructor(spriteLoader, configManager) {
        super(spriteLoader, configManager);
        
        // Параметры для генерации
        this.parameters = {
            // Позиции частей лица
            eyeSpacing: { min: 0.7, max: 1.3, default: 1.0 },
            eyeSize: { min: 0.7, max: 1.3, default: 1.0 },
            eyeHeight: { min: -15, max: 15, default: 0 },
            eyebrowHeight: { min: -10, max: 10, default: 0 },
            noseSize: { min: 0.5, max: 1.5, default: 1.0 },
            mouthSize: { min: 0.5, max: 1.5, default: 1.0 },
            mouthHeight: { min: -10, max: 10, default: 0 },
            headTilt: { min: -10, max: 10, default: 0 },
            // Направление взгляда
            lookDirection: ['forward', 'left', 'right', 'up', 'down']
        };
    }

    async generate() {
        const layers = await this.buildLayers();
        const size = this.getSize();

        // Генерируем уникальные параметры для этого аватара
        const params = this.generateParameters();

        return {
            layers: layers,
            width: 500,
            height: 500,
            category: this.category,
            style: this.style,
            config: this.config,
            params: params,
            metadata: {
                eyeSpacing: params.eyeSpacing,
                lookDirection: params.lookDirection,
                expression: this.config.expression || 'neutral'
            }
        };
    }

    generateParameters() {
        const params = {};
        
        // Генерируем случайные значения для каждого параметра
        Object.entries(this.parameters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Для массивов (например, lookDirection)
                params[key] = value[Math.floor(Math.random() * value.length)];
            } else if (value.min !== undefined && value.max !== undefined) {
                // Для диапазонов
                const configValue = this.config?.[key];
                if (configValue !== undefined) {
                    params[key] = configValue;
                } else {
                    params[key] = value.min + Math.random() * (value.max - value.min);
                }
            } else {
                params[key] = this.config?.[key] || value.default;
            }
        });

        return params;
    }

    async buildLayers() {
        const layers = [];
        const config = this.config;
        const size = this.getSize();
        const params = this.generateParameters();

        // 1. Фон
        const bg = this.createBackgroundLayer(config.bgColor);
        if (bg) layers.push(bg);

        // 2. Рамка (если выбрана)
        if (config.frame && config.frame !== 'none') {
            const frameSprite = await this.createSpriteLayer(
                'frame',
                250, 250,
                size * 1.05,
                config.frameColor || null
            );
            if (frameSprite) layers.push(frameSprite);
        }

        // 3. Лицо (основа)
        const faceSprite = await this.createSpriteLayer(
            'face',
            250 + (params.headTilt || 0),
            250,
            size,
            config.skinColor || '#f5d0b8'
        );
        if (faceSprite) layers.push(faceSprite);

        // 4. Глаза (с учетом расстояния и размера)
        const eyeSpacing = params.eyeSpacing || 1.0;
        const eyeSize = params.eyeSize || 1.0;
        const eyeHeight = params.eyeHeight || 0;
        const lookDir = params.lookDirection || 'forward';

        // Определяем смещение глаз в зависимости от направления взгляда
        let eyeOffsetX = 0;
        let eyeOffsetY = 0;
        switch(lookDir) {
            case 'left': eyeOffsetX = -8; break;
            case 'right': eyeOffsetX = 8; break;
            case 'up': eyeOffsetY = -8; break;
            case 'down': eyeOffsetY = 8; break;
            default: break;
        }

        const eyeX = 250 + eyeOffsetX;
        const eyeY = 240 + eyeHeight + eyeOffsetY;

        // Левый глаз
        const leftEye = await this.createSpriteLayer(
            'eyes',
            eyeX - (30 * eyeSpacing),
            eyeY,
            size * 0.15 * eyeSize,
            config.eyeColor || '#4d96ff'
        );
        if (leftEye) layers.push(leftEye);

        // Правый глаз
        const rightEye = await this.createSpriteLayer(
            'eyes',
            eyeX + (30 * eyeSpacing),
            eyeY,
            size * 0.15 * eyeSize,
            config.eyeColor || '#4d96ff'
        );
        if (rightEye) layers.push(rightEye);

        // 5. Брови (с учетом высоты)
        const browY = 215 + (params.eyebrowHeight || 0);
        const browSprite = await this.createSpriteLayer(
            'eyebrows',
            250, browY,
            size * 0.1,
            config.hairColor || '#2d3436'
        );
        if (browSprite) layers.push(browSprite);

        // 6. Нос (с учетом размера)
        const noseSize = params.noseSize || 1.0;
        const noseSprite = await this.createSpriteLayer(
            'nose',
            250, 265,
            size * 0.08 * noseSize,
            this.darkenColor(config.skinColor || '#f5d0b8', 10)
        );
        if (noseSprite) layers.push(noseSprite);

        // 7. Рот (с учетом размера и высоты)
        const mouthSize = params.mouthSize || 1.0;
        const mouthHeight = params.mouthHeight || 0;
        const mouthY = 285 + mouthHeight;
        const mouthSprite = await this.createSpriteLayer(
            'mouth',
            250, mouthY,
            size * 0.12 * mouthSize,
            config.mouthColor || '#e17055'
        );
        if (mouthSprite) layers.push(mouthSprite);

        // 8. Волосы
        const hairSprite = await this.createSpriteLayer(
            'hair',
            250, 185,
            size,
            config.hairColor || '#2d3436'
        );
        if (hairSprite) layers.push(hairSprite);

        // 9. Аксессуары (проверяем совместимость)
        if (config.accessory && config.accessory !== 'none') {
            // Проверяем, есть ли у персонажа уши для сережек
            const hasEars = this.hasPart('ears');
            const accessoryType = config.accessory;
            
            // Если серьги, но ушей нет - пропускаем
            if (accessoryType === 'earrings' && !hasEars) {
                // Пропускаем
            } else {
                const accSprite = await this.createSpriteLayer(
                    'accessories',
                    250, 220,
                    size * 0.12,
                    config.accessoryColor || null
                );
                if (accSprite) layers.push(accSprite);
            }
        }

        // 10. Текст подписи
        if (config.text && config.textPosition !== 'none') {
            const textY = config.textPosition === 'bottom' ? 440 : 210;
            const textLayer = this.createTextLayer(
                config.text,
                250, textY,
                config.textColor || '#ffffff',
                config.textSize || 18,
                config.font || 'Arial'
            );
            if (textLayer) layers.push(textLayer);
        }

        return layers;
    }

    darkenColor(hex, percent) {
        if (!hex || hex === 'transparent') return '#f5d0b8';
        try {
            const num = parseInt(hex.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.max(0, (num >> 16) - amt);
            const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
            const B = Math.max(0, (num & 0x0000FF) - amt);
            return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
        } catch (e) {
            return '#f5d0b8';
        }
    }
}