// ============================================
// ГЕНЕРАТОР ПЕРСОНАЖЕЙ - Реалистичные персонажи в разных стилях
// ============================================

export class CharacterGenerator {
    constructor() {
        this.characterStyles = {
            fantasy: {
                name: 'Фэнтези',
                icon: 'fas fa-dragon',
                features: ['elf_ears', 'magic_aura', 'ornate_armor']
            },
            sciFi: {
                name: 'Sci-Fi',
                icon: 'fas fa-rocket',
                features: ['cyber_implants', 'hologram', 'tech_armor']
            },
            cartoon: {
                name: 'Мультяшный',
                icon: 'fas fa-face-smile',
                features: ['big_eyes', 'exaggerated_features', 'bright_colors']
            },
            realistic: {
                name: 'Реалистичный',
                icon: 'fas fa-user',
                features: ['detailed_face', 'natural_colors', 'subtle_shadows']
            },
            anime: {
                name: 'Аниме',
                icon: 'fas fa-heart',
                features: ['large_eyes', 'colorful_hair', 'expressive_face']
            }
        };
    }

    generate(params) {
        const { style, color, skinColor, eyes, mouth, hair, accessories, hasWeapon, hasArmor } = params;

        const layers = [];
        const palette = this.generatePalette(color, skinColor);

        // 1. Фон (прозрачный по умолчанию)
        layers.push({
            type: 'background',
            style: 'none',
            color: 'transparent'
        });

        // 2. Тело персонажа
        layers.push(this.createBody(palette, style));

        // 3. Голова
        layers.push(this.createHead(palette, style));

        // 4. Черты лица
        layers.push(...this.createFaceFeatures(palette, eyes, mouth));

        // 5. Волосы
        if (hair && hair !== 'bald') {
            layers.push(this.createHair(palette, hair, style));
        }

        // 6. Одежда
        layers.push(this.createClothing(palette, style, hasArmor));

        // 7. Аксессуары
        if (accessories && accessories.length > 0) {
            layers.push(...this.createAccessories(palette, accessories));
        }

        // 8. Оружие
        if (hasWeapon) {
            layers.push(this.createWeapon(palette, style));
        }

        return {
            layers: layers,
            effects: this.getEffects(style),
            style: style,
            category: 'character',
            config: params
        };
    }

    generatePalette(color, skinColor) {
        return {
            skin: skinColor || '#f5d0b8',
            skinDark: this.darkenColor(skinColor || '#f5d0b8', 20),
            skinLight: this.lightenColor(skinColor || '#f5d0b8', 20),
            body: color || '#7c3aed',
            bodyLight: this.lightenColor(color || '#7c3aed', 30),
            bodyDark: this.darkenColor(color || '#7c3aed', 30),
            accent: '#ffd700',
            hair: '#2d3436',
            hairLight: '#4a4a4a',
            eye: '#ffffff',
            pupil: '#2d3436',
            outline: '#1a1a2e',
            shadow: 'rgba(0,0,0,0.2)'
        };
    }

    createBody(palette, style) {
        return {
            type: 'main',
            shape: 'shield',
            color: palette.body,
            size: 130,
            x: 250,
            y: 280,
            strokeWidth: 2,
            strokeColor: palette.outline,
            opacity: 0.9
        };
    }

    createHead(palette, style) {
        const size = style === 'cartoon' || style === 'anime' ? 100 : 90;
        return {
            type: 'main',
            shape: 'circle',
            color: palette.skin,
            size: size,
            x: 250,
            y: 200,
            strokeWidth: 2,
            strokeColor: palette.outline
        };
    }

    createFaceFeatures(palette, eyesType, mouthType) {
        const layers = [];

        // Глаза
        if (eyesType !== 'none') {
            layers.push({
                type: 'text',
                text: this.getEyesSymbol(eyesType),
                color: palette.eye,
                size: 30,
                x: 250,
                y: 195
            });
            // Зрачки
            layers.push({
                type: 'text',
                text: '•',
                color: palette.pupil,
                size: 10,
                x: 250,
                y: 197
            });
        }

        // Рот
        if (mouthType !== 'none') {
            layers.push({
                type: 'text',
                text: this.getMouthSymbol(mouthType),
                color: palette.skinDark,
                size: 20,
                x: 250,
                y: 215
            });
        }

        // Брови
        layers.push({
            type: 'text',
            text: '‾‾',
            color: palette.hair,
            size: 20,
            x: 250,
            y: 185
        });

        return layers;
    }

    getEyesSymbol(type) {
        const symbols = {
            'simple': '•‿•',
            'anime': '◕‿◕',
            'cartoon': '⊙‿⊙',
            'realistic': '👁️',
            'closed': '⌣‿⌣',
            'happy': '◠‿◠'
        };
        return symbols[type] || '•‿•';
    }

    getMouthSymbol(type) {
        const symbols = {
            'smile': '⌣',
            'open': 'O',
            'neutral': '—',
            'happy': '⌣‿⌣',
            'sad': '⌢',
            'surprised': 'O',
            'none': ''
        };
        return symbols[type] || '⌣';
    }

    createHair(palette, hairType, style) {
        const hairStyles = {
            'short': this.createShortHair.bind(this),
            'long': this.createLongHair.bind(this),
            'ponytail': this.createPonytail.bind(this),
            'spiky': this.createSpikyHair.bind(this),
            'curly': this.createCurlyHair.bind(this)
        };

        const hairFunc = hairStyles[hairType] || hairStyles['short'];
        return hairFunc(palette, style);
    }

    createShortHair(palette, style) {
        return {
            type: 'main',
            shape: 'half_circle',
            color: palette.hair,
            size: 80,
            x: 250,
            y: 180,
            rotation: 0,
            opacity: 0.9
        };
    }

    createLongHair(palette, style) {
        return {
            type: 'main',
            shape: 'rectangle',
            color: palette.hair,
            size: 80,
            x: 250,
            y: 200,
            width: 120,
            height: 100,
            opacity: 0.9
        };
    }

    createPonytail(palette, style) {
        return {
            type: 'main',
            shape: 'triangle',
            color: palette.hair,
            size: 60,
            x: 270,
            y: 180,
            rotation: 0.5,
            opacity: 0.9
        };
    }

    createSpikyHair(palette, style) {
        return {
            type: 'main',
            shape: 'star',
            color: palette.hair,
            size: 70,
            x: 250,
            y: 175,
            points: 7,
            opacity: 0.9
        };
    }

    createCurlyHair(palette, style) {
        return {
            type: 'main',
            shape: 'cloud',
            color: palette.hair,
            size: 70,
            x: 250,
            y: 180,
            opacity: 0.9
        };
    }

    createClothing(palette, style, hasArmor) {
        if (hasArmor) {
            return {
                type: 'main',
                shape: 'shield',
                color: palette.bodyDark,
                size: 110,
                x: 250,
                y: 280,
                strokeWidth: 3,
                strokeColor: palette.accent,
                opacity: 0.9
            };
        }

        return {
            type: 'main',
            shape: 'circle',
            color: palette.body,
            size: 100,
            x: 250,
            y: 280,
            opacity: 0.8
        };
    }

    createAccessories(palette, accessories) {
        const layers = [];
        let xOffset = 220;

        accessories.forEach((acc, index) => {
            const layer = {
                type: 'main',
                shape: 'circle',
                color: palette.accent,
                size: 20,
                x: xOffset + index * 30,
                y: 280,
                opacity: 0.8
            };
            layers.push(layer);
        });

        return layers;
    }

    createWeapon(palette, style) {
        const weaponStyles = {
            'fantasy': { shape: 'shield', color: palette.accent, size: 50, x: 320, y: 250 },
            'sciFi': { shape: 'star', color: '#00ffff', size: 40, x: 320, y: 250 },
            'cartoon': { shape: 'circle', color: '#ff0000', size: 35, x: 320, y: 250 },
            'realistic': { shape: 'triangle', color: '#808080', size: 45, x: 320, y: 250 },
            'anime': { shape: 'star', color: '#ff69b4', size: 40, x: 320, y: 250 }
        };

        const weapon = weaponStyles[style] || weaponStyles['fantasy'];
        return {
            type: 'main',
            shape: weapon.shape,
            color: weapon.color,
            size: weapon.size,
            x: weapon.x,
            y: weapon.y,
            rotation: 0.5,
            opacity: 0.9
        };
    }

    getEffects(style) {
        const effects = [];

        switch (style) {
            case 'fantasy':
                effects.push({
                    type: 'glow',
                    color: '#ffd700',
                    intensity: 0.3,
                    size: 150
                });
                break;
            case 'sciFi':
                effects.push({
                    type: 'glow',
                    color: '#00ffff',
                    intensity: 0.4,
                    size: 120
                });
                effects.push({
                    type: 'scanline',
                    intensity: 0.1
                });
                break;
            case 'anime':
                effects.push({
                    type: 'glow',
                    color: '#ff69b4',
                    intensity: 0.2,
                    size: 100
                });
                break;
        }

        return effects;
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
}