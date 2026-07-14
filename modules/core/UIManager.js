// =============================================================
// UI MANAGER - Управление интерфейсом
// =============================================================

export class UIManager {
    constructor() {
        this.statsEl = {
            total: document.getElementById('stat-total'),
            styles: document.getElementById('stat-styles'),
            saved: document.getElementById('stat-saved')
        };
        
        this.activeStep = null;
        this.steps = ['step-category', 'step-style', 'step-config'];
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
                <div class="history-item">
                    <canvas width="60" height="60" data-icon="${dataStr}"></canvas>
                    <div class="info">
                        <h4>${categoryName} / ${styleName}</h4>
                        <p>${item.timestamp || 'Нет даты'}</p>
                    </div>
                    <div class="actions">
                        <button class="icon-btn" data-action="download-png" data-icon="${dataStr}">
                            <i class="fas fa-image"></i>
                        </button>
                        <button class="icon-btn" data-action="download-svg" data-icon="${dataStr}">
                            <i class="fas fa-code"></i>
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
                <div class="recent-item" data-icon="${dataStr}">
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
                    const canvas = document.getElementById('generation-canvas');
                    const ctx = canvas.getContext('2d');
                    if (window.app && window.app.drawIcon) {
                        window.app.drawIcon(ctx, canvas.width, canvas.height, data);
                        window.app.state.currentIconData = data;
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
        const basicFields = ['shape', 'size', 'color', 'bgColor', 'skinColor', 'hairColor', 'eyeColor', 'outfitColor'];
        const styleFields = ['glow', 'borderWidth', 'cornerRadius', 'strokeWidth'];
        const detailFields = ['complexity', 'hairStyle', 'eyeStyle', 'expression', 'bodyType', 'accessory', 'weapon', 'pose'];
        const textFields = ['text'];
        
        const basic = { title: 'Основные параметры', icon: 'pencil', fields: [] };
        const style = { title: 'Стиль и эффекты', icon: 'paintbrush', fields: [] };
        const details = { title: 'Детализация', icon: 'layer-group', fields: [] };
        const text = { title: 'Текст', icon: 'font', fields: [] };

        Object.entries(config).forEach(([key, field]) => {
            if (basicFields.includes(key)) {
                basic.fields.push({key, ...field});
            } else if (styleFields.includes(key)) {
                style.fields.push({key, ...field});
            } else if (detailFields.includes(key)) {
                details.fields.push({key, ...field});
            } else if (textFields.includes(key)) {
                text.fields.push({key, ...field});
            } else {
                basic.fields.push({key, ...field});
            }
        });

        if (basic.fields.length) groups.push(basic);
        if (style.fields.length) groups.push(style);
        if (details.fields.length) groups.push(details);
        if (text.fields.length) groups.push(text);

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
                break;
            case 'color':
                input = document.createElement('input');
                input.type = 'color';
                input.value = value;
                break;
            case 'range':
                input = document.createElement('input');
                input.type = 'range';
                input.min = field.min || 0;
                input.max = field.max || 100;
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
                break;
            case 'text':
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                break;
        }

        input.id = `config-${field.key}`;
        input.addEventListener('change', () => {
            const val = input.type === 'checkbox' ? input.checked : input.value;
            if (onChange) {
                onChange(field.key, val);
            }
        });

        row.appendChild(input);
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
     * Показать уведомление
     * @param {string} message - Сообщение
     * @param {string} type - Тип (success, error, warning, info)
     * @param {number} duration - Длительность в мс
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стилизация
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${colors[type] || colors.info};
            color: #fff;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Удаление через указанное время
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    /**
     * Показать загрузку
     * @param {string} message - Сообщение
     * @returns {Function} - Функция для скрытия
     */
    showLoading(message = 'Загрузка...') {
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
            background: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        `;
        
        const spinner = overlay.querySelector('.loading-spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        const text = overlay.querySelector('p');
        text.style.cssText = `
            color: #fff;
            margin-top: 16px;
            font-size: 16px;
        `;

        document.body.appendChild(overlay);

        return () => {
            overlay.remove();
        };
    }

    /**
     * Добавление стилей анимаций
     */
    static injectAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Внедрение анимаций при загрузке
UIManager.injectAnimations();