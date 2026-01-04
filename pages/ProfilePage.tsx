
import React from 'react';
import { ChevronLeft, Award, Settings, Shield, HelpCircle, ChevronRight } from 'lucide-react';

const ProfilePage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const stats = [
    { label: '识别次数', value: '12' },
    { label: '学习天数', value: '3' },
    { label: '收藏字数', value: '45' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-start mb-10">
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft /></button>
          <button className="p-2 bg-white rounded-full shadow-sm"><Settings size={20} /></button>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img src="https://picsum.photos/seed/user/200/200" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">墨客_2024</h2>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-bold">
              <Award size={10} /> 资深会员
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl text-center shadow-sm">
              <div className="text-xl font-bold mb-1">{s.value}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#C83C23] p-6 rounded-[30px] text-white mb-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <div className="text-lg font-bold mb-1">升级专业版会员</div>
            <div className="text-sm opacity-80">解锁临摹比对与无限识别</div>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="space-y-2">
          {[
            { icon: <Shield size={18} />, label: '隐私设置' },
            { icon: <HelpCircle size={18} />, label: '帮助与反馈' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm active:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="text-gray-400">{item.icon}</div>
                <span className="font-bold">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
