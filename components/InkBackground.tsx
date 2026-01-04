
import React from 'react';

const InkBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-5">
      <div className="absolute top-10 left-10 w-96 h-96 bg-black rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-black rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-black rounded-full blur-[80px] animate-bounce" style={{ animationDuration: '10s' }}></div>
    </div>
  );
};

export default InkBackground;
