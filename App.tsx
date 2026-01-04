
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import CameraPage from './pages/CameraPage';
import RecognitionResult from './pages/RecognitionResult';
import CharacterDetail from './pages/CharacterDetail';
import HistoryPage from './pages/HistoryPage';
import DictionaryPage from './pages/DictionaryPage';
import BrowsePage from './pages/BrowsePage';
import ProfilePage from './pages/ProfilePage';
import { recognizeCalligraphy } from './geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognitionResults, setRecognitionResults] = useState<any[]>([]);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding) {
      setIsFirstTime(false);
    }
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsFirstTime(false);
  };

  const saveToHistory = (char: string, image: string) => {
    const history = JSON.parse(localStorage.getItem('calligraphy_history') || '[]');
    const newItem = {
      char,
      image,
      timestamp: Date.now(),
    };
    history.push(newItem);
    // Keep only last 50
    const updated = history.slice(-50);
    localStorage.setItem('calligraphy_history', JSON.stringify(updated));
  };

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setLoading(true);
    setCurrentPage('loading');
    
    try {
      const result = await recognizeCalligraphy(imageData);
      const results = result.results || [];
      setRecognitionResults(results);
      
      if (results.length > 0) {
        saveToHistory(results[0].char, imageData);
      }
      
      setCurrentPage('result');
    } catch (err) {
      console.error(err);
      setCurrentPage('error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetail = (char: string) => {
    setSelectedChar(char);
    setCurrentPage('detail');
  };

  const handleHistoryItemClick = (char: string, image: string) => {
    setCapturedImage(image);
    setSelectedChar(char);
    // Directly go to result or detail? Let's go to detail
    navigateToDetail(char);
  };

  if (isFirstTime) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <div className="relative min-h-screen">
      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      
      {currentPage === 'camera' && (
        <CameraPage 
          onBack={() => setCurrentPage('home')} 
          onCapture={handleCapture}
        />
      )}

      {currentPage === 'history' && (
        <HistoryPage 
          onBack={() => setCurrentPage('home')}
          onItemClick={handleHistoryItemClick}
        />
      )}

      {currentPage === 'dictionary' && (
        <DictionaryPage 
          onBack={() => setCurrentPage('home')}
          onSelect={navigateToDetail}
        />
      )}

      {currentPage === 'browse' && (
        <BrowsePage onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'profile' && (
        <ProfilePage onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'loading' && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[60] text-white">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 border-4 border-[#C83C23] rounded-full animate-ping opacity-25"></div>
            <div className="absolute inset-0 border-4 border-t-[#C83C23] border-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-[#C83C23] rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl font-bold tracking-widest animate-pulse">正在请教王羲之...</p>
          <p className="mt-4 text-white/40">翻阅千年碑帖中</p>
        </div>
      )}

      {currentPage === 'result' && capturedImage && (
        <RecognitionResult 
          image={capturedImage}
          results={recognitionResults}
          onBack={() => setCurrentPage('home')}
          onCharacterClick={navigateToDetail}
        />
      )}

      {currentPage === 'detail' && selectedChar && (
        <CharacterDetail 
          char={selectedChar} 
          onBack={() => {
            // If we came from history or dictionary, go back there, otherwise result
            if (recognitionResults.length > 0) setCurrentPage('result');
            else setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'error' && (
        <div className="fixed inset-0 bg-[#F5F5F0] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-6">🏮</div>
          <h2 className="text-2xl font-bold mb-2">这幅字太过洒脱</h2>
          <p className="text-gray-500 mb-8">容我再参详参详... 识别失败了，请检查网络或更换清晰照片。</p>
          <button 
            onClick={() => setCurrentPage('camera')}
            className="w-full bg-[#C83C23] text-white py-4 rounded-xl font-bold"
          >
            重新拍摄
          </button>
          <button 
            onClick={() => setCurrentPage('home')}
            className="mt-4 text-gray-400"
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
