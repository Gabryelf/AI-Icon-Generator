// ===============================================================
// БИБЛИОТЕКА ПРЕСЕТОВ - v0.0.2 Улучшение основных прессетов
//                     - v0.0.3 Добавление пиксельных прессетов
//                     - v0.0.4 Добавление алгоритмов для скинов
//                     - v0.0.5 - Компоненты, стили, конфигурации
//                     - v0.0.6 - Реструктуризация
// ===============================================================


// КАТЕГОРИИ
export const CATEGORIES = {
    button: {
        name: 'Кнопка',
        icon: 'fas fa-square',
        description: 'Интерактивные элементы интерфейса',
        styles: ['pixel', 'cartoon', 'cyberpunk', 'fantasy']
    },
    icon: {
        name: 'Иконка',
        icon: 'fas fa-icons',
        description: 'Графические символы для интерфейсов',
        styles: ['pixel', 'cartoon', 'cyberpunk', 'fantasy']
    },
    avatar: {
        name: 'Аватар',
        icon: 'fas fa-user-circle',
        description: 'Портреты и лица персонажей',
        styles: ['fantasy', 'pixel', 'chibi', 'anime', 'casual']
    },
    character: {
        name: 'Персонаж',
        icon: 'fas fa-user-astronaut',
        description: 'Полноценные персонажи в полный рост',
        styles: ['fantasy', 'pixel', 'chibi', 'anime', 'casual']
    }
};

// СТИЛИ с улучшенными описаниями и иконками
export const STYLES = {
    pixel: {
        name: 'Пиксельный',
        icon: 'fas fa-th',
        description: 'Ретро-пиксельная графика 8-16 бит с характерной сеткой',
        font: 'Press Start 2P',
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff']
    },
    cartoon: {
        name: 'Мультяшный',
        icon: 'fas fa-face-smile',
        description: 'Яркий, дружелюбный стиль с жирным контуром и глянцевыми бликами',
        font: 'Fredoka One',
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff']
    },
    cyberpunk: {
        name: 'Киберпанк',
        icon: 'fas fa-microchip',
        description: 'Неоновые цвета, хакерская эстетика, футуристичный стиль',
        font: 'Orbitron',
        colors: ['#ff00ff', '#00ffff', '#ff0066', '#6600ff', '#00ff66']
    },
    fantasy: {
        name: 'Фэнтези',
        icon: 'fas fa-dragon',
        description: 'Магические руны, золотое свечение, эпическая атмосфера',
        font: 'MedievalSharp',
        colors: ['#7c3aed', '#ffd700', '#8b5cf6', '#f59e0b', '#ec4899']
    },
    chibi: {
        name: 'Чиби',
        icon: 'fas fa-child',
        description: 'Миниатюрные пропорции, большие глаза, максимальная милота',
        font: 'Quicksand',
        colors: ['#ff9ff3', '#f368e0', '#ff6b6b', '#ffd93d', '#6bcb77']
    },
    anime: {
        name: 'Аниме',
        icon: 'fas fa-heart',
        description: 'Большие выразительные глаза, яркие волосы, японская эстетика',
        font: 'Quicksand',
        colors: ['#ff6b6b', '#ffd93d', '#4d96ff', '#ff6bff', '#6bcb77']
    },
    casual: {
        name: 'Казуальный',
        icon: 'fas fa-user',
        description: 'Современный повседневный стиль с естественными пропорциями',
        font: 'Quicksand',
        colors: ['#2d3436', '#636e72', '#74b9ff', '#a29bfe', '#fd79a8']
    }
};

// КОНФИГУРАЦИИ ДЛЯ КАЖДОЙ КАТЕГОРИИ (остаются без изменений)
export const CATEGORY_CONFIGS = {
    button: {
        defaults: {
            text: 'Кнопка',
            color: '#7c3aed',
            bgColor: 'transparent',
            size: 120,
            cornerRadius: 20,
            glow: true,
            borderWidth: 2
        },
        config: {
            text: {
                label: 'Текст',
                type: 'text',
                default: 'Кнопка'
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
                    { value: '#ffffff', label: 'Белый' },
                    { value: 'gradient', label: 'Градиент' }
                ],
                default: 'transparent'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 40,
                max: 200,
                default: 120
            },
            cornerRadius: {
                label: 'Скругление',
                type: 'range',
                min: 0,
                max: 50,
                default: 20
            },
            glow: {
                label: 'Свечение',
                type: 'checkbox',
                default: true
            },
            borderWidth: {
                label: 'Толщина рамки',
                type: 'range',
                min: 0,
                max: 8,
                default: 2
            }
        }
    },
    icon: {
        defaults: {
            shape: 'circle',
            color: '#7c3aed',
            size: 120,
            bgColor: 'transparent',
            glow: true,
            complexity: 5,
            strokeWidth: 2
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
            complexity: {
                label: 'Детализация',
                type: 'range',
                min: 0,
                max: 10,
                default: 5
            },
            strokeWidth: {
                label: 'Толщина контура',
                type: 'range',
                min: 0,
                max: 8,
                default: 2
            }
        }
    },
    avatar: {
        defaults: {
            skinColor: '#f5d0b8',
            hairColor: '#2d3436',
            eyeColor: '#4d96ff',
            hairStyle: 'short',
            eyeStyle: 'anime',
            expression: 'smile',
            accessory: 'none',
            bgColor: 'transparent',
            size: 200
        },
        config: {
            skinColor: {
                label: 'Цвет кожи',
                type: 'color',
                default: '#f5d0b8'
            },
            hairColor: {
                label: 'Цвет волос',
                type: 'color',
                default: '#2d3436'
            },
            eyeColor: {
                label: 'Цвет глаз',
                type: 'color',
                default: '#4d96ff'
            },
            hairStyle: {
                label: 'Прическа',
                type: 'select',
                options: [
                    { value: 'short', label: 'Короткие' },
                    { value: 'long', label: 'Длинные' },
                    { value: 'ponytail', label: 'Хвост' },
                    { value: 'spiky', label: 'Торчком' },
                    { value: 'curly', label: 'Кудрявые' },
                    { value: 'bald', label: 'Лысый' },
                    { value: 'bob', label: 'Каре' },
                    { value: 'bun', label: 'Пучок' }
                ],
                default: 'short'
            },
            eyeStyle: {
                label: 'Стиль глаз',
                type: 'select',
                options: [
                    { value: 'anime', label: 'Аниме' },
                    { value: 'simple', label: 'Простые' },
                    { value: 'realistic', label: 'Реалистичные' },
                    { value: 'cartoon', label: 'Мультяшные' }
                ],
                default: 'anime'
            },
            expression: {
                label: 'Выражение лица',
                type: 'select',
                options: [
                    { value: 'smile', label: 'Улыбка' },
                    { value: 'happy', label: 'Счастливый' },
                    { value: 'neutral', label: 'Нейтральный' },
                    { value: 'surprised', label: 'Удивленный' },
                    { value: 'sad', label: 'Грустный' }
                ],
                default: 'smile'
            },
            accessory: {
                label: 'Аксессуар',
                type: 'select',
                options: [
                    { value: 'none', label: 'Нет' },
                    { value: 'glasses', label: 'Очки' },
                    { value: 'hat', label: 'Шляпа' },
                    { value: 'crown', label: 'Корона' },
                    { value: 'headphones', label: 'Наушники' },
                    { value: 'bow', label: 'Бант' }
                ],
                default: 'none'
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
            size: {
                label: 'Размер',
                type: 'range',
                min: 80,
                max: 300,
                default: 200
            }
        }
    },
    character: {
        defaults: {
            skinColor: '#f5d0b8',
            hairColor: '#2d3436',
            eyeColor: '#4d96ff',
            outfitColor: '#7c3aed',
            hairStyle: 'short',
            eyeStyle: 'anime',
            expression: 'smile',
            bodyType: 'normal',
            accessory: 'none',
            weapon: 'none',
            bgColor: 'transparent',
            size: 250,
            pose: 'standing'
        },
        config: {
            skinColor: {
                label: 'Цвет кожи',
                type: 'color',
                default: '#f5d0b8'
            },
            hairColor: {
                label: 'Цвет волос',
                type: 'color',
                default: '#2d3436'
            },
            eyeColor: {
                label: 'Цвет глаз',
                type: 'color',
                default: '#4d96ff'
            },
            outfitColor: {
                label: 'Цвет одежды',
                type: 'color',
                default: '#7c3aed'
            },
            hairStyle: {
                label: 'Прическа',
                type: 'select',
                options: [
                    { value: 'short', label: 'Короткие' },
                    { value: 'long', label: 'Длинные' },
                    { value: 'ponytail', label: 'Хвост' },
                    { value: 'spiky', label: 'Торчком' },
                    { value: 'curly', label: 'Кудрявые' },
                    { value: 'bald', label: 'Лысый' },
                    { value: 'bob', label: 'Каре' },
                    { value: 'bun', label: 'Пучок' }
                ],
                default: 'short'
            },
            eyeStyle: {
                label: 'Стиль глаз',
                type: 'select',
                options: [
                    { value: 'anime', label: 'Аниме' },
                    { value: 'simple', label: 'Простые' },
                    { value: 'realistic', label: 'Реалистичные' },
                    { value: 'cartoon', label: 'Мультяшные' }
                ],
                default: 'anime'
            },
            expression: {
                label: 'Выражение лица',
                type: 'select',
                options: [
                    { value: 'smile', label: 'Улыбка' },
                    { value: 'happy', label: 'Счастливый' },
                    { value: 'neutral', label: 'Нейтральный' },
                    { value: 'surprised', label: 'Удивленный' },
                    { value: 'sad', label: 'Грустный' }
                ],
                default: 'smile'
            },
            bodyType: {
                label: 'Тип телосложения',
                type: 'select',
                options: [
                    { value: 'normal', label: 'Нормальное' },
                    { value: 'slim', label: 'Худое' },
                    { value: 'muscular', label: 'Мускулистое' },
                    { value: 'chibi', label: 'Чиби' }
                ],
                default: 'normal'
            },
            accessory: {
                label: 'Аксессуар',
                type: 'select',
                options: [
                    { value: 'none', label: 'Нет' },
                    { value: 'glasses', label: 'Очки' },
                    { value: 'hat', label: 'Шляпа' },
                    { value: 'crown', label: 'Корона' },
                    { value: 'cape', label: 'Плащ' },
                    { value: 'backpack', label: 'Рюкзак' }
                ],
                default: 'none'
            },
            weapon: {
                label: 'Оружие',
                type: 'select',
                options: [
                    { value: 'none', label: 'Нет' },
                    { value: 'sword', label: 'Меч' },
                    { value: 'staff', label: 'Посох' },
                    { value: 'bow', label: 'Лук' },
                    { value: 'gun', label: 'Пистолет' },
                    { value: 'shield', label: 'Щит' }
                ],
                default: 'none'
            },
            pose: {
                label: 'Поза',
                type: 'select',
                options: [
                    { value: 'standing', label: 'Стоя' },
                    { value: 'fighting', label: 'Боевая' },
                    { value: 'magic', label: 'Магия' },
                    { value: 'relaxed', label: 'Расслабленная' }
                ],
                default: 'standing'
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
            size: {
                label: 'Размер',
                type: 'range',
                min: 100,
                max: 350,
                default: 250
            }
        }
    }
};