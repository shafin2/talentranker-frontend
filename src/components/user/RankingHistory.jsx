import { useState } from 'react';
import { rankingService } from '../../services/talentranker';

const RankingHistory = ({ rankings, onUpdate }) => {
  const [selectedRanking, setSelectedRanking] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'failed'

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ranking result?')) return;

    try {
      await rankingService.deleteResult(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete ranking:', err);
    }
  };

  const handleExport = (ranking) => {
    rankingService.exportToCSV(
      ranking.results,
      ranking.jobDescription?.title || 'Job_Description'
    );
  };

  const filteredRankings = rankings.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      completed: { text: 'Completed', color: 'bg-green-100 text-green-800' },
      processing: { text: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-800' },
    };
    const badge = badges[status] || badges.completed;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ranking History</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Rankings List */}
      {filteredRankings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="text-6xl mb-4">📜</div>
          <p className="text-gray-500 text-lg">No ranking history found</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter !== 'all' 
              ? `No ${filter} rankings` 
              : 'Start ranking CVs to see history'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRankings.map((ranking) => (
            <div
              key={ranking._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ranking.jobDescription?.title || 'Unknown Job Description'}
                    </h3>
                    {getStatusBadge(ranking.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {ranking.results?.length || 0} candidates ranked • {' '}
                    {new Date(ranking.createdAt).toLocaleDateString()} at{' '}
                    {new Date(ranking.createdAt).toLocaleTimeString()}
                  </p>

                  {ranking.status === 'completed' && ranking.results && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-semibold">
                          ✓ {ranking.results.filter(r => r.prediction === 'Relevant').length}
                        </span>
                        <span className="text-sm text-gray-500">Relevant</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600 font-semibold">
                          ✗ {ranking.results.filter(r => r.prediction === 'Not Relevant').length}
                        </span>
                        <span className="text-sm text-gray-500">Not Relevant</span>
                      </div>
                    </div>
                  )}

                  {ranking.status === 'failed' && ranking.error && (
                    <p className="text-sm text-red-600">Error: {ranking.error}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedRanking(ranking)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    👁️ View
                  </button>
                  {ranking.status === 'completed' && (
                    <button
                      onClick={() => handleExport(ranking)}
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                    >
                      📥 Export
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ranking._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Ranking Modal */}
      {selectedRanking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">
                    {selectedRanking.jobDescription?.title || 'Ranking Results'}
                  </h3>
                  <p className="text-purple-100 mt-1">
                    {selectedRanking.results?.length || 0} candidates • {' '}
                    {new Date(selectedRanking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRanking(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {selectedRanking.status === 'completed' && selectedRanking.results && (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Prediction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRanking.results.map((result, index) => (
                        <tr
                          key={result.cv}
                          className={`hover:bg-gray-50 ${index === 0 ? 'bg-green-50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                              index === 0
                                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                                : 'bg-gray-100 text-gray-600'
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
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              result.prediction === 'Relevant'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.prediction === 'Relevant' ? '✓ ' : '✗ '}
                              {result.prediction}
                            </span>
                          </td>
                          <td className="px-6 py-4">
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
                              <span className={`font-bold ${
                                result.confidence >= 80
                                  ? 'text-green-600'
                                  : result.confidence >= 60
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
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

            {selectedRanking.status === 'failed' && (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    ❌ Ranking failed: {selectedRanking.error || 'Unknown error'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingHistory;
