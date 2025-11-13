import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, FileText } from 'lucide-react';

function About() {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: 'Comprehensive Library',
      description: 'Access thousands of PYQs, notes, and study materials across all departments'
    },
    {
      icon: <GraduationCap size={32} />,
      title: 'Academic Excellence',
      description: 'Curated resources to help students excel in their examinations'
    },
    {
      icon: <FileText size={32} />,
      title: 'Easy Navigation',
      description: 'Simple and intuitive interface to find exactly what you need'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 px-6 pt-32 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About LastNight PYQs
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Your one-stop platform for accessing previous year question papers, notes, and academic resources. 
            We help students prepare better and achieve their academic goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            We believe every student deserves access to quality academic resources. LastNight PYQs is built by students, 
            for students, to make exam preparation easier and more effective. Our platform continuously grows with 
            contributions from the academic community.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;