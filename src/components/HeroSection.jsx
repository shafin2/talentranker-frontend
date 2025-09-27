import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  StarIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/solid';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const floatingElementVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden cursor-fancy"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-success rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-32 left-20 text-primary-300"
        variants={floatingElementVariants}
        animate="animate"
        style={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
      >
        <RocketLaunchIcon className="w-12 h-12" />
      </motion.div>
      
      <motion.div
        className="absolute top-64 right-32 text-accent-300"
        variants={floatingElementVariants}
        animate="animate"
        style={{
          x: mousePosition.x * -0.03,
          y: mousePosition.y * -0.02,
        }}
      >
        <StarIcon className="w-10 h-10" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-20 text-success-300"
        variants={floatingElementVariants}
        animate="animate"
        style={{
          x: mousePosition.x * 0.025,
          y: mousePosition.y * -0.025,
        }}
      >
        <ChartBarIcon className="w-14 h-14" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 mb-8"
          >
            <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-gray-700 font-semibold">Trusted by 10,000+ HR professionals</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight"
          >
            Rank Candidates{' '}
            <motion.span
              className="bg-gradient-primary bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              10x Faster
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed"
          >
            Transform your hiring process with AI-powered candidate ranking. 
            Upload job descriptions & resumes, get instant intelligent rankings.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            Stop spending hours manually screening resumes. Our advanced AI analyzes, 
            scores, and ranks candidates in seconds, not hours.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/auth">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl relative overflow-hidden transform transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <RocketLaunchIcon className="w-6 h-6 mr-2" />
                  Start Free Trial
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-primary-500 text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/50"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto"
          >
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-2">10x</div>
              <div className="text-gray-600 font-semibold">Faster Hiring</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-success-600 mb-2">98%</div>
              <div className="text-gray-600 font-semibold">Accuracy Rate</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-accent-600 mb-2">24/7</div>
              <div className="text-gray-600 font-semibold">Available</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-2">5s</div>
              <div className="text-gray-600 font-semibold">Per Resume</div>
            </div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-6xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Senior Developer Position</h3>
                    <p className="text-gray-600">156 candidates analyzed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-success-600">
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-semibold">Completed in 2 minutes</span>
                </div>
              </div>

              {/* Ranking Cards */}
              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', score: 98, match: 'Perfect Match', color: 'success' },
                  { name: 'Michael Chen', score: 94, match: 'Excellent Fit', color: 'primary' },
                  { name: 'Emma Wilson', score: 89, match: 'Great Candidate', color: 'accent' },
                ].map((candidate, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 1 }}
                    className={`flex items-center justify-between p-6 bg-gradient-to-r from-${candidate.color}-50 to-white rounded-2xl border-l-4 border-${candidate.color}-500 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${candidate.color}-100 rounded-full flex items-center justify-center`}>
                        <span className={`text-${candidate.color}-600 font-bold text-lg`}>#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{candidate.name}</h4>
                        <p className={`text-${candidate.color}-600 font-semibold`}>{candidate.match}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold text-${candidate.color}-600`}>
                        {candidate.score}%
                      </div>
                      <CheckCircleIcon className={`w-8 h-8 text-${candidate.color}-500`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-success rounded-full opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
