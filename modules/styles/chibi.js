// =============================================================
// CHIBI STYLE - Миниатюрные чиби персонажи с большими головами
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
            eye: '#4d96ff',
            blush: '#ff6b6b'
        },
        character: {
            primary: '#ff9ff3',
            secondary: '#f368e0',
            accent: '#ff6b6b',
            background: '#f0f0f0',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff',
            blush: '#ff6b6b'
        }
    },

    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const blushColor = palette.blush || '#ff6b6b';
        const size = config.size || 200;

        // Чиби пропорции: голова занимает ~60% от всего размера
        const headSize = size * 0.55;
        const eyeSize = headSize * 0.35;
        const bodySize = size * 0.3;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                // Тело чиби (маленькое, круглое)
                {
                    type: 'chibi_body',
                    color: config.outfitColor || palette.primary || '#ff9ff3',
                    size: bodySize,
                    x: 250,
                    y: 250 + headSize * 0.4,
                    shape: 'round'
                },
                // Большая голова
                {
                    type: 'face_base',
                    color: skinColor,
                    size: headSize,
                    x: 250,
                    y: 250 - headSize * 0.15,
                    shape: 'circle'
                },
                // Огромные глаза чиби (занимают 1/3 лица)
                {
                    type: 'chibi_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: eyeSize,
                    x: 250,
                    y: 250 - headSize * 0.05,
                    sparkle: true,
                    spacing: 1.1
                },
                // Маленький рот
                {
                    type: 'mouth',
                    color: '#ff6b6b',
                    size: headSize * 0.08,
                    x: 250,
                    y: 250 + headSize * 0.25,
                    expression: 'happy',
                    style: 'cute'
                },
                // Яркий румянец
                {
                    type: 'blush',
                    color: blushColor,
                    size: headSize * 0.2,
                    x: 250,
                    y: 250 + headSize * 0.1,
                    opacity: 0.4
                },
                // Миниатюрные брови
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: headSize * 0.08,
                    x: 250,
                    y: 250 - headSize * 0.2,
                    style: 'chibi'
                },
                // Волосы чиби
                {
                    type: 'chibi_hair',
                    color: hairColor,
                    size: headSize,
                    x: 250,
                    y: 250 - headSize * 0.4,
                    style: config.hairStyle || 'short'
                },
                // Звездочки в глазах
                {
                    type: 'chibi_sparkle',
                    color: '#ffffff',
                    size: eyeSize * 0.15,
                    x: 250,
                    y: 250 - headSize * 0.1
                },
                // Аксессуары
                ...(config.accessory === 'bow' ? [{
                    type: 'bow',
                    color: '#ff6b6b',
                    size: headSize * 0.2,
                    x: 250 + headSize * 0.4,
                    y: 250 - headSize * 0.3
                }] : []),
                ...(config.accessory === 'crown' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: headSize * 0.25,
                    x: 250,
                    y: 250 - headSize * 0.55
                }] : []),
                ...(config.accessory === 'headphones' ? [{
                    type: 'headphones',
                    color: '#2d3436',
                    size: headSize * 0.3,
                    x: 250,
                    y: 250 - headSize * 0.1
                }] : [])
            ],
            effects: [
                { type: 'glow', color: '#ff9ff3', intensity: 0.05 }
            ]
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#ff9ff3';
        const blushColor = palette.blush || '#ff6b6b';
        const size = config.size || 250;

        // Чиби пропорции для персонажа
        const headSize = size * 0.4;
        const bodySize = size * 0.25;
        const eyeSize = headSize * 0.35;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                // Тело чиби
                {
                    type: 'chibi_body',
                    color: outfitColor,
                    size: bodySize,
                    x: 250,
                    y: 250 + headSize * 0.35,
                    shape: 'round'
                },
                // Большая голова
                {
                    type: 'face_base',
                    color: skinColor,
                    size: headSize,
                    x: 250,
                    y: 250 - headSize * 0.1,
                    shape: 'circle'
                },
                // Огромные глаза
                {
                    type: 'chibi_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: eyeSize,
                    x: 250,
                    y: 250 - headSize * 0.05,
                    sparkle: true,
                    spacing: 1.1
                },
                // Маленький рот
                {
                    type: 'mouth',
                    color: '#ff6b6b',
                    size: headSize * 0.06,
                    x: 250,
                    y: 250 + headSize * 0.2,
                    expression: 'happy',
                    style: 'cute'
                },
                // Румянец
                {
                    type: 'blush',
                    color: blushColor,
                    size: headSize * 0.15,
                    x: 250,
                    y: 250 + headSize * 0.08,
                    opacity: 0.35
                },
                // Миниатюрные брови
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: headSize * 0.06,
                    x: 250,
                    y: 250 - headSize * 0.18,
                    style: 'chibi'
                },
                // Волосы
                {
                    type: 'chibi_hair',
                    color: hairColor,
                    size: headSize,
                    x: 250,
                    y: 250 - headSize * 0.35,
                    style: config.hairStyle || 'short'
                },
                // Маленькие ручки и ножки
                {
                    type: 'chibi_limbs',
                    color: skinColor,
                    size: size * 0.08,
                    x: 250,
                    y: 250 + headSize * 0.35
                },
                // Звездочки в глазах
                {
                    type: 'chibi_sparkle',
                    color: '#ffffff',
                    size: eyeSize * 0.15,
                    x: 250,
                    y: 250 - headSize * 0.08
                },
                // Аксессуары
                ...(config.accessory === 'bow' ? [{
                    type: 'bow',
                    color: '#ff6b6b',
                    size: headSize * 0.15,
                    x: 250 + headSize * 0.35,
                    y: 250 - headSize * 0.3
                }] : []),
                ...(config.accessory === 'crown' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: headSize * 0.2,
                    x: 250,
                    y: 250 - headSize * 0.45
                }] : []),
                ...(config.accessory === 'backpack' ? [{
                    type: 'backpack',
                    color: '#2d3436',
                    size: bodySize * 0.5,
                    x: 250,
                    y: 250 + headSize * 0.2
                }] : []),
                // Оружие для чиби (уменьшенное)
                ...(config.weapon && config.weapon !== 'none' ? [{
                    type: 'weapon',
                    color: '#c0c0c0',
                    size: headSize * 0.2,
                    x: 250 + headSize * 0.4,
                    y: 250 - headSize * 0.1,
                    weaponType: config.weapon
                }] : [])
            ],
            effects: [
                { type: 'glow', color: '#ff9ff3', intensity: 0.05 }
            ]
        };
    }
};