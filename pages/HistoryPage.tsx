
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Search } from 'lucide-react';

interface HistoryPageProps {
  onBack: () => void;
  onItemClick: (char: string, image: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, onItemClick }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('calligraphy_history');
    if (saved) {
      setHistory(JSON.parse(saved).reverse());
    }
  }, []);

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      localStorage.removeItem('calligraphy_history');
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-40 border-b border-gray-100">
        <button onClick={onBack} className="p-2"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold">历史记录</h1>
        <button onClick={clearHistory} className="p-2 text-gray-400"><Trash2 size={20} /></button>
      </div>

      <div className="pt-20 px-6">
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="搜索识别过的字..." 
            className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#C83C23]/20"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📜</div>
            <p>暂无历史记录</p>
            <p className="text-sm">快去扫一扫识别书法吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div 
                key={index}
                onClick={() => onItemClick(item.char, item.image)}
                className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm active:scale-95 transition-transform"
              >
                <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                <div className="flex-1">
                  <div className="text-2xl font-calligraphy">{item.char}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
                <div className="text-[#C83C23] text-sm font-bold">详情</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
