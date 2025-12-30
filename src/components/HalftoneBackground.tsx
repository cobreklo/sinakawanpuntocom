const HalftoneBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Halftone dot pattern - bigger more visible */}
      <div className="absolute inset-0 halftone-bg opacity-70" />
      
      {/* Magenta/Fucsia splashes - more intense with float animation */}
      <div 
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full opacity-50 animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(315, 100%, 50%) 0%, hsl(290, 100%, 40%) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '0s',
        }}
      />
      <div 
        className="absolute bottom-1/4 -left-48 w-[700px] h-[700px] rounded-full opacity-40 animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(290, 100%, 50%) 0%, hsl(270, 100%, 35%) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animationDelay: '1.5s',
        }}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full opacity-30 animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(315, 100%, 55%) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animationDelay: '2.5s',
        }}
      />
      
      {/* Abstract splash shapes with slow spin */}
      <svg className="absolute top-5 right-5 w-80 h-80 opacity-25 animate-spin-slow" viewBox="0 0 200 200">
        <path
          d="M 80 20 Q 160 30 180 100 Q 160 170 80 180 Q 20 160 20 100 Q 20 40 80 20"
          fill="hsl(315, 100%, 50%)"
          style={{ filter: 'blur(3px)' }}
        />
      </svg>
      
      <svg className="absolute bottom-10 left-10 w-64 h-64 opacity-20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} viewBox="0 0 200 200">
        <path
          d="M 60 40 Q 140 20 170 90 Q 180 160 100 180 Q 30 170 30 100 Q 30 60 60 40"
          fill="hsl(290, 100%, 50%)"
          style={{ filter: 'blur(4px)' }}
        />
      </svg>

      {/* Diagonal lines - old school web aesthetic with pan animation */}
      <div 
        className="absolute inset-0 opacity-[0.03] animate-bg-pan"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, hsl(315, 100%, 50%) 0px, hsl(315, 100%, 50%) 1px, transparent 1px, transparent 20px)',
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Scrolling Marquee */}
      <div className="absolute top-0 left-0 w-full overflow-hidden opacity-20 py-2 bg-black/20 backdrop-blur-sm z-10">
        <div className="animate-marquee whitespace-nowrap text-2xl font-bold tracking-widest text-fucsia">
          S1NAKA ★ EL NUEVO SONIDO ★ REGGAETON OLD SCHOOL ★ POKEMONA STYLE ★ 2000s VIBES ★ 
          S1NAKA ★ EL NUEVO SONIDO ★ REGGAETON OLD SCHOOL ★ POKEMONA STYLE ★ 2000s VIBES ★
        </div>
      </div>

       {/* Bottom Scrolling Marquee (Reverse) */}
       <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-20 py-2 bg-black/20 backdrop-blur-sm z-10">
        <div className="animate-marquee whitespace-nowrap text-xl font-bold tracking-widest text-accent" style={{ animationDirection: 'reverse' }}>
          ★ WWW.MYSPACE.COM/S1NAKA ★ ADD TO FRIENDS ★ LEAVE A COMMENT ★ THANKS FOR VISITING ★ 
          ★ WWW.MYSPACE.COM/S1NAKA ★ ADD TO FRIENDS ★ LEAVE A COMMENT ★ THANKS FOR VISITING ★
        </div>
      </div>

      {/* Graffiti-style background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none">
        <span 
          className="text-[18rem] font-black tracking-tighter animate-pulse-glow"
          style={{
            background: 'linear-gradient(180deg, hsl(315, 100%, 55%), hsl(270, 100%, 35%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'blur(6px)',
            transform: 'rotate(-5deg)',
          }}
        >
          S1NAKA
        </span>
      </div>

      {/* More graffiti text */}
      <div className="absolute bottom-20 right-10 opacity-[0.06] select-none">
        <span 
          className="text-6xl font-black"
          style={{
            background: 'linear-gradient(180deg, hsl(290, 100%, 50%), hsl(315, 100%, 45%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'blur(2px)',
            transform: 'rotate(8deg)',
          }}
        >
          POKEMONA
        </span>
      </div>

      {/* MSN-style decorative stars scattered - Increased count */}
      <div className="absolute top-20 left-20 text-4xl opacity-20 animate-sparkle">★</div>
      <div className="absolute top-40 right-40 text-2xl opacity-15 animate-sparkle" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute bottom-40 left-1/4 text-3xl opacity-20 animate-sparkle" style={{ animationDelay: '0.8s' }}>★</div>
      <div className="absolute top-1/3 right-20 text-xl opacity-15 animate-sparkle" style={{ animationDelay: '0.3s' }}>✧</div>
      <div className="absolute top-1/2 left-10 text-xl opacity-25 animate-sparkle" style={{ animationDelay: '1.2s' }}>★</div>
      <div className="absolute bottom-10 right-1/3 text-2xl opacity-15 animate-sparkle" style={{ animationDelay: '2.0s' }}>✦</div>
      <div className="absolute top-10 left-1/2 text-3xl opacity-20 animate-sparkle" style={{ animationDelay: '1.5s' }}>✧</div>
      
      {/* Grain overlay - more visible */}
      <div className="absolute inset-0 grain-overlay" />
    </div>
  );
};

export default HalftoneBackground;
