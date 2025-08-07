// components/LoginPage.js
function LoginPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQuote, setShowQuote] = useState(false);
    const [currentQuote, setCurrentQuote] = useState('');
    const [sparkles, setSparkles] = useState([]);
    const [cardLoaded, setCardLoaded] = useState(false);

    const equations = [
        'E = mc²', 'F = ma', 'a² + b² = c²', 'e^(iπ) + 1 = 0', '∇ · E = ρ/ε₀',
        '∫ f(x)dx', '∂u/∂t = α∇²u', 'det(A)', '∑ 1/n² = π²/6', 'φ = (1+√5)/2',
        'sin²θ + cos²θ = 1', 'lim(x→∞) 1/x = 0', 'P(A∩B) = P(A)P(B|A)', 'λ = h/p',
        'A = πr²', 'V = ⁴⁄₃πr³', 'c = λν', 'F = G(m₁m₂)/r²', 'KE = ½mv²', 'PV = nRT'
    ];

    const quotes = [
        "Ideas shape the future.",
        "Write it down before it slips away.",
        "Your thoughts are your superpower.",
        "Creativity begins with a single note.",
        "Capture today, inspire tomorrow.",
        "Great things start with small ideas.",
        "The mind is a notebook of possibilities.",
        "One idea can change everything."
    ];

    const createSparkles = () => {
        const newSparkles = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            left: `${20 + Math.random() * 60}%`,
            top: `${40 + Math.random() * 10}%`,
            delay: Math.random() * 0.5,
        }));
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 1500);
    };

    const handleLogoClick = () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);
        setShowQuote(true);
        createSparkles();
        setTimeout(() => setShowQuote(false), 4000);
    };

    useEffect(() => {
        const timer = setTimeout(() => setCardLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                if (password !== confirmPassword) throw new Error("Passwords don't match");
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (displayName) {
                    await userCredential.user.updateProfile({ displayName });
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Background Math & Quotes */}
            <div className="bg-equations">
                {equations.map((eq, idx) => (
                    <div
                        key={`math-${idx}`}
                        className="equation"
                        style={{
                            left: `${(idx * 7) % 100}%`,
                            top: `${(idx * 11) % 100}%`,
                            fontSize: `${14 + (idx % 6)}px`,
                            animationDelay: `${idx * 0.3}s`,
                            color: '#d1d5db',
                            fontWeight: 500,
                            opacity: 0.4,
                        }}
                    >
                        {eq}
                    </div>
                ))}
                {quotes.map((q, idx) => (
                    <div
                        key={`quote-${idx}`}
                        className="equation"
                        style={{
                            left: `${(idx * 13) % 100}%`,
                            top: `${(idx * 7 + 10) % 100}%`,
                            fontSize: '15px',
                            color: '#c084fc',
                            fontWeight: 600,
                            opacity: 0.18,
                            fontFamily: 'Georgia, serif',
                            fontStyle: 'italic',
                            animation: 'float 15s ease-in-out infinite',
                            animationDelay: `${idx * 1.5}s`,
                        }}
                    >
                        "{q}"
                    </div>
                ))}
            </div>

            {/* Sparkles */}
            {sparkles.map(s => (
                <div
                    key={s.id}
                    className="sparkle"
                    style={{
                        position: 'fixed',
                        top: s.top,
                        left: s.left,
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px 2px rgba(192, 132, 252, 0.8)',
                        opacity: 0,
                        animation: `sparkle 1s ease-out ${s.delay}s forwards`,
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                />
            ))}

            {/* Login UI */}
            <div className="login-container">
                <div
                    className="login-card"
                    style={{
                        transform: cardLoaded ? 'translateY(0)' : 'translateY(30px)',
                        opacity: cardLoaded ? 1 : 0,
                        transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                >
                    <div className="login-header">
                        <div
                            className="login-logo"
                            onClick={handleLogoClick}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseDown={e => e.target.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.target.style.transform = 'scale(1)'}
                        >
                            <i className="fas fa-edit"></i>
                        </div>
                        {showQuote && (
                            <div
                                className="quote-popup"
                                style={{
                                    position: 'absolute',
                                    top: '180px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(124, 58, 237, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid #d8b4fe',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    maxWidth: '300px',
                                    textAlign: 'center',
                                    color: '#a855f7',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    fontFamily: 'Georgia, serif',
                                    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                                    animation: 'fadeInUp 0.4s ease-out',
                                    zIndex: 100,
                                }}
                            >
                                {currentQuote}
                            </div>
                        )}
                        <h1 className="login-title">Notes Pro</h1>
                        <p className="login-subtitle">Welcome to your digital notebook</p>
                    </div>

                    <div className="auth-tabs">
                        <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
                            <i className="fas fa-sign-in-alt"></i> Sign In
                        </button>
                        <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
                            <i className="fas fa-user-plus"></i> Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-user"></i> Display Name
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    className="form-input"
                                    placeholder="Your name"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-lock"></i> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                                minLength="6"
                            />
                        </div>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-lock"></i> Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                />
                            </div>
                        )}
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                                </>
                            ) : (
                                <>
                                    <i className={isLogin ? "fas fa-sign-in-alt" : "fas fa-user-plus"}></i>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="divider"><span>or continue with</span></div>

                    <button onClick={handleGoogleAuth} className="google-button" disabled={loading}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Google</span>
                    </button>

                    <div className="login-footer" style={{
                        textAlign: 'center',
                        marginTop: '24px',
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontStyle: 'italic'
                    }}>
                        💡 Click the logo for more ideas
                    </div>
                </div>
            </div>
        </div>
    );
}