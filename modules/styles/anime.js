// =============================================================
// ANIME STYLE - Аутентичный аниме стиль с большими глазами
// =============================================================

export const AnimeStyle = {
    name: 'anime',
    displayName: 'Аниме',
    icon: 'fas fa-heart',
    description: 'Большие выразительные глаза, яркие волосы, японская эстетика',
    font: 'Quicksand',
    
    palettes: {
        avatar: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#4d96ff',
            background: '#ffffff',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        },
        character: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#4d96ff',
            background: '#f0f0f0',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        }
    },

    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const size = config.size || 200;

        // Аниме пропорции
        const headSize = size;
        const eyeSize = headSize * 0.2;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                // Лицо аниме (вытянутое)
                {
                    type: 'face_base',
                    color: skinColor,
                    size: headSize,
                    x: 250,
                    y: 250,
                    shape: 'anime_face',
                    width: headSize * 0.85,
                    height: headSize * 0.95
                },
                // Большие аниме глаза
                {
                    type: 'anime_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: eyeSize,
                    x: 250,
                    y: 250 - headSize * 0.1,
                    style: 'sparkle',
                    highlight: true,
                    spacing: 1.0
                },
                // Тонкие брови
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: headSize * 0.1,
                    x: 250,
                    y: 250 - headSize * 0.22,
                    style: 'anime'
                },
                // Маленький нос
                {
                    type: 'nose',
                    color: this.darkenColor(skinColor, 10),
                    size: headSize * 0.04,
                    x: 250,
                    y: 250 + headSize * 0.05,
                    style: 'small'
                },
                // Выразительный рот
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: headSize * 0.08,
                    x: 250,
                    y: 250 + headSize * 0.2,
                    expression: config.expression || 'smile',
                    style: 'small'
                },
                // Аниме волосы с характерными прядями
                {
                    type: 'anime_hair',
                    color: hairColor,
                    size: headSize,
                    x: 250,
                    y: 250 - headSize * 0.2,
                    style: config.hairStyle || 'long',
                    hasBangs: true
                },
                // Аксессуары
                ...(config.accessory === 'glasses' ? [{
                    type: 'glasses',
                    color: '#2d3436',
                    size: headSize * 0.25,
                    x: 250,
                    y: 250 - headSize * 0.05,
                    style: 'anime'
                }] : []),
                ...(config.accessory === 'crown' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: headSize * 0.2,
                    x: 250,
                    y: 250 - headSize * 0.4,
                    style: 'anime'
                }] : []),
                ...(config.accessory === 'bow' ? [{
                    type: 'bow',
                    color: '#ff6b6b',
                    size: headSize * 0.15,
                    x: 250 + headSize * 0.3,
                    y: 250 - headSize * 0.3
                }] : [])
            ],
            effects: [
                { type: 'glow', color: '#ff6b6b', intensity: 0.05 }
            ]
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#ff6b6b';
        const size = config.size || 250;

        const headSize = size * 0.3;
        const eyeSize = headSize * 0.2;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                // Тело аниме (стройное)
                {
                    type: 'anime_body',
                    color: outfitColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 + size * 0.15,
                    shape: 'slim',
                    bodyType: config.bodyType || 'normal'
                },
                // Голова
                {
                    type: 'face_base',
                    color: skinColor,
                    size: headSize,
                    x: 250,
                    y: 250 - size * 0.2,
                    shape: 'anime_face',
                    width: headSize * 0.85,
                    height: headSize * 0.95
                },
                // Аниме глаза
                {
                    type: 'anime_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: eyeSize,
                    x: 250,
                    y: 250 - size * 0.3,
                    style: 'sparkle',
                    highlight: true,
                    spacing: 1.0
                },
                // Брови
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: headSize * 0.08,
                    x: 250,
                    y: 250 - size * 0.35,
                    style: 'anime'
                },
                // Нос
                {
                    type: 'nose',
                    color: this.darkenColor(skinColor, 10),
                    size: headSize * 0.04,
                    x: 250,
                    y: 250 - size * 0.12,
                    style: 'small'
                },
                // Рот
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: headSize * 0.06,
                    x: 250,
                    y: 250 - size * 0.12,
                    expression: config.expression || 'smile',
                    style: 'small'
                },
                // Аниме волосы
                {
                    type: 'anime_hair',
                    color: hairColor,
                    size: headSize * 1.2,
                    x: 250,
                    y: 250 - size * 0.35,
                    style: config.hairStyle || 'long',
                    hasBangs: true
                },
                // Руки и ноги
                {
                    type: 'anime_limbs',
                    color: skinColor,
                    size: size * 0.25,
                    x: 250,
                    y: 250 + size * 0.05,
                    pose: config.pose || 'standing'
                },
                // Аксессуары
                ...(config.accessory === 'glasses' ? [{
                    type: 'glasses',
                    color: '#2d3436',
                    size: headSize * 0.2,
                    x: 250,
                    y: 250 - size * 0.28,
                    style: 'anime'
                }] : []),
                ...(config.accessory === 'cape' ? [{
                    type: 'cape',
                    color: this.darkenColor(outfitColor, 20),
                    size: size * 0.5,
                    x: 250,
                    y: 250 + size * 0.1
                }] : []),
                // Оружие
                ...(config.weapon && config.weapon !== 'none' ? [{
                    type: 'weapon',
                    color: '#c0c0c0',
                    size: size * 0.2,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.1,
                    weaponType: config.weapon
                }] : [])
            ],
            effects: [
                { type: 'glow', color: '#ff6b6b', intensity: 0.05 }
            ]
        };
    },

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    },

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
};