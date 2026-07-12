// ============================================
// ГЕНЕРАТОР ТЕКСТУР - Паттерны и текстуры для иконок
// ============================================

export class TextureGenerator {
    constructor() {
        this.patterns = {
            dots: this.generateDots.bind(this),
            grid: this.generateGrid.bind(this),
            diagonal: this.generateDiagonal.bind(this),
            noise: this.generateNoise.bind(this),
            gradient: this.generateGradient.bind(this)
        };
    }

    generate(type, params = {}) {
        const pattern = this.patterns[type];
        if (!pattern) return null;
        return pattern(params);
    }

    generateDots(params) {
        const { size = 100, dotSize = 3, spacing = 10, color = '#7c3aed', opacity = 0.3 } = params;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, size, size);

        for (let x = spacing; x < size; x += spacing) {
            for (let y = spacing; y < size; y += spacing) {
                ctx.globalAlpha = opacity * (0.5 + Math.random() * 0.5);
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, dotSize * (0.5 + Math.random() * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        return canvas;
    }

    generateGrid(params) {
        const { size = 100, cellSize = 10, color = '#7c3aed', opacity = 0.2 } = params;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;

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

    generateDiagonal(params) {
        const { size = 100, spacing = 10, color = '#7c3aed', opacity = 0.2 } = params;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;

        for (let i = -size; i < size * 2; i += spacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + size, size);
            ctx.stroke();
        }

        return canvas;
    }

    generateNoise(params) {
        const { size = 100, density = 0.05, color = '#7c3aed' } = params;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < density) {
                const val = Math.floor(Math.random() * 255);
                data[i] = parseInt(color.slice(1, 3), 16) || 124;
                data[i + 1] = parseInt(color.slice(3, 5), 16) || 58;
                data[i + 2] = parseInt(color.slice(5, 7), 16) || 237;
                data[i + 3] = Math.floor(Math.random() * 100 + 50);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateGradient(params) {
        const { size = 100, startColor = '#7c3aed', endColor = '#3b82f6', direction = 'horizontal' } = params;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        let grad;
        if (direction === 'horizontal') {
            grad = ctx.createLinearGradient(0, 0, size, 0);
        } else if (direction === 'vertical') {
            grad = ctx.createLinearGradient(0, 0, 0, size);
        } else {
            grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        }

        grad.addColorStop(0, startColor);
        grad.addColorStop(1, endColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        return canvas;
    }

    getPatternNames() {
        return Object.keys(this.patterns);
    }
}