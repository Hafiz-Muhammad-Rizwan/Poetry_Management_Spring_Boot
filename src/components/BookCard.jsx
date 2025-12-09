import React from 'react';

const BookCard = ({ book, authorName, onEdit, onDelete }) => {
    return (
        <div className="group relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105">
            <div className="p-8 text-center">
                <div className="w-24 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{book.Title}</h3>
                <div className="space-y-3 text-gray-300">
                    <p><span className="text-purple-400">Author:</span> {authorName}</p>
                    <p><span className="text-purple-400">Year:</span> {book.PublicationYear || '—'}</p>
                    <p><span className="text-purple-400">Genre:</span> {book.Genre}</p>
                </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
                <button onClick={() => onEdit(book)} className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-purple-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button onClick={() => onDelete(book.BookId)} className="p-3 bg-red-600/80 backdrop-blur rounded-full hover:bg-red-700 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default BookCard;