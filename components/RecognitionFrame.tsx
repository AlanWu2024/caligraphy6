
import React from 'react';

const RecognitionFrame: React.FC = () => {
  return (
    <div className="relative w-64 h-64 border-4 border-transparent">
      {/* Custom Corners with brush feel */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#C83C23] rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#C83C23] rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#C83C23] rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#C83C23] rounded-br-lg"></div>
      
      {/* Animated scan line */}
      <div className="absolute inset-0 flex flex-col justify-start">
        <div className="w-full h-0.5 bg-[#C83C23] opacity-50 shadow-[0_0_15px_#C83C23] animate-[scan_2s_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
      `}</style>
    </div>
  );
};

export default RecognitionFrame;
