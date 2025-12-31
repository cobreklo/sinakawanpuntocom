import { useState, useEffect, useRef } from 'react';
import { Send, Dice5, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import msnSound from "@/assets/music/msn-sound_1.mp3";

// Importaciones de Firebase
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";

interface Shout {
  id: string;
  user: string;
  message: string;
  timestamp: any; // Firestore Timestamp
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

    // --- 2. XENOFOBIA Y RACISMO (Tolerancia Cero) ---
    // Gentilicios usados como insulto en chats
    "veneco", "venezolano", "haitiano", "masisi", "colombiano",
    "peruano", "boliviano", "argentino", "dominicano",
    "israel", "palestina", "judio", "nazi", "hitler",
    
    // Insultos racistas directos
    "sudaca", "negro", "mono", "simio", "esclavo", "raza",
    "extranjero", "inmigrante", "ilegal", "balsa", "patera",
    "indio", "araucano", "mapuche", "wallmapu", "terrorista",

    // --- 3. DISCRIMINACIÓN, GÉNERO Y ODIO ---
    // Homofobia/Transfobia
    "maraco", "maraca", "fleto", "coliz", "hueco", "sidoso",
    "trabuco", "trava", "camiona", "lela", "tortillera", "caballo",
    "invertido", "sodomita", "degenerado", "femi", "feminazi", "aliade",
    "incel", "virgo", "beta", "alpha",

    // Capacitismo (Burlarse de condiciones)
    "mongolico", "mongo", "retrasado", "down", "autista", "asperger",
    "esquizo", "bipolar", "loco", "enfermo", "discapacitado", "cojo", "manco",

    // --- 4. VIOLENCIA, CRIMEN Y DROGAS DURAS ---
    // Delitos
    "viola", "violador", "violacion", "abuso", "pedofilo", "pedofilia", "cp",
    "suicidio", "matate", "muérete", "ahorcate", "balazo", "apuñalar", "degollar",
    "sicario", "tren de aragua", "narco", "traficante", "microtrafico",
    
    // Drogas (Evitar venta o apología dura - Marihuana suele tolerarse, esto es lo pesado)
    "pasta", "pasta base", "angustiado", "tussi", "keta", "fentanilo",
    "cocaina", "jale", "falopa", "dealer", "mano", "vendo", "compro",

    // --- 5. CONTENIDO SEXUAL EXPLÍCITO Y VULGARIDAD EXTREMA ---
    // Partes y actos (Más allá del garabato simple)
    "pene", "vagina", "anal", "oral", "semen", "leche", "chorro", "orgasmo",
    "porn", "porno", "xxx", "hentai", "pack", "nudes", "cam", "onlyfans",
    "incesto", "zoofilia", "bestialismo", "scat", "gore",

    // --- 6. SPAM TÉCNICO Y PROMOCIÓN ---
    // Enlaces y dominios
    "http", "https", "www", ".com", ".cl", ".net", ".org", ".io", ".xyz",
    "bit.ly", "goo.gl", "tinyurl", "linktr.ee",
    
    // Plataformas y contactos (Para que no pasen datos)
    "whatsapp", "+569", "telegram", "discord", "instagram", "tiktok", "@",
    "sigueme", "follow", "suscribete", "vendo cuenta", "regalo", "sorteo",
    "crypto", "bitcoin", "nft", "dinero", "ganar", "inversion"
];

// Función para censurar texto
const censorMessage = (text: string) => {
    let cleanedText = text;
    BAD_WORDS.forEach(word => {
        // IMPORTANTE: Escapar la palabra para evitar errores con '+', '.', etc.
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedWord, "gi"); 
        // Reemplaza con asteriscos del mismo largo
        cleanedText = cleanedText.replace(regex, "*".repeat(word.length));
    });
    return cleanedText;
};
// Configuración de Nombres (sin cambios)
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
    "nick pokemón generado 🎲", "nombre estilo msn 2006", "flow antiguo activado",
    "corte reggaetonero 2005", "fotolog style on 📸", "nick pa tu zumbido",
    "generando flow... ⏳", "modo leyenda urbana", "directo al cyber 💻", "nick ready pa la disco 🪩"
];

const generateRandomNickname = (lastCore?: string) => {
    let core;
    do { core = CORES[Math.floor(Math.random() * CORES.length)]; } while (core === lastCore && CORES.length > 1);
    const isChaotic = Math.random() > 0.7;
    if (isChaotic) {
        const prefix = Math.random() > 0.3 ? PREFIXES[Math.floor(Math.random() * PREFIXES.length)] : "";
        const mod = MODS[Math.floor(Math.random() * MODS.length)];
        const suffix = Math.random() > 0.3 ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : "";
        return Math.random() > 0.5 ? `${prefix}${core}${mod}${suffix}` : `${prefix}${mod}${core}${suffix}`;
    } else {
        const prefix = Math.random() > 0.2 ? PREFIXES[Math.floor(Math.random() * PREFIXES.length)] : "";
        const suffix = Math.random() > 0.1 ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : "";
        return `${prefix}${core}${suffix}`;
    }
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return "Enviando...";
    // Convertir Firestore Timestamp a JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const Shoutbox = () => {
  const { toast } = useToast();
  
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem('sinakawa_username') || "Visitante");
  const [isOpen, setIsOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(false); // Estado de conexión
  const [isSending, setIsSending] = useState(false);

  // Lógica Anti-Spam
  const [sessionMessageCount, setSessionMessageCount] = useState(0); 
  const [captcha, setCaptcha] = useState<{ num1: number, num2: number } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio(msnSound);
  }, []);

  // FIREBASE: Suscripción en tiempo real
  useEffect(() => {
    // Referencia a la colección 'shouts'
    const q = query(
        collection(db, "shouts"),
        orderBy("timestamp", "desc"), // Los más nuevos primero
        limit(50) // Traer solo los últimos 50 para no saturar
    );

    // Escuchar cambios
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setIsOnline(true);
        const fetchedShouts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Shout[];
        
        setShouts(fetchedShouts);

        // Reproducir sonido si llega un mensaje nuevo y no es la carga inicial
        // (Lógica simplificada: si la longitud cambia y ya teníamos datos)
        if (snapshot.docChanges().some(change => change.type === 'added') && !snapshot.metadata.fromCache) {
             // Opcional: Sonido de notificación suave
        }
    }, (error) => {
        console.error("Error conectando al chat:", error);
        setIsOnline(false);
    });

    return () => unsubscribe();
  }, []);

  // Guardar usuario localmente
  useEffect(() => {
    localStorage.setItem('sinakawa_username', username);
  }, [username]);

  const generateCaptcha = () => {
    setCaptcha({
        num1: Math.floor(Math.random() * 10) + 1,
        num2: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaAnswer("");
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  const handleRandomNickname = () => {
    let lastCore;
    for (const core of CORES) { if (username.includes(core)) { lastCore = core; break; } }
    const newNick = generateRandomNickname(lastCore);
    setUsername(newNick);
    // Feedback visual
    toast({
        title: FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)],
        description: `Nuevo nick: ${newNick}`,
        className: "bg-black/90 border-primary text-white font-mono text-xs",
    });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

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
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:from-blue-700 hover:to-blue-900 border border-white/20"
      >
        <span className="animate-pulse mr-2">💬</span> Shoutbox Online
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 md:w-96 glass-card rounded-t-lg border-2 border-primary/50 shadow-[0_0_20px_rgba(255,0,128,0.3)] flex flex-col h-[500px]">
      {/* Header Windows XP style */}
      <div className="h-8 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 flex items-center justify-between px-3 rounded-t-sm cursor-pointer shrink-0" onClick={() => setIsOpen(false)}>
        <span className="text-white text-xs font-bold flex items-center gap-2 select-none">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-500'} animate-pulse`}></span>
          S1NAKA Shoutbox {isOnline ? 'Online' : 'Offline'}
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

      {/* Content Container */}
      <div className="flex-1 bg-black/80 p-3 flex flex-col gap-3 overflow-hidden backdrop-blur-md relative">
        {/* Status bar mini */}
        <div className="flex justify-between items-center border-b border-white/10 pb-2 shrink-0">
            <span className="text-[10px] text-muted-foreground">
                {shouts.length} mensajes cargados
            </span>
            {isOnline ? 
                <Wifi className="w-3 h-3 text-green-500" /> : 
                <WifiOff className="w-3 h-3 text-red-500" />
            }
        </div>

        {/* Scrollable Area */}
        <ScrollArea className="flex-1 w-full pr-3 border border-white/5 rounded-md bg-black/20">
          <div className="flex flex-col gap-3 p-2">
            {shouts.length === 0 && isOnline && (
                <div className="text-center text-white/30 text-xs py-10 animate-pulse">
                    Cargando la matrix...
                </div>
            )}
            
            {shouts.map((shout) => (
              <div key={shout.id} className="flex gap-2 items-start group animate-in slide-in-from-bottom-2 duration-300">
                <Avatar className="w-8 h-8 border border-primary/50 shrink-0 mt-1">
                  <AvatarImage src={shout.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                    {shout.user.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-fucsia truncate max-w-[120px] drop-shadow-sm">{shout.user}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">
                            {formatDate(shout.timestamp)}
                        </span>
                    </div>
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
        <div className="mt-auto pt-2 border-t border-white/10 flex flex-col gap-2 shrink-0">
          <div className="flex gap-2">
            <Input 
                className="h-7 text-xs bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus-visible:ring-primary/50 flex-1" 
                placeholder="Tu Nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
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
                        <p>Nombre al azar</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>

          {/* CAPTCHA ANTI-SPAM */}
          {sessionMessageCount > 0 && captcha && (
             <div className="flex items-center gap-2 bg-red-900/20 p-1.5 rounded border border-red-500/30 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-red-200">Anti-Spam: <b>{captcha.num1} + {captcha.num2}</b> = ?</span>
                <Input 
                    className="h-6 w-12 text-xs bg-black/40 border-red-500/50 text-center text-white"
                    placeholder="?"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                />
             </div>
          )}

          <div className="flex gap-2">
            <Input 
              className="h-8 text-xs bg-black/40 border-primary/30 text-white placeholder:text-white/30 focus-visible:ring-primary/50" 
              placeholder={sessionMessageCount > 0 && captcha ? "Resuelve la suma..." : "Escribe un mensaje..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isSending || (sessionMessageCount > 0 && captcha && captchaAnswer === "")}
            />
            <Button 
              size="icon" 
              className={`h-8 w-8 shrink-0 transition-all duration-300 ${
                  (sessionMessageCount > 0 && captcha && parseInt(captchaAnswer) !== (captcha.num1 + captcha.num2)) || isSending
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/80'
              }`}
              onClick={handleSend}
              disabled={isSending || (sessionMessageCount > 0 && captcha && parseInt(captchaAnswer) !== (captcha.num1 + captcha.num2))}
            >
              <Send className={`w-3 h-3 ${isSending ? 'animate-ping' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shoutbox;