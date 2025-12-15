import React, { useState, useEffect } from "react";
import { authFetch } from '../services/authService';
import { API_ENDPOINTS } from '../services/api';

const AddVerse = () => {
  const [verses, setVerses] = useState([]);
  const [books, setBooks] = useState([]);
  const [poems, setPoems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState({});
  const [expandedPoems, setExpandedPoems] = useState({});
  const [poemVerses, setPoemVerses] = useState({}); // Store verses by poemId
  const [currentPoemVerses, setCurrentPoemVerses] = useState([]); // Verses for selected poem in form
  const [loadingPoems, setLoadingPoems] = useState({}); // Track loading state for each poem

  const [poemSearch, setPoemSearch] = useState("");
  const [showPoemDropdown, setShowPoemDropdown] = useState(false);

  const [formData, setFormData] = useState({
    verseId: 0,
    poemId: "",
    verseNumber: "",
    verseText: "",
  });

  useEffect(() => {
    fetchBooks();
    fetchPoems();
  }, []);

  const fetchVersesByPoemId = (poemId) => {
    if (poemVerses[poemId]) {
      // Already fetched, no need to fetch again
      return Promise.resolve(poemVerses[poemId]);
    }

    setLoadingPoems(prev => ({ ...prev, [poemId]: true }));
    
    return authFetch(API_ENDPOINTS.GET_VERSES(poemId))
      .then((res) => res.json())
      .then((data) => {
        setPoemVerses(prev => ({ ...prev, [poemId]: data }));
        setLoadingPoems(prev => ({ ...prev, [poemId]: false }));
        return data;
      })
      .catch((err) => {
        console.error("Error fetching verses:", err);
        setLoadingPoems(prev => ({ ...prev, [poemId]: false }));
        return [];
      });
  };

  const fetchBooks = () => {
    authFetch(API_ENDPOINTS.GET_BOOKS)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  };

  const fetchPoems = () => {
    authFetch(API_ENDPOINTS.GET_POEMS)
      .then((res) => res.json())
      .then((data) => setPoems(data))
      .catch((err) => console.error("Error fetching poems:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setFormData({ verseId: 0, poemId: "", verseNumber: "", verseText: "" });
    setPoemSearch("");
    setCurrentPoemVerses([]);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (verse) => {
    setFormData({ ...verse });
    const selectedPoem = poems.find((p) => p.poemId === verse.poemId);
    setPoemSearch(selectedPoem ? selectedPoem.title : "");
    setIsEditing(true);
    setShowModal(true);
    
    // Fetch verses for validation
    fetchVersesByPoemId(verse.poemId).then(verses => {
      setCurrentPoemVerses(verses);
    });
  };

  const handleDelete = (id, poemId) => {
    if (!window.confirm("Are you sure you want to delete this verse?")) return;

    authFetch(API_ENDPOINTS.DELETE_VERSE(id), {
      method: "DELETE",
    })
      .then(() => {
        // Remove verse from the specific poem's verses
        setPoemVerses(prev => ({
          ...prev,
          [poemId]: prev[poemId].filter(verse => verse.verseId !== id)
        }));
      })
      .catch((err) => console.error("Error deleting verse:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditing
      ? API_ENDPOINTS.UPDATE_VERSE
      : API_ENDPOINTS.ADD_VERSE;

    const method = isEditing ? "PUT" : "POST";
    console.log("Sending request...");
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Payload (formData):", formData);
    console.log("JSON being sent:", JSON.stringify(formData));
    authFetch(url, {
      method,
      body: JSON.stringify(formData),
    })
      .then(() => {
        // Refresh verses for the specific poem
        setPoemVerses(prev => {
          const updated = { ...prev };
          delete updated[formData.poemId]; // Remove cached data
          return updated;
        });
        if (expandedPoems[formData.poemId]) {
          fetchVersesByPoemId(formData.poemId);
        }
        setShowModal(false);
      })
      .catch((err) => console.error("Error saving verse:", err));
  };

  const selectPoem = (poem) => {
    setFormData((prev) => ({ ...prev, poemId: poem.poemId, verseNumber: '' }));
    setPoemSearch(poem.title);
    setShowPoemDropdown(false);
    
    // Fetch verses for this poem to validate verse numbers
    fetchVersesByPoemId(poem.poemId).then(verses => {
      setCurrentPoemVerses(verses);
    });
  };

  const filteredPoems = poems.filter((poem) =>
    poem.title.toLowerCase().includes(poemSearch.toLowerCase())
  );

  const toggleBook = (bookId) => {
    setExpandedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  const togglePoem = (poemId) => {
    const isCurrentlyExpanded = expandedPoems[poemId];
    setExpandedPoems((prev) => ({ ...prev, [poemId]: !prev[poemId] }));
    
    // Fetch verses when expanding
    if (!isCurrentlyExpanded) {
      fetchVersesByPoemId(poemId);
    }
  };

  // Group verses by book and poem
  const groupedData = books
    .map((book) => {
      const bookPoems = poems.filter((poem) => poem.bookId === book.BookId);
      return {
        book,
        poems: bookPoems.map((poem) => ({
          poem,
          verses: (poemVerses[poem.poemId] || [])
            .sort((a, b) => a.verseNumber - b.verseNumber),
          isLoading: loadingPoems[poem.poemId] || false,
        })),
      };
    })
    .filter((group) => group.poems.length > 0);

  return (
    <>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
              Verses Collection
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Browse verses organized by books and poems
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Verse
          </button>
        </div>

        {/* Accordion Structure */}
        <div className="space-y-4">
          {groupedData.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-900/40 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-xl mb-2">No verses found</p>
              <p className="text-gray-500 text-sm">
                Start by adding your first verse!
              </p>
            </div>
          ) : (
            groupedData.map(({ book, poems: bookPoems }) => (
              <div
                key={book.BookId}
                className="bg-gradient-to-br from-slate-900/40 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Book Header */}
                <button
                  onClick={() => toggleBook(book.BookId)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📘</div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">
                        {book.Title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {book.Genre} • {book.PublicationYear}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      expandedBooks[book.BookId] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Poems List */}
                {expandedBooks[book.BookId] && (
                  <div className="border-t border-white/10 bg-black/20">
                    {bookPoems.map(({ poem, verses: verses, isLoading }) => (
                      <div
                        key={poem.poemId}
                        className="border-b border-white/5 last:border-0"
                      >
                        {/* Poem Header */}
                        <button
                          onClick={() => togglePoem(poem.poemId)}
                          className="w-full px-8 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">→</div>
                            <span className="text-lg font-semibold text-emerald-300">
                              {poem.title}
                            </span>
                            {expandedPoems[poem.poemId] && (
                              <span className="text-sm text-gray-500">
                                ({verses.length} verses)
                              </span>
                            )}
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedPoems[poem.poemId] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Verses List */}
                        {expandedPoems[poem.poemId] && (
                          <div className="px-8 pb-4 space-y-3 bg-black/10">
                            {isLoading ? (
                              <div className="text-center py-4">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                <p className="text-gray-400 text-sm mt-2">Loading verses...</p>
                              </div>
                            ) : verses.length === 0 ? (
                              <p className="text-gray-500 text-sm italic py-2">
                                No verses added yet
                              </p>
                            ) : (
                              verses.map((verse) => (
                                <div
                                  key={verse.verseId}
                                  className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:bg-slate-800/70 transition-colors"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs font-semibold rounded">
                                          Verse {verse.verseNumber}
                                        </span>
                                      </div>
                                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {verse.verseText}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => openEditModal(verse)}
                                        className="p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all"
                                        title="Edit"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete(verse.verseId, poem.poemId)
                                        }
                                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all"
                                        title="Delete"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">
                  {isEditing ? "Edit Verse" : "Add New Verse"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/70 hover:text-white transition"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Poem Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Poem *
                </label>
                <input
                  type="text"
                  value={poemSearch}
                  onChange={(e) => {
                    const searchValue = e.target.value;
                    const matchingPoems = poems.filter((poem) =>
                      poem.title
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    );

                    if (matchingPoems.length > 0 || searchValue === "") {
                      setPoemSearch(searchValue);
                      setFormData((prev) => ({ ...prev, poemId: "" }));
                    }
                    setShowPoemDropdown(true);
                  }}
                  onFocus={() => setShowPoemDropdown(true)}
                  placeholder="Type to search poems..."
                  required={!formData.poemId}
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition"
                />
                {showPoemDropdown && filteredPoems.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredPoems.map((poem) => (
                      <div
                        key={poem.poemId}
                        onClick={() => selectPoem(poem)}
                        className="px-5 py-3 hover:bg-purple-600/30 cursor-pointer text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="font-medium">{poem.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verse Number *
                </label>
                <input
                  type="number"
                  name="verseNumber"
                  value={formData.verseNumber}
                  onChange={(e) => {
                    handleChange(e);
                    // Check for duplicate verse number
                    const verseNum = parseInt(e.target.value);
                    const isDuplicate = currentPoemVerses.some(
                      v => v.verseNumber === verseNum && v.verseId !== formData.verseId
                    );
                    if (isDuplicate) {
                      e.target.setCustomValidity(`Verse number ${verseNum} already exists for this poem`);
                    } else {
                      e.target.setCustomValidity('');
                    }
                  }}
                  required
                  min="1"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition"
                  placeholder="e.g. 1"
                />
                {formData.poemId && currentPoemVerses.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Existing verses: {currentPoemVerses.map(v => v.verseNumber).sort((a, b) => a - b).join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verse Text *
                </label>
                <textarea
                  name="verseText"
                  value={formData.verseText}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition resize-none"
                  placeholder="Enter the verse text here..."
                ></textarea>
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
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-600/50 transform hover:scale-105 transition"
                >
                  {isEditing ? "Update Verse" : "Save Verse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddVerse;
