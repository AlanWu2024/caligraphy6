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
    etymology: '暂无本地字源解析，正在尝试联网获取最新学术研究结果...',
    sources: ['正在整理中'],
    meanings: ['加载中']
  };

  useEffect(() => {
    async function fetchWebRefs() {
      setIsSearching(true);
      try {
        const res = await searchCalligraphyWeb(char);
        setWebData(res);
      } catch (e) {
        setWebData({ text: '未能获取在线学术资料，请检查网络。', sources: [] });
      } finally {
        setIsSearching(false);
      }
    }
    fetchWebRefs();
  }, [char]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Fixed Toolbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur-md flex items-center justify-between px-6 z-50 border-b border-black/5">
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
        <div className="bg-white rounded-[40px] aspect-square flex items-center justify-center relative shadow-sm mb-8 overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          <div className="text-[180pt] font-calligraphy leading-none relative z-10 transition-transform group-active:scale-110 duration-500">{char}</div>
          <button className="absolute bottom-8 right-8 w-14 h-14 bg-[#C83C23] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
            <Play fill="white" size={24} />
          </button>
        </div>

        {/* Global Web References Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 border-l-4 border-[#C83C23] pl-3">
            <h3 className="text-sm text-gray-400 tracking-[0.2em] uppercase font-bold">全球学术参考 (AI 实时搜索)</h3>
            <Globe size={14} className="text-blue-400 animate-spin-slow" />
          </div>
          
          <div className="bg-white/60 p-6 rounded-3xl min-h-[100px] border border-white/40">
            {isSearching ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-10 h-10 border-4 border-[#C83C23] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500 font-bold tracking-widest">正在检索国家博物馆数据库...</span>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-gray-700 mb-6 font-medium">
                  {webData.text ? webData.text : "正在获取资料..."}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {webData.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white/80 rounded-2xl hover:bg-white transition-all group border border-transparent hover:border-[#C83C23]/20"
                    >
                      <span className="text-xs font-bold text-gray-800 truncate mr-4">{src.title}</span>
                      <ExternalLink size={14} className="text-[#C83C23] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                  {webData.sources.length === 0 && !isSearching && (
                    <div className="text-xs text-gray-400 text-center py-2 italic">暂无更多参考链接</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Local Data Sections */}
        <div className="mb-10">
          <h3 className="text-sm text-gray-400 tracking-[0.2em] uppercase mb-4 font-bold border-l-4 border-gray-300 pl-3">字源解析</h3>
          <div className="bg-white/60 p-6 rounded-3xl text-lg font-serif leading-relaxed border border-white/40">
            {detail.etymology}
          </div>
        </div>

        <button className="w-full bg-[#1A1A1A] text-white py-6 rounded-[30px] font-bold shadow-xl active:scale-95 transition-all">
          临摹练习 (会员专享)
        </button>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CharacterDetail;