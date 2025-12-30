import { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  id: number;
}

const MouseTrail = () => {
  const [trail, setTrail] = useState<Point[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Agregar nuevo punto
      const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
      
      setTrail((prev) => {
        // Mantener solo los últimos 20 puntos para rendimiento
        const newTrail = [...prev, newPoint];
        if (newTrail.length > 20) {
          return newTrail.slice(newTrail.length - 20);
        }
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Limpiar puntos viejos periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(1);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute flex items-center justify-center text-fucsia animate-sparkle"
          style={{
            left: point.x,
            top: point.y,
            width: '10px',
            height: '10px',
            opacity: (index / trail.length) * 0.8,
            transform: `translate(-50%, -50%) scale(${0.5 + (index / trail.length)})`,
            pointerEvents: 'none',
          }}
        >
          <span className="text-lg">★</span>
        </div>
      ))}
    </div>
  );
};

export default MouseTrail;
