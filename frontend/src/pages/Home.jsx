import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Loader2, AlertCircle, Calendar, BookOpen, GraduationCap, Eye, X, Search } from 'lucide-react';
import { getSubjectsByDepartmentAndSemester } from '../utils/departmentSubjects';
import { papersAPI } from '../utils/api';

const MOCK_DATA = {
  departments: ['Computer Engineering', 'Computer Science and Engineering (Data Science)', 'Information Technology', 'Artificial Intelligence and Data Science', 'Electronics and Telecommunication Engineering', 'Civil Engineering', 'Mechanical Engineering'],
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  years: [2021, 2022, 2023, 2024, 2025],
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
  const [previewPaper, setPreviewPaper] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPapers, setTotalPapers] = useState(0);

  const handleSearch = async (pageNum = 1) => {
    if (department && semester && year && subject) {
      setLoading(true);
      setError('');
      setShowResults(true);
      setCurrentPage(pageNum);
      
      try {
        const response = await papersAPI.getFilteredPapers({
          department,
          semester,
          year,
          subject
        }, pageNum, 12);
        
        const papersData = response.data.papers || [];
        setPapers(papersData);
        setTotalPages(response.data.totalPages || 1);
        setTotalPapers(response.data.totalCount || 0);
        
        if (papersData.length === 0) {
          setError('No papers found matching your criteria.');
        } else {
          setError('');
        }
      } catch (err) {
        setError(err.isConnectionError 
          ? 'Backend server is not running. Please start the backend server.'
          : err.response?.data?.message || 'Failed to fetch papers. Please try again.'
        );
        setPapers([]);
        setTotalPages(1);
        setTotalPapers(0);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async (paperId, subjectName, year) => {
    try {
      const response = await papersAPI.download(paperId, subjectName, year);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${subjectName.replace(/[^a-z0-9]/gi, '_')}_${year}_paper.pdf`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
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
    setCurrentPage(1);
    setTotalPages(1);
    setTotalPapers(0);
  };

  const handlePreview = (paper) => {
    setPreviewPaper(paper);
  };

  const closePreview = () => {
    setPreviewPaper(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #0f1629 50%, #151b2e 100%)' }}>
      {/* Animated background elements */}
      <div className="bg-pattern"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 pt-24 pb-12 min-h-screen">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-6xl md:text-7xl font-display mb-6 text-gradient-cyan"
              style={{ textShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}
            >
              LastNight PYQs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-[#94a3b8] font-light tracking-wide"
            >
              Discover academic resources with precision
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="filters"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-elevated rounded-3xl p-10 space-y-8 shadow-2xl"
              >
                {/* Department */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all cursor-pointer hover:border-[#06b6d4]/50 bg-[rgba(15,22,41,0.6)]"
                  >
                    <option value="" className="bg-[#0f1629]">Select Department</option>
                    {MOCK_DATA.departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#0f1629]">{dept}</option>
                    ))}
                  </select>
                </motion.div>

                {/* Semester & Year Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => {
                        setSemester(e.target.value);
                        setSubject('');
                      }}
                      disabled={!department}
                      className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all cursor-pointer hover:border-[#06b6d4]/50 disabled:opacity-40 disabled:cursor-not-allowed bg-[rgba(15,22,41,0.6)]"
                    >
                      <option value="" className="bg-[#0f1629]">Select Semester</option>
                      {MOCK_DATA.semesters.map((sem) => (
                        <option key={sem} value={sem} className="bg-[#0f1629]">Semester {sem}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all cursor-pointer hover:border-[#06b6d4]/50 bg-[rgba(15,22,41,0.6)]"
                    >
                      <option value="" className="bg-[#0f1629]">Select Year</option>
                      {MOCK_DATA.years.map((yr) => (
                        <option key={yr} value={yr} className="bg-[#0f1629]">{yr}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!semester || !department}
                    className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#06b6d4]/50 bg-[rgba(15,22,41,0.6)]"
                  >
                    <option value="" className="bg-[#0f1629]">
                      {!department ? 'Select Department First' : !semester ? 'Select Semester First' : 'Select Subject'}
                    </option>
                    {semester && department && getSubjectsByDepartmentAndSemester(department, parseInt(semester)).map((subj) => (
                      <option key={subj} value={subj} className="bg-[#0f1629]">{subj}</option>
                    ))}
                  </select>
                  {(!department || !semester) && (
                    <p className="text-[#64748b] text-sm mt-2 font-mono">
                      {!department ? '→ Select department first' : '→ Select semester first'}
                    </p>
                  )}
                </motion.div>

                {/* Search Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={!department || !semester || !year || !subject}
                  className="w-full py-5 rounded-xl font-display text-lg font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #0ea5e9 100%)',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Search size={20} />
                    Search Papers
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="glass-elevated rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3 flex-wrap text-sm text-[#94a3b8] font-mono">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[#06b6d4]/20">
                          <GraduationCap size={14} className="text-[#06b6d4]" /> {department}
                        </span>
                        <span className="text-[#64748b]">•</span>
                        <span className="px-3 py-1.5 rounded-lg glass border border-[#06b6d4]/20">Sem {semester}</span>
                        <span className="text-[#64748b]">•</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[#06b6d4]/20">
                          <Calendar size={14} className="text-[#06b6d4]" /> {year}
                        </span>
                        <span className="text-[#64748b]">•</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-[#06b6d4]/20">
                          <BookOpen size={14} className="text-[#06b6d4]" /> {subject}
                        </span>
                      </div>
                      <h2 className="text-3xl font-display text-gradient-cyan">
                        Available Papers {totalPapers > 0 && <span className="text-[#94a3b8] font-normal">({totalPapers})</span>}
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetSearch}
                      className="px-6 py-3 rounded-xl glass border border-[#06b6d4]/30 text-[#06b6d4] text-sm font-semibold hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all font-mono"
                    >
                      Change Filters
                    </motion.button>
                  </div>
                  
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="animate-spin text-[#06b6d4] mb-4" size={48} />
                      <p className="text-[#94a3b8] font-mono">Loading papers...</p>
                    </div>
                  )}

                  {error && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4 font-mono"
                    >
                      <AlertCircle size={20} />
                      <p>{error}</p>
                    </motion.div>
                  )}

                  {!loading && papers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {papers.map((paper, idx) => (
                        <motion.div
                          key={paper._id || idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(6, 182, 212, 0.2)' }}
                          className="glass rounded-2xl p-6 border border-[#06b6d4]/20 hover:border-[#06b6d4]/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-4 mb-5">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#14b8a6]/20 border border-[#06b6d4]/30 group-hover:scale-110 transition-transform">
                              <FileText className="text-[#06b6d4]" size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-[#06b6d4] transition-colors">
                                {paper.subject}
                              </h3>
                              <p className="text-[#64748b] text-sm font-mono">{paper.department}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-5 text-sm text-[#94a3b8]">
                            <div className="flex items-center gap-2">
                              <span className="text-[#64748b] font-mono">Sem:</span>
                              <span>Semester {paper.semester}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-[#64748b]" />
                              <span>{paper.year}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePreview(paper)}
                              className="flex-1 py-2.5 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] font-semibold flex items-center justify-center gap-2 hover:bg-[#06b6d4]/20 transition-all text-sm"
                            >
                              <Eye size={16} />
                              Preview
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownload(paper._id, paper.subject, paper.year)}
                              className="flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm text-white"
                              style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                              }}
                            >
                              <Download size={16} />
                              Download
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!loading && papers.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#06b6d4]/20">
                      <div className="text-[#64748b] text-sm font-mono">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg glass border border-[#06b6d4]/30 text-[#06b6d4] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#06b6d4] text-sm font-mono"
                        >
                          Prev
                        </motion.button>
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else if (currentPage <= 3) {
                            pageNum = idx + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                          } else {
                            pageNum = currentPage - 2 + idx;
                          }
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSearch(pageNum)}
                              className={`px-4 py-2 rounded-lg border text-sm font-mono ${
                                currentPage === pageNum
                                  ? 'bg-[#06b6d4] border-[#06b6d4] text-white'
                                  : 'glass border-[#06b6d4]/30 text-[#06b6d4] hover:border-[#06b6d4]'
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg glass border border-[#06b6d4]/30 text-[#06b6d4] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#06b6d4] text-sm font-mono"
                        >
                          Next
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {!loading && !error && papers.length === 0 && (
                    <div className="text-center py-16">
                      <FileText className="text-[#64748b] mx-auto mb-4" size={64} />
                      <p className="text-[#94a3b8] text-lg mb-2">No papers found</p>
                      <p className="text-[#64748b] text-sm font-mono">
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

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-elevated rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col border border-[#06b6d4]/30"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#06b6d4]/20">
                <div>
                  <h3 className="text-white font-display text-xl mb-1">{previewPaper.subject}</h3>
                  <p className="text-[#94a3b8] text-sm font-mono">{previewPaper.department} • Sem {previewPaper.semester} • {previewPaper.year}</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(previewPaper._id, previewPaper.subject, previewPaper.year)}
                    className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm text-white"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    }}
                  >
                    <Download size={16} />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closePreview}
                    className="p-2 rounded-lg glass border border-[#06b6d4]/30 text-[#06b6d4] hover:border-[#06b6d4]"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`${previewPaper.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
