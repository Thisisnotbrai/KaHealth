"use client";

import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #3282b8 30%, #4fb3d9 60%, #5dade2 100%)"
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Medical Cross Pattern */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 sm:w-32 sm:h-32"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 12)}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: i * 0.3, duration: 1.5 }}
            >
              <div className="w-full h-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-20 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-8 bg-white rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Health Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { icon: "🏥", delay: 0.8, x: "10%", y: "20%" },
            { icon: "⚕️", delay: 1.4, x: "85%", y: "15%" },
            { icon: "💊", delay: 2.0, x: "15%", y: "75%" },
            { icon: "🩺", delay: 2.6, x: "80%", y: "70%" },
            { icon: "❤️", delay: 3.2, x: "50%", y: "10%" },
            { icon: "🧬", delay: 3.8, x: "90%", y: "45%" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl sm:text-4xl opacity-30"
              style={{ left: item.x, top: item.y }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                y: 50
              }}
              animate={{ 
                opacity: 0.3, 
                scale: 1,
                y: 0
              }}
              transition={{ 
                delay: item.delay, 
                duration: 1.2,
                ease: "easeOut"
              }}
            >
              <motion.span
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {item.icon}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Main Content Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.6, 
            ease: "easeOut",
            delay: 0.6
          }}
        >
          {/* Main Logo/Icon */}
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.4, 
              delay: 1.2,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
              <motion.span 
                className="text-3xl sm:text-5xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🏥
              </motion.span>
            </div>
          </motion.div>

          {/* Main Text */}
          <motion.div
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-widest text-white mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.span
              className="inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              KaHealth
            </motion.span>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="text-lg sm:text-xl lg:text-2xl font-medium text-white/90 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            Your Health, Our Priority
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
            />
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-6 sm:mt-8 w-48 sm:w-64 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                delay: 2.5, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            className="mt-4 text-sm sm:text-base text-white/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.5 }}
          >
            Initializing Health System...
          </motion.div>
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.1, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroAnimation;