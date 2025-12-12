import React, { useState, useEffect } from 'react';
import { authFetch } from '../services/authService';

const AddPoet = () => {
    const [poets, setPoets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Matches your PoetDTO exactly!
    const [formData, setFormData] = useState({
        poetId: 0,
        name: '',
        birthYear: '',     // Capital Y → matches getBirthYear()
        deathYear: '',     // Capital Y → matches getDeathYear()
        biography: ''
    });

    useEffect(() => {
        fetchPoets();
    }, []);

    const fetchPoets = () => {
        authFetch("https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poets/getPoets")
            .then(res => res.json())
            .then(data => setPoets(data))
            .catch(err => console.error("Error fetching poets:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setFormData({ poetId: 0, name: '', birthYear: '', deathYear: '', biography: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const openEditModal = (poet) => {
        setFormData({ ...poet }); // poet from backend already has correct field names
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this poet?")) return;

        authFetch(`https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poets/deletePoet/${id}`, { method: "DELETE" })
            .then(() => {
                setPoets(prev => prev.filter(poet => poet.poetId !== id));
            })
            .catch(err => console.error("Error deleting poet:", err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poets/updatePoet"
            : "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poets/addPoet";

        const method = isEditing ? "PUT" : "POST";

        authFetch(url, {
            method,
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) throw new Error("Save failed");
                fetchPoets();
                setShowModal(false);
            })
            .catch(err => {
                console.error("Error saving poet:", err);
                alert("Failed to save poet. Check console.");
            });
    };

    const filteredPoets = poets.filter(poet =>
        (poet.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (poet.biography?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                            Poets Gallery
                        </h1>
                        <p className="text-gray-300 mt-2 text-lg">Explore and manage literary masters</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Poet
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search poets by name or biography..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Poets Table */}
                <div className="bg-gradient-to-br from-slate-900/40 to-indigo-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    {filteredPoets.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl mb-2">No poets found</p>
                            <p className="text-gray-500 text-sm">Start by adding your first poet to the collection!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-wider">Birth Year</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-wider">Death Year</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-wider">Biography</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredPoets.map((poet) => (
                                        <tr key={poet.poetId} className="hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {poet.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-white font-medium">{poet.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{poet.birthYear || '—'}</td>
                                            <td className="px-6 py-4 text-gray-300">{poet.deathYear || '—'}</td>
                                            <td className="px-6 py-4 text-gray-400 max-w-md">
                                                <div className="line-clamp-2 text-sm">
                                                    {poet.biography || 'No biography available'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(poet)}
                                                        className="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(poet.poetId)}
                                                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-slate-900/95 to-indigo-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 p-8 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-white">
                                    {isEditing ? 'Edit Poet' : 'Add New Poet'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Poet Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                                    placeholder="e.g. William Shakespeare"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Birth Year</label>
                                    <input
                                        type="text"
                                        name="birthYear"           // Matches PoetDTO
                                        value={formData.birthYear}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                                        placeholder="e.g. 1564"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Death Year</label>
                                    <input
                                        type="text"
                                        name="deathYear"           // Matches PoetDTO
                                        value={formData.deathYear}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                                        placeholder="e.g. 1616"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Biography</label>
                                <textarea
                                    name="biography"
                                    value={formData.biography}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition resize-none"
                                    placeholder="Write a brief biography..."
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/50 transform hover:scale-105 transition"
                                >
                                    {isEditing ? 'Update Poet' : 'Save Poet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddPoet;