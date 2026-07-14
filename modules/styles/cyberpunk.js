// =============================================================
// CYBERPUNK STYLE - Киберпанк стиль для кнопок и иконок
// =============================================================

export const CyberpunkStyle = {
    name: 'cyberpunk',
    displayName: 'Киберпанк',
    icon: 'fas fa-microchip',
    description: 'Неон, футуризм, технологичный стиль',
    font: 'Orbitron',
    
    palettes: {
        button: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            text: '#00ffff'
        },
        icon: {
            primary: '#ff00ff',
            secondary: '#00ffff',
            accent: '#ff0066',
            background: '#0a0a0f',
            text: '#00ffff'
        }
    },

    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#ff00ff';
        const text = config.text || 'CYBER';
        const size = config.size || 120;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                {
                    type: 'cyber_button',
                    color: color,
                    text: text,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: '#00ffff',
                    borderWidth: 3,
                    textColor: '#00ffff',
                    font: 'Orbitron',
                    glow: true
                },
                ...Array.from({ length: 3 }, (_, i) => ({
                    type: 'scanline',
                    y: 220 + i * 30,
                    width: size * 0.8,
                    color: '#00ffff',
                    opacity: 0.1 + i * 0.05
                })),
                {
                    type: 'glow',
                    color: color,
                    size: size * 1.5,
                    intensity: 0.6
                },
                ...Array.from({ length: 4 }, (_, i) => ({
                    type: 'cyber_dot',
                    x: 250 + Math.cos((i / 4) * Math.PI * 2) * size * 0.45,
                    y: 250 + Math.sin((i / 4) * Math.PI * 2) * size * 0.45,
                    size: 4,
                    color: '#00ffff',
                    opacity: 0.3 + Math.sin(i * 1.5) * 0.2
                }))
            ],
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.1 }
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
                {
                    type: 'cyber_icon',
                    shape: shape,
                    color: color,
                    size: size,
                    x: 250,
                    y: 250,
                    borderColor: '#00ffff',
                    borderWidth: 3,
                    glow: true
                },
                ...Array.from({ length: 8 }, (_, i) => ({
                    type: 'cyber_dot',
                    x: 250 + Math.cos((i / 8) * Math.PI * 2) * (size * 0.5 + 10),
                    y: 250 + Math.sin((i / 8) * Math.PI * 2) * (size * 0.5 + 10),
                    size: 4,
                    color: '#00ffff',
                    opacity: 0.3 + Math.sin(i * 1.5) * 0.2
                })),
                {
                    type: 'glow',
                    color: color,
                    size: size * 1.8,
                    intensity: 0.6
                }
            ],
            effects: [
                { type: 'glow', color: color, intensity: 0.6 },
                { type: 'scanline', intensity: 0.1 }
            ]
        };
    }
};