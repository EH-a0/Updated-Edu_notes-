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
        reader.
