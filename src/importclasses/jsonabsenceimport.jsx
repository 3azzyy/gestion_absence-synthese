import React, { useState } from 'react';
import axios from 'axios';

const MultiJsonAttendanceImporter = () => {
  // --- CHANGED: Now using arrays for files and results ---
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState([]); // List of results for each file
  const [error, setError] = useState(null);
  const [skipEmpty, setSkipEmpty] = useState(true);

  const getAuthToken = () => {
    const session = JSON.parse(localStorage.getItem('ista_auth_session'));
    return session?.token;
  };

  // Handle file selection (Multiple)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.name.endsWith('.json'));

    if (validFiles.length !== files.length) {
      setError('Some files were skipped because they are not .json');
    } else {
      setError(null);
    }
    
    setSelectedFiles(validFiles);
    setResults([]); // Clear previous results
  };

  // Import all selected classes
  const handleBatchImport = async () => {
    if (selectedFiles.length === 0) return;

    if (!window.confirm(`Are you sure you want to import ${selectedFiles.length} classes?`)) {
      return;
    }

    setImporting(true);
    setError(null);
    const batchResults = [];

    // Loop through each file and upload
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('class_json', file);
      formData.append('skip_empty', skipEmpty ? '1' : '0');

      try {
        const response = await axios.post('/api/attendance/json/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${getAuthToken()}`,
          }
        });

        batchResults.push({
          fileName: file.name,
          status: 'success',
          data: response.data
        });
      } catch (err) {
        batchResults.push({
          fileName: file.name,
          status: 'error',
          message: err.response?.data?.message || 'Import failed'
        });
      }
    }

    setResults(batchResults);
    setImporting(false);
    setSelectedFiles([]);
    document.getElementById('fileInput').value = '';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Batch Attendance Importer</h2>

        {/* File Upload - Added 'multiple' attribute */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Multiple JSON Files
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".json"
            multiple // --- CRITICAL CHANGE ---
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-sm text-blue-600 font-medium">
              Files ready to import: {selectedFiles.length}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleBatchImport}
            disabled={selectedFiles.length === 0 || importing}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-bold
              hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            {importing ? `Importing ${selectedFiles.length} files...` : `📥 Start Batch Import (${selectedFiles.length})`}
          </button>
        </div>

        {/* Batch Results Table */}
        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Import Summary</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((res, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{res.fileName}</td>
                      <td className="px-6 py-4 text-sm">
                        {res.status === 'success' ? (
                          <span className="text-green-600 font-bold">✅ Success</span>
                        ) : (
                          <span className="text-red-600 font-bold">❌ Failed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {res.status === 'success' 
                          ? `${res.data.stats.absences_created} records added` 
                          : res.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiJsonAttendanceImporter;