// modules/core/ConfigManager.js

export class ConfigManager {
    constructor() {
        this.configs = new Map();
        this.spriteConfigs = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Загружаем основные конфиги
            const response = await fetch('/assets/configs/main_config.json');
            if (response.ok) {
                const config = await response.json();
                this.loadConfigs(config);
            }
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить main_config.json, используем встроенные');
            this.loadDefaultConfigs();
        }

        this.isInitialized = true;
        console.log('✅ ConfigManager инициализирован');
    }

    loadConfigs(config) {
        Object.entries(config).forEach(([key, value]) => {
            this.configs.set(key, value);
        });
    }

    loadDefaultConfigs() {
        // Базовая конфигурация для каждого типа
        const defaultConfigs = {
            button: {
                parts: ['background', 'button_sprite', 'text'],
                properties: {
                    text: { type: 'string', default: 'Кнопка' },
                    color: { type: 'color', default: '#7c3aed' },
                    size: { type: 'range', min: 60, max: 250, default: 120 }
                }
            },
            icon: {
                parts: ['background', 'icon_sprite', 'text'],
                properties: {
                    color: { type: 'color', default: '#7c3aed' },
                    size: { type: 'range', min: 40, max: 200, default: 100 },
                    text: { type: 'string', default: '' }
                }
            },
            avatar: {
                parts: ['background', 'frame', 'face', 'eyes', 'eyebrows', 'nose', 'mouth', 'hair', 'accessories', 'text'],
                properties: {
                    skinColor: { type: 'color', default: '#f5d0b8' },
                    hairColor: { type: 'color', default: '#2d3436' },
                    eyeColor: { type: 'color', default: '#4d96ff' },
                    size: { type: 'range', min: 80, max: 300, default: 200 },
                    frame: { type: 'select', options: ['none', 'circle', 'square', 'hexagon'], default: 'none' },
                    text: { type: 'string', default: '' }
                }
            },
            character: {
                parts: ['background', 'body', 'head', 'eyes', 'mouth', 'hair', 'arms', 'legs', 'clothes', 'accessories', 'weapons'],
                properties: {
                    skinColor: { type: 'color', default: '#f5d0b8' },
                    hairColor: { type: 'color', default: '#2d3436' },
                    eyeColor: { type: 'color', default: '#4d96ff' },
                    outfitColor: { type: 'color', default: '#7c3aed' },
                    size: { type: 'range', min: 120, max: 400, default: 250 }
                }
            }
        };

        Object.entries(defaultConfigs).forEach(([key, value]) => {
            this.configs.set(key, value);
        });
    }

    getConfig(category) {
        return this.configs.get(category) || null;
    }

    getParts(category) {
        const config = this.getConfig(category);
        return config?.parts || [];
    }

    getProperties(category) {
        const config = this.getConfig(category);
        return config?.properties || {};
    }

    getDefaultValue(category, property) {
        const config = this.getConfig(category);
        return config?.properties?.[property]?.default || null;
    }
}