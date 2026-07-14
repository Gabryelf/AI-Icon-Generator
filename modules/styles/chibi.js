// =============================================================
// CHIBI STYLE - Чиби стиль для аватаров и персонажей
// =============================================================

export const ChibiStyle = {
    name: 'chibi',
    displayName: 'Чиби',
    icon: 'fas fa-child',
    description: 'Миниатюрные, милые, пропорции 2-3 головы',
    font: 'Quicksand',
    
    palettes: {
        avatar: {
            primary: '#ff9ff3',
            secondary: '#f368e0',
            accent: '#ff6b6b',
            background: '#ffffff',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        },
        character: {
            primary: '#ff9ff3',
            secondary: '#f368e0',
            accent: '#ff6b6b',
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
                    shape: 'circle'
                },
                {
                    type: 'chibi_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 - size * 0.05,
                    sparkle: true
                },
                {
                    type: 'mouth',
                    color: '#ff6b6b',
                    size: size * 0.08,
                    x: 250,
                    y: 250 + size * 0.25,
                    expression: 'happy'
                },
                {
                    type: 'blush',
                    color: '#ff6b6b',
                    size: size * 0.15,
                    x: 250,
                    y: 250 + size * 0.1,
                    opacity: 0.3
                },
                {
                    type: 'chibi_hair',
                    color: hairColor,
                    size: size,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: config.hairStyle || 'short'
                },
                ...(config.accessory === 'bow' ? [{
                    type: 'bow',
                    color: '#ff6b6b',
                    size: size * 0.2,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.3
                }] : []),
                ...(config.accessory === 'crown' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: size * 0.25,
                    x: 250,
                    y: 250 - size * 0.45
                }] : [])
            ],
            effects: []
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#ff9ff3';
        const size = config.size || 250;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'chibi_body',
                    color: outfitColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 + size * 0.2,
                    shape: 'round'
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size * 0.4,
                    x: 250,
                    y: 250 - size * 0.2,
                    shape: 'circle'
                },
                {
                    type: 'chibi_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.18,
                    x: 250,
                    y: 250 - size * 0.25,
                    sparkle: true
                },
                {
                    type: 'mouth',
                    color: '#ff6b6b',
                    size: size * 0.04,
                    x: 250,
                    y: 250 - size * 0.1,
                    expression: 'happy'
                },
                {
                    type: 'blush',
                    color: '#ff6b6b',
                    size: size * 0.08,
                    x: 250,
                    y: 250 - size * 0.12,
                    opacity: 0.3
                },
                {
                    type: 'chibi_hair',
                    color: hairColor,
                    size: size * 0.4,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: config.hairStyle || 'short'
                },
                {
                    type: 'chibi_limbs',
                    color: skinColor,
                    size: size * 0.15,
                    x: 250,
                    y: 250 + size * 0.3
                },
                ...(config.accessory === 'bow' ? [{
                    type: 'bow',
                    color: '#ff6b6b',
                    size: size * 0.15,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.35
                }] : [])
            ],
            effects: []
        };
    }
};