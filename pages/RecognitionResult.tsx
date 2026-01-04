
import React, { useState, useEffect } from 'react';
import { Share2, Heart, ChevronLeft, Info, PlayCircle } from 'lucide-react';
import { COLORS, MOCK_CALLIGRAPHERS } from '../constants';

interface RecognitionResultProps {
  image: string;
  onBack: () => void;
  onCharacterClick: (char: string) => void;
  results: any[];
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ image, onBack, onCharacterClick, results }) => {
  const [showAha, setShowAha] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowAha(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showAha) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] z-[100] flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Mock Gold Stroke Animation */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path 
              d="M20,50 Q40,20 60,50 T100,50" 
              fill="none" 
              stroke={COLORS.gold} 
              strokeWidth="4" 
              strokeLinecap="round"
              className="animate-[draw_2s_ease-in-out_forwards]"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            />
          </svg>
          <div className="absolute text-7xl font-calligraphy text-[#D4AF37] animate-pulse">
            {results[0]?.char || '之'}
          </div>
        </div>
        <p className="mt-8 text-white/60 tracking-widest animate-bounce">千年一笔，穿越时空</p>
        <style>{`
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  const result = results[0] || {
    char: '之',
    calligrapher: '王羲之',
    dynasty: '东晋',
    source: '兰亭序',
    confidence: 0.98,
    etymology: '从一从止，表行进。'
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 flex justify-between items-center">
        <button onClick={onBack} className="p-2"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold">识别结果</h1>
        <div className="flex gap-4">
          <button className="p-2"><Heart size={20} /></button>
          <button className="p-2"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="pt-20 px-6">
        {/* Main Character Display */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm flex flex-col items-center relative overflow-hidden">
          {/* Original Thumbnail */}
          <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <img src={image} className="w-full h-full object-cover" />
          </div>

          <div 
            onClick={() => onCharacterClick(result.char)}
            className="text-[120pt] font-calligraphy leading-none mb-6 cursor-pointer hover:scale-105 transition-transform"
          >
            {result.char}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-bold">
              置信度 {Math.round(result.confidence * 100)}%
            </span>
          </div>

          <p className="text-gray-500 text-center max-w-xs">{result.etymology}</p>
        </div>

        {/* Time Card */}
        <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 mb-6 flex justify-between items-center">
          <div>
            <div className="text-sm opacity-60 mb-1">源自：{result.dynasty}</div>
            <div className="text-xl font-bold">{result.calligrapher}《{result.source}》</div>
          </div>
          <button className="bg-[#C83C23] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
            查看演变 <PlayCircle size={16} />
          </button>
        </div>

        {/* Calligraphers list */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">历代名家写法</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {MOCK_CALLIGRAPHERS.map((c, i) => (
              <div key={i} className="flex-shrink-0 w-28 bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center">
                <img src={c.avatar} className="w-16 h-16 rounded-full mb-2 border-2 border-gray-50" />
                <span className="text-sm font-bold">{c.name}</span>
                <span className="text-xs text-gray-400">{c.dynasty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onCharacterClick(result.char)}
          className="w-full bg-[#C83C23] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          查看字典详情 <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecognitionResult;
