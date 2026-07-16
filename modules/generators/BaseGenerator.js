// ===============================================================
// БАЗОВЫЙ ГЕНЕРАТОР
// ===============================================================

export class BaseGenerator {
    constructor(assetManager, composer) {
        this.assetManager = assetManager;
        this.composer = composer;
        this.category = null;
        this.style = null;
        this.config = null;
    }

    setConfig(category, style, config) {
        this.category = category;
        this.style = style;
        this.config = config;
        return this;
    }

    async generate() {
        throw new Error('Метод generate() должен быть переопределен');
    }

    getConfigValue(key, defaultValue = null) {
        return this.config?.[key] ?? defaultValue;
    }

    getSize() {
        return this.getConfigValue('size', 200);
    }

    createBackgroundLayer(config) {
        const bgColor = config?.backgroundColor || 'transparent';
        if (bgColor === 'transparent') return null;
        
        return {
            type: 'background',
            color: bgColor,
            gradient: bgColor === 'gradient' ? {
                colors: [config?.primaryColor || '#7c3aed', config?.secondaryColor || '#4d96ff'],
                angle: 45
            } : null
        };
    }

    createTextLayer(text, config) {
        if (!text || config.textPosition === 'none') return null;
        
        const size = this.getSize();
        const positions = {
            'top': { x: size/2, y: size * 0.1 },
            'bottom': { x: size/2, y: size * 0.9 },
            'center': { x: size/2, y: size/2 },
            'top-left': { x: size * 0.1, y: size * 0.1 },
            'top-right': { x: size * 0.9, y: size * 0.1 },
            'bottom-left': { x: size * 0.1, y: size * 0.9 },
            'bottom-right': { x: size * 0.9, y: size * 0.9 }
        };
        
        const pos = positions[config.textPosition] || positions.bottom;
        
        return {
            type: 'text',
            text: text,
            x: pos.x,
            y: pos.y,
            color: config.textColor || '#ffffff',
            size: config.textSize || 24,
            font: config.textFont || 'Arial',
            align: ['top', 'bottom', 'center'].includes(config.textPosition) ? 'center' : 
                   ['top-left', 'bottom-left'].includes(config.textPosition) ? 'left' : 'right'
        };
    }

    randomColor() {
        const colors = ['#7c3aed', '#4d96ff', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4', '#10b981'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
}