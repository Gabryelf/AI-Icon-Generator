// ===============================================================
// БИБЛИОТЕКА ПРЕСЕТОВ - v0.0.2 Улучшение основных прессетов
//                     - v0.0.3 Добавление пиксельных прессетов
//                     - v0.0.4 Добавление алгоритмов для скинов
//                     - v0.0.5 - Компоненты, стили, конфигурации
// ===============================================================


// КОМПОНЕНТЫ (основные категории)
export const COMPONENTS = {
    button: {
        name: 'Кнопка',
        icon: 'fas fa-square',
        description: 'Интерактивные элементы интерфейса'
    },
    icon: {
        name: 'Иконка',
        icon: 'fas fa-icons',
        description: 'Графические символы для интерфейсов'
    },
    avatar: {
        name: 'Аватар',
        icon: 'fas fa-user-circle',
        description: 'Пиксельные аватары для профилей'
    },
    character: {
        name: 'Персонаж',
        icon: 'fas fa-user-astronaut',
        description: 'Реалистичные и стилизованные персонажи'
    }
};

// СТИЛИСТИЧЕСКИЕ НАПРАВЛЕНИЯ
export const STYLES = {
    minimal: {
        name: 'Минимализм',
        icon: 'fas fa-circle',
        description: 'Чистые линии, мало деталей'
    },
    vibrant: {
        name: 'Яркий',
        icon: 'fas fa-bolt',
        description: 'Насыщенные цвета, энергия'
    },
    neon: {
        name: 'Неон',
        icon: 'fas fa-lightbulb',
        description: 'Свечение, яркие акценты'
    },
    vintage: {
        name: 'Винтаж',
        icon: 'fas fa-clock',
        description: 'Ретро-стиль, теплые тона'
    },
    geometric: {
        name: 'Геометрический',
        icon: 'fas fa-shapes',
        description: 'Строгие формы и углы'
    },
    organic: {
        name: 'Органический',
        icon: 'fas fa-leaf',
        description: 'Плавные линии, природные формы'
    },
    fantasy: {
        name: 'Фэнтези',
        icon: 'fas fa-dragon',
        description: 'Магические, сказочные элементы'
    },
    pixel: {
        name: 'Пиксельный',
        icon: 'fas fa-th',
        description: 'Ретро-пиксельная графика'
    },
    cyberpunk: {
        name: 'Киберпанк',
        icon: 'fas fa-microchip',
        description: 'Неон, футуризм, технологичный стиль'
    },
    cartoon: {
        name: 'Мультяшный',
        icon: 'fas fa-face-smile',
        description: 'Яркий, дружелюбный стиль'
    },
    steampunk: {
        name: 'Стимпанк',
        icon: 'fas fa-cog',
        description: 'Викторианский стиль + механизмы'
    },
    watercolor: {
        name: 'Акварель',
        icon: 'fas fa-tint',
        description: 'Мягкие, размытые переходы'
    },
    low_poly: {
        name: 'Low Poly',
        icon: 'fas fa-cube',
        description: 'Полигональный стиль'
    },
    anime: {
        name: 'Аниме',
        icon: 'fas fa-heart',
        description: 'Японский стиль, большие глаза'
    }
};

// КОНФИГУРАЦИИ ДЛЯ КАЖДОГО КОМПОНЕНТА
export const CATEGORY_CONFIGS = {
    button: {
        defaults: {
            shape: 'rounded',
            size: 120,
            color: '#7c3aed',
            bgColor: 'transparent',
            glow: true,
            cornerRadius: 20,
            text: 'Кнопка',
            style: 'flat'
        },
        config: {
            shape: {
                label: 'Форма',
                type: 'select',
                options: [
                    { value: 'rounded', label: 'Скругленная' },
                    { value: 'square', label: 'Прямоугольная' },
                    { value: 'circle', label: 'Круглая' },
                    { value: 'pill', label: 'Таблетка' }
                ],
                default: 'rounded'
            },
            color: {
                label: 'Цвет',
                type: 'color',
                default: '#7c3aed'
            },
            bgColor: {
                label: 'Фон',
                type: 'select',
                options: [
                    { value: 'transparent', label: 'Прозрачный' },
                    { value: '#0a0a0f', label: 'Темный' },
                    { value: 'gradient', label: 'Градиент' }
                ],
                default: 'transparent'
            },
            text: {
                label: 'Текст',
                type: 'text',
                default: 'Кнопка'
            },
            glow: {
                label: 'Свечение',
                type: 'checkbox',
                default: true
            },
            cornerRadius: {
                label: 'Скругление',
                type: 'range',
                min: 0,
                max: 50,
                default: 20
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 40,
                max: 200,
                default: 120
            }
        }
    },
    
    icon: {
        defaults: {
            shape: 'circle',
            size: 120,
            color: '#7c3aed',
            bgColor: 'transparent',
            glow: true,
            strokeWidth: 3,
            complexity: 5
        },
        config: {
            shape: {
                label: 'Форма',
                type: 'select',
                options: [
                    { value: 'circle', label: 'Круг' },
                    { value: 'square', label: 'Квадрат' },
                    { value: 'hexagon', label: 'Шестиугольник' },
                    { value: 'shield', label: 'Щит' },
                    { value: 'diamond', label: 'Ромб' },
                    { value: 'star', label: 'Звезда' }
                ],
                default: 'circle'
            },
            color: {
                label: 'Цвет',
                type: 'color',
                default: '#7c3aed'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 40,
                max: 200,
                default: 120
            },
            bgColor: {
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
            glow: {
                label: 'Свечение',
                type: 'checkbox',
                default: true
            },
            strokeWidth: {
                label: 'Толщина контура',
                type: 'range',
                min: 0,
                max: 10,
                default: 3
            },
            complexity: {
                label: 'Детализация',
                type: 'range',
                min: 0,
                max: 10,
                default: 5
            }
        }
    },
    
    avatar: {
        defaults: {
            color: '#7c3aed',
            skinColor: '#f5d0b8',
            eyes: 'simple',
            mouth: 'smile',
            hair: 'short',
            size: 16,
            accessories: '',
            style: 'default'
        },
        config: {
            color: {
                label: 'Основной цвет',
                type: 'color',
                default: '#7c3aed'
            },
            skinColor: {
                label: 'Цвет кожи',
                type: 'color',
                default: '#f5d0b8'
            },
            eyes: {
                label: 'Глаза',
                type: 'select',
                options: [
                    { value: 'simple', label: 'Простые' },
                    { value: 'anime', label: 'Аниме' },
                    { value: 'cartoon', label: 'Мультяшные' },
                    { value: 'realistic', label: 'Реалистичные' },
                    { value: 'closed', label: 'Закрытые' }
                ],
                default: 'simple'
            },
            mouth: {
                label: 'Рот',
                type: 'select',
                options: [
                    { value: 'smile', label: 'Улыбка' },
                    { value: 'open', label: 'Открытый' },
                    { value: 'neutral', label: 'Нейтральный' },
                    { value: 'happy', label: 'Счастливый' },
                    { value: 'none', label: 'Без рта' }
                ],
                default: 'smile'
            },
            hair: {
                label: 'Прическа',
                type: 'select',
                options: [
                    { value: 'short', label: 'Короткие' },
                    { value: 'long', label: 'Длинные' },
                    { value: 'ponytail', label: 'Хвост' },
                    { value: 'spiky', label: 'Торчком' },
                    { value: 'curly', label: 'Кудрявые' },
                    { value: 'bald', label: 'Лысый' }
                ],
                default: 'short'
            },
            size: {
                label: 'Размер пикселя',
                type: 'range',
                min: 8,
                max: 32,
                default: 16
            },
            accessories: {
                label: 'Аксессуары (через запятую)',
                type: 'text',
                default: ''
            }
        }
    },
    
    character: {
        defaults: {
            style: 'fantasy',
            color: '#7c3aed',
            skinColor: '#f5d0b8',
            eyes: 'simple',
            mouth: 'smile',
            hair: 'short',
            bgColor: 'transparent',
            hasWeapon: false,
            hasArmor: false,
            hasGlasses: false,
            hasHat: false,
            accessories: ''
        },
        config: {
            style: {
                label: 'Стиль персонажа',
                type: 'select',
                options: [
                    { value: 'fantasy', label: 'Фэнтези' },
                    { value: 'sciFi', label: 'Sci-Fi' },
                    { value: 'cartoon', label: 'Мультяшный' },
                    { value: 'realistic', label: 'Реалистичный' },
                    { value: 'anime', label: 'Аниме' }
                ],
                default: 'fantasy'
            },
            color: {
                label: 'Основной цвет',
                type: 'color',
                default: '#7c3aed'
            },
            skinColor: {
                label: 'Цвет кожи',
                type: 'color',
                default: '#f5d0b8'
            },
            eyes: {
                label: 'Глаза',
                type: 'select',
                options: [
                    { value: 'simple', label: 'Простые' },
                    { value: 'anime', label: 'Аниме' },
                    { value: 'cartoon', label: 'Мультяшные' },
                    { value: 'realistic', label: 'Реалистичные' },
                    { value: 'closed', label: 'Закрытые' }
                ],
                default: 'simple'
            },
            mouth: {
                label: 'Рот',
                type: 'select',
                options: [
                    { value: 'smile', label: 'Улыбка' },
                    { value: 'open', label: 'Открытый' },
                    { value: 'neutral', label: 'Нейтральный' },
                    { value: 'happy', label: 'Счастливый' },
                    { value: 'none', label: 'Без рта' }
                ],
                default: 'smile'
            },
            hair: {
                label: 'Прическа',
                type: 'select',
                options: [
                    { value: 'short', label: 'Короткие' },
                    { value: 'long', label: 'Длинные' },
                    { value: 'ponytail', label: 'Хвост' },
                    { value: 'spiky', label: 'Торчком' },
                    { value: 'curly', label: 'Кудрявые' },
                    { value: 'bald', label: 'Лысый' }
                ],
                default: 'short'
            },
            bgColor: {
                label: 'Фон',
                type: 'select',
                options: [
                    { value: 'transparent', label: 'Прозрачный' },
                    { value: '#0a0a0f', label: 'Темный' },
                    { value: 'gradient', label: 'Градиент' }
                ],
                default: 'transparent'
            },
            hasWeapon: {
                label: 'Оружие',
                type: 'checkbox',
                default: false
            },
            hasArmor: {
                label: 'Доспехи',
                type: 'checkbox',
                default: false
            },
            hasGlasses: {
                label: 'Очки',
                type: 'checkbox',
                default: false
            },
            hasHat: {
                label: 'Шляпа',
                type: 'checkbox',
                default: false
            },
            accessories: {
                label: 'Дополнительные аксессуары',
                type: 'text',
                default: ''
            }
        }
    }
};