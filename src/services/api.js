// API Base URL Configuration
// Change this URL in one place to update all API endpoints
export const API_BASE_URL = 'https://sheltered-mountain-64913-f230179cbd70.herokuapp.com';

// API Endpoints
export const API_ENDPOINTS = {
    // User endpoints
    LOGIN: `${API_BASE_URL}/users/Login`,
    SIGNUP: `${API_BASE_URL}/users/Signup`,
    
    // Book endpoints
    GET_BOOKS: `${API_BASE_URL}/books/getBooks`,
    ADD_BOOK: `${API_BASE_URL}/books/addBook`,
    UPDATE_BOOK: `${API_BASE_URL}/books/updateBook`,
    DELETE_BOOK: (id) => `${API_BASE_URL}/books/deleteBook/${id}`,
    
    // Poet endpoints
    GET_POETS: `${API_BASE_URL}/poets/getPoets`,
    ADD_POET: `${API_BASE_URL}/poets/addPoet`,
    UPDATE_POET: `${API_BASE_URL}/poets/updatePoet`,
    DELETE_POET: (id) => `${API_BASE_URL}/poets/deletePoet/${id}`,
    
    // Poem endpoints
    GET_POEMS: `${API_BASE_URL}/poems/getPoems`,
    ADD_POEM: `${API_BASE_URL}/poems/addPoem`,
    UPDATE_POEM: `${API_BASE_URL}/poems/updatePoem`,
    DELETE_POEM: (id) => `${API_BASE_URL}/poems/deletePoem/${id}`,
    
    // Verse endpoints
    GET_VERSES: (poemId) => `${API_BASE_URL}/verses/getVerse/${poemId}`,
    ADD_VERSE: `${API_BASE_URL}/verses/addVerse`,
    UPDATE_VERSE: `${API_BASE_URL}/verses/updateVerse`,
    DELETE_VERSE: (id) => `${API_BASE_URL}/verses/deleteVerse/${id}`,
    
    // Lemma endpoints
    GET_ALL_LEMAS: `${API_BASE_URL}/lemas/getAllLemas`,
    
    // Root endpoints
    GET_ALL_ROOTS: `${API_BASE_URL}/roots/getAllRoots`,
    
    // Token endpoints
    GET_ALL_TOKENS: `${API_BASE_URL}/tokens/getTokens`,
};
