document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let saturation = 40;
    let lightness = 60;
    const numColors = 6;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let size = Math.min(width, height) / 10;

    const colors = [];
    let hue = 0;
    const hueIncrement = 20;

    function updateColors(time) {
        hue = Math.sin(time / 3000) * 180 + 180;
        hue = hue % 360;

        saturation = Math.sin(time / 2000) * 20 + 40;
        saturation = Math.max(saturation, 40);
        saturation = Math.min(saturation, 100);

        lightness = Math.sin(time / 1000) * 20 + 60;
        lightness = Math.max(lightness, 40);
        lightness = Math.min(lightness, 80);

        for (let i = 0; i < numColors; i++) {
            const color = `hsl(${hue + i * hueIncrement}, ${saturation}%, ${lightness}%)`;
            colors[i] = color;
        }
    }

    let interval = 100;
    function adjustInterval(event) {
        event.preventDefault();

        if (event.deltaY < 0 || event.touches && event.touches[0].clientY < startY) {
            interval -= 10;
        } else {
            interval += 10;
        }

        interval = Math.max(interval, 10);
        interval = Math.min(interval, 1000);
    }

    document.addEventListener('wheel', adjustInterval);

    let startY;
    document.addEventListener('touchstart', (event) => {
        startY = event.touches[0].clientY;
    });

    document.addEventListener('touchmove', (event) => {
        adjustInterval(event.touches[0]);
    });

    window.addEventListener('resize', () => {
        requestAnimationFrame(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            size = Math.min(width, height) / 10;
        });
    });

    function draw(time) {
        updateColors(time)

        for (let x = 0; x < width; x += size) {
            for (let y = 0; y < height; y += size) {
                const color = colors[Math.floor(Math.random() * numColors)];
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
            }
        }

        setTimeout(() => {
            requestAnimationFrame(draw);
        }, interval);
    }

    draw();
});