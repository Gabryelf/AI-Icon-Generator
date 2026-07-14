// =============================================================
// FANTASY STYLE - Фэнтези стиль для всех категорий
// =============================================================

export const FantasyStyle = {
    name: 'fantasy',
    displayName: 'Фэнтези',
    icon: 'fas fa-dragon',
    description: 'Магические, сказочные, эпические элементы',
    font: 'MedievalSharp',
    
    palettes: {
        button: {
            primary: '#7c3aed',
            secondary: '#ffd700',
            accent: '#8b5cf6',
            background: '#0a0a0f',
            text: '#ffd700'
        },
        icon: {
            primary: '#7c3aed',
            secondary: '#ffd700',
            accent: '#8b5cf6',
            background: '#0a0a0f',
            text: '#ffd700'
        },
        avatar: {
            primary: '#7c3aed',
            secondary: '#ffd700',
            accent: '#8b5cf6',
            background: '#0a0a0f',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        },
        character: {
            primary: '#7c3aed',
            secondary: '#ffd700',
            accent: '#8b5cf6',
            background: '#0a0a0f',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        }
    },

    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#7c3aed';
        const text = config.text || 'МАГИЯ';
        const size = config.size || 120;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'fantasy_button',
                    color: color,
                    text: text,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: '#ffd700',
                    borderWidth: 3,
                    textColor: '#ffd700',
                    font: 'MedievalSharp',
                    glow: true,
                    ornament: true
                },
                ...Array.from({ length: 8 }, (_, i) => ({
                    type: 'magic_rune',
                    x: 250 + Math.cos((i / 8) * Math.PI * 2) * (size * 0.5),
                    y: 250 + Math.sin((i / 8) * Math.PI * 2) * (size * 0.5),
                    size: 8,
                    color: '#ffd700',
                    opacity: 0.3 + Math.sin(i * 1.5) * 0.2
                })),
                {
                    type: 'glow',
                    color: '#ffd700',
                    size: size * 1.8,
                    intensity: 0.3
                }
            ],
            effects: [
                { type: 'glow', color: '#ffd700', intensity: 0.3 },
                { type: 'particles', count: 10 }
            ]
        };
    },

    generateIcon: (config, palette) => {
        const color = config.color || palette.primary || '#7c3aed';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'fantasy_icon',
                    shape: shape,
                    color: color,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: '#ffd700',
                    borderWidth: 3,
                    glow: config.glow
                },
                ...Array.from({ length: 6 }, (_, i) => ({
                    type: 'magic_rune',
                    x: 250 + Math.cos((i / 6) * Math.PI * 2) * (size * 0.6),
                    y: 250 + Math.sin((i / 6) * Math.PI * 2) * (size * 0.6),
                    size: 12,
                    color: '#ffd700',
                    opacity: 0.3 + Math.sin(i * 1.2) * 0.2
                })),
                {
                    type: 'glow',
                    color: '#ffd700',
                    size: size * 2,
                    intensity: 0.3
                }
            ],
            effects: [
                { type: 'glow', color: '#ffd700', intensity: 0.3 },
                { type: 'particles', count: 8 }
            ]
        };
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
                    shape: 'ellipse',
                    width: size * 0.8,
                    height: size * 0.95
                },
                {
                    type: 'fantasy_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.2,
                    x: 250,
                    y: 250 - size * 0.1,
                    style: 'elven'
                },
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: size * 0.15,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: 'arched'
                },
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: size * 0.15,
                    x: 250,
                    y: 250 + size * 0.2,
                    expression: config.expression || 'smile'
                },
                {
                    type: 'elven_hair',
                    color: hairColor,
                    size: size,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: config.hairStyle || 'long'
                },
                {
                    type: 'elven_ears',
                    color: skinColor,
                    size: size * 0.15,
                    x: 250,
                    y: 250 - size * 0.05
                },
                ...(config.accessory === 'crown' || config.accessory === 'tiara' ? [{
                    type: 'crown',
                    color: '#ffd700',
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: 'elven'
                }] : []),
                ...(config.glow ? [{
                    type: 'glow',
                    color: '#ffd700',
                    size: size * 1.5,
                    intensity: 0.2
                }] : [])
            ],
            effects: config.glow ? [{ type: 'glow', color: '#ffd700', intensity: 0.2 }] : []
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#7c3aed';
        const size = config.size || 250;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || 'transparent')
                },
                {
                    type: 'body',
                    color: outfitColor,
                    size: size * 0.4,
                    x: 250,
                    y: 250 + size * 0.15,
                    shape: 'torso',
                    bodyType: config.bodyType || 'normal'
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 - size * 0.25,
                    shape: 'ellipse',
                    width: size * 0.3,
                    height: size * 0.35
                },
                {
                    type: 'fantasy_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.07,
                    x: 250,
                    y: 250 - size * 0.3,
                    style: 'elven'
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
                    type: 'fantasy_hair',
                    color: hairColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: config.hairStyle || 'long'
                },
                {
                    type: 'arms',
                    color: skinColor,
                    size: size * 0.25,
                    x: 250,
                    y: 250 + size * 0.05,
                    pose: config.pose || 'standing'
                },
                {
                    type: 'legs',
                    color: outfitColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 + size * 0.35,
                    pose: config.pose || 'standing'
                },
                ...(config.accessory === 'cape' ? [{
                    type: 'cape',
                    color: this.darkenColor(outfitColor, 20),
                    size: size * 0.5,
                    x: 250,
                    y: 250 + size * 0.1
                }] : []),
                ...(config.weapon && config.weapon !== 'none' ? [{
                    type: 'weapon',
                    color: '#c0c0c0',
                    size: size * 0.25,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.1,
                    weaponType: config.weapon
                }] : [])
            ],
            effects: [{ type: 'glow', color: '#ffd700', intensity: 0.2 }]
        };
    },

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
};