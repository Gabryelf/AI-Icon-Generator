// ============================================
// ХРАНИЛИЩЕ - Абстракция над LocalStorage
// ============================================

export class Storage {
    constructor(prefix = 'nif_') {
        this.prefix = prefix;
    }

    save(key, data) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    }

    load(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.filter(k => k.startsWith(this.prefix)).forEach(k => localStorage.removeItem(k));
    }
}