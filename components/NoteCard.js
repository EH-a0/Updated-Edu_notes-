const NoteCard = ({ note, onUpdate, onDelete, onPin, isPinned }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);

    const handleSave = () => {
        onUpdate(note.id, { title: editTitle.trim(), content: editContent.trim() });
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditTitle(note.title);
            setEditContent(note.content);
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className={`note-card ${isPinned ? 'pinned' : ''}`}>
            <div className="note-content">
                <div className="note-header">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="note-title-input"
                            placeholder="Note title..."
                        />
                    ) : (
                        <h3 className="note-title">{note.title}</h3>
                    )}
                    <div className="note-actions">
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    handleSave();
                                } else {
                                    setIsEditing(true);
                                    setEditTitle(note.title);
                                    setEditContent(note.content);
                                }
                            }}
                            className="note-btn"
                            title={isEditing ? 'Save (Ctrl+Enter)' : 'Edit note'}
                        >
                            <i className={isEditing ? "fas fa-save" : "fas fa-edit"}></i>
                        </button>
                        <button
                            onClick={() => onPin(note.id)}
                            className={`note-btn ${isPinned ? 'pinned' : ''}`}
                            title={isPinned ? 'Unpin note' : 'Pin note'}
                        >
                            <i className={isPinned ? "fas fa-thumbtack" : "far fa-thumbtack"}></i>
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="note-btn delete"
                            title="Delete note"
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="note-textarea"
                        placeholder="Write your note here..."
                    ></textarea>
                ) : (
                    <div className="note-text">
                        {note.content || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No content</span>}
                    </div>
                )}
                <div className="note-footer">
                    <div>
                        <div>Created: {formatDate(note.createdAt)}</div>
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                            <div>Updated: {formatDate(note.updatedAt)}</div>
                        )}
                    </div>
                    {isPinned && (
                        <div className="pin-badge">
                            <i className="fas fa-thumbtack"></i>
                            Pinned
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;