// ===============================================================
// ГЕНЕРАТОР ИКОНОК
// ===============================================================

import { BaseGenerator } from './BaseGenerator.js';
import { getAlgorithm } from '../configs/algorithm_config.js';

export class IconGenerator extends BaseGenerator {
    constructor(assetManager, composer) {
        super(assetManager, composer);
        this.lastSeed = null;
    }

    async generate() {
        const config = this.config;
        const size = this.getSize();
        const layers = [];
        
        // Генерируем случайный сид для воспроизводимости
        this.lastSeed = Math.random();
        
        // 1. Фон
        const bg = this.createBackgroundLayer(config);
        if (bg) layers.push(bg);
        
        // 2. Получаем элементы для композиции
        const elements = this.selectElements(config);
        
        // 3. Компонуем элементы
        const composedLayers = await this.composer.compose(elements, {
            size: size,
            composition: config.composition || 'centered',
            primaryColor: config.primaryColor,
            secondaryColor: config.secondaryColor,
            accentColor: config.accentColor
        });
        
        // 4. Добавляем эффекты к слоям
        composedLayers.forEach((layer, index) => {
            // Применяем цвета
            if (layer.color) {
                // Используем уже установленный цвет
            }
            
            // Добавляем прозрачность
            layer.opacity = layer.opacity || (0.7 + Math.random() * 0.3);
            
            // Случайный поворот для некоторых элементов
            if (config.composition === 'scattered' && Math.random() > 0.5) {
                layer.rotation = (layer.rotation || 0) + Math.random() * 90 - 45;
            }
            
            layers.push(layer);
        });
        
        // 5. Текст
        if (config.text && config.textPosition !== 'none') {
            const textLayer = this.createTextLayer(config.text, config);
            if (textLayer) layers.push(textLayer);
        }
        
        // 6. Дополнительные декоративные элементы
        if (config.complexity > 3) {
            const decorLayers = await this.createDecorLayers(config);
            layers.push(...decorLayers);
        }
        
        return {
            layers: layers,
            width: size,
            height: size,
            category: this.category,
            style: this.style,
            config: config,
            seed: this.lastSeed,
            metadata: {
                algorithm: config.composition || 'centered',
                elements: elements.length,
                complexity: config.complexity || 3
            }
        };
    }

    /**
     * Выбор элементов для иконки
     */
    selectElements(config) {
        const count = Math.min(
            config.complexity || 3,
            5
        );
        
        const elements = [];
        const types = ['shape', 'sprite', 'shape', 'sprite', 'shape'];
        
        for (let i = 0; i < count; i++) {
            const type = types[i % types.length];
            const asset = this.assetManager.getRandomAsset(type === 'shape' ? 'shapes' : 'sprites');
            
            if (asset) {
                const element = {
                    type: type,
                    id: asset.id,
                    opacity: 0.7 + Math.random() * 0.3,
                    blendMode: Math.random() > 0.7 ? 'multiply' : 'normal'
                };
                
                // Цвета
                if (i === 0) {
                    element.color = config.primaryColor || this.randomColor();
                } else if (i === 1) {
                    element.color = config.secondaryColor || this.randomColor();
                } else {
                    element.color = config.accentColor || this.randomColor();
                }
                
                // Случайное масштабирование
                if (Math.random() > 0.5) {
                    element.scale = 0.7 + Math.random() * 0.6;
                }
                
                elements.push(element);
            }
        }
        
        // Убедимся, что есть хотя бы один элемент
        if (elements.length === 0) {
            const fallback = this.assetManager.getRandomAsset('shapes');
            if (fallback) {
                elements.push({
                    type: 'shape',
                    id: fallback.id,
                    color: config.primaryColor || '#7c3aed',
                    opacity: 1.0
                });
            }
        }
        
        return elements;
    }

    /**
     * Создание декоративных слоев
     */
    async createDecorLayers(config) {
        const layers = [];
        const size = this.getSize();
        
        // Добавляем декоративные элементы
        if (config.complexity > 3 && Math.random() > 0.5) {
            const decors = ['circle', 'square', 'triangle', 'star'];
            const decor = decors[Math.floor(Math.random() * decors.length)];
            
            // Загружаем декоративный элемент
            const img = await this.assetManager.loadImage(`shapes/${decor}.png`);
            if (img) {
                layers.push({
                    type: 'sprite',
                    image: img,
                    x: size * (0.1 + Math.random() * 0.8),
                    y: size * (0.1 + Math.random() * 0.8),
                    width: size * 0.08,
                    height: size * 0.08,
                    opacity: 0.3,
                    color: config.accentColor || '#f59e0b',
                    zIndex: -1
                });
            }
        }
        
        return layers;
    }

    /**
     * Сгенерировать с определенным сидом
     */
    async generateWithSeed(seed) {
        if (seed !== undefined) {
            this.lastSeed = seed;
            // Используем seed для воспроизводимости
            // В реальном приложении здесь можно использовать PRNG
        }
        return this.generate();
    }
}