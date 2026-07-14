// =============================================================
// CYBERPUNK STYLE - Настоящий киберпанк с неоном и хакерской эстетикой
// =============================================================

export const CyberpunkStyle = {
    name: 'cyberpunk',
    displayName: 'Киберпанк',
    icon: 'fas fa-microchip',
    description: 'Неоновые цвета, хакерская эстетика, футуристичный стиль',
    font: 'Orbitron',
    
    palettes: {
        button: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            text: '#00ffff',
            glitch: '#00ff66'
        },
        icon: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            text: '#00ffff',
            glitch: '#00ff66'
        },
        avatar: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#00ffff'
        },
        character: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#00ffff'
        }
    },

    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#ff00ff';
        const text = config.text || 'CYBER';
        const size = config.size || 120;
        const w = size * 1.5;
        const h = size * 0.5;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                // Неоновая кнопка
                {
                    type: 'cyber_button',
                    color: color,
                    text: text,
                    w: w,
                    h: h,
                    x: 250,
                    y: 250,
                    borderColor: palette.secondary || '#00ffff',
                    borderWidth: 3,
                    textColor: palette.text || '#00ffff',
                    font: 'Orbitron',
                    glow: true
                },
                // Хакерские линии (scanlines)
                ...Array.from({ length: 4 }, (_, i) => ({
                    type: 'scanline',
                    y: 220 + i * 25,
                    width: w * 0.9,
                    color: palette.secondary || '#00ffff',
                    opacity: 0.05 + i * 0.03
                })),
                // Неоновое свечение
                {
                    type: 'glow_layer',
                    color: color,
                    size: size * 0.8,
                    x: 250,
                    y: 250
                },
                // Глитч-эффект (цветные полосы)
                ...Array.from({ length: 3 }, (_, i) => ({
                    type: 'glitch_line',
                    color: [palette.primary, palette.secondary, palette.glitch][i % 3],
                    y: 200 + i * 40 + Math.random() * 10,
                    width: 20 + Math.random() * 30,
                    height: 2 + Math.random() * 3,
                    opacity: 0.1 + Math.random() * 0.15
                })),
                // Кибер-уголки
                ...Array.from({ length: 4 }, (_, i) => {
                    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
                    return {
                        type: 'cyber_corner',
                        x: 250 + Math.cos(angle) * w * 0.45,
                        y: 250 + Math.sin(angle) * h * 0.45,
                        size: 15,
                        color: palette.secondary || '#00ffff',
                        angle: angle
                    };
                })
            ],
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.08 },
                { type: 'glitch', intensity: 0.05 }
            ]
        };
    },

    generateIcon: (config, palette) => {
        const color = config.color || palette.primary || '#ff00ff';
        const shape = config.shape || 'circle';
        const size = config.size || 120;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                // Неоновая иконка
                {
                    type: 'cyber_icon',
                    shape: shape,
                    color: color,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: palette.secondary || '#00ffff',
                    borderWidth: 3,
                    glow: true
                },
                // Неоновые точки по кругу
                ...Array.from({ length: 8 }, (_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return {
                        type: 'cyber_dot',
                        x: 250 + Math.cos(angle) * (size * 0.5 + 15),
                        y: 250 + Math.sin(angle) * (size * 0.5 + 15),
                        size: 4 + (i % 3) * 2,
                        color: i % 2 === 0 ? palette.secondary : palette.primary,
                        opacity: 0.3 + (i / 8) * 0.4
                    };
                }),
                // Неоновое свечение
                {
                    type: 'glow_layer',
                    color: color,
                    size: size * 0.9,
                    x: 250,
                    y: 250
                },
                // Хакерские линии
                ...Array.from({ length: 6 }, (_, i) => ({
                    type: 'cyber_line',
                    x1: 100 + i * 60,
                    y1: 50,
                    x2: 100 + i * 60 + 20,
                    y2: 450,
                    color: palette.secondary || '#00ffff',
                    width: 1,
                    opacity: 0.03 + i * 0.02
                }))
            ],
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.08 },
                { type: 'glitch', intensity: 0.05 }
            ]
        };
    },

    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#00ffff';
        const size = config.size || 200;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                // Лицо с кибер-имплантами
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size,
                    x: 250,
                    y: 250,
                    shape: 'ellipse',
                    width: size * 0.85,
                    height: size * 0.95
                },
                // Кибер-глаза (неоновые)
                {
                    type: 'cyber_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.15,
                    x: 250,
                    y: 250 - size * 0.1,
                    glow: true
                },
                // Тонкие брови
                {
                    type: 'eyebrows',
                    color: hairColor,
                    size: size * 0.1,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: 'anime'
                },
                // Рот
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: size * 0.08,
                    x: 250,
                    y: 250 + size * 0.2,
                    expression: config.expression || 'neutral',
                    style: 'small'
                },
                // Волосы с неоновыми прядями
                {
                    type: 'cyber_hair',
                    color: hairColor,
                    size: size,
                    x: 250,
                    y: 250 - size * 0.2,
                    style: config.hairStyle || 'short',
                    neonColor: palette.secondary || '#00ffff'
                },
                // Кибер-импланты на лице
                ...Array.from({ length: 3 }, (_, i) => ({
                    type: 'cyber_implant',
                    x: 250 + (i - 1) * size * 0.15,
                    y: 250 + size * 0.05,
                    size: 3 + i * 2,
                    color: palette.secondary || '#00ffff',
                    opacity: 0.3 + i * 0.1
                })),
                // Неоновое свечение
                {
                    type: 'glow_layer',
                    color: palette.secondary || '#00ffff',
                    size: size * 0.5,
                    x: 250,
                    y: 250
                }
            ],
            effects: [
                { type: 'glow', color: palette.secondary || '#00ffff', intensity: 0.3 },
                { type: 'scanline', intensity: 0.05 }
            ]
        };
    },

    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#00ffff';
        const outfitColor = config.outfitColor || palette.primary || '#ff00ff';
        const size = config.size || 250;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                // Тело с кибер-доспехами
                {
                    type: 'cyber_body',
                    color: outfitColor,
                    size: size * 0.35,
                    x: 250,
                    y: 250 + size * 0.15,
                    shape: 'tech',
                    bodyType: config.bodyType || 'normal'
                },
                // Голова
                {
                    type: 'face_base',
                    color: skinColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.2,
                    shape: 'ellipse',
                    width: size * 0.25,
                    height: size * 0.28
                },
                // Кибер-глаза
                {
                    type: 'cyber_eyes',
                    color: '#ffffff',
                    pupilColor: eyeColor,
                    size: size * 0.06,
                    x: 250,
                    y: 250 - size * 0.3,
                    glow: true
                },
                // Рот
                {
                    type: 'mouth',
                    color: '#e17055',
                    size: size * 0.04,
                    x: 250,
                    y: 250 - size * 0.12,
                    expression: 'neutral',
                    style: 'small'
                },
                // Кибер-волосы
                {
                    type: 'cyber_hair',
                    color: hairColor,
                    size: size * 0.3,
                    x: 250,
                    y: 250 - size * 0.4,
                    style: config.hairStyle || 'short',
                    neonColor: palette.secondary || '#00ffff'
                },
                // Кибер-конечности
                {
                    type: 'cyber_limbs',
                    color: skinColor,
                    size: size * 0.2,
                    x: 250,
                    y: 250 + size * 0.05,
                    pose: config.pose || 'standing',
                    accentColor: palette.secondary || '#00ffff'
                },
                // Неоновое свечение
                {
                    type: 'glow_layer',
                    color: palette.secondary || '#00ffff',
                    size: size * 0.4,
                    x: 250,
                    y: 250
                },
                // Оружие
                ...(config.weapon && config.weapon !== 'none' ? [{
                    type: 'weapon',
                    color: '#c0c0c0',
                    size: size * 0.2,
                    x: 250 + size * 0.3,
                    y: 250 - size * 0.1,
                    weaponType: config.weapon,
                    glow: true
                }] : [])
            ],
            effects: [
                { type: 'glow', color: palette.secondary || '#00ffff', intensity: 0.3 },
                { type: 'scanline', intensity: 0.05 },
                { type: 'glitch', intensity: 0.03 }
            ]
        };
    }
};