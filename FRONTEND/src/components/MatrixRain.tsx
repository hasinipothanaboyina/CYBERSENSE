import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const newColumns = Math.floor(width / fontSize);
      if (newColumns > columns) {
        drops.push(...Array(newColumns - columns).fill(0));
      }
      columns = newColumns;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    let animationFrameId: number;

    const renderLoop = (time: number) => {
      const deltaTime = time - lastTime;
      if (deltaTime > interval) {
        draw();
        lastTime = time - (deltaTime % interval);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 opacity-80 pointer-events-none" style={{
      maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)'
    }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none"></div>
    </div>
  );
};

export default MatrixRain;
