import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, FolderOpen, TrendingUp, FileText, Sparkles } from 'lucide-react';
import { papersAPI } from '../utils/api';
import { getSubjectsByDepartmentAndSemester } from '../utils/departmentSubjects';

const MOCK_DATA = {
  departments: ['Computer Engineering', 'Computer Science and Engineering (Data Science)', 'Information Technology', 'Artificial Intelligence and Data Science', 'Electronics and Telecommunication Engineering', 'Civil Engineering', 'Mechanical Engineering'],
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  years: [2021, 2022, 2023, 2024, 2025],
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    department: '',
    semester: '',
    year: '',
    subject: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPDFs: 0,
    totalDownloads: 0,
    thisMonthUploads: 0,
    recentUploads: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await papersAPI.getStats();
      setStats({
        totalPDFs: response.data.totalPdfs || 0,
        totalDownloads: response.data.totalDownloads || 0,
        thisMonthUploads: response.data.thisMonthUploads || 0,
        recentUploads: response.data.recentUploads || []
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.semester || !formData.year || !formData.subject || !formData.file) {
      setError('Please fill all fields');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('pdf', formData.file);
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('department', formData.department);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('year', formData.year);

      const response = await papersAPI.upload(uploadFormData);

      if (response.data.message) {
        setSuccess(true);
        setFormData({
          department: '',
          semester: '',
          year: '',
          subject: '',
          file: null
        });
        
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';

        fetchStats();
        
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #0f1629 50%, #151b2e 100%)' }}>
      {/* Animated background */}
      <div className="bg-pattern"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-12"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 px-6 pt-32 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-display mb-6 text-gradient-cyan"
              style={{ textShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-[#94a3b8] font-light tracking-wide"
            >
              Manage and monitor platform resources
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-10">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('overview')}
              className={`px-8 py-4 rounded-xl font-display font-semibold transition-all relative overflow-hidden ${
                activeTab === 'overview'
                  ? 'text-white'
                  : 'glass border border-[#06b6d4]/30 text-[#06b6d4] hover:border-[#06b6d4]'
              }`}
              style={activeTab === 'overview' ? {
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #0ea5e9 100%)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
              } : {}}
            >
              <div className="flex items-center gap-2 relative z-10">
                <BarChart3 size={20} />
                <span>Overview</span>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('upload')}
              className={`px-8 py-4 rounded-xl font-display font-semibold transition-all relative overflow-hidden ${
                activeTab === 'upload'
                  ? 'text-white'
                  : 'glass border border-[#06b6d4]/30 text-[#06b6d4] hover:border-[#06b6d4]'
              }`}
              style={activeTab === 'upload' ? {
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #0ea5e9 100%)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
              } : {}}
            >
              <div className="flex items-center gap-2 relative z-10">
                <Upload size={20} />
                <span>Upload Resource</span>
              </div>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass-elevated rounded-2xl p-8 border border-[#06b6d4]/30 hover:border-[#06b6d4]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#14b8a6]/20 border border-[#06b6d4]/30 group-hover:scale-110 transition-transform">
                        <FolderOpen size={28} className="text-[#06b6d4]" />
                      </div>
                      <TrendingUp size={20} className="text-[#06b6d4]" />
                    </div>
                    <h3 className="text-4xl font-display text-white mb-2">{stats.totalPDFs}</h3>
                    <p className="text-[#94a3b8] text-sm font-mono uppercase tracking-wider">Total PDFs Uploaded</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass-elevated rounded-2xl p-8 border border-[#8b5cf6]/30 hover:border-[#8b5cf6]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#a78bfa]/20 border border-[#8b5cf6]/30 group-hover:scale-110 transition-transform">
                        <FileText size={28} className="text-[#8b5cf6]" />
                      </div>
                      <TrendingUp size={20} className="text-[#8b5cf6]" />
                    </div>
                    <h3 className="text-4xl font-display text-white mb-2">{stats.totalDownloads.toLocaleString()}</h3>
                    <p className="text-[#94a3b8] text-sm font-mono uppercase tracking-wider">Total Downloads</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass-elevated rounded-2xl p-8 border border-[#f59e0b]/30 hover:border-[#f59e0b]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/20 border border-[#f59e0b]/30 group-hover:scale-110 transition-transform">
                        <Upload size={28} className="text-[#f59e0b]" />
                      </div>
                      <TrendingUp size={20} className="text-[#f59e0b]" />
                    </div>
                    <h3 className="text-4xl font-display text-white mb-2">{stats.thisMonthUploads}</h3>
                    <p className="text-[#94a3b8] text-sm font-mono uppercase tracking-wider">This Month's Uploads</p>
                  </motion.div>
                </div>

                {/* Recent Uploads */}
                {loadingStats ? (
                  <div className="text-center text-[#94a3b8] py-16 font-mono">Loading stats...</div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-elevated rounded-3xl p-8 border border-[#06b6d4]/30"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-[#06b6d4]" size={24} />
                      <h3 className="text-2xl font-display text-white">Recent Uploads</h3>
                    </div>
                    <div className="space-y-3">
                      {stats.recentUploads.length > 0 ? (
                        stats.recentUploads.map((paper, idx) => {
                          const uploadDate = new Date(paper.createdAt);
                          const timeAgo = getTimeAgo(uploadDate);
                          
                          return (
                            <motion.div
                              key={paper._id || idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              whileHover={{ x: 5, borderColor: 'rgba(6, 182, 212, 0.5)' }}
                              className="flex items-center justify-between p-5 rounded-xl glass border border-[#06b6d4]/20 hover:border-[#06b6d4]/40 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/30">
                                  <FileText className="text-[#06b6d4]" size={20} />
                                </div>
                                <div>
                                  <p className="text-white font-semibold mb-1">New PDF uploaded</p>
                                  <p className="text-[#94a3b8] text-sm font-mono">
                                    {paper.subject} • Sem {paper.semester} • {paper.department}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[#64748b] text-sm font-mono">{timeAgo}</span>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-center text-[#64748b] py-12 font-mono">No recent uploads</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-elevated rounded-3xl p-10 border border-[#06b6d4]/30 shadow-2xl"
                >
                  <div className="space-y-8">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center font-mono"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => {
                          setFormData({ ...formData, department: e.target.value, semester: '', subject: '' });
                        }}
                        className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all bg-[rgba(15,22,41,0.6)]"
                      >
                        <option value="" className="bg-[#0f1629]">Select Department</option>
                        {MOCK_DATA.departments.map((dept) => (
                          <option key={dept} value={dept} className="bg-[#0f1629]">{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                          Semester
                        </label>
                        <select
                          value={formData.semester}
                          onChange={(e) => {
                            setFormData({ ...formData, semester: e.target.value, subject: '' });
                          }}
                          disabled={!formData.department}
                          className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[rgba(15,22,41,0.6)]"
                        >
                          <option value="" className="bg-[#0f1629]">Select</option>
                          {MOCK_DATA.semesters.map((sem) => (
                            <option key={sem} value={sem} className="bg-[#0f1629]">Semester {sem}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                          Year
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all bg-[rgba(15,22,41,0.6)]"
                        >
                          <option value="" className="bg-[#0f1629]">Select</option>
                          {MOCK_DATA.years.map((year) => (
                            <option key={year} value={year} className="bg-[#0f1629]">{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        disabled={!formData.semester || !formData.department}
                        className="w-full px-5 py-4 rounded-xl glass border border-[#06b6d4]/30 text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[rgba(15,22,41,0.6)]"
                      >
                        <option value="" className="bg-[#0f1629]">
                          {!formData.department ? 'Select Department First' : !formData.semester ? 'Select Semester First' : 'Select Subject'}
                        </option>
                        {formData.semester && formData.department && getSubjectsByDepartmentAndSemester(formData.department, parseInt(formData.semester)).map((subject) => (
                          <option key={subject} value={subject} className="bg-[#0f1629]">{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#06b6d4] mb-4 font-semibold text-sm uppercase tracking-wider font-mono">
                        Upload PDF
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center gap-3 w-full px-6 py-12 rounded-xl glass border-2 border-dashed border-[#06b6d4]/30 hover:border-[#06b6d4] cursor-pointer transition-all group"
                        >
                          <Upload className="text-[#06b6d4] group-hover:scale-110 transition-transform" size={28} />
                          <span className="text-[#94a3b8] font-mono">
                            {formData.file ? formData.file.name : 'Click to upload PDF'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={uploading || !formData.department || !formData.semester || !formData.year || !formData.subject || !formData.file}
                      className="w-full py-5 rounded-xl font-display text-lg font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #0ea5e9 100%)',
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {uploading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={20} />
                            Upload Resource
                          </>
                        )}
                      </span>
                    </motion.button>

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center font-mono"
                      >
                        Resource uploaded successfully!
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default AdminDashboard;
