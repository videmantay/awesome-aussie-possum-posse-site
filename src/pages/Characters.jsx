import { Suspense, lazy } from 'react';
import { Link } from 'react-router';
import PageLoader from '../design-system/PageLoader';

const CharacterParade = lazy(() => import('../components/CharacterParade'));

function Characters() {
  return (
    <div>
      <Suspense fallback={<PageLoader />}>
        <CharacterParade />
      </Suspense>
      <div
        style={{
          background: '#2a1500',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1.5rem 2rem',
        }}
      >
        <Link
          to="/about"
          style={{
            background: '#c45a1a',
            color: '#fdf4eb',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          Read the Book →
        </Link>
        <Link
          to="/parents"
          style={{
            background: 'transparent',
            color: '#f5c87a',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            border: '2px solid #f5c87a',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
          }}
        >
          For Parents →
        </Link>
      </div>
    </div>
  );
}

export default Characters;
