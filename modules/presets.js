// ===============================================================
// БИБЛИОТЕКА ПРЕСЕТОВ - v2.0 Улучшение основных прессетов
//                     - v3.0 Добавление пиксельных прессетов
//                     - v4.0 Добавление алгоритмов для скинов
// ===============================================================

// ДОМЕНЫ (сферы применения)
export const DOMAINS = {
    gaming: {
        name: 'Игры',
        icon: 'fas fa-gamepad',
        description: 'Иконки, кнопки, аватары для игр',
        styles: ['neon', 'pixel', 'fantasy', 'minimal', 'vibrant', 'cyberpunk', 'cartoon'],
        categories: ['game_icon', 'game_button', 'game_avatar', 'game_emblem', 'game_ui', 'game_character', 'game_item']
    },
    branding: {
        name: 'Брендинг',
        icon: 'fas fa-trademark',
        description: 'Логотипы, эмблемы, фирменные знаки',
        styles: ['minimal', 'luxury', 'vintage', 'geometric', 'organic', 'flat'],
        categories: ['logo', 'emblem', 'badge', 'monogram', 'icon']
    },
    web: {
        name: 'Веб & UI',
        icon: 'fas fa-globe',
        description: 'Кнопки, иконки интерфейса, элементы',
        styles: ['minimal', 'flat', 'gradient', 'material', 'neon', 'cyberpunk'],
        categories: ['ui_icon', 'ui_button', 'ui_nav', 'ui_media', 'ui_data', 'web_illustration']
    },
    social: {
        name: 'Соцсети',
        icon: 'fas fa-share-alt',
        description: 'Аватары, обложки, стикеры',
        styles: ['vibrant', 'pastel', 'gradient', 'cartoon', 'minimal', 'watercolor', 'anime'],
        categories: ['avatar', 'cover', 'sticker', 'reaction', 'badge', 'social_template']
    },
    presentation: {
        name: 'Презентации',
        icon: 'fas fa-presentation',
        description: 'Инфографика, диаграммы, иллюстрации',
        styles: ['flat', 'gradient', 'minimal', 'vibrant', 'organic', 'geometric'],
        categories: ['chart', 'diagram', 'infographic', 'icon_set', 'flow']
    }
};

// СТИЛИ
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
    pixel: {
        name: 'Пиксельный',
        icon: 'fas fa-th',
        description: 'Ретро-пиксельная графика, 16x16 спрайты'
    },
    fantasy: {
        name: 'Фэнтези',
        icon: 'fas fa-dragon',
        description: 'Магические, сказочные элементы'
    },
    luxury: {
        name: 'Люкс',
        icon: 'fas fa-crown',
        description: 'Золото, элегантность, премиум'
    },
    flat: {
        name: 'Flat',
        icon: 'fas fa-square',
        description: 'Плоский дизайн без теней'
    },
    gradient: {
        name: 'Градиент',
        icon: 'fas fa-fill-drip',
        description: 'Плавные переходы цветов'
    },
    material: {
        name: 'Material',
        icon: 'fas fa-layer-group',
        description: 'Материальный дизайн с тенями'
    },
    pastel: {
        name: 'Пастель',
        icon: 'fas fa-pastel',
        description: 'Мягкие, приглушенные тона'
    },
    cartoon: {
        name: 'Мультяшный',
        icon: 'fas fa-face-smile',
        description: 'Яркий, дружелюбный стиль'
    },
    cyberpunk: {
        name: 'Киберпанк',
        icon: 'fas fa-microchip',
        description: 'Неон, футуризм, технологичный стиль'
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

// КАТЕГОРИИ ЭЛЕМЕНТОВ
export const CATEGORIES = {
    // Игры
    game_icon: {
        name: 'Игровая иконка',
        icon: 'fas fa-dice',
        description: 'Иконки для игровых интерфейсов',
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
                    { value: 'diamond', label: 'Ромб' }
                ],
                default: 'circle'
            },
            color: {
                label: 'Основной цвет',
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
    game_character: {
        name: 'Игровой персонаж',
        icon: 'fas fa-user-astronaut',
        description: 'Персонажи для игр в разных стилях',
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
            hasHat: false
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
            }
        }
    },
    game_item: {
        name: 'Игровой предмет',
        icon: 'fas fa-sword',
        description: 'Предметы, оружие, артефакты',
        defaults: {
            type: 'weapon',
            color: '#7c3aed',
            bgColor: 'transparent',
            rarity: 'common'
        },
        config: {
            type: {
                label: 'Тип предмета',
                type: 'select',
                options: [
                    { value: 'weapon', label: 'Оружие' },
                    { value: 'armor', label: 'Броня' },
                    { value: 'potion', label: 'Зелье' },
                    { value: 'artifact', label: 'Артефакт' },
                    { value: 'resource', label: 'Ресурс' }
                ],
                default: 'weapon'
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
                    { value: '#0a0a0f', label: 'Темный' }
                ],
                default: 'transparent'
            },
            rarity: {
                label: 'Редкость',
                type: 'select',
                options: [
                    { value: 'common', label: 'Обычный' },
                    { value: 'uncommon', label: 'Необычный' },
                    { value: 'rare', label: 'Редкий' },
                    { value: 'epic', label: 'Эпический' },
                    { value: 'legendary', label: 'Легендарный' }
                ],
                default: 'common'
            }
        }
    },
    game_button: {
        name: 'Игровая кнопка',
        icon: 'fas fa-gamepad',
        description: 'Кнопки для игрового интерфейса',
        defaults: {
            shape: 'rounded',
            color: '#7c3aed',
            bgColor: 'transparent',
            glow: true,
            cornerRadius: 20,
            text: 'PLAY'
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
                label: 'Цвет кнопки',
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
                default: 'PLAY'
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
            }
        }
    },
    game_avatar: {
        name: 'Игровой аватар',
        icon: 'fas fa-user-astronaut',
        description: 'Аватары для игровых профилей (включая пиксельные)',
        defaults: {
            shape: 'circle',
            color: '#7c3aed',
            bgColor: 'transparent',
            hasBorder: true,
            borderColor: '#ffffff',
            eyes: 'simple',
            mouth: 'smile',
            hair: 'short',
            size: 160
        },
        config: {
            shape: {
                label: 'Форма аватара',
                type: 'select',
                options: [
                    { value: 'circle', label: 'Круг' },
                    { value: 'square', label: 'Квадрат' },
                    { value: 'hexagon', label: 'Шестиугольник' },
                    { value: 'diamond', label: 'Ромб' }
                ],
                default: 'circle'
            },
            color: {
                label: 'Основной цвет',
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
            hasBorder: {
                label: 'Рамка',
                type: 'checkbox',
                default: true
            },
            borderColor: {
                label: 'Цвет рамки',
                type: 'color',
                default: '#ffffff'
            },
            eyes: {
                label: 'Глаза',
                type: 'select',
                options: [
                    { value: 'simple', label: 'Простые' },
                    { value: 'anime', label: 'Аниме' },
                    { value: 'cartoon', label: 'Мультяшные' },
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
                    { value: 'bald', label: 'Лысый' }
                ],
                default: 'short'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 80,
                max: 200,
                default: 160
            }
        }
    },
    game_emblem: {
        name: 'Игровая эмблема',
        icon: 'fas fa-crown',
        description: 'Эмблемы для кланов и команд',
        defaults: {
            shape: 'shield',
            color: '#7c3aed',
            bgColor: 'transparent',
            stars: 3,
            hasRibbon: true
        },
        config: {
            shape: {
                label: 'Форма эмблемы',
                type: 'select',
                options: [
                    { value: 'shield', label: 'Щит' },
                    { value: 'circle', label: 'Круг' },
                    { value: 'diamond', label: 'Ромб' },
                    { value: 'crest', label: 'Герб' }
                ],
                default: 'shield'
            },
            color: {
                label: 'Основной цвет',
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
            stars: {
                label: 'Количество звезд',
                type: 'range',
                min: 0,
                max: 5,
                default: 3
            },
            hasRibbon: {
                label: 'Лента',
                type: 'checkbox',
                default: true
            }
        }
    },
    game_ui: {
        name: 'UI элемент',
        icon: 'fas fa-user-interface',
        description: 'Интерфейсные элементы для игр',
        defaults: {
            style: 'neon',
            color: '#7c3aed',
            bgColor: 'transparent',
            healthBar: true
        },
        config: {
            style: {
                label: 'Стиль UI',
                type: 'select',
                options: [
                    { value: 'neon', label: 'Неон' },
                    { value: 'flat', label: 'Плоский' },
                    { value: 'futuristic', label: 'Футуристичный' },
                    { value: 'minimal', label: 'Минималистичный' }
                ],
                default: 'neon'
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
                    { value: '#0a0a0f', label: 'Темный' }
                ],
                default: 'transparent'
            },
            healthBar: {
                label: 'Полоса здоровья',
                type: 'checkbox',
                default: true
            }
        }
    },

    // Брендинг
    logo: {
        name: 'Логотип',
        icon: 'fas fa-tag',
        description: 'Фирменный знак для бренда',
        defaults: {
            shape: 'circle',
            color: '#7c3aed',
            bgColor: 'transparent',
            letter: 'A',
            hasSlogan: false
        },
        config: {
            shape: {
                label: 'Форма логотипа',
                type: 'select',
                options: [
                    { value: 'circle', label: 'Круг' },
                    { value: 'square', label: 'Квадрат' },
                    { value: 'hexagon', label: 'Шестиугольник' },
                    { value: 'free', label: 'Свободная' }
                ],
                default: 'circle'
            },
            color: {
                label: 'Цвет',
                type: 'color',
                default: '#7c3aed'
            },
            letter: {
                label: 'Буква/символ',
                type: 'text',
                default: 'A'
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
            }
        }
    },
    emblem: {
        name: 'Эмблема',
        icon: 'fas fa-flag',
        description: 'Символическая эмблема',
        defaults: {
            shape: 'shield',
            color: '#7c3aed',
            bgColor: 'transparent',
            borderWidth: 4
        },
        config: {
            shape: {
                label: 'Форма',
                type: 'select',
                options: [
                    { value: 'shield', label: 'Щит' },
                    { value: 'circle', label: 'Круг' },
                    { value: 'crest', label: 'Герб' }
                ],
                default: 'shield'
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
                    { value: '#0a0a0f', label: 'Темный' }
                ],
                default: 'transparent'
            },
            borderWidth: {
                label: 'Толщина рамки',
                type: 'range',
                min: 0,
                max: 10,
                default: 4
            }
        }
    },

    // Веб и UI
    ui_icon: {
        name: 'UI иконка',
        icon: 'fas fa-icons',
        description: 'Иконки для веб-интерфейсов',
        defaults: {
            style: 'minimal',
            color: '#7c3aed',
            size: 64,
            bgColor: 'transparent'
        },
        config: {
            style: {
                label: 'Стиль иконки',
                type: 'select',
                options: [
                    { value: 'minimal', label: 'Минимализм' },
                    { value: 'outline', label: 'Контур' },
                    { value: 'filled', label: 'Заливка' },
                    { value: 'duotone', label: 'Дуотон' }
                ],
                default: 'minimal'
            },
            color: {
                label: 'Цвет',
                type: 'color',
                default: '#7c3aed'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 16,
                max: 128,
                default: 64
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
            }
        }
    },
    ui_button: {
        name: 'Кнопка UI',
        icon: 'fas fa-square',
        description: 'Кнопки для интерфейса',
        defaults: {
            style: 'flat',
            color: '#7c3aed',
            bgColor: 'transparent',
            text: 'Button',
            cornerRadius: 8
        },
        config: {
            style: {
                label: 'Стиль кнопки',
                type: 'select',
                options: [
                    { value: 'flat', label: 'Плоская' },
                    { value: 'gradient', label: 'Градиентная' },
                    { value: 'material', label: 'Material' },
                    { value: 'neon', label: 'Неоновая' },
                    { value: 'minimal', label: 'Минималистичная' }
                ],
                default: 'flat'
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
                    { value: '#ffffff', label: 'Белый' }
                ],
                default: 'transparent'
            },
            text: {
                label: 'Текст',
                type: 'text',
                default: 'Button'
            },
            cornerRadius: {
                label: 'Скругление',
                type: 'range',
                min: 0,
                max: 50,
                default: 8
            }
        }
    },

    // Соцсети
    avatar: {
        name: 'Аватар',
        icon: 'fas fa-user',
        description: 'Аватар для соцсетей',
        defaults: {
            style: 'vibrant',
            color: '#7c3aed',
            bgColor: 'transparent',
            hasGlow: false,
            eyes: 'simple',
            mouth: 'smile',
            hair: 'short'
        },
        config: {
            style: {
                label: 'Стиль аватара',
                type: 'select',
                options: [
                    { value: 'vibrant', label: 'Яркий' },
                    { value: 'pastel', label: 'Пастельный' },
                    { value: 'minimal', label: 'Минималистичный' },
                    { value: 'cartoon', label: 'Мультяшный' },
                    { value: 'watercolor', label: 'Акварель' },
                    { value: 'anime', label: 'Аниме' }
                ],
                default: 'vibrant'
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
            hasGlow: {
                label: 'Свечение',
                type: 'checkbox',
                default: false
            },
            eyes: {
                label: 'Глаза',
                type: 'select',
                options: [
                    { value: 'simple', label: 'Простые' },
                    { value: 'anime', label: 'Аниме' },
                    { value: 'cartoon', label: 'Мультяшные' },
                    { value: 'closed', label: 'Закрытые' }
                ],
                default: 'simple'
            },
            mouth: {
                label: 'Рот',
                type: 'select',
                options: [
                    { value: 'smile', label: 'Улыбка' },
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
                    { value: 'bald', label: 'Лысый' }
                ],
                default: 'short'
            }
        }
    },
    sticker: {
        name: 'Стикер',
        icon: 'fas fa-sticker',
        description: 'Стикеры для мессенджеров',
        defaults: {
            style: 'cartoon',
            color: '#7c3aed',
            bgColor: 'transparent',
            hasOutline: true
        },
        config: {
            style: {
                label: 'Стиль стикера',
                type: 'select',
                options: [
                    { value: 'cartoon', label: 'Мультяшный' },
                    { value: 'minimal', label: 'Минималистичный' },
                    { value: 'vibrant', label: 'Яркий' },
                    { value: 'watercolor', label: 'Акварель' }
                ],
                default: 'cartoon'
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
                    { value: '#0a0a0f', label: 'Темный' }
                ],
                default: 'transparent'
            },
            hasOutline: {
                label: 'Контур',
                type: 'checkbox',
                default: true
            }
        }
    },

    // Презентации
    icon_set: {
        name: 'Набор иконок',
        icon: 'fas fa-layer-group',
        description: 'Набор иконок для презентаций',
        defaults: {
            count: 4,
            style: 'flat',
            color: '#7c3aed',
            size: 48,
            bgColor: 'transparent'
        },
        config: {
            count: {
                label: 'Количество иконок',
                type: 'range',
                min: 2,
                max: 8,
                default: 4
            },
            style: {
                label: 'Стиль',
                type: 'select',
                options: [
                    { value: 'flat', label: 'Flat' },
                    { value: 'outline', label: 'Контур' },
                    { value: 'gradient', label: 'Градиент' },
                    { value: 'minimal', label: 'Минимализм' }
                ],
                default: 'flat'
            },
            color: {
                label: 'Цвет',
                type: 'color',
                default: '#7c3aed'
            },
            size: {
                label: 'Размер',
                type: 'range',
                min: 24,
                max: 96,
                default: 48
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
            }
        }
    },
    infographic: {
        name: 'Инфографика',
        icon: 'fas fa-chart-pie',
        description: 'Элементы для инфографики',
        defaults: {
            type: 'chart',
            color: '#7c3aed',
            bgColor: 'transparent',
            dataPoints: 5
        },
        config: {
            type: {
                label: 'Тип',
                type: 'select',
                options: [
                    { value: 'chart', label: 'График' },
                    { value: 'pie', label: 'Круговая' },
                    { value: 'bar', label: 'Столбцы' },
                    { value: 'flow', label: 'Схема' }
                ],
                default: 'chart'
            },
            color: {
                label: 'Основной цвет',
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
            dataPoints: {
                label: 'Количество точек',
                type: 'range',
                min: 3,
                max: 10,
                default: 5
            }
        }
    }
};