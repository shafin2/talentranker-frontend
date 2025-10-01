import { useState } from 'react';
import { rankingService } from '../../services/talentranker';
import { useToast } from '../../contexts/ToastContext';

const RankingInterface = ({ jds, cvs, onUpdate }) => {
  const { addToast } = useToast();
  const [selectedJD, setSelectedJD] = useState('');
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [ranking, setRanking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCVToggle = (cvId) => {
    setSelectedCVs((prev) =>
      prev.includes(cvId)
        ? prev.filter((id) => id !== cvId)
        : [...prev, cvId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCVs.length === cvs.length) {
      setSelectedCVs([]);
    } else {
      setSelectedCVs(cvs.map((cv) => cv._id));
    }
  };

  const handleRank = async () => {
    if (!selectedJD) {
      setError('Please select a job description');
      return;
    }

    if (selectedCVs.length === 0) {
      setError('Please select at least one CV');
      return;
    }

    setRanking(true);
    setError('');
    setResults(null);

    try {
      const response = await rankingService.rankCVs(selectedJD, selectedCVs);
      console.log('📊 Full ranking response:', response);
      console.log('📊 RankingResult:', response.rankingResult);
      console.log('📊 Results array:', response.rankingResult?.results);
      // Backend returns { success, message, rankingResult: { _id, jdTitle, results, createdAt } }
      setResults(response.rankingResult);
      console.log('✅ Results state set!');
      addToast('CVs ranked successfully!', 'success');
      onUpdate();
    } catch (err) {
      console.error('❌ Ranking error:', err);
      addToast(err.message || 'Failed to rank CVs', 'error');
      setError(err.message || 'Failed to rank CVs');
    } finally {
      setRanking(false);
    }
  };

  const handleExport = () => {
    if (!results) return;
    const jd = jds.find((j) => j._id === selectedJD);
    rankingService.exportToCSV(results.results, jd?.title || 'Job_Description');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 80) return 'bg-green-100';
    if (confidence >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  console.log('🔍 RankingInterface render - results:', results);
  console.log('🔍 Should show results table?', !!results);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Rank Candidates</h2>
        {results && (
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📥 Export to CSV
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <span className="text-2xl">❌</span>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {!results ? (
        <>
          {/* Select Job Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Step 1: Select Job Description
            </h3>
            
            {jds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No job descriptions available</p>
                <p className="text-sm text-gray-400 mt-2">Please upload a job description first</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jds.map((jd) => (
                  <button
                    key={jd._id}
                    onClick={() => setSelectedJD(jd._id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedJD === jd._id
                        ? 'border-[#667eea] bg-gradient-to-br from-purple-50 to-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-[#667eea] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{jd.title}</h4>
                      {selectedJD === jd._id && (
                        <span className="text-[#667eea] text-xl">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{jd.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select CVs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Step 2: Select CVs ({selectedCVs.length} selected)
              </h3>
              {cvs.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-[#667eea] hover:text-[#764ba2] font-medium"
                >
                  {selectedCVs.length === cvs.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {cvs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No CVs available</p>
                <p className="text-sm text-gray-400 mt-2">Please upload CVs first</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cvs.map((cv) => (
                  <button
                    key={cv._id}
                    onClick={() => handleCVToggle(cv._id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                      selectedCVs.includes(cv._id)
                        ? 'border-[#764ba2] bg-gradient-to-r from-purple-50 to-transparent'
                        : 'border-gray-200 hover:border-[#764ba2]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedCVs.includes(cv._id)
                          ? 'border-[#764ba2] bg-[#764ba2]'
                          : 'border-gray-300'
                      }`}>
                        {selectedCVs.includes(cv._id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">{cv.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(cv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rank Button */}
          <button
            onClick={handleRank}
            disabled={ranking || !selectedJD || selectedCVs.length === 0}
            className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {ranking ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ranking CVs... Please wait
              </span>
            ) : (
              '🎯 Rank Selected CVs'
            )}
          </button>
        </>
      ) : (
        /* Results Table */
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-2xl font-bold">Ranking Results</h3>
                <p className="text-purple-100 mt-1">
                  {results.results.length} candidates ranked for {jds.find((j) => j._id === selectedJD)?.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setResults(null);
                  setSelectedJD('');
                  setSelectedCVs([]);
                }}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all"
              >
                ← New Ranking
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prediction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.results.map((result, index) => (
                  <tr
                    key={result.cv}
                    className={`hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        index === 0
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                          : index === 1
                          ? 'bg-gray-200 text-gray-700'
                          : index === 2
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                        {index === 0 ? '🏆' : index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📄</span>
                        <span className="font-medium text-gray-900">{result.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.prediction === 'Relevant'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.prediction === 'Relevant' ? '✓ ' : '✗ '}
                        {result.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              result.confidence >= 80
                                ? 'bg-green-500'
                                : result.confidence >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                          {result.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingInterface;
