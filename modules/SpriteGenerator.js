// modules/SpriteGenerator.js - Генератор тестовых спрайтов

export class SpriteGenerator {
    constructor() {
        this.generatedSprites = new Map();
    }

    /**
     * Генерация тестового спрайта на лету
     */
    generateTestSprite(config) {
        const { id, type, width = 64, height = 64, color = '#7c3aed' } = config;
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Прозрачный фон
        ctx.clearRect(0, 0, width, height);
        
        // Рисуем разные тестовые спрайты в зависимости от типа
        switch(type) {
            case 'eye':
                this.drawEye(ctx, width, height, color);
                break;
            case 'mouth':
                this.drawMouth(ctx, width, height, color);
                break;
            case 'hair':
                this.drawHair(ctx, width, height, color);
                break;
            case 'accessory':
                this.drawAccessory(ctx, width, height, color);
                break;
            case 'button':
                this.drawButton(ctx, width, height, color);
                break;
            case 'icon':
                this.drawIcon(ctx, width, height, color);
                break;
            case 'weapon':
                this.drawWeapon(ctx, width, height, color);
                break;
            default:
                this.drawDefault(ctx, width, height, color);
        }
        
        // Конвертируем в изображение
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        
        // Сохраняем в кэш
        this.generatedSprites.set(id, img);
        
        return {
            id: id,
            file: id + '.png',
            width: width,
            height: height,
            image: img,
            isTest: true
        };
    }

    // ===== РИСОВАНИЕ РАЗНЫХ ТИПОВ СПРАЙТОВ =====

    drawEye(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        const r = Math.min(w, h) * 0.4;
        
        // Белок глаза
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.2, r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Радужка
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Зрачок
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(cx + 2, cy + 2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Блик
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMouth(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        const r = Math.min(w, h) * 0.35;
        
        ctx.strokeStyle = color || '#e17055';
        ctx.lineWidth = 2;
        ctx.fillStyle = color || '#e17055';
        
        // Улыбка
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.1, r, 0.1, Math.PI - 0.1);
        ctx.stroke();
        
        // Внутренняя часть рта (для улыбки)
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.3, r * 0.5, 0, Math.PI);
        ctx.fill();
    }

    drawHair(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        
        ctx.fillStyle = color || '#2d3436';
        
        // Разные прически
        const type = Math.floor(Math.random() * 3);
        
        if (type === 0) { // Короткие
            ctx.beginPath();
            ctx.ellipse(cx, cy - h * 0.2, w * 0.45, h * 0.3, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            // Челка
            ctx.fillRect(cx - w * 0.3, cy - h * 0.5, w * 0.6, h * 0.2);
        } else if (type === 1) { // Длинные
            ctx.beginPath();
            ctx.ellipse(cx, cy - h * 0.2, w * 0.5, h * 0.35, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            // Длинные пряди по бокам
            ctx.fillRect(cx - w * 0.45, cy - h * 0.2, w * 0.15, h * 0.6);
            ctx.fillRect(cx + w * 0.3, cy - h * 0.2, w * 0.15, h * 0.6);
        } else { // Хвост
            ctx.beginPath();
            ctx.ellipse(cx, cy - h * 0.2, w * 0.4, h * 0.3, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            // Хвост сбоку
            ctx.beginPath();
            ctx.ellipse(cx + w * 0.35, cy + h * 0.1, w * 0.2, h * 0.5, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawAccessory(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        
        const type = Math.floor(Math.random() * 4);
        
        ctx.fillStyle = color || '#ffd700';
        ctx.strokeStyle = color || '#ffd700';
        ctx.lineWidth = 2;
        
        if (type === 0) { // Корона
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.4, cy + h * 0.3);
            for (let i = 0; i < 5; i++) {
                const x = cx - w * 0.4 + (i / 4) * w * 0.8;
                const y = i % 2 === 0 ? cy - h * 0.3 : cy + h * 0.3;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (type === 1) { // Очки
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx - w * 0.25, cy, w * 0.2, h * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx + w * 0.25, cy, w * 0.2, h * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.1, cy);
            ctx.lineTo(cx + w * 0.1, cy);
            ctx.stroke();
        } else if (type === 2) { // Бант
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.moveTo(cx - w * 0.3, cy);
            ctx.quadraticCurveTo(cx - w * 0.1, cy - h * 0.4, cx, cy);
            ctx.quadraticCurveTo(cx + w * 0.1, cy - h * 0.4, cx + w * 0.3, cy);
            ctx.quadraticCurveTo(cx + w * 0.1, cy + h * 0.4, cx, cy);
            ctx.quadraticCurveTo(cx - w * 0.1, cy + h * 0.4, cx - w * 0.3, cy);
            ctx.fill();
        } else { // Наушники
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy - h * 0.1, w * 0.3, Math.PI * 1.2, Math.PI * 1.8);
            ctx.stroke();
            ctx.fillStyle = '#2d3436';
            ctx.beginPath();
            ctx.ellipse(cx - w * 0.25, cy + h * 0.1, w * 0.1, h * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + w * 0.25, cy + h * 0.1, w * 0.1, h * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawButton(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        const r = Math.min(w, h) * 0.2;
        
        // Основная кнопка
        ctx.fillStyle = color || '#7c3aed';
        ctx.shadowColor = (color || '#7c3aed') + '60';
        ctx.shadowBlur = 15;
        
        // Скругленный прямоугольник
        const x = cx - w * 0.4;
        const y = cy - h * 0.3;
        const width = w * 0.8;
        const height = h * 0.6;
        const radius = r;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        
        // Текст
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.min(w, h) * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BUTTON', cx, cy + 2);
    }

    drawIcon(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        const r = Math.min(w, h) * 0.4;
        
        ctx.fillStyle = color || '#4d96ff';
        ctx.shadowColor = (color || '#4d96ff') + '60';
        ctx.shadowBlur = 15;
        
        // Звезда
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? r : r * 0.4;
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawWeapon(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        
        ctx.fillStyle = color || '#c0c0c0';
        ctx.shadowColor = (color || '#c0c0c0') + '40';
        ctx.shadowBlur = 10;
        
        const type = Math.floor(Math.random() * 3);
        
        if (type === 0) { // Меч
            ctx.fillRect(cx - w * 0.03, cy - h * 0.4, w * 0.06, h * 0.7);
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(cx - w * 0.12, cy + h * 0.2, w * 0.24, h * 0.06);
            // Рукоять
            ctx.fillStyle = '#8b7355';
            ctx.fillRect(cx - w * 0.05, cy + h * 0.3, w * 0.1, h * 0.1);
        } else if (type === 1) { // Посох
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx, cy + h * 0.4);
            ctx.lineTo(cx, cy - h * 0.4);
            ctx.stroke();
            // Кристалл
            ctx.fillStyle = '#4d96ff';
            ctx.shadowColor = '#4d96ff60';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(cx, cy - h * 0.4, w * 0.08, 0, Math.PI * 2);
            ctx.fill();
        } else { // Щит
            ctx.fillStyle = color || '#c0c0c0';
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy - h * 0.4);
            ctx.quadraticCurveTo(cx + w * 0.4, cy - h * 0.2, cx + w * 0.3, cy + h * 0.2);
            ctx.quadraticCurveTo(cx, cy + h * 0.4, cx - w * 0.3, cy + h * 0.2);
            ctx.quadraticCurveTo(cx - w * 0.4, cy - h * 0.2, cx, cy - h * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Эмблема
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(cx, cy, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawDefault(ctx, w, h, color) {
        const cx = w/2, cy = h/2;
        const r = Math.min(w, h) * 0.3;
        
        ctx.fillStyle = color || '#7c3aed';
        ctx.shadowColor = (color || '#7c3aed') + '60';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `${r}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', cx, cy + 2);
    }

    /**
     * Генерация всех тестовых спрайтов
     */
    generateAllTestSprites() {
        const spriteConfigs = {
            eyes: [
                { id: 'anime_eye_1', type: 'eye', color: '#4d96ff' },
                { id: 'anime_eye_2', type: 'eye', color: '#ff6b6b' },
                { id: 'cartoon_eye', type: 'eye', color: '#2d3436' },
                { id: 'pixel_eye', type: 'eye', color: '#4d96ff', width: 32, height: 32 }
            ],
            mouths: [
                { id: 'smile_1', type: 'mouth', color: '#e17055', width: 30, height: 20 },
                { id: 'happy_1', type: 'mouth', color: '#ff6b6b', width: 30, height: 20 },
                { id: 'neutral_mouth', type: 'mouth', color: '#e17055', width: 25, height: 15 }
            ],
            hairs: [
                { id: 'short_hair_1', type: 'hair', color: '#2d3436' },
                { id: 'long_hair_1', type: 'hair', color: '#2d3436' },
                { id: 'ponytail', type: 'hair', color: '#2d3436' }
            ],
            accessories: [
                { id: 'glasses', type: 'accessory', color: '#2d3436' },
                { id: 'crown', type: 'accessory', color: '#ffd700' },
                { id: 'bow', type: 'accessory', color: '#ff6b6b' },
                { id: 'headphones', type: 'accessory', color: '#2d3436' }
            ],
            buttons: [
                { id: 'btn_rounded', type: 'button', color: '#7c3aed' },
                { id: 'btn_square', type: 'button', color: '#ef4444' },
                { id: 'btn_cyber', type: 'button', color: '#ff00ff' }
            ],
            icons: [
                { id: 'star_icon', type: 'icon', color: '#f59e0b' },
                { id: 'heart_icon', type: 'icon', color: '#ef4444' },
                { id: 'shield_icon', type: 'icon', color: '#3b82f6' }
            ],
            weapons: [
                { id: 'sword', type: 'weapon', color: '#c0c0c0' },
                { id: 'staff', type: 'weapon', color: '#8b7355' },
                { id: 'shield_weapon', type: 'weapon', color: '#c0c0c0' }
            ]
        };

        const result = {};
        
        Object.entries(spriteConfigs).forEach(([category, configs]) => {
            result[category] = configs.map(cfg => {
                const sprite = this.generateTestSprite(cfg);
                return {
                    id: sprite.id,
                    file: sprite.file,
                    width: sprite.width,
                    height: sprite.height,
                    image: sprite.image,
                    isTest: true,
                    ...cfg
                };
            });
        });

        return result;
    }

    /**
     * Получить тестовый спрайт по ID
     */
    getTestSprite(id) {
        return this.generatedSprites.get(id) || null;
    }

    /**
     * Очистить сгенерированные спрайты
     */
    clear() {
        this.generatedSprites.clear();
    }
}