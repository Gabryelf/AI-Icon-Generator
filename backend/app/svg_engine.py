import random


class SVGEngine:
    @staticmethod
    def generate_icon(style: str, shape: str, color: str, size: int = 128) -> str:
        # Основа SVG
        svg = f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">'

        # Фон (форма)
        bg_color = "#f8fafc" if style == "minimal" else color
        if shape == "circle":
            svg += f'<circle cx="{size / 2}" cy="{size / 2}" r="{size / 2 - 10}" fill="{bg_color}" stroke="{color}" stroke-width="4"/>'
        elif shape == "square":
            svg += f'<rect x="10" y="10" width="{size - 20}" height="{size - 20}" rx="15" fill="{bg_color}" stroke="{color}" stroke-width="4"/>'
        else:  # hexagon (шестиугольник)
            points = " ".join([
                                  f"{size / 2 + (size / 2 - 10) * (0.866 if i % 2 else 0.5)},{size / 2 + (size / 2 - 10) * (0.5 if i % 2 else 0.866)}"
                                  for i in range(6)])
            svg += f'<polygon points="{points}" fill="{bg_color}" stroke="{color}" stroke-width="4"/>'

        # Внутренний паттерн (стилистика)
        if style == "colorful":
            # Добавим несколько цветных кругов
            for _ in range(3):
                cx = random.randint(20, size - 20)
                cy = random.randint(20, size - 20)
                r = random.randint(5, 15)
                svg += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}" opacity="0.6"/>'
        elif style == "outline":
            # Добавим геометрические линии
            for i in range(4):
                x = 15 + i * 25
                y = 15 + i * 25
                svg += f'<line x1="{x}" y1="{y}" x2="{size - x}" y2="{size - y}" stroke="{color}" stroke-width="3" opacity="0.5"/>'
        else:  # minimal
            # Просто центральная иконка-звезда или крест
            svg += f'<polygon points="{size / 2},15 {size / 2 + 10},{size / 2 - 10} {size - 15},{size / 2} {size / 2 + 10},{size / 2 + 10} {size / 2},{size - 15} {size / 2 - 10},{size / 2 + 10} 15,{size / 2} {size / 2 - 10},{size / 2 - 10}" fill="{color}" opacity="0.8"/>'

        svg += '</svg>'
        return svg