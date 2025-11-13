import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

const MOCK_DATA = {
  categories: ['PYQs', 'Notes', 'Others'],
  departments: ['Computer Science', 'Artificial Intelligence', 'Mechanical', 'Civil', 'Electrical', 'Electronics'],
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  years: [2021, 2022, 2023, 2024],
  subjects: {
    2021: ['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks'],
    2022: ['Machine Learning', 'Web Development', 'Algorithms', 'Software Engineering'],
    2023: ['AI Fundamentals', 'Cloud Computing', 'Blockchain', 'IoT'],
    2024: ['Deep Learning', 'DevOps', 'Cybersecurity', 'Mobile Computing']
  }
};

function Home() {
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [showYears, setShowYears] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleSearch = () => {
    if (category && department && semester) {
      setShowYears(true);
      setSelectedYear(null);
    }
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const resetSearch = () => {
    setCategory('');
    setDepartment('');
    setSemester('');
    setShowYears(false);
    setSelectedYear(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center px-6 pt-24 pb-12">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Find Your Resources
          </h1>
          <p className="text-gray-400 text-lg">Select your requirements to discover academic materials</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showYears ? (
            <motion.div
              key="filters"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 space-y-6"
            >
              <div>
                <label className="block text-gray-300 mb-3 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {MOCK_DATA.categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-semibold">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {MOCK_DATA.departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-semibold">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {MOCK_DATA.semesters.map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={!category || !department || !semester}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search Resources
              </motion.button>
            </motion.div>
          ) : selectedYear === null ? (
            <motion.div
              key="years"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                <p className="text-gray-400 mb-2">
                  {category} • {department} • Semester {semester}
                </p>
                <h2 className="text-2xl font-bold text-white mb-6">Select Year</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MOCK_DATA.years.map((year) => (
                    <motion.button
                      key={year}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleYearClick(year)}
                      className="p-6 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-2xl"
                    >
                      {year}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                <p className="text-gray-400 mb-2">
                  {category} • {department} • Semester {semester} • {selectedYear}
                </p>
                <h2 className="text-2xl font-bold text-white mb-6">Available Subjects</h2>
                <div className="space-y-3">
                  {MOCK_DATA.subjects[selectedYear].map((subject, idx) => (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-purple-400" size={20} />
                        <span className="text-white font-medium">{subject}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download PDF
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedYear(null)}
                className="w-full py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-blue-500 font-semibold"
              >
                ← Back to Years
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;