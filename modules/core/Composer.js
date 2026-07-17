// ===============================================================
// КОМПОНОВЩИК ИКОНОК
// ===============================================================

import { applyAlgorithm } from '../configs/algorithm_config.js';

export class Composer {
    constructor(assetManager) {
        this.assetManager = assetManager;
        this.elements = [];
    }

    /**
     * Собрать иконку из элементов
     */
    async compose(elements, config) {
        this.elements = [];
        
        // Применяем алгоритм компоновки
        const positions = applyAlgorithm(elements, config);
        
        // Создаем слои для каждого элемента
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const pos = positions[i] || positions[0] || { 
                x: config.centerX || config.size/2, 
                y: config.centerY || config.size/2, 
                scale: 0.4 
            };
            
            const layer = await this.createElementLayer(element, pos, config);
            if (layer) {
                this.elements.push(layer);
            }
        }
        
        return this.elements;
    }

    /**
     * Создать слой для элемента
     */
    async createElementLayer(element, pos, config) {
        const { type, id, color } = element;
        const img = await this.loadAsset(type, id);
        
        if (!img) return null;
        
        // Используем центр из конфига
        const centerX = config.centerX || config.size / 2;
        const centerY = config.centerY || config.size / 2;
        const size = config.size || 200;
        const scale = (element.scale || 1.0) * (pos.scale || 0.4);
        
        const drawSize = size * scale;
        
        return {
            type: 'sprite',
            image: img,
            x: pos.x || centerX,
            y: pos.y || centerY,
            width: drawSize,
            height: drawSize,
            rotation: pos.rotation || 0,
            opacity: element.opacity || 1.0,
            zIndex: pos.zIndex || 0,
            color: color || config.primaryColor,
            blendMode: element.blendMode || 'normal'
        };
    }

    /**
     * Загрузить ассет
     */
    async loadAsset(type, id) {
        const path = this.getAssetPath(type, id);
        if (path) {
            return await this.assetManager.loadImage(path);
        }
        return null;
    }

    /**
     * Получить путь к ассету
     */
    getAssetPath(type, id) {
        const paths = {
            shape: `shapes/${id}.png`,
            texture: `textures/${id}.png`,
            sprite: `sprites/${id}.png`,
            mask: `masks/${id}.png`
        };
        return paths[type] || null;
    }

    /**
     * Применить эффекты к слою
     */
    applyEffects(layer, config) {
        const effects = [];
        
        if (config.glow) {
            effects.push({
                type: 'glow',
                color: config.accentColor,
                blur: 15
            });
        }
        
        if (config.shadow) {
            effects.push({
                type: 'shadow',
                color: 'rgba(0,0,0,0.5)',
                blur: 10,
                offsetX: 5,
                offsetY: 5
            });
        }
        
        if (config.outline) {
            effects.push({
                type: 'outline',
                color: '#ffffff',
                width: 2
            });
        }
        
        return effects;
    }

    /**
     * Получить все элементы
     */
    getElements() {
        return this.elements;
    }

    /**
     * Очистить элементы
     */
    clear() {
        this.elements = [];
    }
}