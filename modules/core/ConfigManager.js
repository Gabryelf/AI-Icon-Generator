// ===============================================================
// МЕНЕДЖЕР КОНФИГУРАЦИЙ
// ===============================================================

import { ICON_CONFIG } from '../configs/icon_config.js';

export class ConfigManager {
    constructor() {
        this.configs = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        // Загружаем конфигурации
        this.configs.set('icon', ICON_CONFIG);
        
        this.isInitialized = true;
        console.log('✅ ConfigManager инициализирован');
    }

    getConfig(type = 'icon') {
        return this.configs.get(type) || ICON_CONFIG;
    }

    getDefaults(type = 'icon') {
        const config = this.getConfig(type);
        return config.defaults || {};
    }

    getConfigFields(type = 'icon') {
        const config = this.getConfig(type);
        return config.config || {};
    }

    getField(type, field) {
        const config = this.getConfig(type);
        return config.config?.[field] || null;
    }

    getDefault(type, field) {
        const config = this.getConfig(type);
        return config.defaults?.[field] || null;
    }
}