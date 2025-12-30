import { useState, useEffect, useRef } from 'react';
import { Send, Dice5 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import msnSound from "@/assets/music/msn-sound_1.mp3";

interface Shout {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar?: string;
}

const PREFIXES = ["La_", "El_", "Dj_", "MC_", "Xx_", "-=-", "~*"];
const CORES = [
    "Shamakito", "Pokemona", "PerroLoko", "Guachito", "NeneFlow", 
    "Chorizo", "Malulo", "SangreNueva", "UnderFlow", "ReggaetonCL", 
    "NeoPerreo", "FlaiteStyle", "Callejero", "Bakan", "Perrin", 
    "Guacho", "Morenito", "Pichanga", "Flowcito", "CumbiaFlow"
];
const MODS = ["xX", "_-", "__", "..", "*", "~x", "Zz"];
const SUFFIXES = [
    "_2004", "_2005", "_2006", "_2007", "_CL", "_Chile", 
    "_HxC", "_St4r", "_Pkm", "_MSN", "_Flow", "_Xx"
];
const FEEDBACK_MESSAGES = ["nick pokemón generado 🎲", "nombre estilo msn 2006", "flow antiguo activado"];

const generateRandomNickname = (lastCore?: string) => {
    // Prevent repetition of the same core base
    let core;
    do {
        core = CORES[Math.floor(Math.random() * CORES.length)];
    } while (core === lastCore && CORES.length > 1);

    // 70% chance for "standard" generation (Prefix + Core + Suffix)
    // 30% chance for "weird/chaotic" generation (Mods involved)
    const isChaotic = Math.random() > 0.7;

    if (isChaotic) {
        const prefix = Math.random() > 0.3 ? PREFIXES[Math.floor(Math.random() * PREFIXES.length)] : "";
        const mod = MODS[Math.floor(Math.random() * MODS.length)];
        const suffix = Math.random() > 0.3 ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : "";
        
        // Randomly place mod either before suffix or wrap core
        if (Math.random() > 0.5) {
            return `${prefix}${core}${mod}${suffix}`;
        } else {
             return `${prefix}${mod}${core}${suffix}`;
        }
    } else {
        // Standard flow
        const usePrefix = Math.random() > 0.2; // 80% chance to have prefix
        const useSuffix = Math.random() > 0.1; // 90% chance to have suffix
        
        const prefix = usePrefix ? PREFIXES[Math.floor(Math.random() * PREFIXES.length)] : "";
        const suffix = useSuffix ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : "";
        
        return `${prefix}${core}${suffix}`;
    }
};

const Shoutbox = () => {
  const { toast } = useToast();
  const [shouts, setShouts] = useState<Shout[]>([
    { id: 1, user: "La_Morenaza_2006", message: "te firmo el log! pasate x el mio sipo!!", time: "Hace 2 min" },
    { id: 2, user: "Dj_Bl4ck_St4r", message: "wena wena perrito, ta pulento el tema nuevo", time: "Hace 15 min" },
    { id: 3, user: "K-tita_Princess", message: "agregame a msn plisss, te deje comments +10", time: "Hace 1 hora" },
    { id: 4, user: "El_Bryan_HxC", message: "ta weno el diseño corte antiguo, aguante el reggaeton old school", time: "Hace 3 horas" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Visitante");
  const [isOpen, setIsOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(msnSound);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  const handleRandomNickname = () => {
    // Extract current core to avoid repetition if possible (simple heuristic)
    let lastCore;
    for (const core of CORES) {
        if (username.includes(core)) {
            lastCore = core;
            break;
        }
    }

    const newNick = generateRandomNickname(lastCore);
    setUsername(newNick);
    
    // Play sound
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
    }

    // Show feedback toast
    const feedback = FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)];
    toast({
        title: feedback,
        description: `Nuevo nick asignado: ${newNick}`,
        duration: 2000,
        className: "bg-black/90 border-primary text-white font-mono text-xs",
    });
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newShout: Shout = {
      id: Date.now(),
      user: username || "Anonimo",
      message: newMessage,
      time: "Ahora",
    };

    setShouts([newShout, ...shouts]);
    setNewMessage("");
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:from-blue-700 hover:to-blue-900 border border-white/20"
      >
        <span className="animate-pulse mr-2">💬</span> Abrir Shoutbox
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 md:w-96 glass-card rounded-t-lg border-2 border-primary/50 shadow-[0_0_20px_rgba(255,0,128,0.3)] flex flex-col max-h-[500px]">
      {/* Header Windows XP style */}
      <div className="h-8 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 flex items-center justify-between px-3 rounded-t-sm cursor-pointer" onClick={() => setIsOpen(false)}>
        <span className="text-white text-xs font-bold flex items-center gap-2 select-none">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          S1NAKA Shoutbox v1.0
        </span>
        <div className="flex gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-4 h-4 bg-red-500 rounded-sm border border-white/50 text-white flex items-center justify-center text-[10px] leading-none hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-black/80 p-3 flex flex-col gap-3 overflow-hidden backdrop-blur-md">
        <div className="text-xs text-muted-foreground text-center border-b border-white/10 pb-2">
          Dejale un saludo al artista! No olvides firmar el guestbook.
        </div>

        <ScrollArea className="flex-1 h-[250px] pr-3">
          <div className="flex flex-col gap-3">
            {shouts.map((shout) => (
              <div key={shout.id} className="flex gap-2 items-start group animate-in slide-in-from-bottom-2 duration-300">
                <Avatar className="w-8 h-8 border border-primary/50 shrink-0">
                  <AvatarImage src={shout.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                    {shout.user.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-fucsia truncate max-w-[120px] drop-shadow-sm">{shout.user}</span>
                    <span className="text-[10px] text-muted-foreground">{shout.time}</span>
                  </div>
                  <p className="text-xs text-foreground/90 break-words leading-tight bg-white/5 p-2 rounded-sm mt-0.5 border border-white/5 shadow-inner">
                    {shout.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="mt-auto pt-2 border-t border-white/10 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input 
                className="h-7 text-xs bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus-visible:ring-primary/50 flex-1" 
                placeholder="Tu Nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            className="h-7 w-7 bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,211,0.5)] border border-fuchsia-400/50 shrink-0 group"
                            onClick={handleRandomNickname}
                        >
                            <Dice5 className="w-4 h-4 text-white group-hover:animate-spin-slow" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#ffffcc] border border-black text-black text-xs font-mono p-1 shadow-md rounded-none">
                        <p>Nombre al azar, corte pokemón</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input 
              className="h-8 text-xs bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus-visible:ring-primary/50" 
              placeholder="Escribe un mensaje..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              size="icon" 
              className="h-8 w-8 bg-primary hover:bg-primary/80 shrink-0"
              onClick={handleSend}
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shoutbox;
