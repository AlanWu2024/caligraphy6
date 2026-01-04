
import React, { useState } from 'react';
import { ChevronRight, Camera, BookOpen, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onFinish: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "欢迎来到行草通",
      subtitle: "让每一笔，都穿越千年",
      desc: "行草通是一款AI驱动的书法识别与学习平台，带你领略中国书法之美。",
      icon: <div className="text-6xl font-calligraphy text-[#C83C23] mb-8">行草</div>
    },
    {
      title: "拍照即识，古今贯通",
      subtitle: "AI辅助深度解析",
      desc: "对准任意草书，AI立即告诉你写的是什么，并为你展示历代名家写法。",
      icon: <Camera size={80} className="text-[#C83C23] mb-8" />
    },
    {
      title: "数据隐私与权限",
      subtitle: "我们重视您的安全",
      desc: "我们需要相机权限来进行拍摄识别。我们承诺照片仅用于识别，不会保存敏感数据。",
      icon: <ShieldCheck size={80} className="text-[#C83C23] mb-8" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F5F5F0] flex flex-col items-center justify-center p-8 z-[100]">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center transition-all duration-500 transform">
          {steps[step].icon}
        </div>
        <h1 className="text-3xl font-bold mb-2">{steps[step].title}</h1>
        <p className="text-[#C83C23] text-lg mb-6">{steps[step].subtitle}</p>
        <p className="text-gray-600 mb-12">{steps[step].desc}</p>

        <div className="flex gap-2 justify-center mb-8">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-[#C83C23]' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-[#C83C23] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#A82C13] transition-colors"
        >
          {step === steps.length - 1 ? '开始探索' : '下一步'}
          <ChevronRight size={20} />
        </button>

        <button 
          onClick={onFinish}
          className="mt-4 text-gray-400 text-sm hover:text-gray-600"
        >
          跳过引导
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
