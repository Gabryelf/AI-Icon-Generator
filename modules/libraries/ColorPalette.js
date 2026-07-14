// =============================================================
// COLOR PALETTE - Умные цветовые палитры для всех стилей
// =============================================================

export class ColorPalette {
    constructor() {
        this.palettes = {
            // Базовые палитры по стилям
            pixel: {
                primary: '#ff6b6b',
                secondary: '#ffd93d',
                accent: '#6bcb77',
                background: '#1a1a2e',
                text: '#ffffff',
                shadow: 'rgba(0,0,0,0.3)'
            },
            cartoon: {
                primary: '#ff6b6b',
                secondary: '#ffd93d',
                accent: '#6bcb77',
                background: '#f0f0f0',
                text: '#2d3436',
                shadow: 'rgba(0,0,0,0.2)'
            },
            cyberpunk: {
                primary: '#ff00ff',
                secondary: '#00ffff',
                accent: '#ff0066',
                background: '#0a0a0f',
                text: '#00ffff',
                shadow: 'rgba(255,0,255,0.3)'
            },
            fantasy: {
                primary: '#7c3aed',
                secondary: '#ffd700',
                accent: '#8b5cf6',
                background: '#0a0a0f',
                text: '#ffd700',
                shadow: 'rgba(124,58,237,0.3)'
            },
            chibi: {
                primary: '#ff9ff3',
                secondary: '#f368e0',
                accent: '#ff6b6b',
                background: '#ffffff',
                text: '#2d3436',
                shadow: 'rgba(255,159,243,0.3)'
            },
            anime: {
                primary: '#ff6b6b',
                secondary: '#ffd93d',
                accent: '#4d96ff',
                background: '#ffffff',
                text: '#2d3436',
                shadow: 'rgba(77,150,255,0.3)'
            },
            casual: {
                primary: '#2d3436',
                secondary: '#636e72',
                accent: '#74b9ff',
                background: '#ffffff',
                text: '#2d3436',
                shadow: 'rgba(0,0,0,0.1)'
            },
            // Дефолтная
            default: {
                primary: '#7c3aed',
                secondary: '#3b82f6',
                accent: '#ec4899',
                background: '#0a0a0f',
                text: '#ffffff',
                shadow: 'rgba(124,58,237,0.3)'
            }
        };

        // Тематические палитры
        this.themes = {
            nature: {
                forest: ['#2d5016', '#4a7c2e', '#8cb369', '#d4c9a8', '#5e4b3c'],
                ocean: ['#006994', '#0077be', '#4da6cf', '#b3d9e8', '#f0f8ff'],
                sunset: ['#ff6b35', '#f7931e', '#ffd700', '#ff6348', '#ff4757'],
                spring: ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe']
            },
            mood: {
                dark: ['#0a0a0f', '#1a1a2e', '#2d2d44', '#4a4a6a', '#6a6a8a'],
                light: ['#f0f0f0', '#ffffff', '#e8e8e8', '#d0d0d0', '#b0b0b0'],
                warm: ['#ff6b35', '#f7931e', '#ffd700', '#ff9f43', '#ff6348'],
                cool: ['#006994', '#0077be', '#4da6cf', '#74b9ff', '#a29bfe']
            }
        };

        // Кастомные палитры пользователя
        this.customPalettes = new Map();
    }

    /**
     * Получить палитру для стиля и категории
     * @param {string} style - Стиль
     * @param {string} category - Категория
     * @returns {Object}
     */
    getPalette(style, category = null) {
        let palette = this.palettes[style] || this.palettes.default;
        
        // Модификация палитры в зависимости от категории
        if (category) {
            palette = this.modifyPaletteForCategory(palette, category);
        }
        
        return { ...palette };
    }

    /**
     * Модификация палитры для категории
     * @param {Object} palette - Исходная палитра
     * @param {string} category - Категория
     * @returns {Object}
     */
    modifyPaletteForCategory(palette, category) {
        const modified = { ...palette };
        
        switch (category) {
            case 'button':
                // Кнопки более яркие
                modified.primary = this.lightenColor(modified.primary, 10);
                modified.accent = this.lightenColor(modified.accent, 20);
                break;
            case 'icon':
                // Иконки с контрастными акцентами
                modified.secondary = this.darkenColor(modified.secondary, 10);
                break;
            case 'avatar':
                // Аватары с мягкими тонами
                modified.primary = this.desaturateColor(modified.primary, 20);
                modified.background = this.lightenColor(modified.background, 30);
                break;
            case 'character':
                // Персонажи с насыщенными цветами
                modified.primary = this.saturateColor(modified.primary, 20);
                modified.accent = this.saturateColor(modified.accent, 20);
                break;
        }
        
        return modified;
    }

    /**
     * Получить цвета для генерации
     * @param {string} style - Стиль
     * @param {number} count - Количество цветов
     * @param {string} category - Категория
     * @returns {Array<string>}
     */
    getColors(style, count = 3, category = null) {
        const palette = this.getPalette(style, category);
        const colors = [];

        if (palette.primary) colors.push(palette.primary);
        if (palette.secondary) colors.push(palette.secondary);
        if (palette.accent) colors.push(palette.accent);

        // Генерация дополнительных цветов
        while (colors.length < count) {
            const baseColor = colors[colors.length % colors.length] || palette.primary || '#7c3aed';
            const variation = (Math.random() - 0.5) * 30;
            colors.push(this.adjustColor(baseColor, variation));
        }

        return colors.slice(0, count);
    }

    /**
     * Получить случайную тему
     * @param {string} category - Категория темы
     * @returns {Array<string>}
     */
    getRandomTheme(category = 'nature') {
        const themes = this.themes[category] || this.themes.nature;
        const themeKeys = Object.keys(themes);
        const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        return themes[randomKey];
    }

    /**
     * Генерация градиента
     * @param {string} startColor - Начальный цвет
     * @param {string} endColor - Конечный цвет
     * @param {number} steps - Количество шагов
     * @returns {Array<string>}
     */
    generateGradient(startColor, endColor, steps = 5) {
        const start = this.hexToRgb(startColor);
        const end = this.hexToRgb(endColor);
        const colors = [];

        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const r = Math.round(start.r + (end.r - start.r) * t);
            const g = Math.round(start.g + (end.g - start.g) * t);
            const b = Math.round(start.b + (end.b - start.b) * t);
            colors.push(this.rgbToHex(r, g, b));
        }

        return colors;
    }

    /**
     * Создать кастомную палитру
     * @param {string} name - Название
     * @param {Object} colors - Цвета
     */
    addCustomPalette(name, colors) {
        this.customPalettes.set(name, colors);
    }

    /**
     * Получить кастомную палитру
     * @param {string} name - Название
     * @returns {Object|null}
     */
    getCustomPalette(name) {
        return this.customPalettes.get(name) || null;
    }

    /**
     * Удалить кастомную палитру
     * @param {string} name - Название
     */
    removeCustomPalette(name) {
        this.customPalettes.delete(name);
    }

    /**
     * Получить все кастомные палитры
     * @returns {Map}
     */
    getCustomPalettes() {
        return new Map(this.customPalettes);
    }

    // ===== ЦВЕТОВЫЕ УТИЛИТЫ =====

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 124, g: 58, b: 237 };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(c => {
            const hex = Math.min(255, Math.max(0, Math.round(c))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const r = Math.min(255, rgb.r + (255 - rgb.r) * (percent / 100));
        const g = Math.min(255, rgb.g + (255 - rgb.g) * (percent / 100));
        const b = Math.min(255, rgb.b + (255 - rgb.b) * (percent / 100));
        return this.rgbToHex(r, g, b);
    }

    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const r = Math.max(0, rgb.r - rgb.r * (percent / 100));
        const g = Math.max(0, rgb.g - rgb.g * (percent / 100));
        const b = Math.max(0, rgb.b - rgb.b * (percent / 100));
        return this.rgbToHex(r, g, b);
    }

    saturateColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        const delta = max - min;
        
        if (delta === 0) return hex;
        
        const factor = 1 + percent / 100;
        const r = Math.min(255, max === rgb.r ? rgb.r + delta * (factor - 1) : rgb.r);
        const g = Math.min(255, max === rgb.g ? rgb.g + delta * (factor - 1) : rgb.g);
        const b = Math.min(255, max === rgb.b ? rgb.b + delta * (factor - 1) : rgb.b);
        
        return this.rgbToHex(r, g, b);
    }

    desaturateColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        const gray = (rgb.r + rgb.g + rgb.b) / 3;
        const factor = percent / 100;
        
        const r = Math.round(rgb.r + (gray - rgb.r) * factor);
        const g = Math.round(rgb.g + (gray - rgb.g) * factor);
        const b = Math.round(rgb.b + (gray - rgb.b) * factor);
        
        return this.rgbToHex(r, g, b);
    }

    adjustColor(hex, degrees) {
        const rgb = this.hexToRgb(hex);
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        let h, s, l;

        // HSL преобразование
        const sum = max + min;
        l = sum / 2;

        if (max === min) {
            h = 0;
            s = 0;
        } else {
            const diff = max - min;
            s = l > 0.5 ? diff / (2 - sum) : diff / sum;
            
            if (max === rgb.r) {
                h = 60 * ((rgb.g - rgb.b) / diff);
            } else if (max === rgb.g) {
                h = 60 * (2 + (rgb.b - rgb.r) / diff);
            } else {
                h = 60 * (4 + (rgb.r - rgb.g) / diff);
            }
            
            if (h < 0) h += 360;
        }

        // Изменение оттенка
        h = (h + degrees) % 360;
        if (h < 0) h += 360;

        // Обратное преобразование в RGB
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return this.rgbToHex(
            (r + m) * 255,
            (g + m) * 255,
            (b + m) * 255
        );
    }

    /**
     * Проверка контрастности цветов
     * @param {string} color1 - Первый цвет
     * @param {string} color2 - Второй цвет
     * @returns {number} - Коэффициент контрастности
     */
    getContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Получить яркость цвета
     * @param {string} hex - HEX цвет
     * @returns {number}
     */
    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Получить доступные стили палитр
     * @returns {Array<string>}
     */
    getAvailableStyles() {
        return Object.keys(this.palettes);
    }

    /**
     * Получить доступные темы
     * @param {string} category - Категория тем
     * @returns {Array<string>}
     */
    getAvailableThemes(category = 'nature') {
        return Object.keys(this.themes[category] || {});
    }

    /**
     * Экспорт палитры в JSON
     * @param {string} style - Стиль
     * @returns {string}
     */
    exportPalette(style) {
        const palette = this.palettes[style];
        if (!palette) return null;
        return JSON.stringify(palette, null, 2);
    }

    /**
     * Импорт палитры из JSON
     * @param {string} name - Название
     * @param {string} json - JSON данные
     * @returns {boolean}
     */
    importPalette(name, json) {
        try {
            const palette = JSON.parse(json);
            if (this.validatePalette(palette)) {
                this.palettes[name] = palette;
                return true;
            }
            return false;
        } catch (e) {
            console.error('Ошибка импорта палитры:', e);
            return false;
        }
    }

    /**
     * Валидация палитры
     * @param {Object} palette - Палитра
     * @returns {boolean}
     */
    validatePalette(palette) {
        const required = ['primary', 'secondary', 'accent', 'background', 'text'];
        return required.every(key => palette[key] && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(palette[key]));
    }
}