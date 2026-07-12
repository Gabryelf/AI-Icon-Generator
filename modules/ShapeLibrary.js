// ============================================
// БИБЛИОТЕКА ФИГУР - Поддержка CSV и встроенных фигур
// ============================================

export class ShapeLibrary {
    constructor() {
        this.shapes = {
            basic: [],
            organic: [],
            geometric: []
        };
        this.loaded = false;
    }

    loadShapes(data) {
        if (data.basic) this.shapes.basic = data.basic;
        if (data.organic) this.shapes.organic = data.organic;
        if (data.geometric) this.shapes.geometric = data.geometric;
        this.loaded = true;
    }

    loadDefaultShapes() {
        // Встроенные фигуры как резерв
        this.shapes.basic = [
            { name: 'circle', type: 'basic', path: 'M0,0 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0', defaultColor: '#7c3aed', tags: 'basic,geometric' },
            { name: 'square', type: 'basic', path: 'M-1,-1 L1,-1 L1,1 L-1,1 Z', defaultColor: '#3b82f6', tags: 'basic,geometric' },
            { name: 'triangle', type: 'basic', path: 'M0,-1 L-1,1 L1,1 Z', defaultColor: '#ef4444', tags: 'basic,geometric' },
            { name: 'star', type: 'basic', path: 'M0,-1 L0.3,-0.3 L1,-0.3 L0.4,0.1 L0.6,0.8 L0,0.4 L-0.6,0.8 L-0.4,0.1 L-1,-0.3 L-0.3,-0.3', defaultColor: '#f59e0b', tags: 'basic,geometric' },
            { name: 'hexagon', type: 'basic', path: 'M0,-1 L0.866,-0.5 L0.866,0.5 L0,1 L-0.866,0.5 L-0.866,-0.5 Z', defaultColor: '#10b981', tags: 'basic,geometric' }
        ];

        this.shapes.organic = [
            { name: 'leaf', type: 'organic', path: 'M0,-1 Q1,-0.5 0.5,0 Q0,0.5 -0.5,0 Q-1,-0.5 0,-1', defaultColor: '#10b981', tags: 'organic,nature' },
            { name: 'drop', type: 'organic', path: 'M0,-1 Q1,0 0,1 Q-1,0 0,-1', defaultColor: '#3b82f6', tags: 'organic,nature' },
            { name: 'cloud', type: 'organic', path: 'M-1.2,0.4 Q-1.2,-0.4 -0.6,-0.6 Q-0.4,-1.2 0.2,-1.2 Q0.8,-1.2 1.0,-0.6 Q1.6,-0.4 1.6,0.2 Q1.6,0.6 1.2,0.8 Q0.8,1.2 0.2,1.2 Q-0.4,1.2 -0.8,0.8 Q-1.2,0.6 -1.2,0.4', defaultColor: '#9ca3af', tags: 'organic,nature' }
        ];

        this.shapes.geometric = [
            { name: 'diamond', type: 'geometric', path: 'M0,-1 L1,0 L0,1 L-1,0 Z', defaultColor: '#8b5cf6', tags: 'geometric' },
            { name: 'shield', type: 'geometric', path: 'M0,-1 L1,-0.6 L0.8,0.6 L0,1 L-0.8,0.6 L-1,-0.6 Z', defaultColor: '#7c3aed', tags: 'geometric,game' },
            { name: 'crest', type: 'geometric', path: 'M0,-1 L0.8,-0.6 L0.6,0.6 L0,1 L-0.6,0.6 L-0.8,-0.6 Z', defaultColor: '#d97706', tags: 'geometric,game' }
        ];

        this.loaded = true;
        console.log('Загружены встроенные фигуры (резервные)');
    }

    getShape(type, name) {
        // Поиск в библиотеке
        for (const category of ['basic', 'organic', 'geometric']) {
            const shape = this.shapes[category].find(s => s.name === name || s.type === name);
            if (shape) return { ...shape, category };
        }
        return null;
    }

    getRandomShape(category = 'basic') {
        const shapes = this.shapes[category] || this.shapes.basic;
        if (shapes.length === 0) return this.shapes.basic[0];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    drawShape(ctx, params) {
        const { shape, size, x, y, color, rotation, opacity } = params;
        const shapeData = this.getShape('basic', shape) || this.shapes.basic[0];
        
        if (!shapeData) return;
        
        ctx.save();
        ctx.translate(x || 0, y || 0);
        ctx.rotate(rotation || 0);
        ctx.scale(size / 2 || 60, size / 2 || 60);
        
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || shapeData.defaultColor || '#7c3aed';
        ctx.shadowColor = (color || shapeData.defaultColor || '#7c3aed') + '40';
        ctx.shadowBlur = 20;
        
        // Используем SVG путь
        try {
            const path = new Path2D(shapeData.path);
            ctx.fill(path);
        } catch (e) {
            // Если Path2D не поддерживается, рисуем круг как fallback
            console.warn('Path2D not supported, using fallback circle');
            ctx.beginPath();
            ctx.arc(0, 0, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawStar(ctx, params) {
        const { x, y, size, points, color, opacity } = params;
        const outerRadius = size || 20;
        const innerRadius = outerRadius * 0.4;
        const spikes = points || 5;
        
        ctx.save();
        ctx.translate(x || 0, y || 0);
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || '#f59e0b';
        ctx.shadowColor = (color || '#f59e0b') + '60';
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    getShapeNames() {
        const names = [];
        for (const category of ['basic', 'organic', 'geometric']) {
            this.shapes[category].forEach(s => {
                names.push({ name: s.name, category: s.type || category });
            });
        }
        return names;
    }
}