import {useRoutes, useParams, Navigate} from 'react-router-dom';
import React, {lazy, ReactElement, ReactNode, Suspense, useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();
const AuthRoutes = lazy(() => import('./auth/AuthRoutes'));
const HomePage = lazy(() => import('../pages/HomePage'));
const OrganisationsPage = lazy(() => import('../pages/OrganisationsPage'));
const SeasonsPage = lazy(() => import('../pages/SeasonsPage'));
// const OrganisationPage = lazy(() => import('../pages/OrganisationPage'));
// const TeamPage = lazy(() => import('../pages/TeamPage'));
// const GamePage = lazy(() => import('../pages/GamePage'));
// const RoundPage = lazy(() => import('../pages/RoundPage'));

interface ProtectedComponentProps {
  children: ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children }): ReactElement | null => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/auth/signin" />;
};

export default function RoutesIndex() {
  let { isAuthenticated } = useAuth();

  let element = useRoutes([
    { path: '/auth/*', element: <AuthRoutes /> },
    { path: '/', element: isAuthenticated
        ? <ProtectedComponent><HomePage /></ProtectedComponent>
        : <Navigate to="/auth/signin" /> },
    { path: '/organisations', element: isAuthenticated
        ? <ProtectedComponent><OrganisationsPage /></ProtectedComponent>
        : <Navigate to="/auth/signin" /> },
    { path: '/organisations/:orgId/seasons', element: isAuthenticated
        ? <ProtectedComponent><SeasonsPage /></ProtectedComponent>
        : <Navigate to="/auth/signin" /> }
    // { path: '/organisations/:orgId/teams/:teamId', element: isAuthenticated ? <ProtectedComponent><TeamPage /></ProtectedComponent> : /* RedirectToSomePage */ },
    // { path: '/organisations/:orgId/seasons/:seasonId', element: isAuthenticated ? <ProtectedComponent><SeasonPage /></ProtectedComponent> : /* RedirectToSomePage */ },
    // { path: '/organisations/:orgId/seasons/:seasonId/games/:gameId', element: isAuthenticated ? <ProtectedComponent><GamePage /></ProtectedComponent> : /* RedirectToSomePage */ },
    // { path: '/organisations/:orgId/seasons/:seasonId/games/:gameId/rounds/:roundId', element: isAuthenticated ? <ProtectedComponent><RoundPage /></ProtectedComponent> : /* RedirectToSomePage */ },
  ]);

  return (
      <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      {element}
    </Suspense>
      </QueryClientProvider>
  );
}
