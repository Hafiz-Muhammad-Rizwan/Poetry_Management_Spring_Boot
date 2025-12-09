import React, { useState, useEffect } from 'react';

const AddBook = () => {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        BookId: 0,
        Title: '',
        PublicationYear: '',
        Genre: '',
        Author: ''
    });

    useEffect(() => {
        fetch("  https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/getBooks")
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error fetching books:", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setFormData({ BookId: 0, Title: '', PublicationYear: '', Genre: '', Author: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setFormData({ ...book });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        fetch(`https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/deleteBook/${id}`, { method: "DELETE" })
            .then(() => {
                setBooks(prev => prev.filter(book => book.BookId !== id));
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/updateBook"
            : "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/addBook";

        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(() => {
                fetch("https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/getBooks")
                    .then(res => res.json())
                    .then(data => setBooks(data));
                setShowModal(false);
            });
    };

    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
 
    return (
        <>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                            Books Collection
                        </h1>
                        <p className="text-gray-300 mt-2 text-lg">Browse and manage your poetry books</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Book
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search books by title, author, or genre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-gradient-to-br from-slate-900/40 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    {filteredBooks.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl mb-2">No books found</p>
                            <p className="text-gray-500 text-sm">Start by adding your first book to the collection!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Genre</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Year</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-blue-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredBooks.map((book) => (
                                        <tr key={book.BookId} className="hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white font-medium">{book.Title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{book.Author}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
                                                    {book.Genre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{book.PublicationYear || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(book)}
                                                        className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book.BookId)}
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
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                        <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 p-8 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-white">
                                    {isEditing ? 'Edit Book' : 'Add New Book'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white/70 hover:text-white transition"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Book Title *</label>
                                <input
                                    type="text"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                                    placeholder="e.g. The Sonnets"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Author Name *</label>
                                <input
                                    type="text"
                                    name="Author"
                                    value={formData.Author}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                                    placeholder="e.g. William Shakespeare"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Publication Year</label>
                                    <input
                                        type="number"
                                        name="PublicationYear"
                                        value={formData.PublicationYear}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                                        placeholder="1609"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre *</label>
                                    <input
                                        type="text"
                                        name="Genre"
                                        value={formData.Genre}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition"
                                        placeholder="Poetry"
                                    />
                                </div>
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
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-600/50 transform hover:scale-105 transition"
                                >
                                    {isEditing ? 'Update Book' : 'Save Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddBook;