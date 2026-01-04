
import React, { useState } from 'react';
import { Camera, Search, Book, User, Clock, Smartphone } from 'lucide-react';
import InkBackground from '../components/InkBackground';
import SyncModal from '../components/SyncModal';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center pb-24">
      <InkBackground />
      
      {/* Header */}
      <div className="w-full px-6 py-12 flex justify-between items-start relative">
        <div className="w-10"></div> {/* Spacer for symmetry */}
        <div className="flex flex-col items-center">
          <div className="text-5xl font-calligraphy mb-2">行草通</div>
          <div className="text-gray-400 text-sm tracking-widest uppercase">Xing Cao Tong</div>
        </div>
        <button 
          onClick={() => setIsSyncModalOpen(true)}
          className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#C83C23] transition-all active:scale-90"
        >
          <Smartphone size={24} />
        </button>
      </div>

      {/* Main Action Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <button 
          onClick={() => onNavigate('camera')}
          className="group relative w-48 h-48 rounded-full bg-[#C83C23] flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-[#C83C23] animate-ping opacity-20"></div>
          <div className="flex flex-col items-center">
            <Camera size={48} className="mb-2" />
            <span className="text-xl font-bold">扫一扫</span>
          </div>
          <div className="absolute inset-[-10px] border border-[#C83C23] border-dashed rounded-full opacity-30 group-hover:rotate-45 transition-transform duration-1000"></div>
        </button>

        <div className="flex gap-8">
          <button 
            onClick={() => onNavigate('dictionary')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C83C23] transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-1">
              <Search size={20} />
            </div>
            <span className="text-sm">查字典</span>
          </button>
          <button 
            onClick={() => onNavigate('browse')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C83C23] transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-1">
              <Book size={20} />
            </div>
            <span className="text-sm">看碑帖</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center text-[#C83C23]">
          <Clock size={20} className="mb-1" />
          <span className="text-xs">首页</span>
        </button>
        <button onClick={() => onNavigate('history')} className="flex flex-col items-center text-gray-400 hover:text-[#C83C23]">
          <Clock size={20} className="mb-1" />
          <span className="text-xs">历史</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center text-gray-400 hover:text-[#C83C23]">
          <User size={20} className="mb-1" />
          <span className="text-xs">我的</span>
        </button>
      </div>

      {/* Quick Access Fab */}
      <button 
        onClick={() => onNavigate('camera')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-[#C83C23] rounded-full shadow-lg flex items-center justify-center text-white md:hidden"
      >
        <Camera size={24} />
      </button>

      {/* Smartphone Sync Modal */}
      {isSyncModalOpen && (
        <SyncModal onClose={() => setIsSyncModalOpen(false)} />
      )}
    </div>
  );
};

export default Home;
