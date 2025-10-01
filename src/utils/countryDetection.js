// Simplified country detection using browser timezone
export const detectUserCountry = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Pakistan timezones
    const pakistanTimezones = [
      'Asia/Karachi',
      'Asia/Lahore'
    ];
    
    // Check if user is in Pakistan timezone
    const isPakistan = pakistanTimezones.some(tz => timezone.includes(tz));
    const country = isPakistan ? 'Pakistan' : 'International';
    
    localStorage.setItem('userCountry', country);
    return country;
  } catch (error) {
    console.error('Country detection failed:', error);
    // Default to international
    const country = 'International';
    localStorage.setItem('userCountry', country);
    return country;
  }
};

export const getCachedCountry = () => {
  return localStorage.getItem('userCountry') || detectUserCountry();
};

export const isPakistanUser = () => {
  const country = getCachedCountry();
  return country === 'Pakistan';
};