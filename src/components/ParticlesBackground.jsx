import { useEffect, useRef } from "react";
import "./ParticlesBackground.css";

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Установка размеров canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Цвета частиц из вашей темы
        const particleColors = ["#00f5a0", "#00d9f5", "#00a8f5", "#00ff95"];

        // Создание частиц
        const particles = [];
        const particleCount = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color =
                    particleColors[
                        Math.floor(Math.random() * particleColors.length)
                    ];
                this.opacity = Math.random() * 0.5 + 0.2;
                this.wobble = Math.random() * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                this.wobbleOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.x +=
                    this.speedX + Math.sin(this.wobbleOffset) * this.wobble;
                this.y +=
                    this.speedY + Math.cos(this.wobbleOffset) * this.wobble;
                this.wobbleOffset += this.wobbleSpeed;

                // Возврат частиц с противоположной стороны
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Добавляем свечение
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        // Создание связей между частицами
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 217, 245, ${
                            0.2 * (1 - distance / 150)
                        })`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Инициализация частиц
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Анимация
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Рисуем связи
            drawConnections();

            // Обновляем и рисуем частицы
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Очистка
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <div className="particles-background"></div>
            <canvas ref={canvasRef} className="particles-canvas" />
        </>
    );
};

export default ParticlesBackground;
