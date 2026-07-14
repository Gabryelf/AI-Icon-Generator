// =============================================================
// ROUTER - Маршрутизация приложения
// =============================================================

export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeNavigate = null;
        this.afterNavigate = null;
    }

    /**
     * Регистрация маршрута
     * @param {string} path - Путь маршрута
     * @param {Function} handler - Обработчик маршрута
     */
    register(path, handler) {
        this.routes.set(path, handler);
        return this;
    }

    /**
     * Навигация на маршрут
     * @param {string} path - Путь маршрута
     * @param {*} data - Данные для маршрута
     */
    navigate(path, data = null) {
        // Проверка хука перед навигацией
        if (this.beforeNavigate) {
            const result = this.beforeNavigate(path, data);
            if (result === false) return;
        }

        const handler = this.routes.get(path);
        if (!handler) {
            console.warn(`Маршрут "${path}" не найден`);
            return;
        }

        this.currentRoute = path;
        
        // Выполнение обработчика
        try {
            handler(data);
        } catch (error) {
            console.error(`Ошибка при навигации на "${path}":`, error);
        }

        // Хук после навигации
        if (this.afterNavigate) {
            this.afterNavigate(path, data);
        }

        // Обновление UI
        this.updateUI(path);
    }

    /**
     * Обновление UI при навигации
     * @param {string} path - Текущий путь
     */
    updateUI(path) {
        // Обновление активного пункта меню
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === path);
        });

        // Обновление страниц
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active-page', page.id === `page-${path}`);
        });

        // Обновление заголовка
        const titles = {
            dashboard: 'Дашборд',
            generator: 'Генератор',
            history: 'История',
            profile: 'Мой профиль',
            settings: 'Настройки'
        };
        const titleEl = document.getElementById('page-title');
        if (titleEl) {
            titleEl.textContent = titles[path] || path;
        }
    }

    /**
     * Получить текущий маршрут
     * @returns {string|null}
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Установить хук перед навигацией
     * @param {Function} fn - Функция-хук
     */
    onBeforeNavigate(fn) {
        this.beforeNavigate = fn;
        return this;
    }

    /**
     * Установить хук после навигации
     * @param {Function} fn - Функция-хук
     */
    onAfterNavigate(fn) {
        this.afterNavigate = fn;
        return this;
    }

    /**
     * Проверка существования маршрута
     * @param {string} path - Путь маршрута
     * @returns {boolean}
     */
    hasRoute(path) {
        return this.routes.has(path);
    }

    /**
     * Получить все зарегистрированные маршруты
     * @returns {Array}
     */
    getRoutes() {
        return Array.from(this.routes.keys());
    }

    /**
     * Очистить все маршруты
     */
    clear() {
        this.routes.clear();
        this.currentRoute = null;
    }

    /**
     * Перезагрузка текущего маршрута
     */
    reload() {
        if (this.currentRoute) {
            this.navigate(this.currentRoute);
        }
    }
}