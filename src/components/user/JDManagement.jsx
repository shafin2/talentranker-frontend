import { useState } from 'react';
import { jdService } from '../../services/talentranker';
import { useToast } from '../../contexts/ToastContext';

const JDManagement = ({ jds, onUpdate }) => {
  const { addToast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('text'); // 'text' or 'pdf'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedJD, setSelectedJD] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });

  const handleTextUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await jdService.uploadJD(formData);
      addToast('Job description uploaded successfully!', 'success');
      setFormData({ title: '', description: '', content: '' });
      setShowUpload(false);
      onUpdate();
    } catch (err) {
      addToast(err.message || 'Failed to upload job description', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formDataObj = new FormData();
    formDataObj.append('jdFile', file);
    formDataObj.append('title', formData.title || file.name.replace('.pdf', ''));
    formDataObj.append('description', formData.description || 'Uploaded from PDF');

    try {
      await jdService.uploadJD(formDataObj);
      addToast('Job description uploaded successfully!', 'success');
      setFormData({ title: '', description: '', content: '' });
      setShowUpload(false);
      onUpdate();
    } catch (err) {
      addToast(err.message || 'Failed to upload PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job description?')) return;

    try {
      await jdService.deleteJD(id);
      addToast('Job description deleted successfully!', 'success');
      onUpdate();
    } catch (err) {
      addToast(err.message || 'Failed to delete job description', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Descriptions</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
        >
          {showUpload ? '✕ Cancel' : '+ Upload Job Description'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <span className="text-2xl">❌</span>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#667eea]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Job Description</h3>
          
          {/* Upload Type Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadType('text')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                uploadType === 'text'
                  ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📝 Enter Text
            </button>
            <button
              onClick={() => setUploadType('pdf')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                uploadType === 'pdf'
                  ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📄 Upload PDF
            </button>
          </div>

          {uploadType === 'text' ? (
            <form onSubmit={handleTextUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  placeholder="Brief description of the role"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Job Description *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  placeholder="Paste the complete job description here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Job Description'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  placeholder="Will use PDF filename if not provided"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF File *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  disabled={loading}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#667eea] transition-colors cursor-pointer"
                />
                <p className="mt-2 text-sm text-gray-500">Max file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* JD List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jds.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No job descriptions yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload your first job description to get started</p>
          </div>
        ) : (
          jds.map((jd) => (
            <div
              key={jd._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors">
                  {jd.title}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Active
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{jd.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>📊 {jd.rankedCVsCount || 0} CVs ranked</span>
                <span>📄 {jd.filename || 'Text input'}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedJD(jd)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleDelete(jd._id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View JD Modal */}
      {selectedJD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{selectedJD.title}</h3>
              <button
                onClick={() => setSelectedJD(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1">{selectedJD.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Content</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                  {selectedJD.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JDManagement;
