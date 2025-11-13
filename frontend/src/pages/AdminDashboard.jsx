import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, Users, FolderOpen, TrendingUp, FileText } from 'lucide-react';

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

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    category: '',
    department: '',
    semester: '',
    year: '',
    subject: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const stats = {
    totalPDFs: 1247,
    totalDownloads: 45678,
    thisMonthUploads: 89,
    activeStudents: 3421
  };

  const monthlyData = [
    { month: 'Jan', uploads: 95, downloads: 3200 },
    { month: 'Feb', uploads: 112, downloads: 3800 },
    { month: 'Mar', uploads: 98, downloads: 4100 },
    { month: 'Apr', uploads: 134, downloads: 5200 },
    { month: 'May', uploads: 156, downloads: 6400 },
    { month: 'Jun', uploads: 142, downloads: 5800 }
  ];

  const handleSubmit = () => {
    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setFormData({
        category: '',
        department: '',
        semester: '',
        year: '',
        subject: '',
        file: null
      });
      
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Users size={24} className="text-white" />
                    </div>
                    <TrendingUp size={20} className="text-green-200" />
                  </div>
                  <h3 className="text-white text-3xl font-bold mb-1">{stats.activeStudents.toLocaleString()}</h3>
                  <p className="text-green-200 text-sm">Active Students</p>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-blue-400" size={24} />
                    Monthly Uploads
                  </h3>
                  <div className="space-y-4">
                    {monthlyData.map((data, idx) => (
                      <div key={data.month}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">{data.month}</span>
                          <span className="text-white font-semibold">{data.uploads}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.uploads / 160) * 100}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-purple-400" size={24} />
                    Monthly Downloads
                  </h3>
                  <div className="space-y-4">
                    {monthlyData.map((data, idx) => (
                      <div key={data.month}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">{data.month}</span>
                          <span className="text-white font-semibold">{data.downloads.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.downloads / 6500) * 100}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {[
                    { action: 'New PDF uploaded', subject: 'Machine Learning - Semester 6', time: '2 hours ago' },
                    { action: 'Resource downloaded', subject: 'Data Structures', time: '3 hours ago' },
                    { action: 'New PDF uploaded', subject: 'Operating Systems - Semester 4', time: '5 hours ago' },
                    { action: 'Resource downloaded', subject: 'Web Development', time: '6 hours ago' }
                  ].map((activity, idx) => (
                    <motion.div
                      key={idx}
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
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.subject}</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
                  <div>
                    <label className="block text-gray-300 mb-3 font-semibold">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
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
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Subject</option>
                      {formData.year && MOCK_DATA.subjects[formData.year] ? (
                        MOCK_DATA.subjects[formData.year].map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))
                      ) : (
                        <>
                          <option value="Data Structures">Data Structures</option>
                          <option value="Operating Systems">Operating Systems</option>
                          <option value="DBMS">DBMS</option>
                          <option value="Computer Networks">Computer Networks</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Algorithms">Algorithms</option>
                          <option value="Software Engineering">Software Engineering</option>
                        </>
                      )}
                    </select>
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
                    disabled={uploading || !formData.category || !formData.department || !formData.semester || !formData.year || !formData.subject || !formData.file}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg disabled:opacity-50"
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

export default AdminDashboard;