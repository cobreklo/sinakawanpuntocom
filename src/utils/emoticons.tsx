import React from 'react';

// Mapa de configuración EXACTO para emoticonos MSN (GIFs y PNGs)
export const EMOTICON_MAP: Record<string, string> = {
  // Animados (GIFs) - Prioridad alta
  ';)': 'winking-smile.gif',
  ":'(": 'crying-face.gif',
  '(^)': 'birthday-cake.gif',
  ':[': 'vampire-bat.gif',
  ':^)': 'i-dont-know-smile.gif',
  '*-)': 'thinking-smile.gif',
  '(li)': 'lightning.gif',
  '<:o)': 'party-smile.gif',
  '8-)': 'eye-rolling-smile.gif',
  '|-)': 'sleepy-smile.gif',
  
  // Estáticos (PNGs) - Clásicos
  ':)': 'smile.png',
  ':D': 'open-mouthed-smile.png',
  ':O': 'surprised-smile.png',
  ':P': 'smile-with-tongue-out.png',
  '(H)': 'hot-smile.png',
  ':@': 'angry-smile.png',
  ':$': 'embarrassed-smile.png',
  ':S': 'confused-smile.png',
  ':(': 'sad-smile.png',
  ':|': 'disappointed-smile.png',
  '(6)': 'devil.png',
  '(A)': 'angel.png',
  '(L)': 'red-heart.png',
  '(U)': 'broken-heart.png',
  '(M)': 'messenger.png',
  '(@)': 'cat-face.png',
  '(&)': 'dog-face.png',
  '(S)': 'sleeping-half-moon.png',
  '(*)': 'star.png',
  '(~)': 'filmstrip.png',
  '(8)': 'note.png',
  '(E)': 'e-mail.png',
  '(F)': 'red-rose.png',
  '(W)': 'wilted-rose.png',
  '(O)': 'clock.png',
  '(K)': 'red-lips.png',
  '(G)': 'gift-with-a-bow.png',
  '(P)': 'camera.png',
  '(I)': 'light-bulb.png',
  '(C)': 'coffee-cup.png',
  '(T)': 'telephone-receiver.png',
  '({)': 'left-hug.png',
  '(})': 'right-hug.png',
  '(B)': 'beer-mug.png',
  '(D)': 'martini-glass.png',
  '(Z)': 'boy.png',
  '(X)': 'girl.png',
  '(Y)': 'thumbs-up.png',
  '(N)': 'thumbs-down.png',
  '(nnh)': 'goat.png',
  '(#)': 'sun.png',
  '(R)': 'rainbow.png',
  ':-#': 'dont-tell-anyone-smile.png',
  '8o|': 'baring-teeth-smile.png',
  '8-|': 'nerd-smile.png',
  '1313': 'sarcastic-smile.png', // Clásico chileno
  '^o)': 'sarcastic-smile.png',
  ':-*': 'secret-telling-smile.png',
  '+o(': 'sick-smile.png',
  '(sn)': 'snail.png',
  '(tu)': 'turtle.png',
  '(pl)': 'plate.png',
  '(||)': 'bowl.png',
  '(pi)': 'pizza.png',
  '(so)': 'soccer-ball.png',
  '(au)': 'auto.png',
  '(ap)': 'airplane.png',
  '(um)': 'umbrella.png',
  '(ip)': 'island-with-a-palm-tree.png',
  '(co)': 'computer.png',
  '(mp)': 'mobile-phone.png',
  '(brb)': 'be-right-back.png',
  '(st)': 'storm-cloud.png',
  '(h5)': 'high-five.png',
  '(mo)': 'money.png',
  '(bah)': 'black-sheep.png',
  '(\'.\')': 'bunny.png'
};

export const parseMessage = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // Escapamos caracteres especiales de regex para el split
    // Ordenamos por longitud descendente para evitar conflictos (ej: ':-)' vs ':)')
    const patterns = Object.keys(EMOTICON_MAP)
      .sort((a, b) => b.length - a.length)
      .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // Regex para dividir el texto manteniendo los separadores
    const regex = new RegExp(`(${patterns.join('|')})`, 'g');
    
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (EMOTICON_MAP[part]) {
        return (
          <img 
            key={index}
            src={`/emoticons/${EMOTICON_MAP[part]}`}
            alt={part}
            title={part}
            className="inline-block w-5 h-5 align-middle mx-0.5 select-none hover:scale-125 transition-transform duration-200"
            style={{ imageRendering: 'pixelated' }} // Estilo retro pixel-perfect
          />
        );
      }
      // Retornamos el texto normal
      return <span key={index}>{part}</span>;
    });
};
