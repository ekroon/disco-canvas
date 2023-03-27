document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('my-canvas');
    const ctx = canvas.getContext('2d');

    const debugOverlay = document.getElementById('debug-overlay');
    const debugOverlayEnabled = debugOverlay !== null;

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

    function renderDebugOverlay() {
        if (debugOverlayEnabled) {
            debugOverlay.textContent = `Interval: ${interval}ms`;
        }
    }

    let interval = 100;
    renderDebugOverlay();
    function adjustInterval(deltaY) {
        deltaY = Math.floor(deltaY / 50);

        interval -= deltaY;
        interval = Math.max(interval, 10);
        interval = Math.min(interval, 1000);

        renderDebugOverlay();
    }

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

    const mc = new Hammer(canvas);
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    mc.on('pan', (event) => {
        adjustInterval(event.deltaY);
    });

    canvas.addEventListener('wheel', (event) => {
        adjustInterval(event.deltaY * 20);
        event.preventDefault();
    });
});