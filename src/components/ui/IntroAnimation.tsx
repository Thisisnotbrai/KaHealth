import { useState, useEffect } from 'react';

const IntroAnimation = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400">
      {/* Simple floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🏥', '⚕️', '💊', '🩺'].map((icon, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-pulse"
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="text-center px-6 animate-fade-in">
        {/* Logo */}
        <div className="mb-6 animate-bounce-slow">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl animate-pulse">🏥</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4 tracking-wide drop-shadow-lg">
          KaHealth
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-white/90 mb-8 font-medium">
          Your Health, Our Priority
        </p>

        {/* Simple loading dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto mb-4">
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <p className="text-white/80 text-sm font-medium">
          {progress < 100 ? 'Loading Health System...' : 'Ready!'}
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;