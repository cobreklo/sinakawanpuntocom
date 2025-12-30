import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AudioVisualizer from './AudioVisualizer';
import TrackList from './TrackList';
import albumCover from '@/assets/album-cover.png';
import introTrack from '@/assets/music/intro.mp3';
import sendaBellakonaTrack from '@/assets/music/senda-bellakona.mp3';

// Tracks del álbum "EL NUEVO SONIDO" - S1NAKA
// Las URLs de audio se configurarán aquí
const tracks = [
  { id: 1, title: "Intro El Nuevo Sonido", artist: "S1NAKA", duration: "0:00", audioUrl: introTrack },
  { id: 2, title: "Senda Bellakona", artist: "S1NAKA", duration: "0:00", audioUrl: sendaBellakonaTrack },
  { id: 3, title: "Track 3", artist: "S1NAKA", duration: "0:00", audioUrl: "/music/track3.mp3" },
  { id: 4, title: "Track 4", artist: "S1NAKA", duration: "0:00", audioUrl: "/music/track4.mp3" },
  { id: 5, title: "Track 5", artist: "S1NAKA", duration: "0:00", audioUrl: "/music/track5.mp3" },
  { id: 6, title: "Track 6", artist: "S1NAKA", duration: "0:00", audioUrl: "/music/track6.mp3" },
];

const CROSSFADE_DURATION = 2000; // 2 segundos de crossfade

const MusicPlayer = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrackData = tracks.find(t => t.id === currentTrack) || tracks[0];

  // Formatear tiempo mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Inicializar audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
    }
    if (!nextAudioRef.current) {
      nextAudioRef.current = new Audio();
      nextAudioRef.current.volume = 0;
    }
  }, []);

  // Cambiar track
  useEffect(() => {
    if (audioRef.current && currentTrackData.audioUrl) {
      audioRef.current.src = currentTrackData.audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Actualizar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Actualizar tiempo actual
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      toast({
        title: "Error de reproducción",
        description: "No se pudo reproducir el archivo de audio.",
        variant: "destructive",
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isSeeking, currentTrack, toast]);

  // Crossfade function
  const performCrossfade = useCallback((nextTrackId: number) => {
    if (!audioRef.current || !nextAudioRef.current) return;
    
    const nextTrackData = tracks.find(t => t.id === nextTrackId);
    if (!nextTrackData?.audioUrl) {
      setCurrentTrack(nextTrackId);
      setCurrentTime(0);
      return;
    }

    nextAudioRef.current.src = nextTrackData.audioUrl;
    nextAudioRef.current.volume = 0;
    nextAudioRef.current.play().catch(console.error);

    const startVolume = isMuted ? 0 : volume / 100;
    const steps = 20;
    const stepDuration = CROSSFADE_DURATION / steps;
    let step = 0;

    if (crossfadeIntervalRef.current) {
      clearInterval(crossfadeIntervalRef.current);
    }

    crossfadeIntervalRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      
      if (audioRef.current) {
        audioRef.current.volume = startVolume * (1 - progress);
      }
      if (nextAudioRef.current) {
        nextAudioRef.current.volume = startVolume * progress;
      }

      if (step >= steps) {
        if (crossfadeIntervalRef.current) {
          clearInterval(crossfadeIntervalRef.current);
        }
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        // Swap refs
        const temp = audioRef.current;
        audioRef.current = nextAudioRef.current;
        nextAudioRef.current = temp;
        
        setCurrentTrack(nextTrackId);
        setCurrentTime(0);
      }
    }, stepDuration);
  }, [volume, isMuted]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrackData.audioUrl) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Play error:", error);
          toast({
             title: "Error",
             description: "No se pudo iniciar la reproducción.",
             variant: "destructive"
          });
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePrevious = () => {
    const prevId = currentTrack > 1 ? currentTrack - 1 : tracks.length;
    if (isPlaying && tracks.find(t => t.id === prevId)?.audioUrl) {
      performCrossfade(prevId);
    } else {
      setCurrentTrack(prevId);
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    const nextId = currentTrack < tracks.length ? currentTrack + 1 : 1;
    if (isPlaying && tracks.find(t => t.id === nextId)?.audioUrl) {
      performCrossfade(nextId);
    } else {
      setCurrentTrack(nextId);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(100, percent * 100));
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header MSN/Pokemón chileno style */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary animate-sparkle" />
          <span className="text-xs text-silver msn-text uppercase tracking-widest">~ xX_S1NAKA_Xx ~</span>
          <Sparkles className="w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-black neon-glow tracking-tight uppercase">
          EL NUEVO SONIDO
        </h1>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="w-3 h-3 text-primary star-glow" />
          <p className="text-primary/80 text-xs msn-text">★ pOkEmOnA mUsIc 2007 ★</p>
          <Star className="w-3 h-3 text-primary star-glow" />
        </div>
      </div>

      {/* Main player container */}
      <div className="w-full max-w-sm">
        {/* Album art / Vinyl disc */}
        <div className="relative glass-card rounded-2xl p-4 mb-3 border-2 border-primary/40">
          {/* Windows XP style title bar */}
          <div className="absolute -top-0.5 left-0 right-0 h-6 bg-gradient-to-r from-[#0a246a] via-[#a6caf0] to-[#0a246a] rounded-t-2xl flex items-center px-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 border border-red-700" />
              <div className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600" />
              <div className="w-2 h-2 rounded-full bg-green-500 border border-green-700" />
            </div>
            <span className="text-[10px] text-foreground font-bold ml-2 msn-text">S1NAKA - Media Player</span>
          </div>
          
          {/* Decorative stars */}
          <Star className="absolute top-8 right-3 w-3 h-3 text-primary star-glow animate-sparkle" />
          <Star className="absolute top-10 right-6 w-2 h-2 text-accent star-glow animate-sparkle" style={{ animationDelay: '0.3s' }} />
          
          {/* Spinning vinyl with album cover */}
          <div className="relative mx-auto w-44 h-44 mt-6 mb-4">
            {/* Vinyl disc */}
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-4 border-[#333] shadow-[0_0_40px_rgba(255,0,128,0.4),inset_0_0_20px_rgba(0,0,0,0.8)] ${isPlaying ? 'animate-spin-slow' : ''}`}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-3 rounded-full border border-[#222]" />
              <div className="absolute inset-6 rounded-full border border-[#1a1a1a]" />
              <div className="absolute inset-9 rounded-full border border-[#222]" />
              <div className="absolute inset-12 rounded-full border border-[#1a1a1a]" />
              
              {/* Album cover in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(255,0,128,0.5)]">
                  <img 
                    src={albumCover} 
                    alt="EL NUEVO SONIDO - S1NAKA" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Shine effect */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
                }}
              />
            </div>
          </div>

          {/* Track info */}
          <div className="text-center mb-3 px-2 py-1 bg-background/50 border border-primary/30 rounded">
            <h2 className="text-lg font-bold neon-glow truncate">{currentTrackData.title}</h2>
            <p className="text-muted-foreground text-xs">{currentTrackData.artist}</p>
          </div>

          {/* Audio visualizer */}
          <AudioVisualizer isPlaying={isPlaying} />

          {/* Progress bar - clickable to seek */}
          <div className="mt-3">
            <div 
              className="relative h-3 bg-muted rounded-sm overflow-hidden cursor-pointer border border-primary/30"
              onClick={handleSeek}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={() => setIsSeeking(false)}
            >
              <div 
                className="absolute inset-y-0 left-0 progress-gradient"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm bg-foreground border border-primary shadow-[0_0_8px_rgba(255,0,128,0.6)]"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons - Winamp style */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button 
              onClick={handlePrevious}
              className="w-10 h-8 rounded-sm winamp-button flex items-center justify-center"
            >
              <SkipBack className="w-4 h-4" fill="currentColor" />
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="w-14 h-10 rounded-sm glow-button flex items-center justify-center animate-pulse-glow"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>
            
            <button 
              onClick={handleNext}
              className="w-10 h-8 rounded-sm winamp-button flex items-center justify-center"
            >
              <SkipForward className="w-4 h-4" fill="currentColor" />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center justify-center gap-2 mt-4 px-4">
            <button onClick={toggleMute} className="p-1 hover:text-primary transition-colors">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <div 
              className="relative flex-1 h-2 bg-muted rounded-sm overflow-hidden cursor-pointer border border-primary/20"
              onClick={handleVolumeChange}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">
              {isMuted ? 0 : Math.round(volume)}%
            </span>
          </div>
        </div>

        {/* Track list */}
        <TrackList 
          tracks={tracks} 
          currentTrack={currentTrack} 
          onTrackSelect={(id) => {
            if (isPlaying && tracks.find(t => t.id === id)?.audioUrl) {
              performCrossfade(id);
            } else {
              setCurrentTrack(id);
              setCurrentTime(0);
              setIsPlaying(true);
            }
          }}
          albumCover={albumCover}
        />
      </div>

      {/* Footer MSN style */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-silver msn-text">
          ★·.·´¯`·.·★ pOkEmOnA cHiLeNa 4EvEr ★·.·´¯`·.·★
        </p>
        <p className="text-[10px] text-primary/60 mt-1 font-mono">
          © 2007 S1NAKA - EL NUEVO SONIDO
        </p>
        <p className="text-[8px] text-muted-foreground mt-1">
          [MSN: s1naka_flaite@hotmail.com]
        </p>
      </div>
    </div>
  );
};

export default MusicPlayer;
