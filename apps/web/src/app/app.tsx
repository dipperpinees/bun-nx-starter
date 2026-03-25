import { useEffect, useMemo, useState } from 'react';
import { initKeycloak, keycloak } from '../auth/keycloak';
import { Button } from '@ui';

type MeResponse = {
  sub?: string;
  username?: string;
  email?: string;
  name?: string;
  roles?: string[];
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function App() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    username?: string;
    email?: string;
    name?: string;
  } | null>(null);
  const [apiResult, setApiResult] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenPreview = useMemo(() => {
    if (!keycloak.token) return 'No token';
    return `${keycloak.token.slice(0, 20)}...${keycloak.token.slice(-20)}`;
  }, [isAuthenticated]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const authenticated = await initKeycloak();
        if (!mounted) return;

        setIsAuthenticated(authenticated);
        if (authenticated) {
          await loadUserProfile();
          await callProtectedApi();
        }
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : 'Cannot initialize Keycloak client',
        );
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await keycloak.loadUserProfile();
      setUserProfile({
        username: profile.username,
        email: profile.email,
        name:
          profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : profile.firstName ?? profile.lastName,
      });
    } catch {
      setUserProfile({ username: keycloak.tokenParsed?.preferred_username });
    }
  };

  const callProtectedApi = async () => {
    if (!keycloak.authenticated) {
      setError('You are not logged in');
      return;
    }

    try {
      await keycloak.updateToken(30);

      const response = await fetch(`${apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const json = (await response.json()) as MeResponse;
      setApiResult(json);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Cannot call protected API endpoint',
      );
    }
  };

  const handleLogin = async () => {
    await keycloak.login({ redirectUri: window.location.href });
  };

  const handleLogout = async () => {
    await keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Keycloak Demo (FE + BE)</h1>
          <p className="text-gray-300">
            FE đăng nhập bằng Keycloak và gọi API protected tại
            <span className="text-cyan-300"> /api/v1/auth/me</span>.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
          <h2 className="text-xl font-semibold">Authentication</h2>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Status: {isReady ? (isAuthenticated ? 'Authenticated' : 'Guest') : 'Initializing...'}</p>
            <p>Realm: {import.meta.env.VITE_KEYCLOAK_REALM ?? 'bun-nx'}</p>
            <p>Client: {import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'web-client'}</p>
            <p>Token: {tokenPreview}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void handleLogin()} variant="primary" size="md">
              Login With Keycloak
            </Button>
            <Button onClick={() => void handleLogout()} variant="secondary" size="md">
              Logout
            </Button>
            <Button onClick={() => void callProtectedApi()} variant="ghost" size="md">
              Call /auth/me
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <pre className="text-sm text-gray-200 overflow-x-auto">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
          <h2 className="text-xl font-semibold">Protected API Result</h2>
          <pre className="text-sm text-gray-200 overflow-x-auto">
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
            <h2 className="text-lg font-semibold text-red-200">Error</h2>
            <p className="text-red-100 text-sm mt-2">{error}</p>
          </section>
        ) : null}

        <footer className="text-xs text-gray-500">
          Demo account after realm import: <strong>demo / demo123</strong>
        </footer>
      </div>
    </div>
  );
}

export default App;
