'use client'

import { useEffect, useRef, useMemo } from 'react'

interface SessionGraphProps {
  results: {
    AGAIN: number;
    HARD: number;
    GOOD: number;
    EASY: number;
  };
}

interface Point {
  x: number;
  y: number;
  type: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
}

export function SessionGraph({ results }: SessionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = 120;

  // Calculate points w/ useMemo
  const points = useMemo(() => {
    const yPositions = {
      AGAIN: height - 6,
      HARD: Math.floor(height * 0.75),
      GOOD: Math.floor(height * 0.25),
      EASY: 6
    };

    const totalDots = Object.values(results).reduce((a, b) => a + b, 0);
    if (totalDots === 0) return [];

    const points: Point[] = [];
    const margin = 2;
    const usableWidth = 100 - (2 * margin);
    const step = usableWidth / (totalDots - 1 || 1);
    let currentX = margin;

    Object.entries(results).forEach(([result, count]) => {
      for (let i = 0; i < count; i++) {
        points.push({
          x: currentX,
          y: yPositions[result as keyof typeof yPositions],
          type: result as 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
        });
        currentX += step;
      }
    });

    return points;
  }, [results, height]);

  const colors = {
    AGAIN: '#EF4444',
    HARD: '#F97316',
    GOOD: '#22C55E',
    EASY: '#3B82F6'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.offsetWidth;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;

    points.forEach((point, index) => {
      const x = (point.x / 100) * canvas.width;
      if (index === 0) {
        ctx.moveTo(x, point.y);
      } else {
        ctx.lineTo(x, point.y);
      }
    });

    ctx.stroke();
  }, [points, height]);

  if (points.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height }}
      />
      
      <svg 
        width="100%" 
        height={height}
        className="absolute inset-0 w-full"
      >
        {points.map((point, index) => (
          <g key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <circle
              cx={`${point.x}%`}
              cy={point.y}
              r="8"
              fill={colors[point.type]}
              fillOpacity="0.1"
            />
            <circle
              cx={`${point.x}%`}
              cy={point.y}
              r="4"
              fill={colors[point.type]}
              fillOpacity="0.2"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}