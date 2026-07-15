// modules/core/SpriteLoader.js

export class SpriteLoader {
    constructor() {
        this.cache = new Map();
        this.basePath = '/assets/sprites/';
        this.spriteMap = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Загружаем карту спрайтов
            const response = await fetch('/assets/configs/sprite_map.json');
            if (response.ok) {
                const map = await response.json();
                this.loadSpriteMap(map);
            }
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить sprite_map.json');
            this.loadDefaultSpriteMap();
        }

        this.isInitialized = true;
        console.log('✅ SpriteLoader инициализирован');
    }

    loadSpriteMap(map) {
        Object.entries(map).forEach(([category, styles]) => {
            Object.entries(styles).forEach(([style, parts]) => {
                const key = `${category}/${style}`;
                this.spriteMap.set(key, parts);
            });
        });
    }

    loadDefaultSpriteMap() {
        // Минимальная карта спрайтов для тестирования
        const defaultMap = {
            button: {
                cyberpunk: { sprites: ['btn_cyber_1'], width: 200, height: 80 },
                fantasy: { sprites: ['btn_fantasy_1'], width: 200, height: 80 },
                pixel: { sprites: ['btn_pixel_1'], width: 200, height: 80 },
                cartoon: { sprites: ['btn_cartoon_1'], width: 200, height: 80 }
            },
            icon: {
                cyberpunk: { sprites: ['icon_cyber_1'], width: 100, height: 100 },
                fantasy: { sprites: ['icon_fantasy_1'], width: 100, height: 100 },
                pixel: { sprites: ['icon_pixel_1'], width: 100, height: 100 },
                cartoon: { sprites: ['icon_cartoon_1'], width: 100, height: 100 }
            },
            avatar: {
                cyberpunk: { 
                    parts: {
                        face: ['face_1'],
                        eyes: ['eye_1', 'eye_2'],
                        eyebrows: ['eyebrow_1'],
                        nose: ['nose_1'],
                        mouth: ['mouth_1', 'mouth_2'],
                        hair: ['hair_1', 'hair_2'],
                        accessories: ['acc_1'],
                        frame: ['frame_1']
                    }
                },
                fantasy: { 
                    parts: {
                        face: ['face_1'],
                        eyes: ['eye_1'],
                        eyebrows: ['eyebrow_1'],
                        nose: ['nose_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        accessories: ['acc_1'],
                        frame: ['frame_1']
                    }
                },
                anime: { 
                    parts: {
                        face: ['face_1'],
                        eyes: ['eye_1'],
                        eyebrows: ['eyebrow_1'],
                        nose: ['nose_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        accessories: ['acc_1'],
                        frame: ['frame_1']
                    }
                },
                chibi: { 
                    parts: {
                        face: ['face_1'],
                        eyes: ['eye_1'],
                        eyebrows: ['eyebrow_1'],
                        nose: ['nose_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        accessories: ['acc_1'],
                        frame: ['frame_1']
                    }
                }
            },
            character: {
                cyberpunk: { 
                    parts: {
                        head: ['head_1'],
                        body: ['body_1'],
                        eyes: ['eye_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        arms: ['arm_1'],
                        legs: ['leg_1'],
                        clothes: ['cloth_1'],
                        accessories: ['acc_1'],
                        weapons: ['weapon_1']
                    }
                },
                fantasy: { 
                    parts: {
                        head: ['head_1'],
                        body: ['body_1'],
                        eyes: ['eye_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        arms: ['arm_1'],
                        legs: ['leg_1'],
                        clothes: ['cloth_1'],
                        accessories: ['acc_1'],
                        weapons: ['weapon_1']
                    }
                },
                anime: { 
                    parts: {
                        head: ['head_1'],
                        body: ['body_1'],
                        eyes: ['eye_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        arms: ['arm_1'],
                        legs: ['leg_1'],
                        clothes: ['cloth_1'],
                        accessories: ['acc_1'],
                        weapons: ['weapon_1']
                    }
                },
                chibi: { 
                    parts: {
                        head: ['head_1'],
                        body: ['body_1'],
                        eyes: ['eye_1'],
                        mouth: ['mouth_1'],
                        hair: ['hair_1'],
                        arms: ['arm_1'],
                        legs: ['leg_1'],
                        clothes: ['cloth_1'],
                        accessories: ['acc_1'],
                        weapons: ['weapon_1']
                    }
                }
            }
        };

        Object.entries(defaultMap).forEach(([category, styles]) => {
            Object.entries(styles).forEach(([style, parts]) => {
                const key = `${category}/${style}`;
                this.spriteMap.set(key, parts);
            });
        });
    }

    getSpriteMap(category, style) {
        const key = `${category}/${style}`;
        return this.spriteMap.get(key) || null;
    }

    getParts(category, style) {
        const map = this.getSpriteMap(category, style);
        return map?.parts || {};
    }

    getSprites(category, style) {
        const map = this.getSpriteMap(category, style);
        return map?.sprites || [];
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
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 25, 25);
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    clearCache() {
        this.cache.clear();
    }
}