// =============================================================
// FONT LIBRARY - Управление шрифтами
// =============================================================

export class FontLibrary {
    constructor() {
        this.fonts = {
            'Press Start 2P': {
                url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
                category: 'pixel',
                weight: '400'
            },
            'Orbitron': {
                url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
                category: 'cyberpunk',
                weight: '400'
            },
            'MedievalSharp': {
                url: 'https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap',
                category: 'fantasy',
                weight: '400'
            },
            'Fredoka One': {
                url: 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',
                category: 'cartoon',
                weight: '400'
            },
            'Quicksand': {
                url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap',
                category: 'casual',
                weight: '400'
            },
            'Righteous': {
                url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
                category: 'cyberpunk',
                weight: '400'
            },
            'Creepster': {
                url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap',
                category: 'fantasy',
                weight: '400'
            },
            'Bangers': {
                url: 'https://fonts.googleapis.com/css2?family=Bangers&display=swap',
                category: 'cartoon',
                weight: '400'
            }
        };

        this.loaded = new Map();
        this.loading = new Map();
    }

    /**
     * Загрузка шрифтов
     * @param {Array<string>} fontNames - Список названий шрифтов
     * @returns {Promise<Array>}
     */
    async loadFonts(fontNames = null) {
        const names = fontNames || Object.keys(this.fonts);
        const promises = names.map(name => this.loadFont(name));
        return Promise.all(promises);
    }

    /**
     * Загрузка одного шрифта
     * @param {string} name - Название шрифта
     * @returns {Promise<boolean>}
     */
    async loadFont(name) {
        // Проверка кэша
        if (this.loaded.has(name)) {
            return this.loaded.get(name);
        }

        // Проверка загрузки
        if (this.loading.has(name)) {
            return this.loading.get(name);
        }

        const font = this.fonts[name];
        if (!font) {
            console.warn(`Шрифт "${name}" не найден`);
            return false;
        }

        // Создание промиса загрузки
        const promise = new Promise((resolve) => {
            // Проверка, не загружен ли уже шрифт
            if (document.querySelector(`link[href="${font.url}"]`)) {
                this.loaded.set(name, true);
                resolve(true);
                return;
            }

            // Создание link для загрузки
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = font.url;

            link.onload = () => {
                this.loaded.set(name, true);
                this.loading.delete(name);
                resolve(true);
            };

            link.onerror = () => {
                console.error(`Ошибка загрузки шрифта "${name}"`);
                this.loaded.set(name, false);
                this.loading.delete(name);
                resolve(false);
            };

            document.head.appendChild(link);
        });

        this.loading.set(name, promise);
        return promise;
    }

    /**
     * Проверка загрузки шрифта
     * @param {string} name - Название шрифта
     * @returns {boolean}
     */
    isLoaded(name) {
        return this.loaded.get(name) === true;
    }

    /**
     * Получение информации о шрифте
     * @param {string} name - Название шрифта
     * @returns {Object|null}
     */
    getFontInfo(name) {
        return this.fonts[name] || null;
    }

    /**
     * Получение шрифтов по категории
     * @param {string} category - Категория
     * @returns {Array<Object>}
     */
    getFontsByCategory(category) {
        const result = [];
        Object.entries(this.fonts).forEach(([name, info]) => {
            if (info.category === category) {
                result.push({ name, ...info });
            }
        });
        return result;
    }

    /**
     * Получение всех категорий
     * @returns {Array<string>}
     */
    getCategories() {
        const categories = new Set();
        Object.values(this.fonts).forEach(info => {
            if (info.category) {
                categories.add(info.category);
            }
        });
        return Array.from(categories);
    }

    /**
     * Генерация CSS для шрифта
     * @param {string} name - Название шрифта
     * @param {Object} options - Опции
     * @returns {string}
     */
    generateFontCSS(name, options = {}) {
        const font = this.fonts[name];
        if (!font) return '';

        const weight = options.weight || font.weight || '400';
        const size = options.size || '16px';
        const style = options.style || 'normal';

        return `
            font-family: '${name}', ${options.fallback || 'sans-serif'};
            font-weight: ${weight};
            font-size: ${size};
            font-style: ${style};
        `;
    }

    /**
     * Предзагрузка шрифтов
     * @param {Array<string>} names - Названия шрифтов
     */
    preload(names) {
        names.forEach(name => {
            const font = this.fonts[name];
            if (font && !document.querySelector(`link[href="${font.url}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = font.url;
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Получение системных шрифтов
     * @returns {Array<Object>}
     */
    getSystemFonts() {
        return [
            { name: 'Arial', category: 'system' },
            { name: 'Helvetica', category: 'system' },
            { name: 'Georgia', category: 'system' },
            { name: 'Times New Roman', category: 'system' },
            { name: 'Courier New', category: 'system' },
            { name: 'Verdana', category: 'system' }
        ];
    }

    /**
     * Очистка кэша шрифтов
     */
    clearCache() {
        this.loaded.clear();
        this.loading.clear();
    }

    /**
     * Получение всех шрифтов
     * @returns {Object}
     */
    getAllFonts() {
        return { ...this.fonts };
    }

    /**
     * Добавление пользовательского шрифта
     * @param {string} name - Название
     * @param {Object} info - Информация о шрифте
     */
    addFont(name, info) {
        this.fonts[name] = info;
    }

    /**
     * Удаление шрифта
     * @param {string} name - Название
     */
    removeFont(name) {
        delete this.fonts[name];
        this.loaded.delete(name);
        this.loading.delete(name);
    }
}