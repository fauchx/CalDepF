import React, { useState, useEffect } from 'react';

interface CircleProps {
  x: number;
  y: number;
  id: number;
  color: string;
}

const Circle: React.FC<CircleProps> = ({ x, y, id, color }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}
  >
    {id}
  </div>
);
/*
interface setDistancias {
  [key: string]: number;
}*/

interface CanvaProps {
  numeroEquipos: number;
  setDistancias: (distancias: Map<string, number>) => void;
}

const Canva: React.FC<CanvaProps> = ({ numeroEquipos, setDistancias }) => {
  const [circles, setCircles] = useState<CircleProps[]>([]);

  useEffect(() => {
    if (circles.length <= 1) return;

    var distances: any = {};

    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const key = `${circles[i].id}-${circles[j].id}`;
        const dx = circles[i].x - circles[j].x;
        const dy = circles[i].y - circles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        distances[key] = Math.round(distance);
      }
    }

    setDistancias(distances);
  }, [circles, setDistancias]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (circles.length >= numeroEquipos) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newCircle: CircleProps = {
      x,
      y,
      id: circles.length + 1,
      color: randomColor(),
    };

    setCircles([...circles, newCircle]);
  };

  const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className='canva'
      onClick={handleClick}
    >
      {circles.map((circle) => (
        <Circle key={circle.id} {...circle} />
      ))}
    </div>
  );
};

export default Canva;