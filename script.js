// script.js
// Make React hooks available globally
const { useState, useEffect, useReducer } = React;

// Define notesReducer globally
const notesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTES': 
            return action.payload;
        case 'ADD_NOTE': 
            return [action.payload, ...state];
        case 'DELETE_NOTE': 
            return state.filter(n => n.id !== action.payload);
        case 'UPDATE_NOTE': 
            return state.map(n => n.id === action.payload.id ? { ...n, ...action.payload.updates } : n);
        case 'TOGGLE_PIN': 
            return state.map(n => n.id === action.payload ? { ...n, isPinned: !n.isPinned } : n);
        case 'IMPORT_NOTES': 
            return [...action.payload, ...state];
        default: 
            return state;
    }
};

// Wait for all components to load before rendering
window.addEventListener('load', () => {
    // Small delay to ensure all babel transforms are complete
    setTimeout(() => {
        ReactDOM.render(React.createElement(App), document.getElementById('root'));
    }, 100);
});
