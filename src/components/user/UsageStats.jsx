import { useAuth } from '../../contexts/AuthContext';

const UsageStats = ({ user, stats }) => {
  const plan = user?.plan;
  const jdUsed = user?.jdUsed || 0;
  const cvUsed = user?.cvUsed || 0;
  const jdLimit = plan?.jdLimit || 1;
  const cvLimit = plan?.cvLimit || 10;

  const jdPercentage = jdLimit === -1 ? 0 : (jdUsed / jdLimit) * 100;
  const cvPercentage = cvLimit === -1 ? 0 : (cvUsed / cvLimit) * 100;

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-[#667eea] to-[#764ba2]';
  };

  const StatCard = ({ title, used, limit, percentage, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center text-2xl`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {used} <span className="text-sm text-gray-500">/ {limit === -1 ? '∞' : limit}</span>
            </p>
          </div>
        </div>
      </div>
      
      {limit !== -1 && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {percentage >= 90 ? '⚠️ ' : ''}{percentage.toFixed(0)}% used
          </p>
        </>
      )}
      
      {limit === -1 && (
        <p className="text-xs text-green-600 font-medium">✨ Unlimited</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Usage Overview</h2>
        {(jdPercentage >= 80 || cvPercentage >= 80) && (
          <a
            href={`https://docs.google.com/forms/d/e/1FAIpQLSfb8m22n6LbGcr1-ZtCW6kB1w0p1QL2YT5gQ8FQHVS5oD5oug/viewform?usp=pp_url&entry.1234567890=${user?.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
          >
            ⬆️ Upgrade Plan
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Job Descriptions"
          used={jdUsed}
          limit={jdLimit}
          percentage={jdPercentage}
          icon="📝"
          color="text-blue-600"
        />
        
        <StatCard
          title="CVs Uploaded"
          used={cvUsed}
          limit={cvLimit}
          percentage={cvPercentage}
          icon="📄"
          color="text-purple-600"
        />
        
        <StatCard
          title="Rankings Done"
          used={stats.rankings?.length || 0}
          limit={-1}
          percentage={0}
          icon="🎯"
          color="text-green-600"
        />
      </div>

      {/* Warning Messages */}
      {jdPercentage >= 90 && jdLimit !== -1 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-900">Job Description Limit Almost Reached</p>
            <p className="text-sm text-red-700 mt-1">
              You've used {jdUsed} of {jdLimit} job descriptions. Upgrade your plan or archive old JDs to continue.
            </p>
          </div>
        </div>
      )}

      {cvPercentage >= 90 && cvLimit !== -1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-900">CV Limit Almost Reached</p>
            <p className="text-sm text-yellow-700 mt-1">
              You've used {cvUsed} of {cvLimit} CVs. Upgrade your plan or archive old CVs to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageStats;
