// modules/generators/IconGenerator.js

import { BaseGenerator } from './BaseGenerator.js';

export class IconGenerator extends BaseGenerator {
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

        // Спрайт иконки
        const iconSprite = await this.createSpriteLayer(
            'icon_sprite',
            250, 250,
            size,
            config.color || '#7c3aed'
        );
        if (iconSprite) layers.push(iconSprite);

        // Текст (снизу или по центру)
        if (config.text && config.textPosition !== 'none') {
            const y = config.textPosition === 'bottom' ? 440 : 250;
            const textLayer = this.createTextLayer(
                config.text,
                250, y,
                config.textColor || '#ffffff',
                config.textSize || 16,
                config.font || 'Arial'
            );
            if (textLayer) layers.push(textLayer);
        }

        return layers;
    }
}