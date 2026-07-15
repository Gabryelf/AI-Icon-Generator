// modules/configs/sprite_configs.js

/**
 * Конфигурация спрайтов для всех категорий и стилей
 * 
 * Структура:
 * - Каждая категория содержит объект со стилями
 * - Каждый стиль содержит объект с частями (parts)
 * - Каждая часть содержит массив имен файлов спрайтов
 * - Файлы должны лежать в /assets/sprites/{category}/{style}/{part}/{filename}.png
 * 
 * Пример пути: /assets/sprites/avatar/anime/eyes/eye_1.png
 */

 export const SPRITE_CONFIGS = {
    // =============================================================
    // КНОПКИ
    // =============================================================
    button: {
        // Пиксельный стиль
        pixel: {
            parts: {
                button_sprite: ['btn_pixel_1', 'btn_pixel_2', 'btn_pixel_3', 'btn_pixel_4'],
                button_hover: ['btn_pixel_hover_1', 'btn_pixel_hover_2'],
                button_pressed: ['btn_pixel_pressed_1', 'btn_pixel_pressed_2']
            },
            width: 200,
            height: 80,
            defaultColor: '#ff6b6b'
        },
        
        // Мультяшный стиль
        cartoon: {
            parts: {
                button_sprite: ['btn_cartoon_1', 'btn_cartoon_2', 'btn_cartoon_3'],
                button_hover: ['btn_cartoon_hover_1'],
                button_pressed: ['btn_cartoon_pressed_1']
            },
            width: 200,
            height: 80,
            defaultColor: '#ff6b6b'
        },
        
        // Киберпанк стиль
        cyberpunk: {
            parts: {
                button_sprite: ['btn_cyber_1', 'btn_cyber_2', 'btn_cyber_3'],
                button_hover: ['btn_cyber_hover_1'],
                button_pressed: ['btn_cyber_pressed_1'],
                button_glow: ['btn_cyber_glow_1']
            },
            width: 200,
            height: 80,
            defaultColor: '#ff00ff'
        },
        
        // Фэнтези стиль
        fantasy: {
            parts: {
                button_sprite: ['btn_fantasy_1', 'btn_fantasy_2', 'btn_fantasy_3'],
                button_hover: ['btn_fantasy_hover_1'],
                button_pressed: ['btn_fantasy_pressed_1'],
                button_ornament: ['btn_fantasy_ornament_1', 'btn_fantasy_ornament_2']
            },
            width: 200,
            height: 80,
            defaultColor: '#7c3aed'
        }
    },

    // =============================================================
    // ИКОНКИ
    // =============================================================
    icon: {
        // Пиксельный стиль
        pixel: {
            parts: {
                icon_sprite: ['icon_pixel_star', 'icon_pixel_heart', 'icon_pixel_sword', 'icon_pixel_shield', 'icon_pixel_coin'],
                icon_detail: ['icon_pixel_detail_1', 'icon_pixel_detail_2']
            },
            width: 100,
            height: 100,
            defaultColor: '#4d96ff'
        },
        
        // Мультяшный стиль
        cartoon: {
            parts: {
                icon_sprite: ['icon_cartoon_star', 'icon_cartoon_heart', 'icon_cartoon_smile', 'icon_cartoon_lightning'],
                icon_detail: ['icon_cartoon_detail_1', 'icon_cartoon_detail_2']
            },
            width: 100,
            height: 100,
            defaultColor: '#ff6b6b'
        },
        
        // Киберпанк стиль
        cyberpunk: {
            parts: {
                icon_sprite: ['icon_cyber_cpu', 'icon_cyber_network', 'icon_cyber_eye', 'icon_cyber_brain', 'icon_cyber_chip'],
                icon_detail: ['icon_cyber_detail_1', 'icon_cyber_detail_2'],
                icon_glow: ['icon_cyber_glow_1', 'icon_cyber_glow_2']
            },
            width: 100,
            height: 100,
            defaultColor: '#ff00ff'
        },
        
        // Фэнтези стиль
        fantasy: {
            parts: {
                icon_sprite: ['icon_fantasy_crystal', 'icon_fantasy_rune', 'icon_fantasy_dragon', 'icon_fantasy_crown', 'icon_fantasy_staff'],
                icon_detail: ['icon_fantasy_detail_1', 'icon_fantasy_detail_2'],
                icon_glow: ['icon_fantasy_glow_1']
            },
            width: 100,
            height: 100,
            defaultColor: '#7c3aed'
        }
    },

    // =============================================================
    // АВАТАРЫ
    // =============================================================
    avatar: {
        // Фэнтези стиль
        fantasy: {
            parts: {
                // Основные части лица
                face: ['face_fantasy_1', 'face_fantasy_2', 'face_fantasy_3'],
                eyes: ['eye_fantasy_1', 'eye_fantasy_2', 'eye_fantasy_3', 'eye_fantasy_4'],
                eyebrows: ['eyebrow_fantasy_1', 'eyebrow_fantasy_2', 'eyebrow_fantasy_3'],
                nose: ['nose_fantasy_1', 'nose_fantasy_2'],
                mouth: ['mouth_fantasy_1', 'mouth_fantasy_2', 'mouth_fantasy_3', 'mouth_fantasy_4'],
                
                // Волосы
                hair: ['hair_fantasy_1', 'hair_fantasy_2', 'hair_fantasy_3', 'hair_fantasy_4', 'hair_fantasy_5'],
                hair_bangs: ['hair_bangs_1', 'hair_bangs_2'],
                hair_tail: ['hair_tail_1', 'hair_tail_2'],
                
                // Аксессуары
                accessories: ['acc_fantasy_crown', 'acc_fantasy_tiara', 'acc_fantasy_earrings', 'acc_fantasy_necklace'],
                frame: ['frame_fantasy_1', 'frame_fantasy_2', 'frame_fantasy_3'],
                
                // Особенности
                ears: ['ear_fantasy_elven_1', 'ear_fantasy_elven_2'],
                marks: ['mark_fantasy_1', 'mark_fantasy_2', 'mark_fantasy_3']
            },
            width: 200,
            height: 200,
            defaultSkin: '#f5d0b8',
            defaultHair: '#8B4513',
            defaultEye: '#4d96ff'
        },
        
        // Пиксельный стиль
        pixel: {
            parts: {
                face: ['face_pixel_1', 'face_pixel_2', 'face_pixel_3'],
                eyes: ['eye_pixel_1', 'eye_pixel_2', 'eye_pixel_3'],
                eyebrows: ['eyebrow_pixel_1', 'eyebrow_pixel_2'],
                nose: ['nose_pixel_1', 'nose_pixel_2'],
                mouth: ['mouth_pixel_1', 'mouth_pixel_2', 'mouth_pixel_3'],
                hair: ['hair_pixel_1', 'hair_pixel_2', 'hair_pixel_3'],
                accessories: ['acc_pixel_1', 'acc_pixel_2'],
                frame: ['frame_pixel_1', 'frame_pixel_2'],
                pixel_details: ['pixel_detail_1', 'pixel_detail_2']
            },
            width: 200,
            height: 200,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff'
        },
        
        // Аниме стиль
        anime: {
            parts: {
                face: ['face_anime_1', 'face_anime_2', 'face_anime_3'],
                eyes: ['eye_anime_1', 'eye_anime_2', 'eye_anime_3', 'eye_anime_4'],
                eyebrows: ['eyebrow_anime_1', 'eyebrow_anime_2'],
                nose: ['nose_anime_1', 'nose_anime_2'],
                mouth: ['mouth_anime_1', 'mouth_anime_2', 'mouth_anime_3'],
                hair: ['hair_anime_1', 'hair_anime_2', 'hair_anime_3', 'hair_anime_4'],
                hair_bangs: ['hair_bangs_anime_1', 'hair_bangs_anime_2'],
                accessories: ['acc_anime_1', 'acc_anime_2', 'acc_anime_3'],
                frame: ['frame_anime_1', 'frame_anime_2'],
                sparkle: ['sparkle_anime_1']
            },
            width: 200,
            height: 200,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff'
        },
        
        // Чиби стиль
        chibi: {
            parts: {
                face: ['face_chibi_1', 'face_chibi_2', 'face_chibi_3'],
                eyes: ['eye_chibi_1', 'eye_chibi_2', 'eye_chibi_3'],
                eyebrows: ['eyebrow_chibi_1', 'eyebrow_chibi_2'],
                nose: ['nose_chibi_1', 'nose_chibi_2'],
                mouth: ['mouth_chibi_1', 'mouth_chibi_2', 'mouth_chibi_3'],
                hair: ['hair_chibi_1', 'hair_chibi_2', 'hair_chibi_3'],
                accessories: ['acc_chibi_1', 'acc_chibi_2'],
                frame: ['frame_chibi_1', 'frame_chibi_2'],
                blush: ['blush_chibi_1', 'blush_chibi_2'],
                sparkle: ['sparkle_chibi_1', 'sparkle_chibi_2']
            },
            width: 200,
            height: 200,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff'
        },
        
        // Казуальный стиль
        casual: {
            parts: {
                face: ['face_casual_1', 'face_casual_2'],
                eyes: ['eye_casual_1', 'eye_casual_2', 'eye_casual_3'],
                eyebrows: ['eyebrow_casual_1', 'eyebrow_casual_2'],
                nose: ['nose_casual_1', 'nose_casual_2'],
                mouth: ['mouth_casual_1', 'mouth_casual_2'],
                hair: ['hair_casual_1', 'hair_casual_2', 'hair_casual_3'],
                accessories: ['acc_casual_1', 'acc_casual_2'],
                frame: ['frame_casual_1']
            },
            width: 200,
            height: 200,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff'
        }
    },

    // =============================================================
    // ПЕРСОНАЖИ
    // =============================================================
    character: {
        // Фэнтези стиль
        fantasy: {
            parts: {
                // Голова и лицо
                head: ['head_fantasy_1', 'head_fantasy_2', 'head_fantasy_3'],
                eyes: ['eye_fantasy_1', 'eye_fantasy_2', 'eye_fantasy_3'],
                eyebrows: ['eyebrow_fantasy_1', 'eyebrow_fantasy_2'],
                nose: ['nose_fantasy_1', 'nose_fantasy_2'],
                mouth: ['mouth_fantasy_1', 'mouth_fantasy_2', 'mouth_fantasy_3'],
                ears: ['ear_fantasy_1', 'ear_fantasy_2'],
                
                // Волосы
                hair: ['hair_fantasy_1', 'hair_fantasy_2', 'hair_fantasy_3', 'hair_fantasy_4'],
                hair_bangs: ['hair_bangs_fantasy_1'],
                
                // Тело и конечности
                body: ['body_fantasy_1', 'body_fantasy_2', 'body_fantasy_3'],
                arms: ['arm_fantasy_1', 'arm_fantasy_2'],
                legs: ['leg_fantasy_1', 'leg_fantasy_2'],
                
                // Одежда
                clothes: ['cloth_fantasy_1', 'cloth_fantasy_2', 'cloth_fantasy_3', 'cloth_fantasy_4'],
                shoes: ['shoe_fantasy_1', 'shoe_fantasy_2'],
                cape: ['cape_fantasy_1', 'cape_fantasy_2'],
                
                // Аксессуары
                accessories: ['acc_fantasy_1', 'acc_fantasy_2', 'acc_fantasy_3'],
                
                // Оружие
                weapons: ['weapon_fantasy_sword', 'weapon_fantasy_staff', 'weapon_fantasy_bow', 'weapon_fantasy_shield'],
                
                // Эффекты
                effects: ['effect_fantasy_aura', 'effect_fantasy_sparkle']
            },
            width: 250,
            height: 350,
            defaultSkin: '#f5d0b8',
            defaultHair: '#8B4513',
            defaultEye: '#4d96ff',
            defaultOutfit: '#7c3aed'
        },
        
        // Пиксельный стиль
        pixel: {
            parts: {
                head: ['head_pixel_1', 'head_pixel_2'],
                eyes: ['eye_pixel_1', 'eye_pixel_2'],
                eyebrows: ['eyebrow_pixel_1'],
                nose: ['nose_pixel_1'],
                mouth: ['mouth_pixel_1', 'mouth_pixel_2'],
                hair: ['hair_pixel_1', 'hair_pixel_2', 'hair_pixel_3'],
                body: ['body_pixel_1', 'body_pixel_2'],
                arms: ['arm_pixel_1', 'arm_pixel_2'],
                legs: ['leg_pixel_1', 'leg_pixel_2'],
                clothes: ['cloth_pixel_1', 'cloth_pixel_2'],
                shoes: ['shoe_pixel_1'],
                accessories: ['acc_pixel_1', 'acc_pixel_2'],
                weapons: ['weapon_pixel_sword', 'weapon_pixel_shield'],
                pixel_details: ['pixel_detail_1']
            },
            width: 250,
            height: 350,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff',
            defaultOutfit: '#6bcb77'
        },
        
        // Аниме стиль
        anime: {
            parts: {
                head: ['head_anime_1', 'head_anime_2', 'head_anime_3'],
                eyes: ['eye_anime_1', 'eye_anime_2', 'eye_anime_3'],
                eyebrows: ['eyebrow_anime_1', 'eyebrow_anime_2'],
                nose: ['nose_anime_1'],
                mouth: ['mouth_anime_1', 'mouth_anime_2', 'mouth_anime_3'],
                hair: ['hair_anime_1', 'hair_anime_2', 'hair_anime_3', 'hair_anime_4'],
                hair_bangs: ['hair_bangs_anime_1', 'hair_bangs_anime_2'],
                body: ['body_anime_1', 'body_anime_2'],
                arms: ['arm_anime_1', 'arm_anime_2'],
                legs: ['leg_anime_1', 'leg_anime_2'],
                clothes: ['cloth_anime_1', 'cloth_anime_2', 'cloth_anime_3'],
                shoes: ['shoe_anime_1'],
                accessories: ['acc_anime_1', 'acc_anime_2'],
                weapons: ['weapon_anime_sword', 'weapon_anime_staff']
            },
            width: 250,
            height: 350,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff',
            defaultOutfit: '#ff6b6b'
        },
        
        // Чиби стиль
        chibi: {
            parts: {
                head: ['head_chibi_1', 'head_chibi_2', 'head_chibi_3'],
                eyes: ['eye_chibi_1', 'eye_chibi_2', 'eye_chibi_3'],
                eyebrows: ['eyebrow_chibi_1'],
                nose: ['nose_chibi_1'],
                mouth: ['mouth_chibi_1', 'mouth_chibi_2'],
                hair: ['hair_chibi_1', 'hair_chibi_2', 'hair_chibi_3'],
                body: ['body_chibi_1', 'body_chibi_2'],
                arms: ['arm_chibi_1'],
                legs: ['leg_chibi_1'],
                clothes: ['cloth_chibi_1', 'cloth_chibi_2'],
                shoes: ['shoe_chibi_1'],
                accessories: ['acc_chibi_1', 'acc_chibi_2'],
                weapons: ['weapon_chibi_sword', 'weapon_chibi_staff'],
                blush: ['blush_chibi_1'],
                sparkle: ['sparkle_chibi_1']
            },
            width: 250,
            height: 300,
            defaultSkin: '#f5d0b8',
            defaultHair: '#2d3436',
            defaultEye: '#4d96ff',
            defaultOutfit: '#ff9ff3'
        }
    }
};

/**
 * Получить конфигурацию спрайтов для категории и стиля
 */
export function getSpriteConfig(category, style) {
    if (!SPRITE_CONFIGS[category]) return null;
    if (!SPRITE_CONFIGS[category][style]) return null;
    return SPRITE_CONFIGS[category][style];
}

/**
 * Получить список частей для категории и стиля
 */
export function getSpriteParts(category, style) {
    const config = getSpriteConfig(category, style);
    if (!config) return {};
    return config.parts || {};
}

/**
 * Получить случайный спрайт для части
 */
export function getRandomSprite(category, style, part) {
    const parts = getSpriteParts(category, style);
    if (!parts[part]) return null;
    
    const sprites = parts[part];
    if (!sprites || sprites.length === 0) return null;
    
    return sprites[Math.floor(Math.random() * sprites.length)];
}

/**
 * Получить путь к спрайту
 */
export function getSpritePath(category, style, part, name) {
    return `${category}/${style}/${part}/${name}.png`;
}

/**
 * Получить все доступные категории
 */
export function getAvailableCategories() {
    return Object.keys(SPRITE_CONFIGS);
}

/**
 * Получить все доступные стили для категории
 */
export function getAvailableStyles(category) {
    if (!SPRITE_CONFIGS[category]) return [];
    return Object.keys(SPRITE_CONFIGS[category]);
}

/**
 * Получить все доступные части для категории и стиля
 */
export function getAvailableParts(category, style) {
    const config = getSpriteConfig(category, style);
    if (!config) return [];
    return Object.keys(config.parts || {});
}

/**
 * Проверить, существует ли часть
 */
export function hasPart(category, style, part) {
    const parts = getSpriteParts(category, style);
    return parts && parts[part] && parts[part].length > 0;
}