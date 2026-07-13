// ==============================================================
// ПИКСЕЛЬНЫЙ ГЕНЕРАТОР - Создание пиксельных аватаров и спрайтов
// ==============================================================

export class PixelGenerator {
    constructor() {
        this.pixelSize = 4;
        this.defaultSize = 16;
    }

    generateAvatar(params) {
        const { 
            color = '#7c3aed', 
            size = 16, 
            shape = 'human', 
            skinColor = '#f5d0b8',
            accessories = [],
            style = 'default'
        } = params;

        const grid = this.createGrid(size);
        const palette = this.generatePalette(color, skinColor);

        // Создаем персонажа в зависимости от формы
        switch (shape) {
            case 'human':
                this.drawHuman(grid, palette, style);
                break;
            case 'robot':
                this.drawRobot(grid, palette);
                break;
            case 'animal':
                this.drawAnimal(grid, palette);
                break;
            case 'fantasy':
                this.drawFantasy(grid, palette);
                break;
            case 'knight':
                this.drawKnight(grid, palette);
                break;
            case 'mage':
                this.drawMage(grid, palette);
                break;
            case 'ninja':
                this.drawNinja(grid, palette);
                break;
            default:
                this.drawHuman(grid, palette, style);
        }

        // Добавляем аксессуары
        accessories.forEach(acc => {
            this.addAccessory(grid, acc, palette);
        });

        // Конвертируем в слои для отрисовки
        return this.gridToLayers(grid, size, palette);
    }

    createGrid(size) {
        return new Array(size).fill(0).map(() => new Array(size).fill('transparent'));
    }

    generatePalette(baseColor, skinColor) {
        const colors = {
            skin: skinColor || '#f5d0b8',
            skinDark: this.darkenColor(skinColor || '#f5d0b8', 20),
            skinLight: this.lightenColor(skinColor || '#f5d0b8', 20),
            eye: '#ffffff',
            pupil: '#2d3436',
            body: baseColor,
            bodyLight: this.lightenColor(baseColor, 30),
            bodyDark: this.darkenColor(baseColor, 30),
            legs: this.darkenColor(baseColor, 40),
            shoes: '#2d3436',
            hair: '#2d3436',
            hairLight: '#4a4a4a',
            outline: '#1a1a2e',
            accent: '#ffd700',
            weapon: '#c0c0c0',
            armor: '#808080'
        };
        return colors;
    }

    // ===== РИСОВАНИЕ РАЗНЫХ ТИПОВ ПЕРСОНАЖЕЙ =====

    drawHuman(grid, palette, style = 'default') {
        const size = grid.length;
        const center = Math.floor(size / 2);

        // Голова (4x4)
        for (let y = 2; y < 6; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 2 || y === 5 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.skin;
                }
            }
        }

        // Волосы
        if (style !== 'bald') {
            for (let x = center - 2; x < center + 2; x++) {
                grid[1][x] = palette.hair;
                if (x === center - 2 || x === center + 1) {
                    grid[0][x] = palette.hair;
                }
            }
        }

        // Глаза
        grid[3][center - 1] = palette.eye;
        grid[3][center] = palette.eye;
        grid[3][center - 1] = palette.pupil;
        grid[3][center] = palette.pupil;

        // Рот
        grid[4][center] = palette.pupil;

        // Тело (4x6)
        for (let y = 6; y < 12; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 6 || y === 11 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else if (y > 6 && y < 11) {
                    grid[y][x] = palette.body;
                }
            }
        }

        // Руки
        for (let y = 7; y < 10; y++) {
            grid[y][center - 3] = palette.skin;
            grid[y][center + 2] = palette.skin;
        }

        // Ноги
        for (let y = 12; y < 15; y++) {
            grid[y][center - 1] = palette.legs;
            grid[y][center] = palette.legs;
        }

        // Обувь
        grid[14][center - 1] = palette.shoes;
        grid[14][center] = palette.shoes;
    }

    drawRobot(grid, palette) {
        const size = grid.length;
        const center = Math.floor(size / 2);

        // Голова робота (квадратная)
        for (let y = 2; y < 6; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 2 || y === 5 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.bodyLight;
                }
            }
        }

        // Светодиоды глаз
        grid[3][center - 1] = '#00ff00';
        grid[3][center] = '#00ff00';

        // Антенна
        grid[1][center] = palette.body;
        grid[0][center] = '#ff0000';

        // Тело робота
        for (let y = 6; y < 12; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 6 || y === 11 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.body;
                }
            }
        }

        // Кнопки на теле
        grid[8][center - 1] = '#ff0000';
        grid[8][center] = '#00ff00';
        grid[9][center] = '#ffff00';

        // Руки-манипуляторы
        for (let y = 7; y < 10; y++) {
            grid[y][center - 3] = palette.bodyLight;
            grid[y][center + 2] = palette.bodyLight;
        }

        // Ноги-гусеницы
        for (let y = 12; y < 15; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                grid[y][x] = palette.bodyDark;
            }
        }
    }

    drawAnimal(grid, palette) {
        const size = grid.length;
        const center = Math.floor(size / 2);

        // Голова животного
        for (let y = 2; y < 6; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 2 || y === 5 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.skin;
                }
            }
        }

        // Уши
        grid[2][center - 2] = palette.skin;
        grid[2][center + 1] = palette.skin;
        grid[1][center - 2] = palette.skinDark;
        grid[1][center + 1] = palette.skinDark;

        // Глаза
        grid[3][center - 1] = palette.eye;
        grid[3][center] = palette.eye;
        grid[3][center - 1] = palette.pupil;
        grid[3][center] = palette.pupil;

        // Нос
        grid[4][center] = palette.pupil;

        // Тело
        for (let y = 6; y < 11; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 6 || y === 10 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.body;
                }
            }
        }

        // Лапы
        for (let y = 11; y < 14; y++) {
            grid[y][center - 2] = palette.legs;
            grid[y][center + 1] = palette.legs;
        }
    }

    drawFantasy(grid, palette) {
        // Рисуем базового человека
        this.drawHuman(grid, palette, 'fantasy');

        const size = grid.length;
        const center = Math.floor(size / 2);

        // Крылья
        for (let y = 4; y < 10; y++) {
            if (y >= 4 && y <= 6) {
                grid[y][center - 5] = palette.bodyLight;
                grid[y][center + 4] = palette.bodyLight;
            }
            if (y >= 5 && y <= 7) {
                grid[y][center - 6] = palette.bodyLight;
                grid[y][center + 5] = palette.bodyLight;
            }
        }

        // Магический шар
        grid[8][center - 3] = '#ff00ff';
        grid[8][center + 2] = '#ff00ff';
        grid[9][center - 3] = '#ff00ff';
        grid[9][center + 2] = '#ff00ff';

        // Корона
        for (let x = center - 2; x < center + 2; x++) {
            grid[1][x] = palette.accent;
            if (x === center - 2 || x === center + 1) {
                grid[0][x] = palette.accent;
            }
        }
        grid[0][center] = palette.accent;
    }

    drawKnight(grid, palette) {
        // Рисуем базового человека
        this.drawHuman(grid, palette, 'bald');

        const size = grid.length;
        const center = Math.floor(size / 2);

        // Шлем
        for (let y = 1; y < 6; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 1 || y === 5 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.armor;
                } else if (y > 1 && y < 5) {
                    grid[y][x] = palette.bodyLight;
                }
            }
        }

        // Забрало
        grid[3][center - 1] = palette.outline;
        grid[3][center] = palette.outline;

        // Доспехи
        for (let y = 6; y < 12; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 6 || y === 11 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.armor;
                }
            }
        }

        // Меч
        for (let y = 4; y < 10; y++) {
            grid[y][center + 3] = palette.weapon;
        }
        grid[3][center + 3] = palette.accent;
        grid[2][center + 3] = palette.accent;

        // Щит
        for (let y = 7; y < 11; y++) {
            for (let x = center - 4; x < center - 2; x++) {
                if (y === 7 || y === 10 || x === center - 4 || x === center - 3) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.bodyDark;
                }
            }
        }
        // Символ на щите
        grid[8][center - 3] = palette.accent;
        grid[9][center - 3] = palette.accent;
    }

    drawMage(grid, palette) {
        // Рисуем базового человека
        this.drawHuman(grid, palette, 'fantasy');

        const size = grid.length;
        const center = Math.floor(size / 2);

        // Шляпа мага
        for (let x = center - 3; x < center + 3; x++) {
            grid[0][x] = palette.hair;
            grid[1][x] = palette.hair;
            if (x === center - 3 || x === center + 2) {
                grid[2][x] = palette.hair;
            }
        }
        // Острая верхушка
        grid[0][center] = palette.accent;

        // Посох
        for (let y = 8; y < 15; y++) {
            grid[y][center + 3] = palette.weapon;
        }
        grid[7][center + 3] = palette.accent;

        // Магические шары
        grid[9][center - 4] = '#ff00ff';
        grid[10][center - 4] = '#ff00ff';
        grid[11][center - 4] = '#ff00ff';
    }

    drawNinja(grid, palette) {
        // Рисуем базового человека
        this.drawHuman(grid, palette, 'bald');

        const size = grid.length;
        const center = Math.floor(size / 2);

        // Маска
        for (let y = 2; y < 6; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y >= 2 && y < 6 && x >= center - 2 && x < center + 2) {
                    if (y === 4 || y === 5) {
                        grid[y][x] = palette.hair;
                    } else {
                        grid[y][x] = palette.hairLight;
                    }
                }
            }
        }

        // Глаза (видны через маску)
        grid[3][center - 1] = palette.eye;
        grid[3][center] = palette.eye;

        // Тело в черном
        for (let y = 6; y < 12; y++) {
            for (let x = center - 2; x < center + 2; x++) {
                if (y === 6 || y === 11 || x === center - 2 || x === center + 1) {
                    grid[y][x] = palette.outline;
                } else {
                    grid[y][x] = palette.hair;
                }
            }
        }

        // Меч за спиной
        for (let y = 3; y < 8; y++) {
            grid[y][center + 2] = palette.weapon;
        }
        grid[2][center + 2] = palette.accent;

        // Пояс с инструментами
        grid[9][center - 2] = palette.accent;
        grid[9][center + 1] = palette.accent;
        grid[10][center - 2] = palette.accent;
        grid[10][center + 1] = palette.accent;
    }

    // ===== АКСЕССУАРЫ =====

    addAccessory(grid, type, palette) {
        const size = grid.length;
        const center = Math.floor(size / 2);

        switch (type) {
            case 'hat':
                for (let x = center - 3; x < center + 3; x++) {
                    grid[0][x] = palette.hair;
                    if (x === center - 3 || x === center + 2) {
                        grid[1][x] = palette.hair;
                    }
                }
                break;
            case 'glasses':
                grid[3][center - 2] = '#000000';
                grid[3][center + 1] = '#000000';
                grid[3][center - 1] = '#ffffff';
                grid[3][center] = '#ffffff';
                break;
            case 'cape':
                for (let y = 7; y < 12; y++) {
                    if (y >= 7 && y <= 9) {
                        grid[y][center - 4] = palette.body;
                        grid[y][center + 3] = palette.body;
                    }
                    if (y >= 10) {
                        grid[y][center - 4] = palette.bodyDark;
                        grid[y][center + 3] = palette.bodyDark;
                    }
                }
                break;
            case 'weapon':
                for (let y = 5; y < 10; y++) {
                    grid[y][center + 3] = palette.weapon;
                }
                grid[4][center + 3] = palette.accent;
                break;
            case 'shield':
                for (let y = 7; y < 11; y++) {
                    for (let x = center - 4; x < center - 2; x++) {
                        if (y === 7 || y === 10 || x === center - 4 || x === center - 3) {
                            grid[y][x] = palette.outline;
                        } else {
                            grid[y][x] = palette.bodyDark;
                        }
                    }
                }
                break;
        }
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====

    gridToLayers(grid, size, palette) {
        const layers = [];

        // Добавляем прозрачный фон
        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // Создаем слой с пиксельным аватаром
        layers.push({
            type: 'pixel_avatar',
            pixels: grid,
            pixelSize: this.pixelSize,
            size: size,
            palette: palette
        });

        return {
            layers: layers,
            effects: [],
            style: 'pixel',
            category: 'pixel_avatar'
        };
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
}