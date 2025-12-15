import React, { useState, useEffect } from 'react';
import { authFetch } from '../services/authService';
import { API_ENDPOINTS } from '../services/api';

const AddLema = () => {
    const [lemas, setLemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLemas();
    }, []);

    const fetchLemas = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('=== LEMMAS API CALL DEBUG ===');
            console.log('API URL:', API_ENDPOINTS.GET_ALL_LEMAS);
            console.log('JWT Token:', localStorage.getItem('jwtToken'));
            console.log('Username:', localStorage.getItem('username'));
            
            const response = await authFetch(API_ENDPOINTS.GET_ALL_LEMAS);
            
            console.log('Response Status:', response.status);
            console.log('Response OK:', response.ok);
            console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.ok) {
                const data = await response.json();
                console.log('Lemmas Data Received:', data);
                console.log('Number of Lemmas:', data.length);
                setLemas(data);
            } else {
                const errorMsg = await response.text();
                console.error('Error Response:', errorMsg);
                setError(errorMsg || 'Failed to fetch lemas');
            }
        } catch (err) {
            console.error('=== ERROR FETCHING LEMMAS ===');
            console.error('Error Message:', err.message);
            console.error('Error Stack:', err.stack);
            setError('Error fetching lemas: ' + err.message);
        } finally {
            setLoading(false);
            console.log('=== API CALL COMPLETE ===');
        }
    };

    const filteredLemas = lemas.filter(lema =>
        (lema.lemmaText && lema.lemmaText.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lema.poetName && lema.poetName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lema.poemTitle && lema.poemTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lema.bookTitle && lema.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                            Lemmas Collection
                        </h1>
                        <p className="text-gray-300 mt-2 text-lg">Browse all lemmas and their roots</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search lemmas by poet, poem, book or text..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition"
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-gray-400 mt-4">Loading lemmas...</p>
                    </div>
                ) : (
                    /* Lemmas Table */
                    <div className="bg-gradient-to-br from-slate-900/40 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {filteredLemas.length === 0 ? (
                            <div className="text-center py-20 px-6">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-xl mb-2">No lemmas found</p>
                                <p className="text-gray-500 text-sm">Lemmas will appear here from your poetry collection</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">Lemma Text</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">Poet Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">Poem Title</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">Book Title</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLemas.map((lema, index) => (
                                            <tr key={lema.lemma_id || index} className="hover:bg-white/5 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-white font-medium text-lg">{lema.lemmaText || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span className="text-gray-300">{lema.poetName || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                        <span className="text-gray-300">{lema.poemTitle || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        <span className="text-gray-300">{lema.bookTitle || 'N/A'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AddLema;
