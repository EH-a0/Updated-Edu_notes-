// components/LandingPage.js
const LandingPage = ({ onStart }) => {
    const highlights = [
        'Capture notes instantly',
        'Search and pin important ideas',
        'Secure sync with Firebase'
    ];

    return React.createElement('div', {},
        React.createElement('div', { className: 'bg-equations' },
            ...highlights.map((t, i) => React.createElement('div', {
                key: i,
                className: 'equation',
                style: {
                    left: `${(i * 23 + 10) % 90}%`,
                    top: `${(i * 17 + 20) % 80}%`,
                    fontSize: `${16 + (i % 3) * 2}px`,
                    fontWeight: 700,
                    color: '#c084fc',
                    opacity: 0.2,
                    animation: 'float 14s ease-in-out infinite',
                    animationDelay: `${i * 0.6}s`
                }
            }, t))
        ),
        React.createElement('div', {
            className: 'login-container',
            style: { textAlign: 'center' }
        },
            React.createElement('div', { className: 'login-card' },
                React.createElement('div', { className: 'login-header' },
                    React.createElement('div', { className: 'login-logo' },
                        React.createElement('i', { className: 'fas fa-edit' })
                    ),
                    React.createElement('h1', { className: 'login-title' }, 'Welcome to Notes Pro'),
                    React.createElement('p', { className: 'login-subtitle' }, 'Your ideas, beautifully organized')
                ),
                React.createElement('button', {
                    onClick: onStart,
                    className: 'auth-button',
                }, React.createElement('i', { className: 'fas fa-arrow-right' }), ' Continue')
            )
        )
    );
};
