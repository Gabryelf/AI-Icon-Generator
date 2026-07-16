// ===============================================================
// АЛГОРИТМЫ КОМПОНОВКИ ИКОНОК
// ===============================================================

/**
 * Алгоритмы генерации иконок
 * Каждый алгоритм определяет, как компонуются фрагменты
 */
 export const ALGORITHMS = {
    /**
     * Классический - элементы выстраиваются в ряд/стопку
     */
    classic: {
        name: 'Классический',
        description: 'Элементы выстраиваются в ряд или стопку',
        compose: (elements, config) => {
            const positions = [];
            const spacing = config.size * 0.1;
            const totalWidth = elements.length * (config.size * 0.4) + (elements.length - 1) * spacing;
            const startX = (config.size - totalWidth) / 2;
            
            elements.forEach((el, i) => {
                positions.push({
                    x: startX + i * (config.size * 0.4 + spacing) + config.size * 0.2,
                    y: config.size / 2,
                    scale: 0.4
                });
            });
            
            return positions;
        }
    },
    
    /**
     * Центрированный - все элементы вокруг центра
     */
    centered: {
        name: 'Центрированный',
        description: 'Элементы группируются вокруг центра',
        compose: (elements, config) => {
            const positions = [];
            const radius = config.size * 0.25;
            const angleStep = (Math.PI * 2) / elements.length;
            const angleOffset = Math.random() * Math.PI * 2;
            
            // Основной элемент в центре
            if (elements.length > 0) {
                positions.push({
                    x: config.size / 2,
                    y: config.size / 2,
                    scale: 0.5,
                    zIndex: 10
                });
            }
            
            // Остальные вокруг
            for (let i = 1; i < elements.length; i++) {
                const angle = angleOffset + i * angleStep;
                positions.push({
                    x: config.size / 2 + Math.cos(angle) * radius,
                    y: config.size / 2 + Math.sin(angle) * radius,
                    scale: 0.3,
                    zIndex: 1,
                    rotation: angle
                });
            }
            
            return positions;
        }
    },
    
    /**
     * Слоеный - элементы накладываются друг на друга
     */
    layered: {
        name: 'Слоеный',
        description: 'Элементы накладываются слоями',
        compose: (elements, config) => {
            const positions = [];
            const layers = elements.length;
            
            elements.forEach((el, i) => {
                const depth = i / layers;
                const scale = 0.5 - depth * 0.15;
                const offset = depth * 20;
                
                positions.push({
                    x: config.size / 2 + (Math.random() - 0.5) * offset,
                    y: config.size / 2 + (Math.random() - 0.5) * offset,
                    scale: scale,
                    zIndex: i,
                    rotation: (Math.random() - 0.5) * 30
                });
            });
            
            return positions;
        }
    },
    
    /**
     * Диагональный - элементы по диагонали
     */
    diagonal: {
        name: 'Диагональный',
        description: 'Элементы вдоль диагонали',
        compose: (elements, config) => {
            const positions = [];
            const count = elements.length;
            const spacing = config.size * 0.15;
            const startX = config.size * 0.2;
            const startY = config.size * 0.2;
            const endX = config.size * 0.8;
            const endY = config.size * 0.8;
            
            elements.forEach((el, i) => {
                const t = count > 1 ? i / (count - 1) : 0.5;
                positions.push({
                    x: startX + (endX - startX) * t + (Math.random() - 0.5) * 20,
                    y: startY + (endY - startY) * t + (Math.random() - 0.5) * 20,
                    scale: 0.3 + Math.random() * 0.2,
                    rotation: (Math.random() - 0.5) * 45
                });
            });
            
            return positions;
        }
    },
    
    /**
     * Разбросанный - хаотичное размещение
     */
    scattered: {
        name: 'Разбросанный',
        description: 'Хаотичное размещение элементов',
        compose: (elements, config) => {
            const positions = [];
            const margin = config.size * 0.1;
            
            elements.forEach((el) => {
                positions.push({
                    x: margin + Math.random() * (config.size - margin * 2),
                    y: margin + Math.random() * (config.size - margin * 2),
                    scale: 0.2 + Math.random() * 0.3,
                    rotation: Math.random() * 360
                });
            });
            
            return positions;
        }
    },
    
    /**
     * Симметричный - зеркальное отражение
     */
    symmetric: {
        name: 'Симметричный',
        description: 'Зеркальное отражение элементов',
        compose: (elements, config) => {
            const positions = [];
            const center = config.size / 2;
            
            elements.forEach((el, i) => {
                const angle = (i / elements.length) * Math.PI * 2;
                const radius = config.size * 0.2 + Math.random() * config.size * 0.15;
                
                // Основной элемент
                positions.push({
                    x: center + Math.cos(angle) * radius,
                    y: center + Math.sin(angle) * radius,
                    scale: 0.3,
                    rotation: angle * (180 / Math.PI)
                });
                
                // Симметричный элемент (отражение)
                if (i > 0) {
                    positions.push({
                        x: center - Math.cos(angle) * radius,
                        y: center - Math.sin(angle) * radius,
                        scale: 0.3,
                        rotation: angle * (180 / Math.PI) + 180
                    });
                }
            });
            
            return positions;
        }
    }
};

/**
 * Получить алгоритм по имени
 */
export function getAlgorithm(name) {
    return ALGORITHMS[name] || ALGORITHMS.centered;
}

/**
 * Получить список всех алгоритмов
 */
export function getAllAlgorithms() {
    return Object.entries(ALGORITHMS).map(([key, value]) => ({
        id: key,
        name: value.name,
        description: value.description
    }));
}

/**
 * Применить алгоритм к элементам
 */
export function applyAlgorithm(elements, config) {
    const algorithm = getAlgorithm(config.composition || 'centered');
    return algorithm.compose(elements, config);
}