import React from 'react';

const NotFoundPage = () => {
  const handleGoHome = () => {
    // For React Router, you would use: navigate('/') 
    // For now, using window.location for demo purposes
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-black animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-gray-200 -z-10 transform translate-x-2 translate-y-2">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-30 animate-pulse delay-75"></div>
            <div className="absolute inset-8 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full opacity-40 animate-pulse delay-150"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-32 h-32 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.451M15 9l-3-3-3 3" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Home
          </button>
        </div>


      </div>
    </div>
  );
};

export default NotFoundPage;