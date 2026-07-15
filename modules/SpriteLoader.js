// modules/SpriteLoader.js

export class SpriteLoader {
    constructor() {
        this.cache = new Map();
        this.basePath = '/assets/sprites/';
        this.spriteConfigs = new Map();
        this.isInitialized = false;
    }

    /**
     * Инициализация загрузчика: загрузка конфигураций спрайтов
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Загружаем главный конфиг спрайтов
            const response = await fetch(`${this.basePath}sprites.json`);
            if (!response.ok) throw new Error('Sprite config not found');
            
            const config = await response.json();
            
            // Сохраняем конфиги по категориям
            Object.entries(config).forEach(([category, items]) => {
                this.spriteConfigs.set(category, items);
            });
            
            this.isInitialized = true;
            console.log('✅ SpriteLoader инициализирован');
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить sprites.json, используем встроенные конфиги');
            this.loadDefaultConfigs();
            this.isInitialized = true;
        }
    }

    /**
     * Загрузка дефолтных конфигов (если JSON недоступен)
     */
    loadDefaultConfigs() {
        // Здесь будут дефолтные спрайты на случай, если JSON не загрузился
        const defaultConfig = {
            eyes: [
                { id: 'anime_eye_1', file: 'eyes/anime_1.png', width: 40, height: 30 },
                { id: 'anime_eye_2', file: 'eyes/anime_2.png', width: 40, height: 30 },
                { id: 'cartoon_eye', file: 'eyes/cartoon_eye.png', width: 30, height: 30 },
                { id: 'pixel_eye', file: 'eyes/pixel_eye.png', width: 16, height: 16 }
            ],
            hairs: [
                { id: 'short_hair_1', file: 'hairs/short_1.png', width: 80, height: 40 },
                { id: 'long_hair_1', file: 'hairs/long_1.png', width: 80, height: 60 },
                { id: 'ponytail', file: 'hairs/ponytail.png', width: 80, height: 50 }
            ],
            mouths: [
                { id: 'smile_1', file: 'mouths/smile.png', width: 20, height: 10 },
                { id: 'happy_1', file: 'mouths/happy.png', width: 20, height: 12 }
            ],
            buttons: [
                { id: 'btn_rounded', file: 'buttons/rounded.png', width: 120, height: 40 },
                { id: 'btn_square', file: 'buttons/square.png', width: 100, height: 40 }
            ],
            icons: [
                { id: 'star_icon', file: 'icons/star.png', width: 60, height: 60 },
                { id: 'heart_icon', file: 'icons/heart.png', width: 60, height: 60 }
            ],
            accessories: [
                { id: 'glasses', file: 'accessories/glasses.png', width: 60, height: 20 },
                { id: 'crown', file: 'accessories/crown.png', width: 40, height: 30 }
            ],
            weapons: [
                { id: 'sword', file: 'weapons/sword.png', width: 30, height: 60 },
                { id: 'staff', file: 'weapons/staff.png', width: 20, height: 60 }
            ]
        };
        
        Object.entries(defaultConfig).forEach(([category, items]) => {
            this.spriteConfigs.set(category, items);
        });
    }

    /**
     * Получение конфигурации спрайтов по категории
     */
    getSpriteConfigs(category) {
        return this.spriteConfigs.get(category) || [];
    }

    /**
     * Получение случайного спрайта из категории
     */
    getRandomSprite(category, filter = null) {
        const configs = this.getSpriteConfigs(category);
        if (!configs || configs.length === 0) return null;
        
        let filtered = configs;
        if (filter) {
            filtered = configs.filter(item => {
                if (typeof filter === 'function') return filter(item);
                return item.id === filter || item.tags?.includes(filter);
            });
        }
        
        if (filtered.length === 0) return null;
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    /**
     * Загрузка изображения спрайта
     */
    async loadSprite(spriteConfig) {
        const cacheKey = spriteConfig.file;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const img = new Image();
            img.src = `${this.basePath}${spriteConfig.file}`;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            this.cache.set(cacheKey, img);
            return img;
        } catch (error) {
            console.warn(`⚠️ Не удалось загрузить спрайт: ${spriteConfig.file}`);
            // Возвращаем заглушку (цветной прямоугольник)
            return this.createFallbackSprite(spriteConfig);
        }
    }

    /**
     * Создание спрайта-заглушки
     */
    createFallbackSprite(config) {
        const canvas = document.createElement('canvas');
        canvas.width = config.width || 50;
        canvas.height = config.height || 50;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🖼️', canvas.width/2, canvas.height/2);
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    /**
     * Загрузка всех спрайтов для категории
     */
    async loadCategorySprites(category) {
        const configs = this.getSpriteConfigs(category);
        const results = [];
        
        for (const config of configs) {
            const img = await this.loadSprite(config);
            results.push({ config, img });
        }
        
        return results;
    }

    /**
     * Очистка кэша
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Получение размера спрайта
     */
    getSpriteSize(spriteConfig) {
        return {
            width: spriteConfig.width || 50,
            height: spriteConfig.height || 50
        };
    }

    /**
     * Добавление кастомного спрайта в конфиг
     */
    addSpriteConfig(category, config) {
        if (!this.spriteConfigs.has(category)) {
            this.spriteConfigs.set(category, []);
        }
        this.spriteConfigs.get(category).push(config);
    }
}