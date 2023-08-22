import {useRoutes, Navigate} from 'react-router-dom';
import React, {lazy, ReactElement, ReactNode, Suspense} from 'react';
import { useAuth } from '../hooks/useAuth';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();
const AuthRoutes = lazy(() => import('./auth/AuthRoutes'));
const HomePage = lazy(() => import('../pages/HomePage'));
const OrganisationsPage = lazy(() => import('../pages/OrganisationsPage'));
const SeasonsPage = lazy(() => import('../pages/SeasonsPage'));
const TeamsPage = lazy(() => import('../pages/TeamsPage'));
const GamesPage = lazy(() => import('../pages/GamesPage'));
// const OrganisationPage = lazy(() => import('../pages/OrganisationPage'));
// const RoundPage = lazy(() => import('../pages/RoundPage'));

interface ProtectedComponentProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedComponentProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/signin" />;
};

export default function RoutesIndex() {
  const routes = useRoutes([
    { path: '/auth/*', element: <AuthRoutes /> },
    { path: '/', element: <ProtectedRoute><HomePage /></ProtectedRoute> },
    { path: '/organisations', element: <ProtectedRoute><OrganisationsPage /></ProtectedRoute> },
    { path: '/organisations/:orgId/seasons', element: <ProtectedRoute><SeasonsPage /></ProtectedRoute> },
    { path: '/organisations/:orgId/teams', element: <ProtectedRoute><TeamsPage /></ProtectedRoute> },
    { path: '/organisations/:orgId/seasons/:seasonId/games', element: <ProtectedRoute><GamesPage /></ProtectedRoute> },
    // { path: '/organisations/:orgId/seasons/:seasonId', element: <ProtectedRoute><SeasonPage /></ProtectedRoute> },
    // { path: '/organisations/:orgId/seasons/:seasonId/games/:gameId/rounds/:roundId', element: <ProtectedRoute><RoundPage /></ProtectedRoute> },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        {routes}
      </Suspense>
    </QueryClientProvider>
  );
}
