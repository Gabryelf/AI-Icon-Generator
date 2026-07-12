// ============================================
// ЦВЕТОВЫЕ ПАЛИТРЫ - Умные палитры для разных стилей
// ============================================

export class ColorPalette {
    constructor() {
        this.palettes = {
            // Тематические палитры
            nature: {
                forest: ['#2d5016', '#4a7c2e', '#8cb369', '#d4c9a8', '#5e4b3c'],
                ocean: ['#006994', '#0077be', '#4da6cf', '#b3d9e8', '#f0f8ff'],
                sunset: ['#ff6b35', '#f7931e', '#ffd700', '#ff6348', '#ff4757'],
                spring: ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe']
            },
            // Стилистические палитры
            style: {
                neon: {
                    primary: '#ff00ff',
                    secondary: '#00ffff',
                    accent: '#ff6600',
                    background: '#0a0a0f'
                },
                vintage: {
                    primary: '#8b7355',
                    secondary: '#d4a574',
                    accent: '#c41e3a',
                    background: '#f5e6d3'
                },
                cyberpunk: {
                    primary: '#ff00ff',
                    secondary: '#00ffff',
                    accent: '#ff0066',
                    background: '#0a0a0f'
                },
                pastel: {
                    primary: '#ffb3ba',
                    secondary: '#ffdfba',
                    accent: '#baffc9',
                    background: '#f0f0f0'
                }
            },
            // Доменные палитры
            domain: {
                gaming: {
                    primary: '#7c3aed',
                    secondary: '#3b82f6',
                    accent: '#ec4899',
                    background: '#0a0a0f'
                },
                branding: {
                    primary: '#1a1a2e',
                    secondary: '#16213e',
                    accent: '#f5c842',
                    background: '#ffffff'
                },
                web: {
                    primary: '#3b82f6',
                    secondary: '#8b5cf6',
                    accent: '#10b981',
                    background: '#ffffff'
                },
                social: {
                    primary: '#ec4899',
                    secondary: '#f59e0b',
                    accent: '#3b82f6',
                    background: '#ffffff'
                }
            }
        };
    }

    getPalette(style, domain) {
        // Приоритет: стиль > домен > дефолтная
        let palette = null;

        // По стилю
        if (style && this.palettes.style[style]) {
            palette = this.palettes.style[style];
        }

        // По домену (если нет стиля)
        if (!palette && domain && this.palettes.domain[domain]) {
            palette = this.palettes.domain[domain];
        }

        // Дефолтная
        if (!palette) {
            palette = {
                primary: '#7c3aed',
                secondary: '#3b82f6',
                accent: '#ec4899',
                background: '#0a0a0f'
            };
        }

        return palette;
    }

    getColors(style, domain, count = 3) {
        const palette = this.getPalette(style, domain);
        const colors = [];

        if (palette.primary) colors.push(palette.primary);
        if (palette.secondary) colors.push(palette.secondary);
        if (palette.accent) colors.push(palette.accent);

        // Если нужно больше цветов, генерируем
        while (colors.length < count) {
            const color = this.generateColor(palette);
            colors.push(color);
        }

        return colors.slice(0, count);
    }

    generateColor(palette) {
        // Генерируем цвет на основе палитры
        const base = palette.primary || '#7c3aed';
        const hue = this.hexToHue(base);
        const variation = (Math.random() - 0.5) * 30;
        return this.hueToHex(hue + variation);
    }

    hexToHue(hex) {
        const rgb = this.hexToRgb(hex);
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        let hue = 0;

        if (max === min) {
            return 0;
        }

        const diff = max - min;
        if (max === rgb.r) {
            hue = ((rgb.g - rgb.b) / diff) * 60;
        } else if (max === rgb.g) {
            hue = (2 + (rgb.b - rgb.r) / diff) * 60;
        } else {
            hue = (4 + (rgb.r - rgb.g) / diff) * 60;
        }

        if (hue < 0) hue += 360;
        return hue;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    hueToHex(hue) {
        const rgb = this.hueToRgb(hue, 50, 50);
        return '#' + [rgb.r, rgb.g, rgb.b].map(c => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hueToRgb(hue, sat, light) {
        const c = (1 - Math.abs(2 * light / 100 - 1)) * sat / 100;
        const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = light / 100 - c / 2;

        let r, g, b;
        if (hue < 60) { r = c; g = x; b = 0; }
        else if (hue < 120) { r = x; g = c; b = 0; }
        else if (hue < 180) { r = 0; g = c; b = x; }
        else if (hue < 240) { r = 0; g = x; b = c; }
        else if (hue < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return {
            r: (r + m) * 255,
            g: (g + m) * 255,
            b: (b + m) * 255
        };
    }
}