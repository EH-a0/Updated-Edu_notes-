// components/App.js
const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, dispatch] = useReducer(notesReducer, []);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [showImportDialog, setShowImportDialog] = useState(false);

    const equations = [
        'E = mc²', 'F = ma', 'a² + b² = c²', 'e^(iπ) + 1 = 0', '∇ · E = ρ/ε₀',
        '∫ f(x)dx', '∂u/∂t = α∇²u', 'det(A)', '∑ 1/n² = π²/6', 'φ = (1+√5)/2',
        'sin²θ + cos²θ = 1', 'lim(x→∞) 1/x = 0', 'P(A∩B) = P(A)P(B|A)', 'λ = h/p',
        'A = πr²', 'V = ⁴⁄₃πr³', 'c = λν', 'F = G(m₁m₂)/r²', 'KE = ½mv²', 'PV = nRT'
    ];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const unsubscribe = db.collection('notes')
                .where('userId', '==', user.uid)
                .orderBy('updatedAt', 'desc')
                .onSnapshot(snapshot => {
                    const userNotes = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    dispatch({ type: 'SET_NOTES', payload: userNotes });
                });
            return () => unsubscribe();
        }
    }, [user]);

    const addNote = async () => {
        if (!user || (!newNote.title.trim() && !newNote.content.trim())) return;
        const note = {
            title: newNote.title.trim() || 'Untitled Note',
            content: newNote.content.trim(),
            isPinned: false,
            userId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        try {
            await db.collection('notes').add(note);
            setNewNote({ title: '', content: '' });
            setIsAddingNote(false);
        } catch (err) {
            alert('Error adding note: ' + err.message);
        }
    };

    const deleteNote = async (id) => {
        if (!confirm('Delete this note?')) return;
        try {
            await db.collection('notes').doc(id).delete();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const togglePin = async (id) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        try {
            await db.collection('notes').doc(id).update({
                isPinned: !note.isPinned,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const updateNote = async (id, updates) => {
        try {
            await db.collection('notes').doc(id).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const exportNotes = () => {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const filename = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', filename);
        link.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const imported = JSON.parse(evt.target.result);
                if (Array.isArray(imported)) {
                    const batch = db.batch();
                    imported.forEach(n => {
                        const ref = db.collection('notes').doc();
                        batch.set(ref, {
                            ...n,
                            userId: user.uid,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });
                    await batch.commit();
                    setShowImportDialog(false);
                    alert(`Imported ${imported.length} notes!`);
                } else {
                    alert('Invalid format.');
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const filtered = notes.filter(n =>
        !searchTerm ||
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const pinned = filtered.filter(n => n.isPinned);
    const unpinned = filtered.filter(n => !n.isPinned);

    if (loading) {
        return React.createElement('div', { className: 'login-container' },
            React.createElement('div', { 
                className: 'loading-spinner', 
                style: { width: '40px', height: '40px' } 
            })
        );
    }

    if (!user) {
        return React.createElement(LoginPage, { onLogin: setUser });
    }

    return React.createElement('div', {},
        React.createElement('div', { className: 'bg-equations' },
            ...equations.map((eq, i) =>
                React.createElement('div', {
                    key: i,
                    className: 'equation',
                    style: {
                        left: `${(i * 7) % 100}%`,
                        top: `${(i * 11) % 100}%`,
                        fontSize: `${14 + (i % 6)}px`,
                        animationDelay: `${i * 0.3}s`
                    }
                }, eq)
            )
        ),

        React.createElement('div', { className: 'header' },
            React.createElement('div', { className: 'header-content' },
                React.createElement('div', { className: 'header-top' },
                    React.createElement('div', { className: 'logo-section' },
                        React.createElement('div', { className: 'logo' },
                            React.createElement('i', { className: 'fas fa-edit' })
                        ),
                        React.createElement('div', { className: 'title-section' },
                            React.createElement('h1', {}, 'Notes Pro'),
                            React.createElement('p', {}, 'Production-Ready Notes Application')
                        )
                    ),
                    React.createElement('div', { className: 'header-actions' },
                        React.createElement('div', { className: 'search-container' },
                            React.createElement('i', { className: 'fas fa-search search-icon' }),
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Search notes...',
                                value: searchTerm,
                                onChange: e => setSearchTerm(e.target.value),
                                className: 'search-input'
                            }),
                            searchTerm && React.createElement('button', {
                                onClick: () => setSearchTerm(''),
                                className: 'clear-search'
                            }, React.createElement('i', { className: 'fas fa-times' }))
                        ),
                        React.createElement('button', {
                            onClick: exportNotes,
                            className: 'btn btn-secondary'
                        },
                            React.createElement('i', { className: 'fas fa-download' }),
                            ' Export'
                        ),
                        React.createElement('button', {
                            onClick: () => setShowImportDialog(true),
                            className: 'btn btn-secondary'
                        },
                            React.createElement('i', { className: 'fas fa-upload' }),
                            ' Import'
                        ),
                        React.createElement('button', {
                            onClick: () => setIsAddingNote(true),
                            className: 'btn btn-primary'
                        },
                            React.createElement('i', { className: 'fas fa-plus' }),
                            ' Add Note'
                        ),
                        React.createElement('div', { className: 'user-info' },
                            React.createElement('div', { className: 'user-avatar' },
                                user.photoURL ?
                                    React.createElement('img', {
                                        src: user.photoURL,
                                        alt: 'Profile',
                                        style: { width: '100%', height: '100%', borderRadius: '50%' }
                                    }) :
                                    (user.displayName || user.email).charAt(0).toUpperCase()
                            ),
                            React.createElement('div', { className: 'user-details' },
                                React.createElement('div', { className: 'user-name' }, user.displayName || 'User'),
                                React.createElement('div', { className: 'user-email' }, user.email)
                            ),
                            React.createElement('button', {
                                onClick: handleSignOut,
                                className: 'btn btn-danger',
                                style: { padding: '6px 8px' }
                            }, React.createElement('i', { className: 'fas fa-sign-out-alt' }))
                        )
                    )
                )
            )
        ),

        React.createElement('div', { className: 'main-content' },
            React.createElement('div', { className: 'stats-grid' },
                React.createElement('div', { className: 'stat-card purple' },
                    React.createElement('div', { className: 'stat-icon purple' },
                        React.createElement('i', { className: 'fas fa-edit' })
                    ),
                    React.createElement('div', { className: 'stat-info' },
                        React.createElement('h3', {}, notes.length),
                        React.createElement('p', {}, 'Total Notes')
                    )
                ),
                React.createElement('div', { className: 'stat-card blue' },
                    React.createElement('div', { className: 'stat-icon blue' },
                        React.createElement('i', { className: 'fas fa-thumbtack' })
                    ),
                    React.createElement('div', { className: 'stat-info' },
                        React.createElement('h3', {}, pinned.length),
                        React.createElement('p', {}, 'Pinned Notes')
                    )
                ),
                React.createElement('div', { className: 'stat-card green' },
                    React.createElement('div', { className: 'stat-icon green' },
                        React.createElement('i', { className: 'fas fa-search' })
                    ),
                    React.createElement('div', { className: 'stat-info' },
                        React.createElement('h3', {}, filtered.length),
                        React.createElement('p', {}, 'Search Results')
                    )
                )
            ),

            pinned.length > 0 && React.createElement('div', { className: 'notes-section' },
                React.createElement('div', { className: 'section-header' },
                    React.createElement('i', { className: 'fas fa-thumbtack' }),
                    React.createElement('h2', {}, 'Pinned Notes'),
                    React.createElement('div', { className: 'section-line' })
                ),
                React.createElement('div', { className: 'notes-grid' },
                    ...pinned.map(n =>
                        React.createElement(NoteCard, {
                            key: n.id,
                            note: n,
                            onUpdate: updateNote,
                            onDelete: deleteNote,
                            onPin: togglePin,
                            isPinned: true
                        })
                    )
                )
            ),

            unpinned.length > 0 && React.createElement('div', { className: 'notes-section' },
                pinned.length > 0 && React.createElement('div', { className: 'section-header' },
                    React.createElement('div', { style: { width: '20px' } }),
                    React.createElement('h2', {}, 'All Notes'),
                    React.createElement('div', { className: 'section-line' })
                ),
                React.createElement('div', { className: 'notes-grid' },
                    ...unpinned.map(n =>
                        React.createElement(NoteCard, {
                            key: n.id,
                            note: n,
                            onUpdate: updateNote,
                            onDelete: deleteNote,
                            onPin: togglePin,
                            isPinned: false
                        })
                    )
                )
            ),

            filtered.length === 0 && React.createElement('div', { className: 'empty-state' },
                React.createElement('div', { className: 'empty-icon' },
                    React.createElement('i', { className: searchTerm ? "fas fa-search" : "fas fa-edit" })
                ),
                React.createElement('h3', {}, searchTerm ? 'No notes found' : 'No notes yet'),
                React.createElement('p', {},
                    searchTerm
                        ? `No notes match "${searchTerm}". Try a different search term.`
                        : 'Create your first note to get started with your digital notebook'
                ),
                !searchTerm && React.createElement('button', {
                    onClick: () => setIsAddingNote(true),
                    className: 'btn btn-primary'
                },
                    React.createElement('i', { className: 'fas fa-plus' }),
                    ' Create Your First Note'
                )
            )
        ),

        // Add Note Modal
        isAddingNote && React.createElement('div', { className: 'form-overlay' },
            React.createElement('div', { className: 'form-modal' },
                React.createElement('div', { className: 'form-header' },
                    React.createElement('h2', {}, 'Create New Note'),
                    React.createElement('button', {
                        onClick: () => { setIsAddingNote(false); setNewNote({ title: '', content: '' }); },
                        className: 'close-btn'
                    }, React.createElement('i', { className: 'fas fa-times' }))
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Note title...',
                        value: newNote.title,
                        onChange: e => setNewNote(p => ({ ...p, title: e.target.value })),
                        className: 'form-input',
                        autoFocus: true
                    })
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('textarea', {
                        placeholder: 'Write your note here...',
                        value: newNote.content,
                        onChange: e => setNewNote(p => ({ ...p, content: e.target.value })),
                        className: 'form-textarea'
                    })
                ),
                React.createElement('div', { className: 'form-actions' },
                    React.createElement('button', {
                        onClick: addNote,
                        className: 'btn btn-primary'
                    },
                        React.createElement('i', { className: 'fas fa-save' }),
                        ' Create Note'
                    ),
                    React.createElement('button', {
                        onClick: () => { setIsAddingNote(false); setNewNote({ title: '', content: '' }); },
                        className: 'btn btn-secondary'
                    }, 'Cancel')
                )
            )
        ),

        // Import Modal
        showImportDialog && React.createElement('div', { className: 'form-overlay' },
            React.createElement('div', { className: 'form-modal' },
                React.createElement('div', { className: 'form-header' },
                    React.createElement('h2', {}, 'Import Notes'),
                    React.createElement('button', {
                        onClick: () => setShowImportDialog(false),
                        className: 'close-btn'
                    }, React.createElement('i', { className: 'fas fa-times' }))
                ),
                React.createElement('p', {
                    style: { marginBottom: '16px', color: '#6b7280' }
                }, 'Select a JSON file to import your notes.'),
                React.createElement('input', {
                    type: 'file',
                    accept: '.json',
                    onChange: handleImport,
                    className: 'file-input'
                }),
                React.createElement('div', { className: 'form-actions' },
                    React.createElement('button', {
                        onClick: () => setShowImportDialog(false),
                        className: 'btn btn-secondary'
                    }, 'Cancel')
                )
            )
        )
    );
};
