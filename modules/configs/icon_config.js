// ===============================================================
// КОНФИГУРАЦИЯ ДЛЯ ИКОНОК
// ===============================================================

export const ICON_CATEGORIES = {
    'game': {
        name: 'Игровая',
        icon: 'fa-gamepad',
        description: 'Игровые иконки, оружие, персонажи',
        defaultColor: '#7c3aed'
    },
    'tech': {
        name: 'Технологичная',
        icon: 'fa-microchip',
        description: 'Технологии, кибернетика, нейросети',
        defaultColor: '#00d4ff'
    },
    'nature': {
        name: 'Природная',
        icon: 'fa-leaf',
        description: 'Природа, животные, растения',
        defaultColor: '#22c55e'
    },
    'abstract': {
        name: 'Абстрактная',
        icon: 'fa-shapes',
        description: 'Геометрические абстракции',
        defaultColor: '#f59e0b'
    },
    'fantasy': {
        name: 'Фэнтези',
        icon: 'fa-dragon',
        description: 'Магия, руны, драконы',
        defaultColor: '#ec4899'
    }
};

export const ICON_STYLES = {
    'minimal': {
        name: 'Минимализм',
        icon: 'fa-circle',
        description: 'Максимум 2-3 элемента'
    },
    'detailed': {
        name: 'Детализированный',
        icon: 'fa-plus-circle',
        description: 'Много слоев и деталей'
    },
    'pixel': {
        name: 'Пиксельный',
        icon: 'fa-th',
        description: 'Ретро-пиксельный стиль'
    },
    'gradient': {
        name: 'Градиентный',
        icon: 'fa-fill-drip',
        description: 'Плавные переходы цветов'
    },
    'outline': {
        name: 'Контурный',
        icon: 'fa-border-all',
        description: 'Основной контур с заливкой'
    }
};

export const ICON_CONFIG = {
    defaults: {
        // Размеры
        size: 200,
        scale: 1.0,
        rotation: 0,
        opacity: 1.0,
        
        // Цвета
        primaryColor: '#7c3aed',
        secondaryColor: '#4d96ff',
        accentColor: '#f59e0b',
        backgroundColor: 'transparent',
        
        // Слои
        layers: ['background', 'shape', 'detail', 'text'],
        complexity: 3,
        
        // Текст
        text: '',
        textSize: 24,
        textColor: '#ffffff',
        textPosition: 'bottom',
        textFont: 'Arial',
        
        // Эффекты
        glow: false,
        shadow: false,
        outline: false,
        
        // Композиция
        composition: 'centered',
        symmetry: 'none'
    },
    
    config: {
        // Цвета
        primaryColor: {
            label: 'Основной цвет',
            type: 'color',
            default: '#7c3aed'
        },
        secondaryColor: {
            label: 'Вторичный цвет',
            type: 'color',
            default: '#4d96ff'
        },
        accentColor: {
            label: 'Акцентный цвет',
            type: 'color',
            default: '#f59e0b'
        },
        backgroundColor: {
            label: 'Фон',
            type: 'select',
            options: [
                { value: 'transparent', label: 'Прозрачный' },
                { value: '#0a0a0f', label: 'Темный' },
                { value: '#ffffff', label: 'Белый' },
                { value: 'gradient', label: 'Градиент' }
            ],
            default: 'transparent'
        },
        
        // Размеры
        size: {
            label: 'Размер иконки',
            type: 'range',
            min: 80,
            max: 350,
            default: 200
        },
        scale: {
            label: 'Масштаб',
            type: 'range',
            min: 0.5,
            max: 1.5,
            step: 0.05,
            default: 1.0
        },
        rotation: {
            label: 'Поворот',
            type: 'range',
            min: 0,
            max: 360,
            default: 0
        },
        complexity: {
            label: 'Сложность',
            type: 'range',
            min: 1,
            max: 5,
            default: 3
        },
        
        // Композиция
        composition: {
            label: 'Композиция',
            type: 'select',
            options: [
                { value: 'centered', label: 'По центру' },
                { value: 'top', label: 'Сверху' },
                { value: 'bottom', label: 'Снизу' },
                { value: 'left', label: 'Слева' },
                { value: 'right', label: 'Справа' },
                { value: 'diagonal', label: 'Диагонально' },
                { value: 'scattered', label: 'Разбросанно' }
            ],
            default: 'centered'
        },
        symmetry: {
            label: 'Симметрия',
            type: 'select',
            options: [
                { value: 'none', label: 'Нет' },
                { value: 'horizontal', label: 'Горизонтальная' },
                { value: 'vertical', label: 'Вертикальная' },
                { value: 'radial', label: 'Радиальная' }
            ],
            default: 'none'
        },
        
        // Текст
        text: {
            label: 'Текст',
            type: 'text',
            default: ''
        },
        textSize: {
            label: 'Размер текста',
            type: 'range',
            min: 12,
            max: 48,
            default: 24
        },
        textColor: {
            label: 'Цвет текста',
            type: 'color',
            default: '#ffffff'
        },
        textPosition: {
            label: 'Позиция текста',
            type: 'select',
            options: [
                { value: 'none', label: 'Без текста' },
                { value: 'top', label: 'Сверху' },
                { value: 'bottom', label: 'Снизу' },
                { value: 'center', label: 'По центру' },
                { value: 'top-left', label: 'Сверху слева' },
                { value: 'top-right', label: 'Сверху справа' },
                { value: 'bottom-left', label: 'Снизу слева' },
                { value: 'bottom-right', label: 'Снизу справа' }
            ],
            default: 'bottom'
        },
        textFont: {
            label: 'Шрифт',
            type: 'select',
            options: [
                { value: 'Arial', label: 'Arial' },
                { value: 'Orbitron', label: 'Orbitron' },
                { value: 'Press Start 2P', label: 'Pixel' },
                { value: 'MedievalSharp', label: 'Fantasy' },
                { value: 'Quicksand', label: 'Modern' },
                { value: 'Fredoka One', label: 'Cartoon' }
            ],
            default: 'Arial'
        },
        
        // Эффекты
        glow: {
            label: 'Свечение',
            type: 'checkbox',
            default: false
        },
        shadow: {
            label: 'Тень',
            type: 'checkbox',
            default: false
        },
        outline: {
            label: 'Контур',
            type: 'checkbox',
            default: false
        }
    }
};

// Группы настроек для UI
export const CONFIG_GROUPS = [
    {
        id: 'colors',
        title: 'Цвета',
        icon: 'palette',
        fields: ['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor']
    },
    {
        id: 'size',
        title: 'Размеры',
        icon: 'arrows-alt',
        fields: ['size', 'scale', 'rotation', 'complexity']
    },
    {
        id: 'composition',
        title: 'Композиция',
        icon: 'layer-group',
        fields: ['composition', 'symmetry']
    },
    {
        id: 'text',
        title: 'Текст',
        icon: 'font',
        fields: ['text', 'textSize', 'textColor', 'textPosition', 'textFont']
    },
    {
        id: 'effects',
        title: 'Эффекты',
        icon: 'magic',
        fields: ['glow', 'shadow', 'outline']
    }
];