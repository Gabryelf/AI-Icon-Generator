// =============================================================
// PIXEL STYLE - Пиксельный стиль для всех категорий
// =============================================================

export const PixelStyle = {
    name: 'pixel',
    displayName: 'Пиксельный',
    icon: 'fas fa-th',
    description: 'Ретро-пиксельная графика 8-16 бит',
    font: 'Press Start 2P',
    
    // Палитры для разных категорий
    palettes: {
        button: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#1a1a2e'
        },
        icon: {
            primary: '#4d96ff',
            secondary: '#ff6bff',
            accent: '#ffd93d',
            background: '#0a0a0f'
        },
        avatar: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#2d3436'
        },
        character: {
            primary: '#6bcb77',
            secondary: '#4d96ff',
            accent: '#ff6bff',
            background: '#0a0a0f'
        }
    },

    // Генерация пиксельной кнопки
    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#ff6b6b';
        const text = config.text || 'PIXEL';
        const size = config.size || 120;
        const pixelSize = 4;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#1a1a2e')
                },
                {
                    type: 'pixel_button',
                    color: color,
                    text: text,
                    size: size,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    textColor: '#ffffff',
                    font: 'Press Start 2P'
                },
                {
                    type: 'pixel_border',
                    color: this.lightenColor(color, 20),
                    size: size + 8,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    opacity: 0.5
                }
            ],
            effects: []
        };
    },

    // Генерация пиксельной иконки
    generateIcon: (config, palette) => {
        const color = config.color || palette.primary || '#4d96ff';
        const shape = config.shape || 'circle';
        const size = config.size || 120;
        const pixelSize = 4;

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                {
                    type: 'pixel_icon',
                    shape: shape,
                    color: color,
                    size: size,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    complexity: config.complexity || 5
                }
            ],
            effects: []
        };
    },

    // Генерация пиксельного аватара
    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const size = config.size || 200;
        const pixelSize = Math.max(4, Math.floor(size / 40));

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#2d3436')
                },
                {
                    type: 'pixel_face',
                    skinColor: skinColor,
                    hairColor: hairColor,
                    eyeColor: eyeColor,
                    size: size,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    expression: config.expression || 'smile',
                    hairStyle: config.hairStyle || 'short'
                }
            ],
            effects: []
        };
    },

    // Генерация пиксельного персонажа
    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || '#f5d0b8';
        const hairColor = config.hairColor || '#2d3436';
        const eyeColor = config.eyeColor || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#6bcb77';
        const size = config.size || 250;
        const pixelSize = Math.max(4, Math.floor(size / 50));

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                {
                    type: 'pixel_character',
                    skinColor: skinColor,
                    hairColor: hairColor,
                    eyeColor: eyeColor,
                    outfitColor: outfitColor,
                    size: size,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    expression: config.expression || 'smile',
                    hairStyle: config.hairStyle || 'short',
                    bodyType: config.bodyType || 'normal',
                    pose: config.pose || 'standing',
                    weapon: config.weapon || 'none'
                }
            ],
            effects: []
        };
    },

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
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