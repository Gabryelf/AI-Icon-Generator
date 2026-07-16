// ===============================================================
// ЗАГРУЗЧИК СПРАЙТОВ
// ===============================================================

export class SpriteLoader {
    constructor() {
        this.cache = new Map();
        this.basePath = '/assets/sprites/';
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        console.log('✅ SpriteLoader инициализирован');
    }

    async loadSprite(path) {
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
            console.warn(`⚠️ Не удалось загрузить спрайт: ${path}`);
            return this.createFallbackSprite();
        }
    }

    createFallbackSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 32, 34);
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    getSpriteMap() {
        return null; // Упрощено
    }

    getParts() {
        return {}; // Упрощено
    }

    clearCache() {
        this.cache.clear();
    }
}