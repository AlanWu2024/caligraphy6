
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, Play, MoreVertical, Globe, ExternalLink } from 'lucide-react';
import { MOCK_CHAR_DETAIL, COLORS } from '../constants';
import { searchCalligraphyWeb } from '../geminiService';

interface CharacterDetailProps {
  char: string;
  onBack: () => void;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ char, onBack }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [webData, setWebData] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [isSearching, setIsSearching] = useState(false);

  const detail = MOCK_CHAR_DETAIL[char as keyof typeof MOCK_CHAR_DETAIL] || {
    etymology: '暂无本地字源解析',
    sources: ['正在整理中'],
    meanings: ['加载中']
  };

  useEffect(() => {
    async function fetchWebRefs() {
      setIsSearching(true);
      const res = await searchCalligraphyWeb(char);
      setWebData(res);
      setIsSearching(false);
    }
    fetchWebRefs();
  }, [char]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Fixed Toolbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <button onClick={onBack} className="p-2"><ChevronLeft /></button>
        <div className="flex gap-4">
          <button onClick={() => setIsFavorite(!isFavorite)} className={`p-2 ${isFavorite ? 'text-[#C83C23]' : ''}`}>
            <Heart fill={isFavorite ? COLORS.vermilion : 'none'} />
          </button>
          <button className="p-2"><Share2 /></button>
          <button className="p-2"><MoreVertical /></button>
        </div>
      </div>

      <div className="pt-20 px-6 flex flex-col">
        {/* Main Char Area */}
        <div className="bg-white rounded-[40px] aspect-square flex items-center justify-center relative shadow-sm mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          <div className="text-[180pt] font-calligraphy leading-none relative z-10">{char}</div>
          <button className="absolute bottom-8 right-8 w-14 h-14 bg-[#C83C23] rounded-full flex items-center justify-center text-white shadow-lg">
            <Play fill="white" size={24} />
          </button>
        </div>

        {/* Global Web References Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 border-l-4 border-[#C83C23] pl-3">
            <h3 className="text-sm text-gray-400 tracking-[0.2em] uppercase font-bold">全球学术参考</h3>
            <Globe size={14} className="text-blue-400 animate-spin-slow" />
          </div>
          
          <div className="bg-white/60 p-6 rounded-3xl min-h-[100px]">
            {isSearching ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-8 h-8 border-2 border-t-[#C83C23] border-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400">正在访问故宫、大都会博物馆...</span>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-gray-600 mb-6 italic">
                  "{webData.text.slice(0, 200)}..."
                </p>
                <div className="space-y-3">
                  {webData.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white/80 rounded-2xl hover:bg-white transition-colors group"
                    >
                      <span className="text-xs font-bold text-gray-700 truncate mr-4">{src.title}</span>
                      <ExternalLink size={14} className="text-[#C83C23] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Local Data Sections */}
        <div className="mb-10">
          <h3 className="text-sm text-gray-400 tracking-[0.2em] uppercase mb-4 font-bold border-l-4 border-gray-300 pl-3">字源解析 (本地)</h3>
          <div className="bg-white/60 p-6 rounded-3xl text-lg">{detail.etymology}</div>
        </div>

        <button className="w-full bg-[#1A1A1A] text-white py-6 rounded-[30px] font-bold">
          临摹练习 (会员专享)
        </button>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CharacterDetail;
