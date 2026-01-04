
import React from 'react';
import { X, Smartphone, Info, ExternalLink } from 'lucide-react';

interface SyncModalProps {
  onClose: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ onClose }) => {
  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-16 h-16 bg-[#F5F5F0] rounded-3xl flex items-center justify-center text-[#C83C23] mb-6">
          <Smartphone size={32} />
        </div>

        <h2 className="text-xl font-bold mb-2">在手机上使用</h2>
        <p className="text-gray-400 text-sm text-center mb-8">扫描二维码，随时随地开启识别</p>

        {/* QR Code Frame */}
        <div className="relative p-4 bg-white border-2 border-dashed border-[#C83C23]/20 rounded-3xl mb-8">
          <img 
            src={qrUrl} 
            alt="Scan to sync" 
            className="w-48 h-48 rounded-xl"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            style={{ opacity: 0, transition: 'opacity 0.5s' }}
          />
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C83C23]"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C83C23]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C83C23]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C83C23]"></div>
        </div>

        {/* Instructions */}
        <div className="w-full space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#F5F5F0] rounded-2xl">
            <Info size={18} className="text-[#C83C23] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-700">重要提示：</span><br />
              iOS 用户请使用 <span className="text-blue-600">Safari</span>，Android 用户请使用 <span className="text-blue-600">Chrome</span> 打开，并允许浏览器访问相机。
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[#C83C23] text-xs font-bold py-2">
            <ExternalLink size={14} />
            <span>{currentUrl.substring(0, 30)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
