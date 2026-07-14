// =============================================================
// ANIME STYLE - Аниме стиль для аватаров и персонажей
// =============================================================

export const AnimeStyle = {
    name: 'anime',
    displayName: 'Аниме',
    icon: 'fas fa-heart',
    description: 'Японский стиль, большие выразительные глаза',
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

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size,
                    x: 250,
                    y: 250,
                    shape: 'anime_face',
                    width: size * 0.85,
                    height: size * 0.95
                },
                {
                    type: 'anime_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.25,
                    x: 250,
                    y: 250 - size * 0.1,
                    style: 'sparkle',
                    highlight: true
                },
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: size * 0.12,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: 'anime'
                },
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: size * 0.1,
                    x: 250,
                    y: 250 + size * 0.2,
                    expression: config.expression || 'smile'
                },
                {
                    type: 'nose',
                    color: this.darkenColor(skinColor, 10),
                    size: size * 0.05,
                    x: 250,
                    y: 250 + size * 0.05
                },
                {
                    type: 'anime_hair',
                    color: hairColor,
                    size: size,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: config.hairStyle || 'long',
                    hasBangs: true
                },
                ...(config.accessory === 'glasses' ? [{
                    type: 'glasses',
                    color: '#2d3436',
                    size: size * 0.25,
                    x: 250,
                    y: 250 - size * 0.05,
                    style: 'anime'
                }] : []),
                ...(config.accessory === 'crown' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: size * 0.2,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: 'anime'
                }] : [])
            ],
            effects: []
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#ff6b6b';
        const size = config.size || 250;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'anime_body',
                    color: outfitColor,
                    size: size * 0.4,
                    x: 250,
                    y: 250 + size * 0.15,
                    shape: 'slim',
                    bodyType: config.bodyType || 'normal'
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.25,
                    shape: 'anime_face',
                    width: size * 0.28,
                    height: size * 0.32
                },
                {
                    type: 'anime_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.1,
                    x: 250,
                    y: 250 - size * 0.3,
                    style: 'sparkle',
                    highlight: true
                },
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: size * 0.05,
                    x: 250,
                    y: 250 - size * 0.35,
                    style: 'anime'
                },
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: size * 0.04,
                    x: 250,
                    y: 250 - size * 0.15,
                    expression: config.expression || 'smile'
                },
                {
                    type: 'anime_hair',
                    color: hairColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: config.hairStyle || 'long',
                    hasBangs: true
                },
                {
                    type: 'anime_limbs',
                    color: skinColor,
                    size: size * 0.25,
                    x: 250,
                    y: 250 + size * 0.05,
                    pose: config.pose || 'standing'
                },
                ...(config.accessory === 'glasses' ? [{
                    type: 'glasses',
                    color: '#2d3436',
                    size: size * 0.1,
                    x: 250,
                    y: 250 - size * 0.28,
                    style: 'anime'
                }] : []),
                ...(config.weapon && config.weapon !== 'none' ? [{
                    type: 'weapon',
                    color: '#c0c0c0',
                    size: size * 0.2,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.1,
                    weaponType: config.weapon
                }] : [])
            ],
            effects: []
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