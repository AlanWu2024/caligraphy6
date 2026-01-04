
import React, { useRef, useEffect, useState } from 'react';
import { X, Image as ImageIcon, Zap, Grid, Check, RotateCcw } from 'lucide-react';
import RecognitionFrame from '../components/RecognitionFrame';

interface CameraPageProps {
  onBack: () => void;
  onCapture: (imageData: string) => void;
}

const CameraPage: React.FC<CameraPageProps> = ({ onBack, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("无法访问相机，请检查权限。");
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg');
        setCapturedImage(data);
      }
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between z-50 overflow-hidden">
      {/* Top Controls */}
      <div className="w-full px-6 py-8 flex justify-between items-center z-10">
        <button onClick={onBack} className="text-white p-2">
          <X size={28} />
        </button>
        <div className="text-white/80 text-sm font-medium">正在请教王羲之...</div>
        <button onClick={() => setIsFlashOn(!isFlashOn)} className="text-white p-2">
          <Zap size={24} className={isFlashOn ? 'text-yellow-400' : ''} />
        </button>
      </div>

      {/* Viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Scan Frame */}
        {!capturedImage && (
          <div className="relative z-10 flex flex-col items-center">
            <RecognitionFrame />
            <p className="text-white/70 text-sm mt-6 bg-black/40 px-4 py-1 rounded-full">
              请将书法字对准印章框内
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full px-8 py-12 flex justify-between items-center bg-black/20 backdrop-blur-sm">
        {capturedImage ? (
          <div className="w-full flex justify-around items-center">
            <button 
              onClick={handleRetake}
              className="flex flex-col items-center gap-2 text-white"
            >
              <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center">
                <RotateCcw size={24} />
              </div>
              <span className="text-xs">重拍</span>
            </button>
            <button 
              onClick={handleUsePhoto}
              className="flex flex-col items-center gap-2 text-white"
            >
              <div className="w-20 h-20 rounded-full bg-[#C83C23] flex items-center justify-center shadow-lg">
                <Check size={40} />
              </div>
              <span className="text-sm font-bold">确认识别</span>
            </button>
            <div className="w-14"></div> {/* Spacer */}
          </div>
        ) : (
          <>
            <button className="text-white p-2">
              <ImageIcon size={28} />
            </button>
            <button 
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1"
            >
              <div className="w-full h-full rounded-full bg-white active:bg-red-500 transition-colors"></div>
            </button>
            <button className="text-white p-2">
              <Grid size={28} />
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPage;
