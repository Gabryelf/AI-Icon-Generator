// =============================================================
// STORAGE - Абстракция над localStorage с поддержкой сжатия
// =============================================================

export class Storage {
    constructor(prefix = 'app_') {
        this.prefix = prefix;
        this.memoryCache = new Map();
        this.enableCache = true;
        this.compressionThreshold = 1024 * 10; // 10KB
    }

    /**
     * Сохранить данные
     * @param {string} key - Ключ
     * @param {*} data - Данные
     * @param {Object} options - Опции
     * @returns {boolean}
     */
    save(key, data, options = {}) {
        const fullKey = this.prefix + key;
        try {
            let serialized = JSON.stringify(data);
            
            // Сжатие для больших данных
            if (options.compress !== false && serialized.length > this.compressionThreshold) {
                serialized = this.compress(serialized);
            }

            localStorage.setItem(fullKey, serialized);
            
            if (this.enableCache) {
                this.memoryCache.set(key, data);
            }
            
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            
            // Попытка очистить кэш при ошибке
            try {
                if (e.name === 'QuotaExceededError') {
                    this.clearCache();
                    localStorage.setItem(fullKey, JSON.stringify(data));
                    return true;
                }
            } catch (retryError) {
                console.error('Retry save failed:', retryError);
            }
            
            return false;
        }
    }

    /**
     * Загрузить данные
     * @param {string} key - Ключ
     * @param {*} defaultValue - Значение по умолчанию
     * @param {Object} options - Опции
     * @returns {*}
     */
    load(key, defaultValue = null, options = {}) {
        const fullKey = this.prefix + key;
        
        // Проверка кэша
        if (this.enableCache && this.memoryCache.has(key)) {
            return this.memoryCache.get(key);
        }

        try {
            const raw = localStorage.getItem(fullKey);
            if (raw === null) return defaultValue;

            let data = raw;
            
            // Распаковка
            if (options.decompress !== false && this.isCompressed(raw)) {
                data = this.decompress(raw);
            }

            const parsed = JSON.parse(data);
            
            if (this.enableCache) {
                this.memoryCache.set(key, parsed);
            }
            
            return parsed;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    }

    /**
     * Удалить данные
     * @param {string} key - Ключ
     * @returns {boolean}
     */
    remove(key) {
        const fullKey = this.prefix + key;
        try {
            localStorage.removeItem(fullKey);
            this.memoryCache.delete(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }

    /**
     * Очистить все данные с префиксом
     * @returns {number} - Количество удаленных элементов
     */
    clear() {
        let count = 0;
        try {
            const keys = Object.keys(localStorage);
            const prefixedKeys = keys.filter(k => k.startsWith(this.prefix));
            
            prefixedKeys.forEach(key => {
                localStorage.removeItem(key);
                count++;
            });
            
            this.memoryCache.clear();
        } catch (e) {
            console.error('Storage clear error:', e);
        }
        return count;
    }

    /**
     * Получить все ключи с префиксом
     * @returns {Array<string>}
     */
    keys() {
        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(k => k.startsWith(this.prefix))
                .map(k => k.slice(this.prefix.length));
        } catch (e) {
            console.error('Storage keys error:', e);
            return [];
        }
    }

    /**
     * Получить размер хранилища
     * @returns {number} - Размер в байтах
     */
    getSize() {
        let total = 0;
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) total += value.length;
            });
        } catch (e) {
            console.error('Storage size error:', e);
        }
        return total;
    }

    /**
     * Проверить, сжаты ли данные
     * @param {string} data - Данные
     * @returns {boolean}
     */
    isCompressed(data) {
        return data.startsWith('{') === false && data.startsWith('[') === false;
    }

    /**
     * Простое сжатие (LZString подобное)
     * @param {string} data - Данные
     * @returns {string}
     */
    compress(data) {
        // Простое кодирование для уменьшения размера
        let compressed = '';
        let lastChar = '';
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            const char = data[i];
            if (char === lastChar && count < 9) {
                count++;
            } else {
                if (count > 0) {
                    compressed += count + lastChar;
                }
                lastChar = char;
                count = 0;
            }
        }
        if (count > 0) {
            compressed += count + lastChar;
        }

        // Добавляем маркер сжатия
        return 'C' + compressed;
    }

    /**
     * Распаковка данных
     * @param {string} data - Сжатые данные
     * @returns {string}
     */
    decompress(data) {
        if (!data.startsWith('C')) return data;
        
        let decompressed = '';
        const compressed = data.slice(1);
        
        for (let i = 0; i < compressed.length; i += 2) {
            const count = parseInt(compressed[i]);
            const char = compressed[i + 1];
            if (!isNaN(count) && char) {
                decompressed += char.repeat(count);
            }
        }
        
        return decompressed;
    }

    /**
     * Очистить кэш
     */
    clearCache() {
        this.memoryCache.clear();
    }

    /**
     * Включить/выключить кэш
     * @param {boolean} enabled - Включен ли кэш
     */
    setCacheEnabled(enabled) {
        this.enableCache = enabled;
        if (!enabled) {
            this.clearCache();
        }
    }

    /**
     * Экспорт всех данных
     * @returns {Object}
     */
    exportAll() {
        const data = {};
        try {
            const keys = this.keys();
            keys.forEach(key => {
                data[key] = this.load(key);
            });
        } catch (e) {
            console.error('Storage export error:', e);
        }
        return data;
    }

    /**
     * Импорт данных
     * @param {Object} data - Данные для импорта
     * @param {boolean} clear - Очистить перед импортом
     * @returns {number} - Количество импортированных элементов
     */
    importAll(data, clear = false) {
        if (clear) {
            this.clear();
        }

        let count = 0;
        try {
            Object.entries(data).forEach(([key, value]) => {
                if (this.save(key, value)) {
                    count++;
                }
            });
        } catch (e) {
            console.error('Storage import error:', e);
        }
        return count;
    }
}