// ===============================================================
// БИБЛИОТЕКА ПРЕСЕТОВ - v0.0.2 Улучшение основных прессетов
//                     - v0.0.3 Добавление пиксельных прессетов
//                     - v0.0.4 Добавление алгоритмов для скинов
//                     - v0.0.5 - Компоненты, стили, конфигурации
//                     - v0.0.6 - Реструктуризация
// ===============================================================


// КАТЕГОРИИ
// modules/configs/presets.js

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
        description: 'Графические символы, логотипы, эмблемы, значки',
        styles: ['pixel', 'cartoon', 'cyberpunk', 'fantasy']
    },
    avatar: {
        name: 'Аватар',
        icon: 'fas fa-user-circle',
        description: 'Портреты и лица персонажей с рамками и подписями',
        styles: ['fantasy', 'pixel', 'chibi', 'anime', 'casual']
    },
    character: {
        name: 'Персонаж',
        icon: 'fas fa-user-astronaut',
        description: 'Полноценные персонажи в полный рост',
        styles: ['fantasy', 'pixel', 'chibi', 'anime', 'casual']
    }
};

export const STYLES = {
    pixel: {
        name: 'Пиксельный',
        icon: 'fas fa-th',
        description: 'Ретро-пиксельная графика 8-16 бит',
        font: 'Press Start 2P'
    },
    cartoon: {
        name: 'Мультяшный',
        icon: 'fas fa-face-smile',
        description: 'Яркий, дружелюбный стиль с жирным контуром',
        font: 'Fredoka One'
    },
    cyberpunk: {
        name: 'Киберпанк',
        icon: 'fas fa-microchip',
        description: 'Неоновые цвета, хакерская эстетика',
        font: 'Orbitron'
    },
    fantasy: {
        name: 'Фэнтези',
        icon: 'fas fa-dragon',
        description: 'Магические руны, золотое свечение',
        font: 'MedievalSharp'
    },
    chibi: {
        name: 'Чиби',
        icon: 'fas fa-child',
        description: 'Миниатюрные пропорции, большие глаза',
        font: 'Quicksand'
    },
    anime: {
        name: 'Аниме',
        icon: 'fas fa-heart',
        description: 'Большие выразительные глаза, яркие волосы',
        font: 'Quicksand'
    },
    casual: {
        name: 'Казуальный',
        icon: 'fas fa-user',
        description: 'Современный повседневный стиль',
        font: 'Quicksand'
    }
};

// Конфигурации для UI
export const CATEGORY_CONFIGS = {
    button: {
        defaults: {
            text: 'Кнопка',
            color: '#7c3aed',
            bgColor: 'transparent',
            size: 120,
            textColor: '#ffffff',
            textSize: 24,
            font: 'Arial'
        },
        config: {
            text: {
                label: 'Текст кнопки',
                type: 'text',
                default: 'Кнопка'
            },
            color: {
                label: 'Цвет кнопки',
                type: 'color',
                default: '#7c3aed'
            },
            textColor: {
                label: 'Цвет текста',
                type: 'color',
                default: '#ffffff'
            },
            textSize: {
                label: 'Размер текста',
                type: 'range',
                min: 12,
                max: 48,
                default: 24
            },
            bgColor: {
                label: 'Фон',
                type: 'select',
                options: [
                    { value: 'transparent', label: 'Прозрачный' },
                    { value: '#0a0a0f', label: 'Темный' },
                    { value: '#ffffff', label: 'Белый' }
                ],
                default: 'transparent'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 60,
                max: 250,
                default: 120
            }
        }
    },
    icon: {
        defaults: {
            color: '#7c3aed',
            bgColor: 'transparent',
            size: 100,
            text: '',
            textPosition: 'none',
            textColor: '#ffffff',
            textSize: 16
        },
        config: {
            color: {
                label: 'Цвет иконки',
                type: 'color',
                default: '#7c3aed'
            },
            bgColor: {
                label: 'Фон',
                type: 'select',
                options: [
                    { value: 'transparent', label: 'Прозрачный' },
                    { value: '#0a0a0f', label: 'Темный' },
                    { value: '#ffffff', label: 'Белый' }
                ],
                default: 'transparent'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 40,
                max: 200,
                default: 100
            },
            text: {
                label: 'Текст',
                type: 'text',
                default: ''
            },
            textPosition: {
                label: 'Позиция текста',
                type: 'select',
                options: [
                    { value: 'none', label: 'Без текста' },
                    { value: 'bottom', label: 'Снизу' },
                    { value: 'center', label: 'По центру' }
                ],
                default: 'none'
            },
            textColor: {
                label: 'Цвет текста',
                type: 'color',
                default: '#ffffff'
            },
            textSize: {
                label: 'Размер текста',
                type: 'range',
                min: 10,
                max: 36,
                default: 16
            }
        }
    },
    avatar: {
        defaults: {
            skinColor: '#f5d0b8',
            hairColor: '#2d3436',
            eyeColor: '#4d96ff',
            bgColor: 'transparent',
            size: 200,
            text: '',
            textPosition: 'none',
            textColor: '#ffffff',
            frame: 'none',
            expression: 'neutral'
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
            },
            frame: {
                label: 'Рамка',
                type: 'select',
                options: [
                    { value: 'none', label: 'Нет' },
                    { value: 'circle', label: 'Круглая' },
                    { value: 'square', label: 'Квадратная' },
                    { value: 'hexagon', label: 'Шестиугольная' }
                ],
                default: 'none'
            },
            expression: {
                label: 'Выражение лица',
                type: 'select',
                options: [
                    { value: 'neutral', label: 'Нейтральное' },
                    { value: 'smile', label: 'Улыбка' },
                    { value: 'happy', label: 'Счастливое' },
                    { value: 'surprised', label: 'Удивленное' },
                    { value: 'sad', label: 'Грустное' }
                ],
                default: 'neutral'
            },
            text: {
                label: 'Текст подписи',
                type: 'text',
                default: ''
            },
            textPosition: {
                label: 'Позиция текста',
                type: 'select',
                options: [
                    { value: 'none', label: 'Без текста' },
                    { value: 'bottom', label: 'Снизу' },
                    { value: 'top', label: 'Сверху' }
                ],
                default: 'none'
            },
            textColor: {
                label: 'Цвет текста',
                type: 'color',
                default: '#ffffff'
            },
            textSize: {
                label: 'Размер текста',
                type: 'range',
                min: 12,
                max: 30,
                default: 18
            }
        }
    },
    character: {
        defaults: {
            skinColor: '#f5d0b8',
            hairColor: '#2d3436',
            eyeColor: '#4d96ff',
            outfitColor: '#7c3aed',
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
            bgColor: {
                label: 'Фон',
                type: 'select',
                options: [
                    { value: 'transparent', label: 'Прозрачный' },
                    { value: '#0a0a0f', label: 'Темный' }
                ],
                default: 'transparent'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 120,
                max: 400,
                default: 250
            },
            pose: {
                label: 'Поза',
                type: 'select',
                options: [
                    { value: 'standing', label: 'Стоя' },
                    { value: 'fighting', label: 'Боевая' },
                    { value: 'magic', label: 'Магия' },
                    { value: 'relaxed', label: 'Расслабленная' },
                    { value: 'running', label: 'Бег' }
                ],
                default: 'standing'
            }
        }
    }
};