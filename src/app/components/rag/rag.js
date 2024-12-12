"use client";
import React, { useState } from 'react';
import { Search, Info, CreditCard, MapPin, BarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DemographicDetails = ({ stat }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex items-center space-x-3">
        <MapPin className="text-blue-600" />
        <h3 className="font-bold text-xl text-gray-800">Location Details</h3>
      </div>
      <span className="text-sm text-gray-500 font-medium">{stat.district}</span>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Population</span>
          <BarChart className="text-blue-500" size={20} />
        </div>
        <div className="text-2xl font-bold text-blue-800 mt-2">{stat.totP.toLocaleString()}</div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Female Population</span>
          <BarChart className="text-green-500" size={20} />
        </div>
        <div className="text-2xl font-bold text-green-800 mt-2">{stat.totF.toLocaleString()}</div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Age 18-24</span>
          <BarChart className="text-purple-500" size={20} />
        </div>
        <div className="text-xl font-bold text-purple-800 mt-2">{stat.population1824.toLocaleString()}</div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Age 25-40</span>
          <BarChart className="text-orange-500" size={20} />
        </div>
        <div className="text-xl font-bold text-orange-800 mt-2">{stat.population2540.toLocaleString()}</div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Population Breakdown</span>
          <BarChart className="text-red-500" size={20} />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          Young Adults (18-24): {((stat.population1824 / stat.totP) * 100).toFixed(2)}% 
          | Mid-Career (25-40): {((stat.population2540 / stat.totP) * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  </div>
);

const PostOfficeSchemesSuggestionUI = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-blue-600 text-white p-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <CreditCard className="mr-3" />
              Post Office Scheme Finder
            </h1>
            <p className="text-blue-100 mt-2">
              Personalized financial insights for your location
            </p>
          </div>
        </div>

        <div className="p-6 flex-shrink-0 space-y-6">
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your location or demographic details"
              className="flex-grow bg-transparent text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="mr-2" /> 
              {isLoading ? 'Searching...' : 'Find Schemes'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center text-blue-600 py-6">
              Analyzing your details...
            </div>
          )}
        </div>

        {result && (
          <div className="overflow-y-auto flex-grow">
            <div className="grid md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h2 className="font-bold text-xl flex items-center text-blue-800">
                    <Info className="mr-3" />
                    Location Insights
                  </h2>
                  <ReactMarkdown 
                    className="prose prose-blue mt-2 text-blue-700"
                    components={{
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                    }}
                  >
                    {result.interpretation}
                  </ReactMarkdown>
                </div>

                {result.statistics.length > 0 && (
                  <DemographicDetails stat={result.statistics[0]} />
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <CreditCard className="inline mr-2" />
                  Recommended Schemes
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {result.suggestedSchemes.map((scheme, index) => (
                    <div 
                      key={index} 
                      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <h4 className="font-semibold text-blue-800 mb-2">
                        {scheme.scheme}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {scheme.description}
                      </p>
                      <div className="text-sm text-green-700">
                        🎯 {scheme.matchReason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOfficeSchemesSuggestionUI;