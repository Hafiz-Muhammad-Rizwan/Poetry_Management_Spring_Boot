import React, { useState, useEffect } from 'react';

const AddPoem = () => {
    const [poems, setPoems] = useState([]);
    const [poets, setPoets] = useState([]);
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filterable dropdown states
    const [poetSearch, setPoetSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    const [showPoetDropdown, setShowPoetDropdown] = useState(false);
    const [showBookDropdown, setShowBookDropdown] = useState(false);

    const [formData, setFormData] = useState({
        poemId: 0,
        title: '',
        poetId: '',
        bookId: ''
    });

    useEffect(() => {
        fetchPoems();
        fetchPoets();
        fetchBooks();
    }, []);

    const fetchPoems = () => {
        fetch("https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poems/getPoems")
            .then(res => res.json())
            .then(data => setPoems(data))
            .catch(err => console.error("Error fetching poems:", err));
    };

    const fetchPoets = () => {
        fetch("https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poets/getPoets")
            .then(res => res.json())
            .then(data => setPoets(data))
            .catch(err => console.error("Error fetching poets:", err));
    };

    const fetchBooks = () => {
        fetch("https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/books/getBooks")
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error fetching books:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setFormData({ poemId: 0, title: '', poetId: '', bookId: '' });
        setPoetSearch('');
        setBookSearch('');
        setIsEditing(false);
        setShowModal(true);
    };

    const openEditModal = (poem) => {
        setFormData({ ...poem });
        const selectedPoet = poets.find(p => p.poet_id === poem.poetId);
        const selectedBook = books.find(b => b.BookId === poem.bookId);
        setPoetSearch(selectedPoet ? selectedPoet.name : '');
        setBookSearch(selectedBook ? selectedBook.Title : '');
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this poem?")) return;

        fetch(`https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poems/deletePoem/${id}`, { method: "DELETE" })
            .then(() => {
                setPoems(prev => prev.filter(poem => poem.poemId !== id));
            })
            .catch(err => console.error("Error deleting poem:", err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poems/updatePoem"
            : "https://sheltered-mountain-64913-f230179cbd70.herokuapp.com/poems/addPoem";

        const method = isEditing ? "PUT" : "POST";
        console.log("Sending request...");
        console.log("URL:", url);
        console.log("Method:", method);
        console.log("Payload (formData):", formData);
        console.log("JSON being sent:", JSON.stringify(formData));

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(() => {
                fetchPoems();
                setShowModal(false);
            })
            .catch(err => console.error("Error saving poem:", err));
    };

    const filteredPoems = poems.filter(poem =>
        poem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPoets = poets.filter(poet =>
        poet.name.toLowerCase().includes(poetSearch.toLowerCase())
    );

    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(bookSearch.toLowerCase())
    );

    const getPoetName = (poetId) => {
        const poet = poets.find(p => p.poetId === poetId);
        return poet ? poet.name : 'Unknown';
    };

    const getBookTitle = (bookId) => {
        const book = books.find(b => b.BookId === bookId);
        return book ? book.Title : 'Unknown';
    };

    const selectPoet = (poet) => {
        setFormData(prev => ({ ...prev, poetId: poet.poetId }));
        setPoetSearch(poet.name);
        setShowPoetDropdown(false);
    };

    const selectBook = (book) => {
        setFormData(prev => ({ ...prev, bookId: book.BookId }));
        setBookSearch(book.Title);
        setShowBookDropdown(false);
    };

    return (
        <>
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                            Poems Collection
                        </h1>
                        <p className="text-gray-300 mt-2 text-lg">Explore and manage poetry masterpieces</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Poem
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search poems by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition"
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Poems Table */}
                <div className="bg-gradient-to-br from-slate-900/40 to-emerald-900/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    {filteredPoems.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl mb-2">No poems found</p>
                            <p className="text-gray-500 text-sm">Start by adding your first poem to the collection!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300 uppercase tracking-wider">Poet</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-300 uppercase tracking-wider">Book</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredPoems.map((poem) => (
                                        <tr key={poem.poemId} className="hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-white font-medium">{poem.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{getPoetName(poem.poetId)}</td>
                                            <td className="px-6 py-4 text-gray-300">{getBookTitle(poem.bookId)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(poem)}
                                                        className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(poem.poemId)}
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
                    <div className="bg-gradient-to-br from-slate-900/95 to-emerald-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                        <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 p-8 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-white">
                                    {isEditing ? 'Edit Poem' : 'Add New Poem'}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Poem Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition"
                                    placeholder="e.g. The Road Not Taken"
                                />
                            </div>

                            {/* Filterable Poet Dropdown */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select Poet *</label>
                                <input
                                    type="text"
                                    value={poetSearch}
                                    onChange={(e) => {
                                        const searchValue = e.target.value;
                                        const matchingPoets = poets.filter(poet =>
                                            poet.name.toLowerCase().includes(searchValue.toLowerCase())
                                        );
                                        
                                        if (matchingPoets.length > 0 || searchValue === '') {
                                            setPoetSearch(searchValue);
                                            setFormData(prev => ({ ...prev, poetId: '' }));
                                        }
                                        setShowPoetDropdown(true);
                                    }}
                                    onFocus={() => setShowPoetDropdown(true)}
                                    placeholder="Type to search poets..."
                                    required={!formData.poetId}
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition"
                                />
                                {showPoetDropdown && filteredPoets.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                        {filteredPoets.map(poet => (
                                            <div
                                                key={poet.poetId}
                                                onClick={() => selectPoet(poet)}
                                                className="px-5 py-3 hover:bg-emerald-600/30 cursor-pointer text-white transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="font-medium">{poet.name}</div>
                                                {poet.birth_year && (
                                                    <div className="text-sm text-gray-400">({poet.birth_year} - {poet.death_year || 'Present'})</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Filterable Book Dropdown */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select Book *</label>
                                <input
                                    type="text"
                                    value={bookSearch}
                                    onChange={(e) => {
                                        const searchValue = e.target.value;
                                        const matchingBooks = books.filter(book =>
                                            book.Title.toLowerCase().includes(searchValue.toLowerCase())
                                        );
                                        
                                        if (matchingBooks.length > 0 || searchValue === '') {
                                            setBookSearch(searchValue);
                                            setFormData(prev => ({ ...prev, bookId: '' }));
                                        }
                                        setShowBookDropdown(true);
                                    }}
                                    onFocus={() => setShowBookDropdown(true)}
                                    placeholder="Type to search books..."
                                    required={!formData.bookId}
                                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition"
                                />
                                {showBookDropdown && filteredBooks.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                        {filteredBooks.map(book => (
                                            <div
                                                key={book.BookId}
                                                onClick={() => selectBook(book)}
                                                className="px-5 py-3 hover:bg-emerald-600/30 cursor-pointer text-white transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="font-medium">{book.Title}</div>
                                                <div className="text-sm text-gray-400">{book.Genre} {book.PublicationYear && `• ${book.PublicationYear}`}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-600/50 transform hover:scale-105 transition"
                                >
                                    {isEditing ? 'Update Poem' : 'Save Poem'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddPoem;
