import { Music, Star, Disc3 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrack: number;
  onTrackSelect: (id: number) => void;
  albumCover: string;
}

const TrackList = ({ tracks, currentTrack, onTrackSelect, albumCover }: TrackListProps) => {
  return (
    <div className="glass-card rounded-lg p-3 max-h-64 overflow-y-auto border-2 border-primary/30">
      {/* MSN style header */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border bg-gradient-to-r from-[#0a246a]/50 to-transparent -mx-3 -mt-3 px-3 pt-2 rounded-t-lg">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
        <Disc3 className="w-3 h-3 text-primary animate-spin-slow" />
        <span className="text-xs font-bold msn-text uppercase tracking-wider">EL NUEVO SONIDO</span>
        <Star className="w-3 h-3 text-primary star-glow ml-auto" />
      </div>
      
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track.id)}
            className={`track-item flex items-center gap-2 p-2 rounded cursor-pointer border ${
              currentTrack === track.id 
                ? 'bg-primary/20 border-primary/50 shadow-[inset_0_0_10px_rgba(255,0,128,0.2)]' 
                : 'border-transparent hover:border-primary/30'
            }`}
          >
            {/* MSN Online status / track number */}
            <div className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${
              currentTrack === track.id 
                ? 'bg-green-400 text-background shadow-[0_0_8px_rgba(74,222,128,0.6)]' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {String(index + 1).padStart(2, '0')}
            </div>
            
            {/* Album mini cover */}
            <div className="w-8 h-8 rounded-sm overflow-hidden border border-primary/30 flex-shrink-0">
              <img 
                src={albumCover} 
                alt="Album" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold truncate ${
                currentTrack === track.id ? 'text-primary neon-glow' : ''
              }`}>
                {track.title}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {track.artist}
              </p>
            </div>
            
            {/* Duration */}
            <span className="text-[10px] text-muted-foreground font-mono">
              {track.duration}
            </span>
            
            {/* Playing indicator */}
            {currentTrack === track.id && (
              <div className="flex gap-0.5">
                {[1,2,3].map((i) => (
                  <div 
                    key={i}
                    className="w-0.5 h-3 bg-primary rounded-full animate-visualizer"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* MSN style status bar */}
      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-2 h-2 text-primary" />
          <span>{tracks.length} tRaCkS</span>
        </div>
        <span className="msn-text">★ EL NUEVO SONIDO ★</span>
      </div>
    </div>
  );
};

export default TrackList;
