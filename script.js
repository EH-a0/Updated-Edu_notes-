// script.js
// Define notesReducer globally
const notesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTES': return action.payload;
        case 'ADD_NOTE': return [action.payload, ...state];
        case 'DELETE_NOTE': return state.filter(n => n.id !== action.payload);
        case 'UPDATE_NOTE': return state.map(n => n.id === action.payload.id ? { ...n, ...action.payload.updates } : n);
        case 'TOGGLE_PIN': return state.map(n => n.id === action.payload ? { ...n, isPinned: !n.isPinned } : n);
        case 'IMPORT_NOTES': return [...action.payload, ...state];
        default: return state;
    }
};

// Render App
ReactDOM.render(<App />, document.getElementById('root'));