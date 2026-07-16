// ===============================================================
// УПРАВЛЕНИЕ АССЕТАМИ
// ===============================================================

export class AssetManager {
    constructor() {
        this.assets = {
            shapes: [],
            textures: [],
            sprites: [],
            masks: []
        };
        this.cache = new Map();
        this.isInitialized = false;
        this.basePath = '/assets/';
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // Пытаемся загрузить манифест
            const response = await fetch(`${this.basePath}manifest.json`);
            if (response.ok) {
                const manifest = await response.json();
                this.loadManifest(manifest);
            } else {
                // Если нет manifest, сканируем папки
                await this.scanAssets();
            }
            
            this.isInitialized = true;
            console.log('✅ AssetManager инициализирован');
            console.log(`📦 Загружено ассетов: ${this.getTotalAssets()}`);
        } catch (error) {
            console.warn('⚠️ Ошибка загрузки ассетов, используем встроенные');
            this.loadDefaultAssets();
            this.isInitialized = true;
        }
    }

    loadManifest(manifest) {
        Object.keys(this.assets).forEach(category => {
            if (manifest[category]) {
                this.assets[category] = manifest[category];
            }
        });
    }

    async scanAssets() {
        // В реальном приложении здесь был бы запрос к API для сканирования папок
        // Пока используем дефолтные ассеты
        this.loadDefaultAssets();
    }

    loadDefaultAssets() {
        // Базовые ассеты для тестирования
        this.assets = {
            shapes: [
                { id: 'circle', name: 'Круг', path: 'shapes/circle.png' },
                { id: 'square', name: 'Квадрат', path: 'shapes/square.png' },
                { id: 'triangle', name: 'Треугольник', path: 'shapes/triangle.png' },
                { id: 'star', name: 'Звезда', path: 'shapes/star.png' },
                { id: 'hexagon', name: 'Шестиугольник', path: 'shapes/hexagon.png' },
                { id: 'diamond', name: 'Ромб', path: 'shapes/diamond.png' },
                { id: 'arrow', name: 'Стрелка', path: 'shapes/arrow.png' },
                { id: 'cross', name: 'Крест', path: 'shapes/cross.png' },
                { id: 'heart', name: 'Сердце', path: 'shapes/heart.png' },
                { id: 'moon', name: 'Полумесяц', path: 'shapes/moon.png' }
            ],
            textures: [
                { id: 'metal', name: 'Металл', path: 'textures/metal.png' },
                { id: 'wood', name: 'Дерево', path: 'textures/wood.png' },
                { id: 'stone', name: 'Камень', path: 'textures/stone.png' },
                { id: 'fabric', name: 'Ткань', path: 'textures/fabric.png' }
            ],
            sprites: [
                { id: 'sprite_1', name: 'Спрайт 1', path: 'sprites/sprite_1.png' },
                { id: 'sprite_2', name: 'Спрайт 2', path: 'sprites/sprite_2.png' },
                { id: 'sprite_3', name: 'Спрайт 3', path: 'sprites/sprite_3.png' }
            ],
            masks: [
                { id: 'mask_1', name: 'Маска 1', path: 'masks/mask_1.png' },
                { id: 'mask_2', name: 'Маска 2', path: 'masks/mask_2.png' }
            ]
        };
    }

    /**
     * Получить все ассеты определенной категории
     */
    getAssets(category) {
        return this.assets[category] || [];
    }

    /**
     * Получить случайный ассет из категории
     */
    getRandomAsset(category) {
        const assets = this.getAssets(category);
        if (assets.length === 0) return null;
        return assets[Math.floor(Math.random() * assets.length)];
    }

    /**
     * Получить ассет по ID
     */
    getAsset(category, id) {
        const assets = this.getAssets(category);
        return assets.find(a => a.id === id) || null;
    }

    /**
     * Получить общее количество ассетов
     */
    getTotalAssets() {
        let total = 0;
        Object.values(this.assets).forEach(arr => total += arr.length);
        return total;
    }

    /**
     * Загрузить изображение по пути
     */
    async loadImage(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        try {
            const img = new Image();
            img.src = `${this.basePath}${path}`;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            this.cache.set(path, img);
            return img;
        } catch (error) {
            console.warn(`⚠️ Не удалось загрузить: ${path}`);
            return this.createFallbackImage();
        }
    }

    /**
     * Загрузить ассет по категории и ID
     */
    async loadAsset(category, id) {
        const asset = this.getAsset(category, id);
        if (!asset) return null;
        return this.loadImage(asset.path);
    }

    /**
     * Создать заглушку для отсутствующего изображения
     */
    createFallbackImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Рисуем градиентный квадрат
        const grad = ctx.createLinearGradient(0, 0, 64, 64);
        grad.addColorStop(0, '#7c3aed');
        grad.addColorStop(1, '#4d96ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        
        // Рисуем вопросительный знак
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 32, 34);
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    /**
     * Очистить кэш изображений
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Добавить новый ассет
     */
    addAsset(category, asset) {
        if (!this.assets[category]) {
            this.assets[category] = [];
        }
        this.assets[category].push(asset);
    }

    /**
     * Удалить ассет
     */
    removeAsset(category, id) {
        if (!this.assets[category]) return false;
        const index = this.assets[category].findIndex(a => a.id === id);
        if (index === -1) return false;
        this.assets[category].splice(index, 1);
        return true;
    }

    /**
     * Обновить ассет
     */
    updateAsset(category, id, updates) {
        if (!this.assets[category]) return false;
        const asset = this.assets[category].find(a => a.id === id);
        if (!asset) return false;
        Object.assign(asset, updates);
        return true;
    }

    /**
     * Получить все категории ассетов
     */
    getCategories() {
        return Object.keys(this.assets);
    }

    /**
     * Проверить наличие ассета
     */
    hasAsset(category, id) {
        if (!this.assets[category]) return false;
        return this.assets[category].some(a => a.id === id);
    }
}