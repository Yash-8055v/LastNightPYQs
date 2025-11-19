import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Loader2, AlertCircle, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { getSubjectsBySemester } from '../utils/subjectsData';
import { papersAPI } from '../utils/api';

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
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (department && semester && year && subject) {
      setLoading(true);
      setError('');
      setShowResults(true);
      
      try {
        const response = await papersAPI.getFilteredPapers({
          department,
          semester,
          year,
          subject
        });
        
        // Handle both new format (with papers array) and old format (direct array)
        const papersData = response.data.papers || (Array.isArray(response.data) ? response.data : []);
        setPapers(papersData);
        
        if (papersData.length === 0) {
          setError('No papers found matching your criteria.');
        } else {
          setError(''); // Clear error if papers found
        }
      } catch (err) {
        setError(err.isConnectionError 
          ? 'Backend server is not running. Please start the backend server.'
          : err.response?.data?.message || 'Failed to fetch papers. Please try again.'
        );
        setPapers([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async (paperId, subjectName, year) => {
    try {
      // Download through backend proxy - this avoids CORS and Cloudinary issues
      const response = await papersAPI.download(paperId, subjectName, year);
      
      // Check if response has data
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Verify blob size
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${subjectName.replace(/[^a-z0-9]/gi, '_')}_${year}_paper.pdf`;
      link.style.display = 'none';
      
      // Append to body, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
    } catch (err) {
      console.error('Download failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      const errorDetails = err.response?.data?.error || '';
      alert(`Failed to download PDF: ${errorMessage}${errorDetails ? `\n\nDetails: ${errorDetails}` : ''}`);
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
                    <p className="text-gray-400 mb-2 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <GraduationCap size={16} /> {department}
                      </span>
                      <span>•</span>
                      <span>Semester {semester}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> {year}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={16} /> {subject}
                      </span>
                    </p>
                    <h2 className="text-2xl font-bold text-white">
                      Available Papers {papers.length > 0 && `(${papers.length})`}
                    </h2>
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
                
                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
                    <p className="text-gray-400">Loading papers...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 mb-4"
                  >
                    <AlertCircle size={20} />
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Papers Grid - Card Layout */}
                {!loading && papers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {papers.map((paper, idx) => (
                      <motion.div
                        key={paper._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-900/50 border border-gray-700 rounded-xl p-5 hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <FileText className="text-purple-400" size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                              {paper.subject}
                            </h3>
                            <p className="text-gray-400 text-sm">{paper.department}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <GraduationCap size={16} className="text-gray-500" />
                            <span>{paper.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-gray-500">Sem:</span>
                            <span>Semester {paper.semester}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar size={16} className="text-gray-500" />
                            <span>{paper.year}</span>
                          </div>
                          {paper.createdAt && (
                            <div className="text-xs text-gray-500 mt-2">
                              Uploaded: {new Date(paper.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownload(paper._id, paper.subject, paper.year)}
                          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                          <Download size={18} />
                          Download PDF
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && papers.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="text-gray-600 mx-auto mb-4" size={64} />
                    <p className="text-gray-400 text-lg mb-2">No papers found</p>
                    <p className="text-gray-500 text-sm">
                      Try adjusting your filters or upload a new paper as admin.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;