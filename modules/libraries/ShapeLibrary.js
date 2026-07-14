// =============================================================
// SHAPE LIBRARY - Библиотека фигур с поддержкой CSV
// =============================================================

export class ShapeLibrary {
    constructor() {
        this.shapes = {
            basic: [],
            organic: [],
            geometric: []
        };
        this.loaded = false;
        this.shapeCache = new Map();
        this.defaultShapes = [
            { name: 'circle', type: 'basic', path: 'M0,0 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0', defaultColor: '#7c3aed', tags: 'basic,geometric' },
            { name: 'square', type: 'basic', path: 'M-1,-1 L1,-1 L1,1 L-1,1 Z', defaultColor: '#3b82f6', tags: 'basic,geometric' },
            { name: 'triangle', type: 'basic', path: 'M0,-1 L-1,1 L1,1 Z', defaultColor: '#ef4444', tags: 'basic,geometric' },
            { name: 'star', type: 'basic', path: 'M0,-1 L0.3,-0.3 L1,-0.3 L0.4,0.1 L0.6,0.8 L0,0.4 L-0.6,0.8 L-0.4,0.1 L-1,-0.3 L-0.3,-0.3', defaultColor: '#f59e0b', tags: 'basic,geometric' },
            { name: 'hexagon', type: 'basic', path: 'M0,-1 L0.866,-0.5 L0.866,0.5 L0,1 L-0.866,0.5 L-0.866,-0.5 Z', defaultColor: '#10b981', tags: 'basic,geometric' }
        ];
    }

    /**
     * Загрузка фигур из CSV данных
     * @param {Object} data - Данные с фигурами
     */
    loadShapes(data) {
        if (data.basic) this.shapes.basic = data.basic;
        if (data.organic) this.shapes.organic = data.organic;
        if (data.geometric) this.shapes.geometric = data.geometric;
        this.loaded = true;
        this.shapeCache.clear();
    }

    /**
     * Загрузка фигур по умолчанию
     */
    loadDefaultShapes() {
        this.shapes.basic = this.defaultShapes;
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

    /**
     * Получить фигуру по имени
     * @param {string} name - Имя фигуры
     * @param {string} category - Категория (опционально)
     * @returns {Object|null}
     */
    getShape(name, category = null) {
        const cacheKey = `${category || 'all'}:${name}`;
        if (this.shapeCache.has(cacheKey)) {
            return this.shapeCache.get(cacheKey);
        }

        const categories = category ? [category] : ['basic', 'organic', 'geometric'];
        
        for (const cat of categories) {
            const shape = this.shapes[cat]?.find(s => s.name === name || s.type === name);
            if (shape) {
                const result = { ...shape, category: cat };
                this.shapeCache.set(cacheKey, result);
                return result;
            }
        }
        return null;
    }

    /**
     * Получить случайную фигуру
     * @param {string} category - Категория
     * @param {string} tag - Тег (опционально)
     * @returns {Object}
     */
    getRandomShape(category = 'basic', tag = null) {
        let shapes = this.shapes[category] || this.shapes.basic;
        
        if (tag) {
            shapes = shapes.filter(s => s.tags && s.tags.includes(tag));
        }
        
        if (shapes.length === 0) {
            return this.shapes.basic[0] || this.defaultShapes[0];
        }
        
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    /**
     * Получить фигуры по тегу
     * @param {string} tag - Тег
     * @param {string} category - Категория (опционально)
     * @returns {Array<Object>}
     */
    getShapesByTag(tag, category = null) {
        const categories = category ? [category] : ['basic', 'organic', 'geometric'];
        const result = [];
        
        for (const cat of categories) {
            const shapes = this.shapes[cat] || [];
            const filtered = shapes.filter(s => s.tags && s.tags.includes(tag));
            result.push(...filtered.map(s => ({ ...s, category: cat })));
        }
        
        return result;
    }

    /**
     * Получить все имена фигур
     * @param {string} category - Категория (опционально)
     * @returns {Array<string>}
     */
    getShapeNames(category = null) {
        const categories = category ? [category] : ['basic', 'organic', 'geometric'];
        const names = [];
        
        for (const cat of categories) {
            const shapes = this.shapes[cat] || [];
            names.push(...shapes.map(s => s.name));
        }
        
        return names;
    }

    /**
     * Получить все теги
     * @returns {Set<string>}
     */
    getAllTags() {
        const tags = new Set();
        for (const category of ['basic', 'organic', 'geometric']) {
            const shapes = this.shapes[category] || [];
            for (const shape of shapes) {
                if (shape.tags) {
                    shape.tags.split(',').forEach(t => tags.add(t.trim()));
                }
            }
        }
        return tags;
    }

    /**
     * Отрисовка фигуры на Canvas
     * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
     * @param {Object} params - Параметры отрисовки
     * @param {number} cx - Центр X
     * @param {number} cy - Центр Y
     */
    drawShape(ctx, params, cx = 250, cy = 250) {
        const { shape, size, x, y, color, rotation, opacity, strokeWidth, strokeColor } = params;
        const shapeData = this.getShape(shape);
        
        if (!shapeData) {
            this.drawFallback(ctx, params, cx, cy);
            return;
        }
        
        const centerX = x || cx;
        const centerY = y || cy;
        const scale = (size || 100) / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation || 0);
        ctx.scale(scale, scale);
        
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || shapeData.defaultColor || '#7c3aed';
        
        // Тень
        if (params.shadow) {
            ctx.shadowColor = (color || shapeData.defaultColor || '#7c3aed') + '40';
            ctx.shadowBlur = 20;
        }
        
        try {
            const path = new Path2D(shapeData.path);
            ctx.fill(path);
            
            if (strokeWidth || strokeColor) {
                ctx.strokeStyle = strokeColor || '#ffffff';
                ctx.lineWidth = strokeWidth || 2;
                ctx.stroke(path);
            }
        } catch (e) {
            // Fallback при ошибке
            console.warn('Ошибка отрисовки фигуры:', e);
            this.drawFallback(ctx, params, cx, cy);
        }
        
        ctx.restore();
    }

    /**
     * Отрисовка звезды
     * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
     * @param {Object} params - Параметры
     */
    drawStar(ctx, params) {
        const { x, y, size, points, color, opacity, rotation } = params;
        const outerRadius = size || 20;
        const innerRadius = outerRadius * 0.4;
        const spikes = points || 5;
        
        ctx.save();
        ctx.translate(x || 250, y || 250);
        ctx.rotate(rotation || 0);
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || '#f59e0b';
        
        if (params.shadow) {
            ctx.shadowColor = (color || '#f59e0b') + '60';
            ctx.shadowBlur = 15;
        }
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            if (i === 0) {
                ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    /**
     * Отрисовка пиксельной фигуры
     * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
     * @param {Object} params - Параметры
     */
    drawPixelShape(ctx, params) {
        const { shape, size, x, y, color, pixelSize = 4, complexity = 5 } = params;
        const centerX = x || 250;
        const centerY = y || 250;
        const gridSize = Math.floor((size || 100) / pixelSize);
        const offsetX = centerX - (gridSize * pixelSize) / 2;
        const offsetY = centerY - (gridSize * pixelSize) / 2;
        
        ctx.save();
        ctx.fillStyle = color || '#7c3aed';
        
        // Генерация пиксельной маски
        const mask = this.generatePixelMask(shape, gridSize, complexity);
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (mask[i] && mask[i][j]) {
                    ctx.fillRect(offsetX + i * pixelSize, offsetY + j * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        
        ctx.restore();
    }

    /**
     * Генерация пиксельной маски
     * @param {string} shape - Тип фигуры
     * @param {number} size - Размер сетки
     * @param {number} complexity - Сложность
     * @returns {Array<Array<boolean>>}
     */
    generatePixelMask(shape, size, complexity = 5) {
        const mask = Array(size).fill(null).map(() => Array(size).fill(false));
        const center = size / 2;
        const radius = size * 0.4;
        const density = 0.3 + (complexity / 10) * 0.5;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const dx = i - center;
                const dy = j - center;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                let fill = false;
                switch (shape) {
                    case 'circle':
                        fill = dist < radius;
                        break;
                    case 'square':
                        fill = Math.abs(dx) < radius && Math.abs(dy) < radius;
                        break;
                    case 'triangle':
                        fill = dx < radius && dy < radius && dx > -radius && dy > -radius && dx + dy < radius * 0.8;
                        break;
                    case 'star':
                        fill = dist < radius && (Math.random() < density || dist < radius * 0.3);
                        break;
                    default:
                        fill = dist < radius;
                }
                
                // Добавляем шум для реалистичности
                if (fill && Math.random() > density) {
                    fill = false;
                }
                if (!fill && Math.random() < 0.1 * density) {
                    fill = true;
                }
                
                mask[i][j] = fill;
            }
        }
        
        return mask;
    }

    /**
     * Fallback отрисовка
     * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
     * @param {Object} params - Параметры
     * @param {number} cx - Центр X
     * @param {number} cy - Центр Y
     */
    drawFallback(ctx, params, cx = 250, cy = 250) {
        const { size, x, y, color, opacity } = params;
        const centerX = x || cx;
        const centerY = y || cy;
        const radius = (size || 100) / 2;
        
        ctx.save();
        ctx.globalAlpha = opacity || 1;
        ctx.fillStyle = color || '#7c3aed';
        ctx.shadowColor = (color || '#7c3aed') + '40';
        ctx.shadowBlur = 20;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Добавление кастомной фигуры
     * @param {string} name - Имя
     * @param {Object} shapeData - Данные фигуры
     */
    addShape(name, shapeData) {
        const category = shapeData.type || 'basic';
        if (!this.shapes[category]) {
            this.shapes[category] = [];
        }
        this.shapes[category].push({ name, ...shapeData });
        this.shapeCache.clear();
    }

    /**
     * Удаление фигуры
     * @param {string} name - Имя фигуры
     * @param {string} category - Категория
     */
    removeShape(name, category = 'basic') {
        if (this.shapes[category]) {
            this.shapes[category] = this.shapes[category].filter(s => s.name !== name);
            this.shapeCache.clear();
        }
    }

    /**
     * Экспорт фигур в CSV
     * @param {string} category - Категория
     * @returns {string}
     */
    exportToCSV(category = 'basic') {
        const shapes = this.shapes[category] || [];
        if (shapes.length === 0) return '';
        
        const headers = Object.keys(shapes[0]);
        const lines = [headers.join(',')];
        
        for (const shape of shapes) {
            const values = headers.map(key => shape[key] || '');
            lines.push(values.join(','));
        }
        
        return lines.join('\n');
    }

    /**
     * Импорт фигур из CSV
     * @param {string} csv - CSV данные
     * @param {string} category - Категория
     * @returns {number} - Количество импортированных фигур
     */
    importFromCSV(csv, category = 'basic') {
        try {
            const lines = csv.split('\n').filter(line => line.trim());
            if (lines.length < 2) return 0;
            
            const headers = lines[0].split(',').map(h => h.trim());
            const shapes = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length === headers.length) {
                    const obj = {};
                    headers.forEach((h, idx) => {
                        obj[h] = values[idx];
                    });
                    shapes.push(obj);
                }
            }
            
            if (!this.shapes[category]) {
                this.shapes[category] = [];
            }
            this.shapes[category].push(...shapes);
            this.shapeCache.clear();
            
            return shapes.length;
        } catch (e) {
            console.error('Ошибка импорта CSV:', e);
            return 0;
        }
    }
}