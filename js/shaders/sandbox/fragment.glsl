uniform float time; // Переменная времени

void main() {
                // Анимация цвета на основе времени
    float r = abs(sin(time));
    float g = abs(cos(time));
    float b = 0.5;
    gl_FragColor = vec4(r, g, b, 1.0); // Устанавливаем цвет пикселя
}