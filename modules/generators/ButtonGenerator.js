// modules/generators/ButtonGenerator.js

import { BaseGenerator } from './BaseGenerator.js';

export class ButtonGenerator extends BaseGenerator {
    async generate() {
        const layers = await this.buildLayers();
        const size = this.getSize();

        return {
            layers: layers,
            width: 500,
            height: 500,
            category: this.category,
            style: this.style,
            config: this.config
        };
    }

    async buildLayers() {
        const layers = [];
        const config = this.config;
        const size = this.getSize();

        // Фон
        const bg = this.createBackgroundLayer(config.bgColor);
        if (bg) layers.push(bg);

        // Спрайт кнопки
        const buttonSprite = await this.createSpriteLayer(
            'button_sprite',
            250, 250,
            size,
            config.color || '#7c3aed'
        );
        if (buttonSprite) layers.push(buttonSprite);

        // Текст на кнопке
        if (config.text) {
            const textLayer = this.createTextLayer(
                config.text,
                250, 250 + (config.textOffset || 0),
                config.textColor || '#ffffff',
                config.textSize || 24,
                config.font || 'Arial'
            );
            if (textLayer) layers.push(textLayer);
        }

        return layers;
    }
}