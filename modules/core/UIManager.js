// modules/core/UIManager.js

export class UIManager {
    constructor() {
        this.statsEl = {
            total: document.getElementById('stat-total'),
            styles: document.getElementById('stat-styles'),
            saved: document.getElementById('stat-saved')
        };
        
        this.activeStep = null;
        this.steps = ['step-category', 'step-style', 'step-config'];
        this.notificationTimeout = null;
    }

    /**
     * Обновление статистики
     * @param {Object} stats - Статистика
     */
    updateStats(stats) {
        if (this.statsEl.total) {
            this.statsEl.total.textContent = stats?.total || 0;
        }
        if (this.statsEl.styles) {
            this.statsEl.styles.textContent = stats?.styles || 18;
        }
        if (this.statsEl.saved) {
            this.statsEl.saved.textContent = stats?.saved || 0;
        }
    }

    /**
     * Отображение шага
     * @param {string} stepId - ID шага
     */
    showStep(stepId) {
        document.querySelectorAll('.setup-step').forEach(el => {
            el.style.display = 'none';
        });
        
        const step = document.getElementById(stepId);
        if (step) {
            step.style.display = 'block';
            this.activeStep = stepId;
            
            // Анимация появления
            step.style.animation = 'none';
            requestAnimationFrame(() => {
                step.style.animation = 'fadeIn 0.3s ease';
            });
        }
    }

    /**
     * Получить текущий шаг
     * @returns {string|null}
     */
    getCurrentStep() {
        return this.activeStep;
    }

    /**
     * Рендеринг истории
     * @param {Array} history - История генераций
     */
    renderHistory(history) {
        const container = document.getElementById('history-list');
        if (!container) return;

        if (!history || history.length === 0) {
            container.innerHTML = `<div class="empty-state">Пока нет сохраненных иконок</div>`;
            return;
        }

        container.innerHTML = history.map((item, index) => {
            if (!item || !item.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            const categoryName = item.params?.category || 'unknown';
            const styleName = item.params?.style || 'default';
            return `
                <div class="history-item" data-index="${index}">
                    <canvas width="60" height="60" data-icon="${dataStr}"></canvas>
                    <div class="info">
                        <h4>${categoryName} / ${styleName}</h4>
                        <p>${item.timestamp || 'Нет даты'}</p>
                    </div>
                    <div class="actions">
                        <button class="icon-btn" data-action="download-png" data-icon="${dataStr}" title="Скачать PNG">
                            <i class="fas fa-image"></i>
                        </button>
                        <button class="icon-btn" data-action="download-svg" data-icon="${dataStr}" title="Скачать SVG">
                            <i class="fas fa-code"></i>
                        </button>
                        <button class="icon-btn delete-history-btn" data-index="${index}" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Отрисовка миниатюр
        container.querySelectorAll('.history-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                if (window.app && window.app.drawIcon) {
                    window.app.drawIcon(ctx, 60, 60, data);
                }
            } catch (e) {
                console.warn('Ошибка отрисовки миниатюры:', e);
            }
        });

        // Обработчики для кнопок удаления
        container.querySelectorAll('.delete-history-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (window.app && window.app.removeHistoryItem) {
                    window.app.removeHistoryItem(index);
                }
            });
        });

        // Клик по элементу истории для загрузки в генератор
        container.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Игнорируем клики по кнопкам
                if (e.target.closest('.actions')) return;
                
                try {
                    const canvas = item.querySelector('canvas');
                    if (!canvas) return;
                    const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                    if (window.app && window.app.loadHistoryItem) {
                        window.app.loadHistoryItem(data);
                    }
                } catch (e) {
                    console.error('Ошибка загрузки иконки из истории:', e);
                }
            });
        });
    }

    /**
     * Рендеринг последних иконок
     * @param {Array} items - Последние иконки
     */
    renderRecent(items) {
        const grid = document.getElementById('recent-grid');
        if (!grid) return;
        
        if (!items || items.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Нет недавних иконок</div>`;
            return;
        }

        grid.innerHTML = items.map(item => {
            if (!item || !item.data) return '';
            const dataStr = encodeURIComponent(JSON.stringify(item.data));
            return `
                <div class="recent-item" data-icon="${dataStr}" title="Нажмите для загрузки">
                    <canvas width="80" height="80" data-icon="${dataStr}"></canvas>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.recent-item canvas').forEach(canvas => {
            try {
                const data = JSON.parse(decodeURIComponent(canvas.dataset.icon));
                const ctx = canvas.getContext('2d');
                if (window.app && window.app.drawIcon) {
                    window.app.drawIcon(ctx, 80, 80, data);
                }
            } catch (e) {
                console.warn('Ошибка отрисовки миниатюры:', e);
            }
        });

        // Клик для загрузки иконки в генератор
        grid.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                try {
                    const data = JSON.parse(decodeURIComponent(item.dataset.icon));
                    if (window.app && window.app.loadRecentItem) {
                        window.app.loadRecentItem(data);
                    }
                } catch (e) {
                    console.error('Ошибка загрузки иконки:', e);
                }
            });
        });
    }

    /**
     * Группировка полей конфигурации
     * @param {Object} config - Конфигурация
     * @returns {Array} - Группы полей
     */
    groupConfigFields(config) {
        const groups = [];
        
        // Определяем категории полей
        const colorFields = ['color', 'skinColor', 'hairColor', 'eyeColor', 'outfitColor', 'textColor', 'mouthColor', 'accessoryColor', 'frameColor', 'weaponColor'];
        const sizeFields = ['size', 'textSize'];
        const textFields = ['text'];
        const selectFields = ['bgColor', 'frame', 'expression', 'textPosition', 'pose', 'accessory', 'weapon', 'shape', 'font'];
        const rangeFields = ['cornerRadius', 'borderWidth', 'strokeWidth', 'complexity', 'eyeSpacing', 'eyeSize', 'noseSize', 'mouthSize'];
        const toggleFields = ['glow', 'autoGenerate', 'autoSaveProfile'];

        const groupsMap = {
            colors: { title: 'Цвета', icon: 'palette', fields: [] },
            sizes: { title: 'Размеры', icon: 'arrows-alt', fields: [] },
            text: { title: 'Текст', icon: 'font', fields: [] },
            options: { title: 'Опции', icon: 'cog', fields: [] },
            advanced: { title: 'Дополнительно', icon: 'sliders-h', fields: [] }
        };

        Object.entries(config).forEach(([key, field]) => {
            if (colorFields.includes(key)) {
                groupsMap.colors.fields.push({key, ...field});
            } else if (sizeFields.includes(key)) {
                groupsMap.sizes.fields.push({key, ...field});
            } else if (textFields.includes(key)) {
                groupsMap.text.fields.push({key, ...field});
            } else if (selectFields.includes(key) || toggleFields.includes(key)) {
                groupsMap.options.fields.push({key, ...field});
            } else if (rangeFields.includes(key)) {
                groupsMap.advanced.fields.push({key, ...field});
            } else {
                // Если поле не определено, добавляем в опции
                groupsMap.options.fields.push({key, ...field});
            }
        });

        // Добавляем только непустые группы
        Object.values(groupsMap).forEach(group => {
            if (group.fields.length > 0) {
                groups.push(group);
            }
        });

        return groups;
    }

    /**
     * Создание строки конфигурации
     * @param {Object} field - Поле
     * @param {Object} defaults - Значения по умолчанию
     * @param {Function} onChange - Обработчик изменения
     * @returns {HTMLElement}
     */
    createConfigRow(field, defaults, onChange) {
        const row = document.createElement('div');
        row.className = 'config-row';

        const label = document.createElement('label');
        label.textContent = field.label;
        row.appendChild(label);

        const value = field.default || defaults[field.key] || '';

        let input;
        switch (field.type) {
            case 'select':
                input = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (opt.value === value) option.selected = true;
                    input.appendChild(option);
                });
                input.addEventListener('change', () => {
                    if (onChange) {
                        onChange(field.key, input.value);
                    }
                });
                break;
            case 'color':
                input = document.createElement('input');
                input.type = 'color';
                input.value = value;
                input.addEventListener('input', () => {
                    if (onChange) {
                        onChange(field.key, input.value);
                    }
                });
                break;
            case 'range':
                input = document.createElement('input');
                input.type = 'range';
                input.min = field.min || 0;
                input.max = field.max || 100;
                input.step = field.step || 1;
                input.value = value;
                
                const display = document.createElement('span');
                display.className = 'config-value';
                display.textContent = value;
                row.appendChild(display);
                
                input.addEventListener('input', () => {
                    display.textContent = input.value;
                    if (onChange) {
                        onChange(field.key, parseFloat(input.value));
                    }
                });
                break;
            case 'checkbox':
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = value === true || value === 'true';
                input.addEventListener('change', () => {
                    if (onChange) {
                        onChange(field.key, input.checked);
                    }
                });
                break;
            case 'text':
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                input.addEventListener('input', () => {
                    if (onChange) {
                        onChange(field.key, input.value);
                    }
                });
                break;
        }

        input.id = `config-${field.key}`;
        input.className = 'config-input';
        row.appendChild(input);
        
        return row;
    }

    /**
     * Создание строки конфигурации с кнопкой заморозки
     */
    createConfigRowWithLock(field, defaults, onChange) {
        const row = this.createConfigRow(field, defaults, (key, value) => {
            if (onChange) {
                onChange(key, value);
            }
        });

        row.classList.add('with-lock');

        // Кнопка заморозки
        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.innerHTML = '🔓';
        lockBtn.dataset.locked = 'false';
        lockBtn.title = 'Зафиксировать значение при рандомизации';
        
        lockBtn.addEventListener('click', () => {
            const isLocked = lockBtn.dataset.locked === 'true';
            lockBtn.dataset.locked = isLocked ? 'false' : 'true';
            lockBtn.innerHTML = isLocked ? '🔓' : '🔒';
            
            // Сохраняем состояние заморозки
            const configKey = `lock_${field.key}`;
            if (typeof onChange === 'function') {
                onChange(configKey, !isLocked);
            }
        });
        
        row.appendChild(lockBtn);
        return row;
    }

    /**
     * Установка значений по умолчанию
     * @param {Object} defaults - Значения по умолчанию
     * @param {Object} config - Текущая конфигурация
     */
    setConfigDefaults(defaults, config) {
        if (!defaults) return;
        Object.entries(defaults).forEach(([key, value]) => {
            if (!(key in config)) {
                config[key] = value;
            }
            const input = document.getElementById(`config-${key}`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value === true || value === 'true';
                } else if (input.type === 'range') {
                    input.value = value;
                    const display = input.parentElement.querySelector('.config-value');
                    if (display) display.textContent = value;
                } else {
                    input.value = value;
                }
            }
        });
    }

    /**
     * Получить текущие значения конфигурации
     * @param {Object} configSchema - Схема конфигурации
     * @returns {Object}
     */
    getConfigValues(configSchema) {
        const values = {};
        Object.keys(configSchema).forEach(key => {
            const input = document.getElementById(`config-${key}`);
            if (input) {
                if (input.type === 'checkbox') {
                    values[key] = input.checked;
                } else if (input.type === 'range') {
                    values[key] = parseFloat(input.value);
                } else {
                    values[key] = input.value;
                }
            }
        });
        return values;
    }

    /**
     * Показать уведомление
     * @param {string} message - Сообщение
     * @param {string} type - Тип (success, error, warning, info)
     * @param {number} duration - Длительность в мс
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Удаляем предыдущее уведомление
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Иконки для разных типов
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        // Стилизация
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${colors[type] || colors.info};
            color: #fff;
            border-radius: 12px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            animation: slideIn 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        document.body.appendChild(notification);

        // Автоматическое скрытие
        if (duration > 0) {
            this.notificationTimeout = setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }

        // Возвращаем функцию для ручного скрытия
        return () => {
            this.hideNotification(notification);
        };
    }

    /**
     * Скрыть уведомление
     */
    hideNotification(notification) {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;
        }
        
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    /**
     * Показать загрузку
     * @param {string} message - Сообщение
     * @returns {Function} - Функция для скрытия
     */
    showLoading(message = 'Загрузка...') {
        // Удаляем старый оверлей
        const oldOverlay = document.querySelector('.loading-overlay');
        if (oldOverlay) {
            oldOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        `;
        
        const spinner = overlay.querySelector('.loading-spinner');
        spinner.style.cssText = `
            width: 48px;
            height: 48px;
            border: 4px solid rgba(255,255,255,0.1);
            border-top-color: var(--accent, #7c3aed);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        const text = overlay.querySelector('p');
        text.style.cssText = `
            color: #fff;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 500;
        `;

        document.body.appendChild(overlay);

        return () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        };
    }

    /**
     * Добавление стилей анимаций
     */
    static injectAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%) translateY(-20px); opacity: 0; }
                to { transform: translateX(0) translateY(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0) translateY(0); opacity: 1; }
                to { transform: translateX(100%) translateY(-20px); opacity: 0; }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .notification {
                animation: slideIn 0.3s ease;
            }
            
            .loading-overlay {
                animation: fadeIn 0.3s ease;
            }
            
            /* Стили для кнопки заморозки */
            .config-row.with-lock {
                position: relative;
            }
            
            .lock-btn {
                background: transparent;
                border: 1px solid var(--border-color, #2a2a4a);
                border-radius: 6px;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
                color: var(--text-secondary, #a0a0c0);
                min-width: 32px;
                text-align: center;
            }
            
            .lock-btn:hover {
                border-color: var(--accent, #7c3aed);
                background: rgba(124, 58, 237, 0.1);
            }
            
            .lock-btn[data-locked="true"] {
                border-color: var(--accent, #7c3aed);
                background: rgba(124, 58, 237, 0.15);
                color: var(--accent, #7c3aed);
            }
            
            /* Улучшенные стили для конфигурации */
            .config-input {
                flex: 1;
                padding: 6px 10px;
                background: var(--bg-primary, #0f0f1a);
                border: 1px solid var(--border-color, #2a2a4a);
                border-radius: 6px;
                color: var(--text-primary, #f0f0ff);
                font-size: 13px;
                transition: border-color 0.2s ease;
            }
            
            .config-input:focus {
                outline: none;
                border-color: var(--accent, #7c3aed);
                box-shadow: 0 0 0 2px var(--accent-glow, rgba(124, 58, 237, 0.2));
            }
            
            .config-input[type="color"] {
                padding: 2px;
                width: 40px;
                flex: none;
                cursor: pointer;
            }
            
            .config-input[type="range"] {
                padding: 0;
                flex: 2;
                cursor: pointer;
                background: transparent;
            }
            
            .config-input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--accent, #7c3aed);
                cursor: pointer;
                box-shadow: 0 0 10px var(--accent-glow, rgba(124, 58, 237, 0.3));
            }
            
            .config-input[type="checkbox"] {
                width: auto;
                flex: none;
                width: 20px;
                height: 20px;
                accent-color: var(--accent, #7c3aed);
                cursor: pointer;
            }
            
            .config-value {
                min-width: 36px;
                text-align: center;
                font-size: 13px;
                color: var(--text-secondary, #a0a0c0);
                font-weight: 600;
            }
            
            /* Кнопки в истории */
            .delete-history-btn {
                color: var(--danger, #ef4444) !important;
            }
            
            .delete-history-btn:hover {
                background: rgba(239, 68, 68, 0.15) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Внедрение анимаций при загрузке
UIManager.injectAnimations();