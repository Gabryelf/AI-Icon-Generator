// =============================================================
// CARTOON STYLE - Мультяшный стиль
// =============================================================

export const CartoonStyle = {
    name: 'cartoon',
    displayName: 'Мультяшный',
    icon: 'fas fa-face-smile',
    description: 'Яркий, дружелюбный, с жирным контуром',
    font: 'Fredoka One',
    
    palettes: {
        button: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#ffffff'
        },
        icon: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#f0f0f0'
        },
        avatar: {
            primary: '#ff9ff3',
            secondary: '#f368e0',
            accent: '#ff6b6b',
            background: '#ffffff'
        },
        character: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#f0f0f0'
        }
    },

    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#ff6b6b';
        const text = config.text || 'КНОПКА';
        const size = config.size || 120;
        const radius = config.cornerRadius || 20;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
                },
                {
                    type: 'cartoon_button',
                    color: color,
                    text: text,
                    size: size,
                    radius: radius,
                    x: 250,
                    y: 250,
                    borderColor: '#2d3436',
                    borderWidth: 6,
                    textColor: '#ffffff',
                    font: 'Fredoka One',
                    shadow: true,
                    glow: config.glow
                },
                {
                    type: 'highlight',
                    color: '#ffffff',
                    x: 250,
                    y: 230,
                    size: size * 0.3,
                    opacity: 0.3,
                    shape: 'ellipse'
                }
            ],
            effects: []
        };
    },

    generateIcon: (config, palette) => {
        const color = config.color || palette.primary || '#ff6b6b';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
                },
                {
                    type: 'cartoon_icon',
                    shape: shape,
                    color: color,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: '#2d3436',
                    borderWidth: 6,
                    glow: config.glow
                },
                ...(config.complexity > 3 ? [
                    {
                        type: 'cartoon_eyes',
                        color: '#ffffff',
                        pupilColor: '#2d3436',
                        size: size * 0.3,
                        x: 250,
                        y: 250 - size * 0.1
                    },
                    {
                        type: 'cartoon_mouth',
                        color: '#2d3436',
                        size: size * 0.2,
                        x: 250,
                        y: 250 + size * 0.2,
                        expression: 'smile'
                    }
                ] : [])
            ],
            effects: []
        };
    },

    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size,
                    x: 250,
                    y: 250,
                    shape: 'ellipse'
                },
                {
                    type: 'cartoon_eyes',
                    color: '#ffffff',
                    pupilColor: '#2d3436',
                    size: size * 0.2,
                    x: 250,
                    y: 250 - size * 0.1
                },
                {
                    type: 'cartoon_mouth',
                    color: '#e17055',
                    size: size * 0.15,
                    x: 250,
                    y: 250 + size * 0.2,
                    expression: config.expression || 'smile'
                },
                {
                    type: 'cartoon_hair',
                    color: hairColor,
                    size: size,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: config.hairStyle || 'short'
                }
            ],
            effects: []
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#ff6b6b';
        const size = config.size || 250;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || 'transparent')
                },
                {
                    type: 'cartoon_body',
                    color: outfitColor,
                    size: size * 0.4,
                    x: 250,
                    y: 250 + size * 0.15
                },
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.25,
                    shape: 'ellipse'
                },
                {
                    type: 'cartoon_eyes',
                    color: '#ffffff',
                    pupilColor: '#2d3436',
                    size: size * 0.1,
                    x: 250,
                    y: 250 - size * 0.3
                },
                {
                    type: 'cartoon_mouth',
                    color: '#e17055',
                    size: size * 0.08,
                    x: 250,
                    y: 250 - size * 0.15,
                    expression: config.expression || 'smile'
                },
                {
                    type: 'cartoon_hair',
                    color: hairColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: config.hairStyle || 'short'
                },
                {
                    type: 'cartoon_limbs',
                    color: skinColor,
                    size: size * 0.25,
                    x: 250,
                    y: 250 + size * 0.05,
                    pose: config.pose || 'standing'
                }
            ],
            effects: []
        };
    }
};