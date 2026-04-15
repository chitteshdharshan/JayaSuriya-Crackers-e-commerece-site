import React, { useEffect, useState } from 'react';

const FireworkBurst = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const numParticles = 40;
    const newParticles = Array.from({ length: numParticles }).map((_, i) => {
      const angle = (Math.PI * 2 / numParticles) * i;
      const speed = Math.random() * 4 + 2;
      return {
        id: i,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        x: 0,
        y: 0
      };
    });

    setParticles(newParticles);

    const timer = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // Gravity
          opacity: p.opacity - 0.02
        })).filter(p => p.opacity > 0);
        
        if (updated.length === 0) {
          clearInterval(timer);
          onComplete && onComplete();
        }
        return updated;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: '4px',
            height: '4px',
            backgroundColor: p.color,
            borderRadius: '50%',
            opacity: p.opacity,
            boxShadow: `0 0 5px ${p.color}`
          }}
        />
      ))}
    </div>
  );
};

export default FireworkBurst;
