import { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { Send, Dice5 } from 'lucide-react';
=======
import { Send, Dice5, ShieldCheck, Wifi, WifiOff, Smile } from 'lucide-react';
>>>>>>> e173e6c (feat(emoticons): add msn-style emoticons with parser and picker)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import msnSound from "@/assets/music/msn-sound_1.mp3";

<<<<<<< HEAD
=======
// Importaciones de Firebase
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { parseMessage, EMOTICON_MAP } from "@/utils/emoticons";

>>>>>>> e173e6c (feat(emoticons): add msn-style emoticons with parser and picker)
interface Shout {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar?: string;
}
// Agrega esto arriba, junto a las otras constantes
const BAD_WORDS = [
    // --- 1. POLÍTICA Y CONTINGENCIA (Para evitar peleas eternas) ---
    // Nombres y figuras
    "boric", "merluzo", "kast", "republicano", "pinochet", "allende",
    "piñera", "bachelet", "jackson", "vallejo", "matthei", "kaiser",
    "milei", "maduro", "chavez", "bukele", "trump", "biden",
    
    // Términos polarizantes
    "facho", "fachito", "comunista", "comunacho", "zurdo", "zurdito",
    "momio", "upeliento", "patriota", "libertario", "progre", "ñuñoino",
    "apruebo", "rechazo", "estallido", "dignidad", "primera linea", "pacos", "yuta",
    "dictador", "dictadura", "golpe", "pronunciamiento", "ddhh",
    "constitucion", "plebiscito", "senado", "diputado", "gobierno",
    "onu", "agenda 2030", "globalista", "plandemia", "vacuna",

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
const FEEDBACK_MESSAGES = [
    "nick pokemón generado 🎲", 
    "nombre estilo msn 2006", 
    "flow antiguo activado",
    "corte reggaetonero 2005",
    "fotolog style on 📸",
    "nick pa tu zumbido",
    "generando flow... ⏳",
    "modo leyenda urbana",
    "directo al cyber 💻",
    "nick ready pa la disco 🪩"
];

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
<<<<<<< HEAD
  const [shouts, setShouts] = useState<Shout[]>([
    { id: 1, user: "La_Morenaza_2006", message: "te firmo el log! pasate x el mio sipo!!", time: "Hace 2 min" },
    { id: 2, user: "Dj_Bl4ck_St4r", message: "wena wena perrito, ta pulento el tema nuevo", time: "Hace 15 min" },
    { id: 3, user: "K-tita_Princess", message: "agregame a msn plisss, te deje comments +10", time: "Hace 1 hora" },
    { id: 4, user: "El_Bryan_HxC", message: "ta weno el diseño corte antiguo, aguante el reggaeton old school", time: "Hace 3 horas" },
  ]);
=======
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [shouts, setShouts] = useState<Shout[]>([]);
>>>>>>> e173e6c (feat(emoticons): add msn-style emoticons with parser and picker)
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Visitante");
  const [isOpen, setIsOpen] = useState(true);
<<<<<<< HEAD
=======
  const [isOnline, setIsOnline] = useState(false); // Estado de conexión
  const [isSending, setIsSending] = useState(false);
  const [lastShoutTime, setLastShoutTime] = useState(0);

  // Lógica Anti-Spam
  const [sessionMessageCount, setSessionMessageCount] = useState(0); 
  const [captcha, setCaptcha] = useState<{ num1: number, num2: number } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

>>>>>>> e173e6c (feat(emoticons): add msn-style emoticons with parser and picker)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastFeedbackIndex = useRef<number>(-1);

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

    // Show feedback toast with non-repeating logic
    let feedbackIndex;
    do {
        feedbackIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length);
    } while (feedbackIndex === lastFeedbackIndex.current && FEEDBACK_MESSAGES.length > 1);
    
    lastFeedbackIndex.current = feedbackIndex;
    const feedback = FEEDBACK_MESSAGES[feedbackIndex];

    toast({
        title: feedback,
        description: `Nuevo nick asignado: ${newNick}`,
        duration: 2000,
        className: "bg-black/90 border-primary text-white font-mono text-xs",
    });
  };

<<<<<<< HEAD
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
=======
  const insertEmoticon = (code: string) => {
    const input = inputRef.current;
    if (input) {
      // Insertar en la posición del cursor
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = newMessage;
      const newText = text.substring(0, start) + code + text.substring(end);
      setNewMessage(newText);
      
      // Devolver el foco al input y poner el cursor después del emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + code.length, start + code.length);
      }, 0);
    } else {
      // Fallback por si no hay ref
      setNewMessage(prev => prev + code);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // VALIDACIÓN COOLDOWN (15 segundos)
    const now = Date.now();
    const timeSinceLastShout = now - lastShoutTime;
    const cooldownMs = 15000;

    if (timeSinceLastShout < cooldownMs) {
        const secondsRemaining = Math.ceil((cooldownMs - timeSinceLastShout) / 1000);
        toast({
            title: "⏳ Calma tu flow",
            description: `Espera ${secondsRemaining} segundos antes de enviar otro mensaje.`,
            variant: "destructive",
        });
        return;
    }

    // VALIDACIÓN ANTI-SPAM
    if (sessionMessageCount >= 1 && captcha) {
        const sum = captcha.num1 + captcha.num2;
        if (parseInt(captchaAnswer) !== sum) {
            toast({
                title: "🚫 Acceso denegado",
                description: "Suma incorrecta. Eres un robot?",
                variant: "destructive",
            });
            generateCaptcha();
            return;
        }
    }

    setIsSending(true);

    try {
        // CENSURA: Filtrar mensaje antes de enviar
        const cleanedMessage = censorMessage(newMessage);

        // FIREBASE: Guardar en la nube
        await addDoc(collection(db, "shouts"), {
            user: username || "Anonimo",
            message: cleanedMessage,
            timestamp: serverTimestamp(), // Hora del servidor (importante para orden global)
            avatar: "", // Opcional
        });

        setNewMessage("");
        setSessionMessageCount(prev => prev + 1);
        setLastShoutTime(Date.now());
        
        // Activar captcha para el siguiente
        if (sessionMessageCount >= 0) {
            generateCaptcha();
        }

        toast({
            title: "Enviado al mundo 🌍",
            description: "Tu mensaje está en vivo.",
            className: "bg-blue-900 border-blue-500 text-white text-xs",
        });

        // Reproducir sonido MSN al enviar
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }

    } catch (error) {
        console.error("Error enviando shout:", error);
        toast({
            title: "Error",
            description: "No se pudo conectar al servidor de chat.",
            variant: "destructive",
        });
    } finally {
        setIsSending(false);
    }
>>>>>>> e173e6c (feat(emoticons): add msn-style emoticons with parser and picker)
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
                    {parseMessage(shout.message)}
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
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 shrink-0 text-yellow-400 hover:text-yellow-300 hover:bg-white/10"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 bg-white/95 border-2 border-blue-500 shadow-xl" side="top" align="start">
                <ScrollArea className="h-48 w-full pr-2">
                  <div className="grid grid-cols-6 gap-1">
                    {Object.entries(EMOTICON_MAP).map(([code, filename]) => (
                      <button
                        key={code}
                        onClick={() => insertEmoticon(code)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors flex items-center justify-center"
                        title={code}
                      >
                        <img 
                          src={`/emoticons/${filename}`} 
                          alt={code} 
                          className="w-5 h-5 object-contain"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Input 
              ref={inputRef}
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
