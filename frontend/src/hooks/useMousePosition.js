import { useState, useEffect } from 'react';

export function useMousePosition(divisor = 35) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: (e.clientX - window.innerWidth / 2) / divisor,
        y: (e.clientY - window.innerHeight / 2) / divisor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [divisor]);

  return position;
}
