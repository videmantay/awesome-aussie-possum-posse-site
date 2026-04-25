import { Suspense, lazy } from 'react';
import PageLoader from '../design-system/PageLoader';

const CharacterParade = lazy(() => import('../components/CharacterParade'));

function Characters() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CharacterParade />
    </Suspense>
  );
}

export default Characters;
