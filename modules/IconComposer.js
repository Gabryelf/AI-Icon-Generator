// === Новая логика генерации ===
export class IconComposer {
    composeIcon(params) {
        const layers = [];
        
        // 1. Базовый слой (фон/форма)
        layers.push(this.createBackground(params));
        
        // 2. Основной контент (в зависимости от категории)
        layers.push(this.createContent(params));
        
        // 3. Детали (уровень сложности)
        layers.push(this.createDetails(params));
        
        // 4. Спецэффекты (свечение, тени, текстуры)
        layers.push(this.createEffects(params));
        
        // 5. Рамка/обводка
        layers.push(this.createBorder(params));
        
        return layers;
    }
}