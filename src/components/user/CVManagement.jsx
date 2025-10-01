import { useState, useCallback } from 'react';
import { cvService } from '../../services/talentranker';
import { useToast } from '../../contexts/ToastContext';

const CVManagement = ({ cvs, onUpdate }) => {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (files.length === 0) {
      setError('Please upload only PDF files');
      return;
    }

    setSelectedFiles(files);
    setError('');
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setError('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one CV');
      return;
    }

    if (selectedFiles.length > 20) {
      setError('Maximum 20 CVs can be uploaded at once');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('cvFiles', file);
    });

    try {
      await cvService.uploadCVs(formData);
      addToast(`Successfully uploaded ${selectedFiles.length} CV(s)!`, 'success');
      setSelectedFiles([]);
      onUpdate();
    } catch (err) {
      addToast(err.message || 'Failed to upload CVs', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    try {
      await cvService.deleteCV(id);
      addToast('CV deleted successfully!', 'success');
      onUpdate();
    } catch (err) {
      addToast(err.message || 'Failed to delete CV', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">CVs / Resumes</h2>
        <div className="text-sm text-gray-500">
          {cvs.length} CV(s) uploaded
        </div>
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

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#764ba2]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CVs</h3>
        
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-[#764ba2] bg-purple-50 scale-105'
              : 'border-gray-300 hover:border-[#764ba2]'
          }`}
        >
          <input
            type="file"
            id="cv-upload"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drag & Drop CVs Here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>
          
          <label
            htmlFor="cv-upload"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg transition-all cursor-pointer font-medium"
          >
            📁 Browse Files
          </label>
          
          <p className="mt-4 text-xs text-gray-400">
            PDF only • Max 10MB per file • Up to 20 files at once
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Uploading...' : `⬆️ Upload ${selectedFiles.length} CV(s)`}
            </button>
          </div>
        )}
      </div>

      {/* CV List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cvs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500 text-lg">No CVs uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload CVs to start ranking candidates</p>
          </div>
        ) : (
          cvs.map((cv) => (
            <div
              key={cv._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📄</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#764ba2] transition-colors line-clamp-1">
                      {cv.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(cv.fileSize || 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  Active
                </span>
                <span>
                  {new Date(cv.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCV(cv)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleDelete(cv._id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View CV Modal */}
      {selectedCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedCV.filename}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(selectedCV.fileSize || 0)} • Uploaded on {new Date(selectedCV.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedCV(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-500">Extracted Content</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selectedCV.content || 'No content extracted'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagement;
