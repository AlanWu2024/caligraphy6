
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Globe, ExternalLink, BookOpen } from 'lucide-react';
import { CLASSICS_DATA, DYNASTIES } from '../constants';

const EXTERNAL_RESOURCES = [
  { name: '故宫博物院', url: 'https://digicol.dpm.org.cn/', region: '北京' },
  { name: '台北故宫', url: 'https://www.npm.gov.tw/collection/', region: '台北' },
  { name: '大都会艺术博物馆', url: 'https://www.metmuseum.org/art/collection', region: '纽约' },
  { name: '书法迷', url: 'https://www.shufami.com/', region: '数据库' },
  { name: '东京国立博物馆', url: 'https://www.tnm.jp/', region: '东京' },
];

const BrowsePage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState('全部');
  const [view, setView] = useState<'local' | 'web'>('local');

  const filteredData = useMemo(() => {
    return CLASSICS_DATA.filter(item => {
      const matchesSearch = item.title.includes(searchQuery) || item.author.includes(searchQuery);
      const matchesDynasty = selectedDynasty === '全部' || item.dynasty === selectedDynasty;
      return matchesSearch && matchesDynasty;
    });
  }, [searchQuery, selectedDynasty]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-10">
      <div className="sticky top-0 bg-[#F5F5F0]/80 backdrop-blur-lg z-50 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24} /></button>
          <h1 className="text-xl font-bold">看碑帖</h1>
          <div className="w-10"></div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setView('local')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${view === 'local' ? 'bg-white shadow-sm text-[#C83C23]' : 'text-gray-500'}`}
          >
            传世经典
          </button>
          <button 
            onClick={() => setView('web')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${view === 'web' ? 'bg-white shadow-sm text-[#C83C23]' : 'text-gray-500'}`}
          >
            权威馆藏库
          </button>
        </div>

        {view === 'local' && (
          <>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="搜索碑帖或书法家..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-2xl py-4 pl-12 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {DYNASTIES.map(dynasty => (
                <button
                  key={dynasty}
                  onClick={() => setSelectedDynasty(dynasty)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedDynasty === dynasty ? 'bg-[#C83C23] text-white' : 'bg-white text-gray-500'}`}
                >
                  {dynasty}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-6 mt-4">
        {view === 'local' ? (
          <div className="space-y-8">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm">
                <div className="h-56 overflow-hidden">
                  <img src={item.cover} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-[#C83C23] font-bold">{item.dynasty} · {item.author}</div>
                    <div className="text-2xl font-bold font-calligraphy">{item.title}</div>
                  </div>
                  <BookOpen className="text-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-blue-50 rounded-3xl mb-6">
              <p className="text-xs text-blue-600 leading-relaxed font-bold">
                💡 应用已接入全球顶级博物馆 API。点击下方链接可直接访问高清原件数据库。
              </p>
            </div>
            {EXTERNAL_RESOURCES.map((res, i) => (
              <a 
                key={i} 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm hover:ring-2 hover:ring-[#C83C23]/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] flex items-center justify-center text-[#C83C23]">
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{res.name}</div>
                    <div className="text-xs text-gray-400">{res.region} · 官方馆藏</div>
                  </div>
                </div>
                <ExternalLink size={20} className="text-gray-300" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
