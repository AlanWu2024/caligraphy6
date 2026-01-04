
import React, { useState } from 'react';
import { ChevronLeft, Search, Edit3 } from 'lucide-react';

interface DictionaryPageProps {
  onBack: () => void;
  onSelect: (char: string) => void;
}

const DictionaryPage: React.FC<DictionaryPageProps> = ({ onBack, onSelect }) => {
  const [query, setQuery] = useState('');
  const recommendations = ['之', '和', '天', '下', '道', '书', '墨', '心'];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="px-6 py-8">
        <button onClick={onBack} className="mb-6 p-2 bg-white rounded-full shadow-sm"><ChevronLeft /></button>
        <h1 className="text-3xl font-bold mb-2">查字典</h1>
        <p className="text-gray-400 mb-8">输入汉字，探索千年演变</p>

        <div className="relative mb-10">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入汉字..." 
            className="w-full bg-white border-none rounded-3xl py-5 pl-14 pr-6 text-xl shadow-lg focus:ring-2 focus:ring-[#C83C23]/20"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C83C23]" size={24} />
          {query && (
            <button 
              onClick={() => onSelect(query[0])}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#C83C23] text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              查询
            </button>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-4 tracking-widest">热门推荐</h3>
          <div className="grid grid-cols-4 gap-4">
            {recommendations.map(char => (
              <button 
                key={char}
                onClick={() => onSelect(char)}
                className="bg-white aspect-square rounded-2xl flex items-center justify-center text-2xl font-calligraphy shadow-sm active:bg-[#C83C23] active:text-white transition-colors"
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-[#1A1A1A] rounded-[30px] text-white flex items-center justify-between">
          <div>
            <div className="text-lg font-bold mb-1">手写输入</div>
            <div className="text-xs opacity-50">更符合书法的查询方式</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Edit3 size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryPage;
