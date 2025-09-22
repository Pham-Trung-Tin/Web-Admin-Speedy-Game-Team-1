import React, { useState, useEffect, useCallback } from "react";
import SessionTable from "../../../components/SessionTable";
import { getSessionsByPlayerWithParams } from "../../../services/sessionService";

const FilterByPlayer = () => {
  // State cho form inputs
  const [userId, setUserId] = useState("68ca4d3bdfdf93291fa739b9"); // Giá trị mặc định từ API
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // State cho kết quả
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm gọi API
  const fetchSessionsByPlayer = useCallback(async () => {
    if (!userId.trim()) {
      setError("Please enter User ID");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Prepare API parameters
      const params = {
        page,
        limit,
        sortBy,
        sortOrder
      };

      console.log("Making API call with:", {
        userId: userId.trim(),
        params
      });

      // Call the API
      const data = await getSessionsByPlayerWithParams(userId.trim(), params);
      
      console.log("Raw API response:", data);
      
      // Handle response data
      if (data && typeof data === 'object') {
        const sessionsData = data.data || [];
        const totalItems = data.total || sessionsData.length;
        
        console.log("Processed sessions data:", {
          sessionsData,
          sessionsCount: sessionsData.length,
          totalItems,
          hasData: sessionsData.length > 0
        });
        
        setSessions(sessionsData);
        setTotal(totalItems);
        
        // Show success message even if no data
        if (sessionsData.length === 0) {
          console.log("API call successful but no sessions found for user:", userId.trim());
        }
        
        console.log("Fetched sessions by player:", {
          userId: userId.trim(),
          params,
          sessionsCount: sessionsData.length,
          total: totalItems
        });
      } else {
        // Handle unexpected response format
        console.warn("Unexpected API response format:", data);
        setSessions([]);
        setTotal(0);
      }
      
    } catch (err) {
      console.error("Error fetching sessions by player:", err);
      
      // Handle different types of errors
      let errorMessage = "Unable to fetch sessions data. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const responseData = err.response.data;
        
        if (status === 404) {
          errorMessage = `User "${userId}" not found or has no sessions.`;
        } else if (status === 400) {
          errorMessage = responseData?.message || "Invalid User ID format.";
        } else if (status === 401) {
          errorMessage = "Unauthorized. Please login again.";
        } else if (status === 403) {
          errorMessage = "Access denied. You don't have permission to view this data.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = responseData?.message || `Error ${status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        // Other errors
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      setError(errorMessage);
      setSessions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit, sortBy, sortOrder]);

  // Auto fetch khi các dependencies thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId.trim()) {
        fetchSessionsByPlayer();
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [userId, page, sortBy, sortOrder, fetchSessionsByPlayer]);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("Please enter User ID");
      return;
    }
    setPage(1); // Reset về trang đầu
    await fetchSessionsByPlayer();
  };

  // Xử lý clear form
  const handleClear = () => {
    setUserId("");
    setPage(1);
    setLimit(20);
    setSortBy("createdAt");
    setSortOrder("desc");
    setSessions([]);
    setTotal(0);
    setError("");
    setLoading(false);
  };

  // Xử lý pagination
  const totalPages = Math.ceil(total / limit);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Filter Game Sessions by Player
          </h1>
          <p className="text-gray-600">
            Search and filter game sessions by User ID
          </p>
        </div>

        {/* Filter Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* User ID Input */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter User ID (e.g: 68ca4d3bdfdf93291fa739b9)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              {/* Page Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={page}
                  onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              {/* Limit Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limit
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="state">State</option>
                  <option value="name">Session Name</option>
                </select>
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Order:</span>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === "desc"}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">Descending</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === "asc"}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">Ascending</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !userId.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Filters
              </button>

              <button
                type="button"
                onClick={fetchSessionsByPlayer}
                disabled={loading || !userId.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </form>

         
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results
                {userId && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    for User "{userId}"
                  </span>
                )}
              </h2>
              {!loading && sessions.length > 0 && (
                <span className="text-sm text-gray-600">
                  Showing {sessions.length} of {total} results
                </span>
              )}
            </div>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading data...</p>
              </div>
            )}

            {!loading && !error && sessions.length === 0 && userId && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-600 mb-2">No game sessions found for user "{userId}"</p>
                <p className="text-sm text-gray-500">
                  API call completed successfully but returned empty results.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Check console for detailed API response logs.
                </p>
              </div>
            )}

            {!loading && !error && sessions.length === 0 && !userId && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-600">Enter User ID to search</p>
              </div>
            )}

            {!loading && !error && sessions.length > 0 && (
              <>
                <SessionTable sessions={sessions} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Page {page} of {totalPages} 
                      <span className="ml-2">({total} results)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterByPlayer;