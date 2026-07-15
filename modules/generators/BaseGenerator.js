// modules/generators/BaseGenerator.js

export class BaseGenerator {
    constructor(spriteLoader, configManager) {
        this.spriteLoader = spriteLoader;
        this.configManager = configManager;
        this.category = null;
        this.style = null;
        this.config = null;
    }

    setConfig(category, style, config) {
        this.category = category;
        this.style = style;
        this.config = config;
        return this;
    }

    async generate() {
        throw new Error('Метод generate() должен быть переопределен');
    }

    async buildLayers() {
        throw new Error('Метод buildLayers() должен быть переопределен');
    }

    async createSpriteLayer(part, x, y, scale = 1, color = null) {
        const path = this.getSpritePath(part);
        if (!path) return null;

        return {
            type: 'sprite',
            path: path,
            x: x || 250,
            y: y || 250,
            scale: scale,
            color: color || null,
            opacity: 1
        };
    }

    getSpritePath(part) {
        const parts = this.spriteLoader.getParts(this.category, this.style);
        if (!parts || !parts[part]) return null;

        const sprites = parts[part];
        if (!sprites || sprites.length === 0) return null;

        const spriteName = sprites[Math.floor(Math.random() * sprites.length)];
        return `${this.category}/${this.style}/${part}/${spriteName}.png`;
    }

    getConfigValue(key, defaultValue = null) {
        return this.config?.[key] ?? defaultValue;
    }

    getSize() {
        const size = this.getConfigValue('size', 200);
        const map = this.spriteLoader.getSpriteMap(this.category, this.style);
        const baseSize = map?.width || 200;
        return size / baseSize;
    }

    createTextLayer(text, x, y, color = '#ffffff', size = 20, font = 'Arial') {
        if (!text) return null;

        return {
            type: 'text',
            text: text,
            x: x || 250,
            y: y || 250,
            color: color,
            size: size,
            font: font,
            align: 'center'
        };
    }

    createBackgroundLayer(color) {
        if (!color || color === 'transparent') return null;

        return {
            type: 'background',
            color: color
        };
    }

    getRandomFromArray(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Методы для работы с позициями частей
    getPartPosition(part) {
        const positions = {
            // Общие позиции
            'background': { x: 250, y: 250 },
            
            // Для аватаров
            'face': { x: 250, y: 250 },
            'eyes': { x: 250, y: 235 },
            'eyebrows': { x: 250, y: 210 },
            'nose': { x: 250, y: 265 },
            'mouth': { x: 250, y: 285 },
            'hair': { x: 250, y: 185 },
            'accessories': { x: 250, y: 220 },
            'frame': { x: 250, y: 250 },
            'text': { x: 250, y: 440 },
            
            // Для персонажей
            'head': { x: 250, y: 150 },
            'body': { x: 250, y: 270 },
            'arms': { x: 250, y: 260 },
            'legs': { x: 250, y: 370 },
            'clothes': { x: 250, y: 270 },
            'weapons': { x: 350, y: 250 },
            
            // Для кнопок
            'button_sprite': { x: 250, y: 250 },
            'text': { x: 250, y: 250 },
            
            // Для иконок
            'icon_sprite': { x: 250, y: 250 }
        };

        return positions[part] || { x: 250, y: 250 };
    }

    // Проверка совместимости частей
    isPartCompatible(part, config) {
        // Проверяем, есть ли у персонажа/аватара определенные части
        const hasEars = this.hasPart('ears');
        const hasHair = this.hasPart('hair');
        const hasAccessories = this.hasPart('accessories');

        switch(part) {
            case 'earrings':
                return hasEars;
            case 'hat':
                return hasHair;
            case 'glasses':
                return true;
            default:
                return true;
        }
    }

    hasPart(part) {
        const parts = this.spriteLoader.getParts(this.category, this.style);
        return parts && parts[part] && parts[part].length > 0;
    }

    // Получение цветов для частей
    getPartColor(part) {
        const colorMap = {
            'face': this.getConfigValue('skinColor'),
            'head': this.getConfigValue('skinColor'),
            'body': this.getConfigValue('skinColor'),
            'eyes': this.getConfigValue('eyeColor'),
            'eyebrows': this.getConfigValue('hairColor'),
            'hair': this.getConfigValue('hairColor'),
            'clothes': this.getConfigValue('outfitColor'),
            'button_sprite': this.getConfigValue('color'),
            'icon_sprite': this.getConfigValue('color')
        };

        return colorMap[part] || null;
    }
}