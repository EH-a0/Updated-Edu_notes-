// components/App.js
function App() {
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
        return (
            <div className="login-container">
                <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage onLogin={setUser} />;
    }

    return (
        <div>
            <div className="bg-equations">
                {equations.map((eq, i) => (
                    <div key={i} className="equation" style={{
                        left: `${(i * 7) % 100}%`,
                        top: `${(i * 11) % 100}%`,
                        fontSize: `${14 + (i % 6)}px`,
                        animationDelay: `${i * 0.3}s`
                    }}>{eq}</div>
                ))}
            </div>

            <div className="header">
                <div className="header-content">
                    <div className="header-top">
                        <div className="logo-section">
                            <div className="logo"><i className="fas fa-edit"></i></div>
                            <div className="title-section">
                                <h1>Notes Pro</h1>
                                <p>Production-Ready Notes Application</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <div className="search-container">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="clear-search">
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                            <button onClick={exportNotes} className="btn btn-secondary">
                                <i className="fas fa-download"></i> Export
                            </button>
                            <button onClick={() => setShowImportDialog(true)} className="btn btn-secondary">
                                <i className="fas fa-upload"></i> Import
                            </button>
                            <button onClick={() => setIsAddingNote(true)} className="btn btn-primary">
                                <i className="fas fa-plus"></i> Add Note
                            </button>
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                    ) : (
                                        (user.displayName || user.email).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="user-details">
                                    <div className="user-name">{user.displayName || 'User'}</div>
                                    <div className="user-email">{user.email}</div>
                                </div>
                                <button onClick={handleSignOut} className="btn btn-danger" style={{ padding: '6px 8px' }}>
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="stats-grid">
                    <div className="stat-card purple">
                        <div className="stat-icon purple"><i className="fas fa-edit"></i></div>
                        <div className="stat-info">
                            <h3>{notes.length}</h3>
                            <p>Total Notes</p>
                        </div>
                    </div>
                    <div className="stat-card blue">
                        <div className="stat-icon blue"><i className="fas fa-thumbtack"></i></div>
                        <div className="stat-info">
                            <h3>{pinned.length}</h3>
                            <p>Pinned Notes</p>
                        </div>
                    </div>
                    <div className="stat-card green">
                        <div className="stat-icon green"><i className="fas fa-search"></i></div>
                        <div className="stat-info">
                            <h3>{filtered.length}</h3>
                            <p>Search Results</p>
                        </div>
                    </div>
                </div>

                {pinned.length > 0 && (
                    <div className="notes-section">
                        <div className="section-header">
                            <i className="fas fa-thumbtack"></i>
                            <h2>Pinned Notes</h2>
                            <div className="section-line"></div>
                        </div>
                        <div className="notes-grid">
                            {pinned.map(n => (
                                <NoteCard
                                    key={n.id}
                                    note={n}
                                    onUpdate={updateNote}
                                    onDelete={deleteNote}
                                    onPin={togglePin}
                                    isPinned={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {unpinned.length > 0 && (
                    <div className="notes-section">
                        {pinned.length > 0 && (
                            <div className="section-header">
                                <div style={{ width: '20px' }}></div>
                                <h2>All Notes</h2>
                                <div className="section-line"></div>
                            </div>
                        )}
                        <div className="notes-grid">
                            {unpinned.map(n => (
                                <NoteCard
                                    key={n.id}
                                    note={n}
                                    onUpdate={updateNote}
                                    onDelete={deleteNote}
                                    onPin={togglePin}
                                    isPinned={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className={searchTerm ? "fas fa-search" : "fas fa-edit"}></i>
                        </div>
                        <h3>{searchTerm ? 'No notes found' : 'No notes yet'}</h3>
                        <p>
                            {searchTerm 
                                ? `No notes match "${searchTerm}". Try a different search term.`
                                : 'Create your first note to get started with your digital notebook'
                            }
                        </p>
                        {!searchTerm && (
                            <button onClick={() => setIsAddingNote(true)} className="btn btn-primary">
                                <i className="fas fa-plus"></i> Create Your First Note
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            {isAddingNote && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <div className="form-header">
                            <h2>Create New Note</h2>
                            <button onClick={() => { setIsAddingNote(false); setNewNote({ title: '', content: '' }); }} className="close-btn">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Note title..."
                                value={newNote.title}
                                onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))}
                                className="form-input"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Write your note here..."
                                value={newNote.content}
                                onChange={e => setNewNote(p => ({ ...p, content: e.target.value }))}
                                className="form-textarea"
                            ></textarea>
                        </div>
                        <div className="form-actions">
                            <button onClick={addNote} className="btn btn-primary">
                                <i className="fas fa-save"></i> Create Note
                            </button>
                            <button onClick={() => { setIsAddingNote(false); setNewNote({ title: '', content: '' }); }} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportDialog && (
                <div className="form-overlay">
                    <div className="form-modal">
                        <div className="form-header">
                            <h2>Import Notes</h2>
                            <button onClick={() => setShowImportDialog(false)} className="close-btn">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                            Select a JSON file to import your notes.
                        </p>
                        <input type="file" accept=".json" onChange={handleImport} className="file-input" />
                        <div className="form-actions">
                            <button onClick={() => setShowImportDialog(false)} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}