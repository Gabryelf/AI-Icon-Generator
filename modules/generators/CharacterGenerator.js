// modules/generators/CharacterGenerator.js

import { BaseGenerator } from './BaseGenerator.js';

export class CharacterGenerator extends BaseGenerator {
    constructor(spriteLoader, configManager) {
        super(spriteLoader, configManager);
        
        this.parameters = {
            // Позы персонажа
            pose: ['standing', 'fighting', 'magic', 'relaxed', 'running'],
            // Направление взгляда
            lookDirection: ['forward', 'left', 'right'],
            // Пропорции
            bodyProportions: { min: 0.8, max: 1.2, default: 1.0 },
            headSize: { min: 0.8, max: 1.2, default: 1.0 }
        };
    }

    async generate() {
        const layers = await this.buildLayers();
        const size = this.getSize();
        const params = this.generateParameters();

        return {
            layers: layers,
            width: 500,
            height: 500,
            category: this.category,
            style: this.style,
            config: this.config,
            params: params
        };
    }

    generateParameters() {
        const params = {};
        
        Object.entries(this.parameters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                const configValue = this.config?.[key];
                if (configValue && value.includes(configValue)) {
                    params[key] = configValue;
                } else {
                    params[key] = value[Math.floor(Math.random() * value.length)];
                }
            } else if (value.min !== undefined && value.max !== undefined) {
                params[key] = value.min + Math.random() * (value.max - value.min);
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
        const pose = params.pose || 'standing';

        // 1. Фон
        const bg = this.createBackgroundLayer(config.bgColor);
        if (bg) layers.push(bg);

        // 2. Тело (основа)
        const bodySprite = await this.createSpriteLayer(
            'body',
            250, 270,
            size * 0.6 * (params.bodyProportions || 1.0),
            config.skinColor || '#f5d0b8'
        );
        if (bodySprite) layers.push(bodySprite);

        // 3. Одежда (поверх тела)
        const clothesSprite = await this.createSpriteLayer(
            'clothes',
            250, 270,
            size * 0.6,
            config.outfitColor || '#7c3aed'
        );
        if (clothesSprite) layers.push(clothesSprite);

        // 4. Голова
        const headSize = params.headSize || 1.0;
        const headSprite = await this.createSpriteLayer(
            'head',
            250, 155,
            size * 0.25 * headSize,
            config.skinColor || '#f5d0b8'
        );
        if (headSprite) layers.push(headSprite);

        // 5. Волосы
        const hairSprite = await this.createSpriteLayer(
            'hair',
            250, 130,
            size * 0.28,
            config.hairColor || '#2d3436'
        );
        if (hairSprite) layers.push(hairSprite);

        // 6. Глаза
        const lookDir = params.lookDirection || 'forward';
        let eyeOffsetX = 0;
        switch(lookDir) {
            case 'left': eyeOffsetX = -8; break;
            case 'right': eyeOffsetX = 8; break;
            default: break;
        }

        const eyeX = 250 + eyeOffsetX;
        const eyeY = 150;

        // Левый глаз
        const leftEye = await this.createSpriteLayer(
            'eyes',
            eyeX - 20,
            eyeY,
            size * 0.06,
            config.eyeColor || '#4d96ff'
        );
        if (leftEye) layers.push(leftEye);

        // Правый глаз
        const rightEye = await this.createSpriteLayer(
            'eyes',
            eyeX + 20,
            eyeY,
            size * 0.06,
            config.eyeColor || '#4d96ff'
        );
        if (rightEye) layers.push(rightEye);

        // 7. Рот
        const mouthSprite = await this.createSpriteLayer(
            'mouth',
            250, 170,
            size * 0.05,
            config.mouthColor || '#e17055'
        );
        if (mouthSprite) layers.push(mouthSprite);

        // 8. Руки (с учетом позы)
        let armY = 260;
        let armOffsetX = 0;
        switch(pose) {
            case 'fighting': armY = 230; armOffsetX = 30; break;
            case 'magic': armY = 220; armOffsetX = 20; break;
            case 'relaxed': armY = 280; armOffsetX = 10; break;
            case 'running': armY = 240; armOffsetX = 40; break;
            default: break;
        }

        const armSprite = await this.createSpriteLayer(
            'arms',
            250 + armOffsetX,
            armY,
            size * 0.25,
            config.skinColor || '#f5d0b8'
        );
        if (armSprite) layers.push(armSprite);

        // 9. Ноги (с учетом позы)
        let legOffset = 0;
        switch(pose) {
            case 'fighting': legOffset = 15; break;
            case 'running': legOffset = 25; break;
            default: break;
        }

        const legSprite = await this.createSpriteLayer(
            'legs',
            250 + legOffset,
            370,
            size * 0.3,
            config.outfitColor || '#2d3436'
        );
        if (legSprite) layers.push(legSprite);

        // 10. Аксессуары (проверка совместимости)
        if (config.accessory && config.accessory !== 'none') {
            const hasHead = this.hasPart('head');
            const hasBody = this.hasPart('body');
            
            // Проверяем совместимость аксессуара
            if (this.isAccessoryCompatible(config.accessory, hasHead, hasBody)) {
                const accSprite = await this.createSpriteLayer(
                    'accessories',
                    250, 200,
                    size * 0.12,
                    config.accessoryColor || null
                );
                if (accSprite) layers.push(accSprite);
            }
        }

        // 11. Оружие (если выбрано и совместимо с позой)
        if (config.weapon && config.weapon !== 'none') {
            const hasArms = this.hasPart('arms');
            if (hasArms) {
                const weaponSprite = await this.createSpriteLayer(
                    'weapons',
                    350 + (pose === 'fighting' ? 20 : 0),
                    250 + (pose === 'fighting' ? -30 : 0),
                    size * 0.2,
                    config.weaponColor || null
                );
                if (weaponSprite) layers.push(weaponSprite);
            }
        }

        return layers;
    }

    isAccessoryCompatible(accessory, hasHead, hasBody) {
        // Проверяем совместимость аксессуаров
        const headAccessories = ['hat', 'crown', 'headphones', 'glasses'];
        const bodyAccessories = ['cape', 'backpack', 'belt'];
        const earAccessories = ['earrings'];

        if (headAccessories.includes(accessory) && !hasHead) return false;
        if (bodyAccessories.includes(accessory) && !hasBody) return false;
        if (earAccessories.includes(accessory)) {
            // Проверяем наличие ушей
            return this.hasPart('ears');
        }

        return true;
    }
}