const HalftoneBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />

      {/* Halftone dot pattern */}
      <div className="absolute inset-0 halftone-bg opacity-70" />

      {/* Magenta / Fucsia splashes */}
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full opacity-50 animate-float"
        style={{
          background:
            "radial-gradient(circle, hsl(315, 100%, 50%) 0%, hsl(290, 100%, 40%) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="absolute bottom-1/4 -left-48 w-[700px] h-[700px] rounded-full opacity-40 animate-float"
        style={{
          background:
            "radial-gradient(circle, hsl(290, 100%, 50%) 0%, hsl(270, 100%, 35%) 40%, transparent 70%)",
          filter: "blur(100px)",
          animationDelay: "1.5s",
        }}
      />

      <div
        className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full opacity-30 animate-float"
        style={{
          background:
            "radial-gradient(circle, hsl(315, 100%, 55%) 0%, transparent 60%)",
          filter: "blur(60px)",
          animationDelay: "2.5s",
        }}
      />

      {/* Abstract splash shapes */}
      <svg
        className="absolute top-5 right-5 w-80 h-80 opacity-25 animate-spin-slow"
        viewBox="0 0 200 200"
      >
        <path
          d="M 80 20 Q 160 30 180 100 Q 160 170 80 180 Q 20 160 20 100 Q 20 40 80 20"
          fill="hsl(315, 100%, 50%)"
          style={{ filter: "blur(3px)" }}
        />
      </svg>

      <svg
        className="absolute bottom-10 left-10 w-64 h-64 opacity-20 animate-spin-slow"
        style={{ animationDirection: "reverse", animationDuration: "15s" }}
        viewBox="0 0 200 200"
      >
        <path
          d="M 60 40 Q 140 20 170 90 Q 180 160 100 180 Q 30 170 30 100 Q 30 60 60 40"
          fill="hsl(290, 100%, 50%)"
          style={{ filter: "blur(4px)" }}
        />
      </svg>

      {/* Diagonal old school lines */}
      <div
        className="absolute inset-0 opacity-[0.03] animate-bg-pan"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, hsl(315, 100%, 50%) 0px, hsl(315, 100%, 50%) 1px, transparent 1px, transparent 20px)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* TOP MARQUEE — identidad */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-25 py-2 bg-black/20 backdrop-blur-sm z-10">
        <div className="animate-marquee whitespace-nowrap text-2xl font-bold tracking-widest text-fucsia">
          ★ S1NAKA ★ EL NUEVO SONIDO ★ REGGAETÓN OLD SCHOOL ★ DESDE EL BARRIO ★
          POKEMONA STYLE ★ FLOW ANTIGUO ★
        </div>
      </div>

      {/* BOTTOM MARQUEE — MSN / MySpace */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-25 py-2 bg-black/20 backdrop-blur-sm z-10">
        <div
          className="animate-marquee whitespace-nowrap text-xl font-bold tracking-widest text-accent"
          style={{ animationDirection: "reverse" }}
        >
          AGREGA A MSN ★ DEJA TU SALUDO ★ FIRMA EL GUESTBOOK ★
          SUBE EL VOLUMEN ★ GRACIAS POR VISITAR ★
        </div>
      </div>

      {/* Main graffiti text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.045] select-none">
        <span
          className="text-[18rem] font-black tracking-tighter animate-pulse-glow"
          style={{
            background:
              "linear-gradient(180deg, hsl(315, 100%, 55%), hsl(270, 100%, 35%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "blur(6px)",
            transform: "rotate(-5deg)",
          }}
        >
          EL NUEVO SONIDO
        </span>
      </div>

      {/* Secondary graffiti words */}
      <div className="absolute bottom-32 right-16 opacity-[0.06] select-none">
        <span
          className="text-6xl font-black"
          style={{
            background:
              "linear-gradient(180deg, hsl(290, 100%, 50%), hsl(315, 100%, 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "blur(2px)",
            transform: "rotate(8deg)",
          }}
        >
          POKEMONA
        </span>
      </div>

      <div className="absolute top-32 left-16 opacity-[0.05] select-none">
        <span
          className="text-5xl font-black"
          style={{
            background:
              "linear-gradient(180deg, hsl(315, 100%, 50%), hsl(270, 100%, 40%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "blur(3px)",
            transform: "rotate(-10deg)",
          }}
        >
          FLOW ANTIGUO
        </span>
      </div>

      {/* MSN stars */}
      <div className="absolute top-20 left-20 text-4xl opacity-20 animate-sparkle">★</div>
      <div className="absolute top-40 right-40 text-2xl opacity-15 animate-sparkle">✦</div>
      <div className="absolute bottom-40 left-1/4 text-3xl opacity-20 animate-sparkle">★</div>
      <div className="absolute top-1/3 right-20 text-xl opacity-15 animate-sparkle">✧</div>
      <div className="absolute top-1/2 left-10 text-xl opacity-25 animate-sparkle">★</div>
      <div className="absolute bottom-10 right-1/3 text-2xl opacity-15 animate-sparkle">✦</div>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay" />
    </div>
  );
};

export default HalftoneBackground;
