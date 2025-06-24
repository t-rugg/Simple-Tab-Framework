export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1>Simple Tab Framework</h1>
      <p style={{ marginBottom: '2rem' }}>
        A flexible tab management system built with React and Next.js
      </p>
      <a
        href="/play"
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        Try the Tab Manager
      </a>
    </div>
  );
}
