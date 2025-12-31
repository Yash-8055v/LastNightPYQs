import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, FolderOpen, TrendingUp, FileText } from 'lucide-react';
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
    // Fetch stats when component mounts
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
        
        // Reset file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';

        // Refresh stats
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 px-6 pt-32 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Manage and monitor platform resources</p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-purple-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={20} />
              <span>Overview</span>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('upload')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-purple-500'
            }`}
          >
            <div className="flex items-center gap-2">
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <FolderOpen size={24} className="text-white" />
                    </div>
                    <TrendingUp size={20} className="text-blue-200" />
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-1">{stats.totalPDFs}</h3>
                  <p className="text-blue-200 text-sm">Total PDFs Uploaded</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <FileText size={24} className="text-white" />
                    </div>
                    <TrendingUp size={20} className="text-purple-200" />
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-1">{stats.totalDownloads.toLocaleString()}</h3>
                  <p className="text-purple-200 text-sm">Total Downloads</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 border border-pink-500/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Upload size={24} className="text-white" />
                    </div>
                    <TrendingUp size={20} className="text-pink-200" />
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-1">{stats.thisMonthUploads}</h3>
                  <p className="text-pink-200 text-sm">This Month's Uploads</p>
                </motion.div>
              </div>

              {loadingStats ? (
                <div className="text-center text-gray-400 py-12">Loading stats...</div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6">Recent Uploads</h3>
                  <div className="space-y-4">
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
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-purple-600/20 rounded-lg">
                                <FileText className="text-purple-400" size={20} />
                              </div>
                              <div>
                                <p className="text-white font-medium">New PDF uploaded</p>
                                <p className="text-gray-400 text-sm">
                                  {paper.subject} - Semester {paper.semester} ({paper.department})
                                </p>
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">{timeAgo}</span>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 py-8">No recent uploads</div>
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
              className="max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8"
              >
                <div className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-gray-300 mb-3 font-semibold">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        // Reset semester and subject when department changes
                        setFormData({ ...formData, department: e.target.value, semester: '', subject: '' });
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
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
                        value={formData.semester}
                        onChange={(e) => {
                          // Reset subject when semester changes
                          setFormData({ ...formData, semester: e.target.value, subject: '' });
                        }}
                        disabled={!formData.department}
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select</option>
                        {MOCK_DATA.semesters.map((sem) => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-3 font-semibold">Year</label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select</option>
                        {MOCK_DATA.years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-3 font-semibold">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      disabled={!formData.semester || !formData.department}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.department ? 'Select Department First' : !formData.semester ? 'Select Semester First' : 'Select Subject'}
                      </option>
                      {formData.semester && formData.department && getSubjectsByDepartmentAndSemester(formData.department, parseInt(formData.semester)).map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    {(!formData.department || !formData.semester) && (
                      <p className="text-gray-500 text-sm mt-1">
                        {!formData.department ? 'Please select department first' : 'Please select semester first'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-3 font-semibold">Upload PDF</label>
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
                        className="flex items-center justify-center gap-3 w-full px-4 py-8 rounded-lg bg-gray-900/50 border-2 border-dashed border-gray-700 hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <Upload className="text-purple-400" size={24} />
                        <span className="text-gray-300">
                          {formData.file ? formData.file.name : 'Click to upload PDF'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={uploading || !formData.department || !formData.semester || !formData.year || !formData.subject || !formData.file}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Resource'}
                  </motion.button>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-center"
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
  );
}

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default AdminDashboard;