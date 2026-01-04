import React, { useState, useEffect } from 'react';
import { Share2, Heart, ChevronLeft, Info, PlayCircle, Globe, ExternalLink, Search } from 'lucide-react';
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
    const timer = setTimeout(() => setShowAha(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showAha) {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] z-[100] flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/5 rounded-full animate-ping"></div>
          <div className="absolute text-7xl font-calligraphy text-[#D4AF37] animate-pulse">
            {results[0]?.char || '辨'}
          </div>
        </div>
        <p className="mt-8 text-[#D4AF37] tracking-[0.5em] font-serif">正在对接全球书法数据库...</p>
      </div>
    );
  }

  const result = results[0] || {
    char: '?',
    calligrapher: '未知',
    dynasty: '未知',
    source: '未知',
    confidence: 0,
    reasoning: '未能获取有效识别逻辑',
    webReferences: []
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 flex justify-between items-center border-b border-black/5">
        <button onClick={onBack} className="p-2"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold font-serif">鉴定结果</h1>
        <div className="flex gap-2">
          <button className="p-2"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="pt-20 px-6">
        {/* Main Display */}
        <div className="bg-white rounded-[40px] p-10 mb-6 shadow-sm flex flex-col items-center relative overflow-hidden border border-black/5">
          <div className="absolute top-6 right-6 w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#F5F5F0] shadow-inner rotate-3">
            <img src={image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div 
            onClick={() => onCharacterClick(result.char)}
            className="text-[130pt] font-calligraphy leading-none mb-4 cursor-pointer hover:scale-105 transition-transform"
          >
            {result.char}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#C83C23]" style={{ width: `${result.confidence * 100}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              置信度 {Math.round(result.confidence * 100)}%
            </span>
          </div>

          <div className="bg-[#F5F5F0] p-4 rounded-2xl w-full">
            <div className="text-[10px] text-[#C83C23] font-bold mb-2 flex items-center gap-1">
              <Search size={10} /> 识别逻辑推演
            </div>
            <p className="text-xs leading-relaxed text-gray-600 font-serif italic">
              “{result.reasoning}”
            </p>
          </div>
        </div>

        {/* Web Evidence Links */}
        {result.webReferences && result.webReferences.length > 0 && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold tracking-widest">全球博物馆比对依据</h2>
            </div>
            <div className="space-y-2">
              {result.webReferences.map((ref: any, idx: number) => (
                <a 
                  key={idx}
                  href={ref.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-blue-200 transition-colors group"
                >
                  <span className="text-xs font-medium text-gray-700 truncate mr-4">{ref.title}</span>
                  <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Master Info */}
        <div className="bg-[#1A1A1A] text-white rounded-[32px] p-6 mb-8 flex justify-between items-center shadow-xl">
          <div className="flex-1">
            <div className="text-[10px] opacity-40 mb-1 tracking-[0.2em]">最匹配真迹</div>
            <div className="text-lg font-bold font-serif">{result.calligrapher}《{result.source || '佚名碑帖'}》</div>
          </div>
          <button className="bg-[#C83C23] h-12 px-6 rounded-2xl text-xs font-bold flex items-center gap-2 active:scale-95 transition-all">
            演变 <PlayCircle size={14} />
          </button>
        </div>

        {/* Action */}
        <button 
          onClick={() => onCharacterClick(result.char)}
          className="w-full bg-white border border-black/5 text-[#1A1A1A] py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          查看千年演变详情 <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecognitionResult;