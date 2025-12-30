import HalftoneBackground from '@/components/HalftoneBackground';
import MusicPlayer from '@/components/MusicPlayer';
import MouseTrail from '@/components/MouseTrail';
import Shoutbox from '@/components/Shoutbox';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HalftoneBackground />
      <MouseTrail />
      <MusicPlayer />
      <Shoutbox />
    </div>
  );
};

export default Index;
