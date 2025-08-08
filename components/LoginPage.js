// components/LoginPage.js
const LoginPage = ({ onLogin }) => {
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

    return React.createElement('div', {},
        // Background Math & Quotes
        React.createElement('div', { className: 'bg-equations' },
            ...equations.map((eq, idx) => 
                React.createElement('div', {
                    key: `math-${idx}`,
                    className: 'equation',
                    style: {
                        left: `${(idx * 7) % 100}%`,
                        top: `${(idx * 11) % 100}%`,
                        fontSize: `${14 + (idx % 6)}px`,
                        animationDelay: `${idx * 0.3}s`,
                        color: '#d1d5db',
                        fontWeight: 500,
                        opacity: 0.4,
                    }
                }, eq)
            ),
            ...quotes.map((q, idx) => 
                React.createElement('div', {
                    key: `quote-${idx}`,
                    className: 'equation',
                    style: {
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
                    }
                }, `"${q}"`)
            )
        ),

        // Sparkles
        ...sparkles.map(s => 
            React.createElement('div', {
                key: s.id,
                className: 'sparkle',
                style: {
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
                }
            })
        ),

        // Login UI
        React.createElement('div', { className: 'login-container' },
            React.createElement('div', {
                className: 'login-card',
                style: {
                    transform: cardLoaded ? 'translateY(0)' : 'translateY(30px)',
                    opacity: cardLoaded ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }
            },
                React.createElement('div', { className: 'login-header' },
                    React.createElement('button', {
                        type: 'button',
                        className: 'login-logo',
                        onClick: handleLogoClick,
                        style: {
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            background: 'none',
                            border: 'none',
                            padding: 0
                        }
                    }, React.createElement('i', { className: 'fas fa-edit' })),
                    
                    showQuote && React.createElement('div', {
                        className: 'quote-popup',
                        style: {
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
                        }
                    }, currentQuote),
                    
                    React.createElement('h1', { className: 'login-title' }, 'Notes Pro'),
                    React.createElement('p', { className: 'login-subtitle' }, 'Welcome to your digital notebook')
                ),

                React.createElement('div', { className: 'auth-tabs' },
                    React.createElement('button', { 
                        className: `auth-tab ${isLogin ? 'active' : ''}`, 
                        onClick: () => setIsLogin(true) 
                    }, React.createElement('i', { className: 'fas fa-sign-in-alt' }), ' Sign In'),
                    React.createElement('button', { 
                        className: `auth-tab ${!isLogin ? 'active' : ''}`, 
                        onClick: () => setIsLogin(false) 
                    }, React.createElement('i', { className: 'fas fa-user-plus' }), ' Sign Up')
                ),

                error && React.createElement('div', { className: 'error-message' },
                    React.createElement('i', { className: 'fas fa-exclamation-triangle' }), ' ', error
                ),

                React.createElement('form', { onSubmit: handleEmailAuth },
                    !isLogin && React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' },
                            React.createElement('i', { className: 'fas fa-user' }), ' Display Name'
                        ),
                        React.createElement('input', {
                            type: 'text',
                            value: displayName,
                            onChange: e => setDisplayName(e.target.value),
                            className: 'form-input',
                            placeholder: 'Your name'
                        })
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' },
                            React.createElement('i', { className: 'fas fa-envelope' }), ' Email'
                        ),
                        React.createElement('input', {
                            type: 'email',
                            value: email,
                            onChange: e => setEmail(e.target.value),
                            className: 'form-input',
                            placeholder: 'your@email.com',
                            required: true
                        })
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' },
                            React.createElement('i', { className: 'fas fa-lock' }), ' Password'
                        ),
                        React.createElement('input', {
                            type: 'password',
                            value: password,
                            onChange: e => setPassword(e.target.value),
                            className: 'form-input',
                            placeholder: '••••••••',
                            required: true,
                            minLength: 6
                        })
                    ),
                    !isLogin && React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' },
                            React.createElement('i', { className: 'fas fa-lock' }), ' Confirm Password'
                        ),
                        React.createElement('input', {
                            type: 'password',
                            value: confirmPassword,
                            onChange: e => setConfirmPassword(e.target.value),
                            className: 'form-input',
                            placeholder: '••••••••',
                            required: true,
                            minLength: 6
                        })
                    ),
                    React.createElement('button', { 
                        type: 'submit', 
                        className: 'auth-button', 
                        disabled: loading 
                    },
                        loading ? [
                            React.createElement('div', { key: 'spinner', className: 'loading-spinner' }),
                            React.createElement('span', { key: 'text' }, isLogin ? 'Signing In...' : 'Creating Account...')
                        ] : [
                            React.createElement('i', { 
                                key: 'icon', 
                                className: isLogin ? "fas fa-sign-in-alt" : "fas fa-user-plus" 
                            }),
                            React.createElement('span', { key: 'text' }, isLogin ? 'Sign In' : 'Create Account')
                        ]
                    )
                ),

                React.createElement('div', { className: 'divider' }, 
                    React.createElement('span', {}, 'or continue with')
                ),

                React.createElement('button', { 
                    onClick: handleGoogleAuth, 
                    className: 'google-button', 
                    disabled: loading 
                },
                    React.createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24' },
                        React.createElement('path', { fill: '#4285F4', d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' }),
                        React.createElement('path', { fill: '#34A853', d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' }),
                        React.createElement('path', { fill: '#FBBC05', d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' }),
                        React.createElement('path', { fill: '#EA4335', d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' })
                    ),
                    React.createElement('span', {}, 'Google')
                ),

                React.createElement('div', { 
                    className: 'login-footer',
                    style: {
                        textAlign: 'center',
                        marginTop: '24px',
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontStyle: 'italic'
                    }
                }, '💡 Click the logo for more ideas')
            )
        )
    );
};
