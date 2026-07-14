// =============================================================
// PIXEL STYLE - Настоящие пиксельные спрайты 8-16 бит
// =============================================================

export const PixelStyle = {
    name: 'pixel',
    displayName: 'Пиксельный',
    icon: 'fas fa-th',
    description: 'Настоящие пиксельные спрайты 8-16 бит',
    font: 'Press Start 2P',
    
    palettes: {
        button: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#1a1a2e',
            text: '#ffffff'
        },
        icon: {
            primary: '#4d96ff',
            secondary: '#ff6bff',
            accent: '#ffd93d',
            background: '#0a0a0f',
            text: '#ffffff'
        },
        avatar: {
            primary: '#ff6b6b',
            secondary: '#ffd93d',
            accent: '#6bcb77',
            background: '#2d3436',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        },
        character: {
            primary: '#6bcb77',
            secondary: '#4d96ff',
            accent: '#ff6bff',
            background: '#0a0a0f',
            skin: '#f5d0b8',
            hair: '#2d3436',
            eye: '#4d96ff'
        }
    },

    // ===== ПИКСЕЛЬНАЯ КНОПКА =====
    generateButton: (config, palette) => {
        const color = config.color || palette.primary || '#ff6b6b';
        const text = config.text || 'PIXEL';
        const size = config.size || 120;
        const pixelSize = 4;
        const w = Math.floor(size * 1.5 / pixelSize) * pixelSize;
        const h = Math.floor(size * 0.5 / pixelSize) * pixelSize;
        const px = 250;
        const py = 250;
        const textSize = Math.floor(size * 0.2 / pixelSize) * pixelSize;

        // Генерация пиксельного шрифта для текста
        const pixelText = text.toUpperCase().split('').map(char => {
            return char === ' ' ? ' ' : char;
        }).join('');

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#1a1a2e')
                },
                // Пиксельная кнопка
                {
                    type: 'pixel_button_sprite',
                    color: color,
                    text: pixelText,
                    w: w,
                    h: h,
                    pixelSize: pixelSize,
                    x: px,
                    y: py,
                    textColor: palette.text || '#ffffff',
                    fontSize: textSize
                },
                // Пиксельная рамка (внешняя)
                {
                    type: 'pixel_border_sprite',
                    color: this.lightenColor(color, 30),
                    w: w + pixelSize * 2,
                    h: h + pixelSize * 2,
                    pixelSize: pixelSize,
                    x: px,
                    y: py,
                    opacity: 0.5
                },
                // Пиксельные уголки
                {
                    type: 'pixel_corners_sprite',
                    color: this.lightenColor(color, 50),
                    size: Math.min(w, h) * 0.3,
                    pixelSize: pixelSize,
                    x: px,
                    y: py
                }
            ],
            effects: []
        };
    },

    // ===== ПИКСЕЛЬНАЯ ИКОНКА (настоящий спрайт) =====
    generateIcon: (config, palette) => {
        const color = config.color || palette.primary || '#4d96ff';
        const shape = config.shape || 'circle';
        const size = config.size || 120;
        const pixelSize = 4;
        const gridSize = Math.floor(size / pixelSize);

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                // Пиксельный спрайт иконки
                {
                    type: 'pixel_icon_sprite',
                    shape: shape,
                    color: color,
                    gridSize: gridSize,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    complexity: config.complexity || 5
                },
                // Пиксельная рамка
                {
                    type: 'pixel_frame_sprite',
                    color: this.darkenColor(color, 40),
                    gridSize: gridSize + 2,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250,
                    opacity: 0.3
                }
            ],
            effects: []
        };
    },

    // ===== ПИКСЕЛЬНЫЙ АВАТАР (настоящее пиксельное лицо) =====
    generateAvatar: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const size = config.size || 200;
        const pixelSize = Math.max(4, Math.floor(size / 32));

        // Создаем пиксельный спрайт лица 32x32
        const faceSprite = generatePixelFace(skinColor, hairColor, eyeColor, config.expression || 'smile', config.hairStyle || 'short');

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#2d3436')
                },
                {
                    type: 'pixel_avatar_sprite',
                    pixels: faceSprite,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250
                }
            ],
            effects: []
        };
    },

    // ===== ПИКСЕЛЬНЫЙ ПЕРСОНАЖ (настоящий спрайт) =====
    generateCharacter: (config, palette) => {
        const skinColor = config.skinColor || palette.skin || '#f5d0b8';
        const hairColor = config.hairColor || palette.hair || '#2d3436';
        const eyeColor = config.eyeColor || palette.eye || '#4d96ff';
        const outfitColor = config.outfitColor || palette.primary || '#6bcb77';
        const size = config.size || 250;
        const pixelSize = Math.max(4, Math.floor(size / 48));

        // Создаем пиксельный спрайт персонажа 48x48
        const charSprite = generatePixelCharacter(skinColor, hairColor, eyeColor, outfitColor, 
            config.expression || 'smile', config.hairStyle || 'short', config.bodyType || 'normal', 
            config.pose || 'standing', config.weapon || 'none');

        return {
            layers: [
                {
                    type: 'background',
                    style: 'solid',
                    color: config.bgColor === 'transparent' ? 'transparent' : (config.bgColor || palette.background || '#0a0a0f')
                },
                {
                    type: 'pixel_character_sprite',
                    pixels: charSprite,
                    pixelSize: pixelSize,
                    x: 250,
                    y: 250
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

// =============================================================
// ГЕНЕРАТОРЫ ПИКСЕЛЬНЫХ СПРАЙТОВ
// =============================================================

function generatePixelFace(skinColor, hairColor, eyeColor, expression, hairStyle) {
    const size = 32;
    const grid = Array(size).fill(null).map(() => Array(size).fill(0));
    
    // Базовые цвета
    const SKIN = skinColor;
    const SKIN_SHADOW = darkenHex(skinColor, 15);
    const HAIR = hairColor;
    const HAIR_LIGHT = lightenHex(hairColor, 20);
    const EYE = '#ffffff';
    const PUPIL = eyeColor;
    const MOUTH = '#e17055';
    const OUTLINE = '#2d3436';

    // Лицо (овал)
    for (let y = 8; y < 24; y++) {
        for (let x = 10; x < 22; x++) {
            const dx = (x - 16) / 6;
            const dy = (y - 16) / 8;
            if (dx*dx + dy*dy < 1) {
                grid[y][x] = SKIN;
            }
        }
    }

    // Глаза
    const eyeY = 13;
    const eyeSpacing = 5;
    for (let side of [-1, 1]) {
        const ex = 16 + side * eyeSpacing;
        // Белки
        for (let ey = eyeY - 1; ey <= eyeY + 2; ey++) {
            for (let ex2 = ex - 2; ex2 <= ex + 1; ex2++) {
                if (grid[ey] && grid[ey][ex2] !== undefined) {
                    grid[ey][ex2] = EYE;
                }
            }
        }
        // Зрачки
        grid[eyeY + 1][ex + (side > 0 ? 0 : 1)] = PUPIL;
        // Блик
        grid[eyeY][ex + (side > 0 ? 1 : 0)] = '#ffffff';
    }

    // Брови
    for (let side of [-1, 1]) {
        const bx = 16 + side * 4;
        for (let i = -2; i <= 1; i++) {
            grid[11][bx + i] = HAIR;
            grid[12][bx + i] = HAIR;
        }
    }

    // Рот
    if (expression === 'smile' || expression === 'happy') {
        grid[19][15] = MOUTH;
        grid[19][16] = MOUTH;
        grid[19][17] = MOUTH;
        grid[20][15] = MOUTH;
        grid[20][17] = MOUTH;
    } else if (expression === 'surprised') {
        grid[19][15] = MOUTH;
        grid[19][16] = MOUTH;
        grid[19][17] = MOUTH;
        grid[20][15] = MOUTH;
        grid[20][16] = MOUTH;
        grid[20][17] = MOUTH;
    } else {
        grid[19][15] = MOUTH;
        grid[19][16] = MOUTH;
        grid[19][17] = MOUTH;
    }

    // Волосы
    if (hairStyle === 'short') {
        for (let y = 4; y < 10; y++) {
            for (let x = 10; x < 22; x++) {
                if (y < 8 || (y === 8 && (x < 12 || x > 20))) {
                    grid[y][x] = HAIR;
                }
            }
        }
        // Челка
        for (let x = 12; x < 20; x++) {
            grid[9][x] = HAIR;
            grid[10][x] = HAIR;
        }
    } else if (hairStyle === 'long') {
        for (let y = 4; y < 10; y++) {
            for (let x = 10; x < 22; x++) {
                if (y < 8 || (y === 8 && (x < 12 || x > 20))) {
                    grid[y][x] = HAIR;
                }
            }
        }
        // Длинные волосы по бокам
        for (let y = 10; y < 24; y++) {
            grid[y][9] = HAIR;
            grid[y][10] = HAIR_LIGHT;
            grid[y][21] = HAIR;
            grid[y][22] = HAIR_LIGHT;
        }
        // Челка
        for (let x = 12; x < 20; x++) {
            grid[9][x] = HAIR;
            grid[10][x] = HAIR;
        }
    } else if (hairStyle === 'ponytail') {
        for (let y = 4; y < 10; y++) {
            for (let x = 10; x < 22; x++) {
                if (y < 8 || (y === 8 && (x < 12 || x > 20))) {
                    grid[y][x] = HAIR;
                }
            }
        }
        // Хвост
        for (let y = 12; y < 20; y++) {
            grid[y][22] = HAIR;
            grid[y][23] = HAIR_LIGHT;
        }
        // Челка
        for (let x = 12; x < 20; x++) {
            grid[9][x] = HAIR;
            grid[10][x] = HAIR;
        }
    }

    return grid;
}

function generatePixelCharacter(skinColor, hairColor, eyeColor, outfitColor, expression, hairStyle, bodyType, pose, weapon) {
    const size = 48;
    const grid = Array(size).fill(null).map(() => Array(size).fill(0));
    
    // Базовые цвета
    const SKIN = skinColor;
    const SKIN_SHADOW = darkenHex(skinColor, 15);
    const HAIR = hairColor;
    const HAIR_LIGHT = lightenHex(hairColor, 20);
    const OUTFIT = outfitColor;
    const OUTFIT_SHADOW = darkenHex(outfitColor, 20);
    const EYE = '#ffffff';
    const PUPIL = eyeColor;
    const MOUTH = '#e17055';
    const OUTLINE = '#2d3436';
    const BOOT = '#2d3436';

    // Тело
    const bodyWidth = bodyType === 'slim' ? 12 : bodyType === 'muscular' ? 16 : 14;
    const bodyStartX = 24 - bodyWidth/2;
    const bodyEndX = 24 + bodyWidth/2;
    
    for (let y = 20; y < 38; y++) {
        for (let x = bodyStartX; x < bodyEndX; x++) {
            if (x > bodyStartX + 1 && x < bodyEndX - 1) {
                grid[y][x] = OUTFIT;
            } else {
                grid[y][x] = OUTFIT_SHADOW;
            }
        }
    }

    // Шея
    for (let y = 16; y < 20; y++) {
        for (let x = 22; x < 26; x++) {
            grid[y][x] = SKIN;
        }
    }

    // Голова (овал)
    for (let y = 4; y < 18; y++) {
        for (let x = 16; x < 32; x++) {
            const dx = (x - 24) / 8;
            const dy = (y - 11) / 7;
            if (dx*dx + dy*dy < 1) {
                grid[y][x] = SKIN;
            }
        }
    }

    // Глаза
    const eyeY = 10;
    for (let side of [-1, 1]) {
        const ex = 24 + side * 4;
        grid[eyeY][ex - 1] = EYE;
        grid[eyeY][ex] = EYE;
        grid[eyeY + 1][ex - 1] = EYE;
        grid[eyeY + 1][ex] = EYE;
        grid[eyeY + 1][ex + (side > 0 ? 0 : 1)] = PUPIL;
        grid[eyeY][ex + (side > 0 ? 1 : 0)] = '#ffffff';
    }

    // Брови
    for (let side of [-1, 1]) {
        const bx = 24 + side * 4;
        for (let i = -2; i <= 1; i++) {
            grid[8][bx + i] = HAIR;
        }
    }

    // Рот
    if (expression === 'smile' || expression === 'happy') {
        grid[14][22] = MOUTH;
        grid[14][23] = MOUTH;
        grid[14][24] = MOUTH;
        grid[14][25] = MOUTH;
        grid[15][22] = MOUTH;
        grid[15][25] = MOUTH;
    } else {
        grid[14][22] = MOUTH;
        grid[14][23] = MOUTH;
        grid[14][24] = MOUTH;
        grid[14][25] = MOUTH;
    }

    // Волосы
    if (hairStyle === 'short') {
        for (let y = 2; y < 8; y++) {
            for (let x = 18; x < 30; x++) {
                if (y < 6 || (y === 6 && (x < 20 || x > 28))) {
                    grid[y][x] = HAIR;
                }
            }
        }
        for (let x = 20; x < 28; x++) {
            grid[7][x] = HAIR;
        }
    } else if (hairStyle === 'long') {
        for (let y = 2; y < 8; y++) {
            for (let x = 18; x < 30; x++) {
                if (y < 6 || (y === 6 && (x < 20 || x > 28))) {
                    grid[y][x] = HAIR;
                }
            }
        }
        for (let y = 8; y < 20; y++) {
            grid[y][16] = HAIR;
            grid[y][17] = HAIR_LIGHT;
            grid[y][30] = HAIR;
            grid[y][31] = HAIR_LIGHT;
        }
        for (let x = 20; x < 28; x++) {
            grid[7][x] = HAIR;
        }
    }

    // Руки
    const armY = 22;
    const armLength = pose === 'fighting' ? 16 : 12;
    // Левая рука
    for (let y = armY; y < armY + armLength; y++) {
        const xOffset = y < armY + 4 ? 0 : 1;
        grid[y][bodyStartX - 2 + xOffset] = SKIN;
        grid[y][bodyStartX - 1 + xOffset] = SKIN_SHADOW;
    }
    // Правая рука
    for (let y = armY; y < armY + armLength; y++) {
        const xOffset = y < armY + 4 ? 0 : -1;
        grid[y][bodyEndX + 1 + xOffset] = SKIN;
        grid[y][bodyEndX + 2 + xOffset] = SKIN_SHADOW;
    }

    // Ноги
    const legY = 38;
    const legWidth = 4;
    for (let side of [-1, 1]) {
        const legX = 24 + side * 5;
        for (let y = legY; y < 46; y++) {
            for (let x = legX; x < legX + legWidth; x++) {
                grid[y][x] = OUTFIT_SHADOW;
                if (y > 44) {
                    grid[y][x] = BOOT;
                }
            }
        }
    }

    // Оружие
    if (weapon === 'sword') {
        for (let y = 10; y < 24; y++) {
            grid[y][34] = '#c0c0c0';
            if (y === 10 || y === 11) {
                grid[y][34] = '#ffd700';
            }
        }
        grid[9][33] = '#ffd700';
        grid[9][35] = '#ffd700';
    }

    return grid;
}

function lightenHex(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function darkenHex(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}