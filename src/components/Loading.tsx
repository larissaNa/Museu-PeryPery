import React from "react";
import logoLaranja from "../assets/logolaranja.png";

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-museum-dark relative overflow-hidden">
      {/* Decorative Glowing Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-museum-orange/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/10 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Animated Spin Rings */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-museum-orange/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-museum-orange animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-museum-gold animate-spin" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
          
          {/* Pulsing Logo in the center */}
          <div className="w-16 h-16 flex items-center justify-center animate-pulse">
            <img 
              src={logoLaranja} 
              alt="Logo Museu Pery Pery" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(233,163,84,0.4)]" 
            />
          </div>
        </div>

        {/* Text loading */}
        <h2 className="mt-8 font-display text-lg font-medium text-white tracking-widest uppercase animate-pulse">
          Carregando
        </h2>
        <p className="mt-2 text-xs text-museum-warm-gray tracking-wider uppercase font-light">
          Museu Pery Pery
        </p>
      </div>
    </div>
  );
};

export default Loading;
