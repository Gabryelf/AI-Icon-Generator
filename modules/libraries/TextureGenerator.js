// =============================================================
// TEXTURE GENERATOR - Генерация текстур и паттернов
// =============================================================

export class TextureGenerator {
    constructor() {
        this.patterns = {
            dots: this.generateDots.bind(this),
            grid: this.generateGrid.bind(this),
            diagonal: this.generateDiagonal.bind(this),
            noise: this.generateNoise.bind(this),
            gradient: this.generateGradient.bind(this),
            stripes: this.generateStripes.bind(this),
            checker: this.generateChecker.bind(this),
            waves: this.generateWaves.bind(this),
            spiral: this.generateSpiral.bind(this),
            hex_grid: this.generateHexGrid.bind(this),
            noise_cloud: this.generateNoiseCloud.bind(this),
            marble: this.generateMarble.bind(this),
            wood: this.generateWood.bind(this),
            brick: this.generateBrick.bind(this),
            fabric: this.generateFabric.bind(this)
        };
        
        this.cache = new Map();
        this.maxCacheSize = 50;
    }

    /**
     * Генерация текстуры
     * @param {string} type - Тип текстуры
     * @param {Object} params - Параметры
     * @returns {HTMLCanvasElement|null}
     */
    generate(type, params = {}) {
        const cacheKey = `${type}:${JSON.stringify(params)}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const pattern = this.patterns[type];
        if (!pattern) {
            console.warn(`Текстура "${type}" не найдена`);
            return null;
        }

        const result = pattern(params);
        
        // Кэширование
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(cacheKey, result);
        
        return result;
    }

    /**
     * Генерация текстуры с точками
     */
    generateDots(params = {}) {
        const { size = 200, dotSize = 3, spacing = 12, color = '#7c3aed', opacity = 0.4, randomness = 0.5 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        for (let x = spacing; x < size; x += spacing) {
            for (let y = spacing; y < size; y += spacing) {
                const offsetX = (Math.random() - 0.5) * spacing * randomness;
                const offsetY = (Math.random() - 0.5) * spacing * randomness;
                const dotSizeVar = dotSize * (0.5 + Math.random() * 0.5);
                const alpha = opacity * (0.5 + Math.random() * 0.5);
                
                ctx.globalAlpha = alpha;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x + offsetX, y + offsetY, dotSizeVar, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        return canvas;
    }

    /**
     * Генерация сетки
     */
    generateGrid(params = {}) {
        const { size = 200, cellSize = 16, color = '#7c3aed', opacity = 0.3, lineWidth = 1 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        for (let x = 0; x <= size; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }

        for (let y = 0; y <= size; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }

        return canvas;
    }

    /**
     * Генерация диагональных линий
     */
    generateDiagonal(params = {}) {
        const { size = 200, spacing = 12, color = '#7c3aed', opacity = 0.3, angle = 45, lineWidth = 1 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        const rad = (angle * Math.PI) / 180;
        const step = spacing / Math.cos(rad);
        
        for (let i = -size; i < size * 2; i += step) {
            ctx.beginPath();
            const x1 = i * Math.cos(rad);
            const y1 = i * Math.sin(rad);
            const x2 = (i + size) * Math.cos(rad);
            const y2 = (i + size) * Math.sin(rad);
            ctx.moveTo(x1 + size/2, y1 + size/2);
            ctx.lineTo(x2 + size/2, y2 + size/2);
            ctx.stroke();
        }

        return canvas;
    }

    /**
     * Генерация шума
     */
    generateNoise(params = {}) {
        const { size = 200, density = 0.3, color = '#7c3aed', opacity = 0.2 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        const rgb = this.hexToRgb(color);

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < density) {
                const brightness = Math.floor(Math.random() * 100 + 50);
                data[i] = Math.min(255, rgb.r + (Math.random() - 0.5) * 50);
                data[i + 1] = Math.min(255, rgb.g + (Math.random() - 0.5) * 50);
                data[i + 2] = Math.min(255, rgb.b + (Math.random() - 0.5) * 50);
                data[i + 3] = Math.floor(opacity * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Генерация градиента
     */
    generateGradient(params = {}) {
        const { size = 200, startColor = '#7c3aed', endColor = '#3b82f6', direction = 'horizontal' } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        let grad;
        if (direction === 'horizontal') {
            grad = ctx.createLinearGradient(0, 0, size, 0);
        } else if (direction === 'vertical') {
            grad = ctx.createLinearGradient(0, 0, 0, size);
        } else if (direction === 'diagonal') {
            grad = ctx.createLinearGradient(0, 0, size, size);
        } else {
            grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        }

        grad.addColorStop(0, startColor);
        grad.addColorStop(1, endColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        return canvas;
    }

    /**
     * Генерация полос
     */
    generateStripes(params = {}) {
        const { size = 200, stripeWidth = 10, color = '#7c3aed', opacity = 0.4, angle = 0 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.translate(size/2, size/2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-size/2, -size/2);
        
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;

        for (let x = -size; x < size * 2; x += stripeWidth * 2) {
            ctx.fillRect(x, 0, stripeWidth, size);
        }

        ctx.restore();
        return canvas;
    }

    /**
     * Генерация шахматной доски
     */
    generateChecker(params = {}) {
        const { size = 200, cellSize = 20, color1 = '#7c3aed', color2 = '#3b82f6', opacity = 0.5 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.globalAlpha = opacity;

        for (let x = 0; x < size; x += cellSize) {
            for (let y = 0; y < size; y += cellSize) {
                const isEven = (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0;
                ctx.fillStyle = isEven ? color1 : color2;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }

        return canvas;
    }

    /**
     * Генерация волн
     */
    generateWaves(params = {}) {
        const { size = 200, amplitude = 20, frequency = 0.05, color = '#7c3aed', opacity = 0.3 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 2;

        for (let y = 0; y < size; y += 4) {
            const offset = Math.sin(y * frequency) * amplitude + Math.sin(y * frequency * 0.7 + 1) * amplitude * 0.5;
            ctx.beginPath();
            ctx.moveTo(0, y + offset);
            for (let x = 0; x < size; x++) {
                const wave = Math.sin(x * frequency * 2 + y * 0.02) * amplitude * 0.5;
                ctx.lineTo(x, y + offset + wave);
            }
            ctx.stroke();
        }

        return canvas;
    }

    /**
     * Генерация спирали
     */
    generateSpiral(params = {}) {
        const { size = 200, turns = 5, color = '#7c3aed', opacity = 0.4, lineWidth = 2 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        const center = size / 2;
        const maxRadius = size * 0.4;

        ctx.beginPath();
        for (let t = 0; t < turns * 2 * Math.PI; t += 0.05) {
            const radius = (t / (turns * 2 * Math.PI)) * maxRadius;
            const x = center + Math.cos(t) * radius;
            const y = center + Math.sin(t) * radius;
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        return canvas;
    }

    /**
     * Генерация шестиугольной сетки
     */
    generateHexGrid(params = {}) {
        const { size = 200, hexSize = 20, color = '#7c3aed', opacity = 0.3, lineWidth = 1 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        const hexRadius = hexSize;
        const hexWidth = hexRadius * Math.sqrt(3);
        const hexHeight = hexRadius * 1.5;

        for (let row = -1; row < size / hexHeight + 2; row++) {
            for (let col = -1; col < size / hexWidth + 2; col++) {
                const x = col * hexWidth + (row % 2) * hexWidth / 2;
                const y = row * hexHeight;

                this.drawHexagon(ctx, x, y, hexRadius);
            }
        }

        return canvas;
    }

    /**
     * Генерация облачного шума
     */
    generateNoiseCloud(params = {}) {
        const { size = 200, scale = 20, color = '#7c3aed', opacity = 0.2 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        const rgb = this.hexToRgb(color);

        // Простая симуляция Perlin шума
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const nx = x / size;
                const ny = y / size;
                const value = Math.sin(nx * scale + ny * scale * 0.7) * 
                             Math.cos(ny * scale * 0.5 - nx * scale * 0.3) * 0.5 + 0.5;
                
                const idx = (y * size + x) * 4;
                const brightness = Math.floor(value * 100 + 50);
                data[idx] = Math.min(255, rgb.r + brightness * 0.5);
                data[idx + 1] = Math.min(255, rgb.g + brightness * 0.5);
                data[idx + 2] = Math.min(255, rgb.b + brightness * 0.5);
                data[idx + 3] = Math.floor(value * opacity * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Генерация мрамора
     */
    generateMarble(params = {}) {
        const { size = 200, color1 = '#7c3aed', color2 = '#3b82f6', opacity = 0.6 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const value = Math.sin(x * 0.02 + y * 0.01) * 
                            Math.cos(y * 0.015 - x * 0.025) * 0.5 + 0.5;
                
                const idx = (y * size + x) * 4;
                const r = rgb1.r + (rgb2.r - rgb1.r) * value;
                const g = rgb1.g + (rgb2.g - rgb1.g) * value;
                const b = rgb1.b + (rgb2.b - rgb1.b) * value;
                
                data[idx] = Math.floor(r);
                data[idx + 1] = Math.floor(g);
                data[idx + 2] = Math.floor(b);
                data[idx + 3] = Math.floor(opacity * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Генерация дерева
     */
    generateWood(params = {}) {
        const { size = 200, color = '#8b7355', opacity = 0.5, rings = 5 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        const rgb = this.hexToRgb(color);

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const dx = x - size / 2;
                const dy = y - size / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ring = Math.sin(dist * rings / size * Math.PI * 2) * 0.5 + 0.5;
                const grain = Math.sin(x * 0.05 + y * 0.03) * 0.3 + 0.7;
                
                const value = ring * grain;
                const idx = (y * size + x) * 4;
                
                data[idx] = Math.floor(rgb.r * (0.5 + value * 0.5));
                data[idx + 1] = Math.floor(rgb.g * (0.5 + value * 0.5));
                data[idx + 2] = Math.floor(rgb.b * (0.5 + value * 0.5));
                data[idx + 3] = Math.floor(opacity * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Генерация кирпичной кладки
     */
    generateBrick(params = {}) {
        const { size = 200, brickWidth = 30, brickHeight = 15, color1 = '#c0392b', color2 = '#e74c3c', opacity = 0.7 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.globalAlpha = opacity;

        for (let row = 0; row < size / brickHeight + 2; row++) {
            for (let col = -1; col < size / brickWidth + 2; col++) {
                const x = col * brickWidth + (row % 2) * brickWidth / 2;
                const y = row * brickHeight;
                const color = (row + col) % 2 === 0 ? color1 : color2;
                
                ctx.fillStyle = color;
                ctx.fillRect(x, y, brickWidth - 2, brickHeight - 2);
                
                // Тень для объема
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.fillRect(x, y + brickHeight - 2, brickWidth - 2, 2);
                ctx.fillRect(x + brickWidth - 2, y, 2, brickHeight - 2);
            }
        }

        return canvas;
    }

    /**
     * Генерация ткани
     */
    generateFabric(params = {}) {
        const { size = 200, color = '#7c3aed', opacity = 0.3, threadSize = 2, spacing = 6 } = params;
        const canvas = this.createCanvas(size);
        const ctx = canvas.getContext('2d');

        ctx.globalAlpha = opacity;
        
        // Вертикальные нити
        for (let x = 0; x < size; x += spacing) {
            const variation = Math.sin(x * 0.1) * 0.2 + 0.8;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity * variation;
            ctx.fillRect(x, 0, threadSize, size);
        }

        // Горизонтальные нити
        for (let y = 0; y < size; y += spacing) {
            const variation = Math.cos(y * 0.1) * 0.2 + 0.8;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity * variation;
            ctx.fillRect(0, y, size, threadSize);
        }

        return canvas;
    }

    /**
     * Создание Canvas с прозрачным фоном
     */
    createCanvas(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);
        return canvas;
    }

    /**
     * Отрисовка шестиугольника
     */
    drawHexagon(ctx, x, y, radius) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * HEX в RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 124, g: 58, b: 237 };
    }

    /**
     * Получить список доступных текстур
     */
    getAvailableTextures() {
        return Object.keys(this.patterns);
    }

    /**
     * Очистить кэш
     */
    clearCache() {
        this.cache.clear();
    }
}