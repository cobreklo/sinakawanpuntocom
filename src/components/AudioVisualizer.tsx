import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer = ({ isPlaying }: AudioVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(Array(16).fill(20));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(16).fill(20));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 80 + 20));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-1 h-16 px-4">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-2 rounded-t-sm visualizer-bar transition-all duration-100"
          style={{
            height: `${height}%`,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
