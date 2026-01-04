import React, { useState, useEffect } from 'react';
import { Share2, Heart, ChevronLeft, Info, PlayCircle, Globe, ExternalLink, Search, CheckCircle2 } from 'lucide-react';

interface RecognitionResultProps {
  image: string;
  onBack: () => void;
  onCharacterClick: (char: string) => void;
  results: any[];
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ image, onBack, onCharacterClick, results }) => {
  const [showAha, setShowAha] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowAha(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showAha) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] z-[100] flex flex-col items-center justify-center">
        <div className="relative w-72 h-72">
          <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full"></div>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="text-8xl font-calligraphy text-[#D4AF37] animate-pulse">
              {results[0]?.char || '鉴'}
            </span>
            <span className="text-xs text-[#D4AF37]/60 tracking-[0.4em]">正在调拨专家库</span>
          </div>
        </div>
      </div>
    );
  }

  const activeResult = results[activeIndex] || results[0] || {};

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24 font-serif">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-xl z-40 px-6 py-4 flex justify-between items-center border-b border-black/5">
        <button onClick={onBack} className="p-2"><ChevronLeft size={24} /></button>
        <h1 className="text-sm font-bold tracking-[0.3em]">专家会诊结论</h1>
        <div className="flex gap-2">
          <button className="p-2"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="pt-20 px-6">
        {/* Main Display Area */}
        <div className="bg-white rounded-[40px] p-8 mb-8 shadow-sm flex flex-col items-center relative border border-white">
          {/* Source Thumbnail */}
          <div className="absolute top-6 left-6 w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={image} className="w-full h-full object-cover" />
          </div>

          {/* Character View */}
          <div 
            onClick={() => onCharacterClick(activeResult.char)}
            className="text-[140pt] font-calligraphy leading-none mb-6 cursor-pointer drop-shadow-sm active:scale-95 transition-all"
          >
            {activeResult.char}
          </div>

          {/* Candidate Tabs */}
          <div className="w-full flex gap-3 mb-8">
            {results.map((res, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex-1 py-4 rounded-3xl transition-all flex flex-col items-center gap-1 border-2 ${
                  activeIndex === i 
                    ? 'bg-[#C83C23] border-[#C83C23] text-white shadow-lg' 
                    : 'bg-white border-transparent text-gray-400'
                }`}
              >
                <span className="text-xl font-bold font-calligraphy">{res.char}</span>
                <span className="text-[10px] opacity-60">可能性 {Math.round(res.confidence * 100)}%</span>
              </button>
            ))}
          </div>

          {/* Reasoning Card */}
          <div className="bg-[#F5F5F0] p-6 rounded-[32px] w-full border border-black/[0.03]">
            <div className="flex items-center gap-2 mb-3">
              <Search size={14} className="text-[#C83C23]" />
              <span className="text-[10px] font-bold text-[#C83C23] tracking-widest uppercase">草法鉴定逻辑</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 italic">
              “{activeResult.reasoning}”
            </p>
          </div>
        </div>

        {/* Evidence Links */}
        {activeResult.evidenceLinks && activeResult.evidenceLinks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Globe size={16} className="text-blue-500" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400">数字图书馆比对依据</h2>
            </div>
            <div className="space-y-3">
              {activeResult.evidenceLinks.map((ref: any, idx: number) => (
                <a 
                  key={idx}
                  href={ref.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-black/[0.03] hover:border-blue-200 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{ref.title}</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* History Info */}
        <div className="bg-[#1A1A1A] text-white rounded-[32px] p-8 mb-8 flex justify-between items-center shadow-xl">
          <div className="flex-1">
            <div className="text-[10px] opacity-40 mb-1 tracking-[0.2em] font-sans">学术参考样式</div>
            <div className="text-xl font-bold">{activeResult.calligrapher || '历代名家'}写法</div>
            <div className="text-[10px] text-[#D4AF37] mt-1 font-sans">{activeResult.era || '传承千年'}</div>
          </div>
          <button className="bg-[#C83C23] h-14 w-14 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg">
            <PlayCircle size={28} />
          </button>
        </div>

        {/* Footer Action */}
        <button 
          onClick={() => onCharacterClick(activeResult.char)}
          className="w-full bg-white text-[#1A1A1A] py-6 rounded-[28px] font-bold flex items-center justify-center gap-3 border border-black/5 active:bg-gray-50 transition-all"
        >
          查看此字千年演变 <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecognitionResult;