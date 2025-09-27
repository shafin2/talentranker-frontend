import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CloudArrowUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Upload Job Description',
      description: 'Simply paste or upload your job requirements and let our AI understand what you\'re looking for with precision.',
      step: 1,
      gradient: 'from-primary-500 to-primary-700'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Upload CVs',
      description: 'Bulk upload candidate resumes in PDF format. Our system processes and analyzes them instantly.',
      step: 2,
      gradient: 'from-accent-500 to-accent-700'
    },
    {
      icon: ChartBarIcon,
      title: 'Get Ranked Candidates',
      description: 'Receive comprehensive rankings with match scores, detailed analysis, and actionable insights for each candidate.',
      step: 3,
      gradient: 'from-success-500 to-success-700'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.8
      }
    }
  };

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-80 right-10 w-40 h-40 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-success-200 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold mb-6"
          >
            ⚡ How It Works
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
          >
            Three Steps to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Perfect Hiring
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your recruitment process with our intelligent automation. 
            From job posting to perfect candidate match in minutes.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.1)"
                }}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-gray-700">{feature.step}</span>
                </div>

                {/* Icon Container */}
                <div className="relative mb-8">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                    whileHover={{ 
                      rotate: 5,
                      scale: 1.1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Animated Ring */}
                  <motion.div
                    className={`absolute inset-0 w-20 h-20 border-4 border-transparent bg-gradient-to-r ${feature.gradient} rounded-2xl mx-auto opacity-0 group-hover:opacity-30`}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ maskComposite: 'subtract' }}
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="text-4xl">🎯</div>
            <div className="text-left">
              <div className="text-lg font-bold text-gray-900">Ready to transform your hiring?</div>
              <div className="text-gray-600">Join thousands of companies already using TalentRanker</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
