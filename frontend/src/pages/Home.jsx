import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { getSubjectsBySemester } from '../utils/subjectsData';

const MOCK_DATA = {
  departments: ['Computer Science', 'Artificial Intelligence', 'Mechanical', 'Civil', 'Electrical', 'Electronics'],
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  years: [2021, 2022, 2023, 2024],
};

function Home() {
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (department && semester && year && subject) {
      setShowResults(true);
      // TODO: Fetch papers from API with filters
    }
  };

  const resetSearch = () => {
    setDepartment('');
    setSemester('');
    setYear('');
    setSubject('');
    setShowResults(false);
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
          {!showResults ? (
            <motion.div
              key="filters"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 space-y-6"
            >
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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-3 font-semibold">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => {
                      setSemester(e.target.value);
                      setSubject(''); // Reset subject when semester changes
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Semester</option>
                    {MOCK_DATA.semesters.map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-3 font-semibold">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    {MOCK_DATA.years.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-3 font-semibold">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!semester}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {semester ? 'Select Subject' : 'Select Semester First'}
                  </option>
                  {semester && getSubjectsBySemester(parseInt(semester)).map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
                {!semester && (
                  <p className="text-gray-500 text-sm mt-1">Please select semester first</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={!department || !semester || !year || !subject}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search Papers
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 mb-2">
                      {department} • Semester {semester} • {year} • {subject}
                    </p>
                    <h2 className="text-2xl font-bold text-white">Available Papers</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetSearch}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold"
                  >
                    Change Filters
                  </motion.button>
                </div>
                
                {/* Results will be displayed here after API integration */}
                <div className="space-y-3">
                  <div className="text-center text-gray-400 py-8">
                    <p>Papers will appear here after API integration</p>
                    <p className="text-sm mt-2">Filters: Department={department}, Semester={semester}, Year={year}, Subject={subject}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;