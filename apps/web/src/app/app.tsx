import { useEffect, useState } from 'react';
import { getAuthenticatedUser, initAuthentik, login, logout } from '../auth/authentik';

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
  const displayName = userProfile?.name || userProfile?.username || 'Operator';
  const avatarText = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const authenticated = await initAuthentik();
        if (!mounted) return;

        setIsAuthenticated(authenticated);
        if (authenticated) {
          await loadUserProfileAndToken();
          await callProtectedApi();
        }
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : 'Cannot initialize Authentik client',
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

  const loadUserProfileAndToken = async () => {
    const user = await getAuthenticatedUser();
    if (!user) {
      setUserProfile(null);
      return;
    }

    setUserProfile({
      username:
        (typeof user.profile.preferred_username === 'string' &&
          user.profile.preferred_username) ||
        (typeof user.profile.nickname === 'string' && user.profile.nickname) ||
        (typeof user.profile.name === 'string' && user.profile.name) ||
        undefined,
      email:
        typeof user.profile.email === 'string' ? user.profile.email : undefined,
      name: typeof user.profile.name === 'string' ? user.profile.name : undefined,
    });
  };

  const callProtectedApi = async () => {
    const user = await getAuthenticatedUser();
    if (!user) {
      setError('You are not logged in');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
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
    await login();
  };

  const handleLogout = async () => {
    await logout();
  };

  const dashboardStats = [
    {
      label: 'Revenue',
      value: '$12,480',
      delta: '+8.2%',
      tone: 'text-emerald-300',
    },
    {
      label: 'Active Users',
      value: '1,238',
      delta: '+4.1%',
      tone: 'text-sky-300',
    },
    {
      label: 'Conversion',
      value: '3.42%',
      delta: '+0.6%',
      tone: 'text-amber-300',
    },
  ];

  const activities = [
    'Lead imported from onboarding form',
    'Payment webhook processed successfully',
    'New role assignment pending review',
  ];

  if (!isAuthenticated) {
    return (
      <div className="auth-page min-h-screen text-white px-4 py-6 sm:px-6 lg:px-10">
        <main className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section>
              <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/85">Authentik Gateway</p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                Secure Access
                <br />
                for Your Workspace
              </h1>
              <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-300">
                Đăng nhập để truy cập dashboard nội bộ. Luồng xác thực sử dụng OIDC + PKCE thông qua Authentik.
              </p>
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => void handleLogin()}
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  Đăng nhập ngay
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Trạng thái: {isReady ? 'Sẵn sàng đăng nhập' : 'Đang khởi tạo...'}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Connection Info</h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                <p>Hệ thống dùng Authentik để đăng nhập an toàn.</p>
                <p>Nhấn đăng nhập để truy cập dashboard.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Security</p>
                  <p className="mt-1 text-sm font-semibold">OIDC + PKCE</p>
                </article>
                <article className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Backend</p>
                  <p className="mt-1 text-sm font-semibold">NestJS Guard</p>
                </article>
              </div>
            </section>
          </div>
        </main>

        {error ? (
          <section className="mx-auto mt-6 max-w-6xl rounded-2xl border border-rose-300/35 bg-rose-500/10 p-4">
            <h2 className="text-sm font-semibold text-rose-200">Error</h2>
            <p className="mt-1 text-sm text-rose-100">{error}</p>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="auth-page min-h-screen text-white px-4 py-6 sm:px-6 lg:px-10">
      <div className="auth-grid mx-auto max-w-7xl">
        <aside className="rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 lg:p-8 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Control Center</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight">
              Authentik
              <br />
              Web Console
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Trải nghiệm đăng nhập OIDC + dashboard mô phỏng. Giữ nguyên flow Authentik, nâng cấp UI cho dễ dùng hơn.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">User</p>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-cyan-300/20 border border-cyan-200/40 flex items-center justify-center text-sm font-semibold text-cyan-100">
                {avatarText || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">{displayName}</p>
                <p className="text-xs text-slate-300">Authenticated</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center justify-center rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600"
            >
              Đăng xuất
            </button>
          </div>

        </aside>

        <main className="rounded-3xl border border-white/10 bg-slate-950/55 backdrop-blur-xl p-6 lg:p-8">
          <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Dashboard</p>
                <h2 className="mt-1 text-3xl font-semibold">Welcome back, {displayName}</h2>
                <p className="mt-2 text-sm text-slate-300">Dữ liệu dưới đây là giao diện demo để mô phỏng màn quản trị sau đăng nhập.</p>
              </div>
              <span className="rounded-full border border-emerald-300/35 bg-emerald-300/15 px-3 py-1 text-xs text-emerald-200">
                Session Active
              </span>
            </header>

            <div className="grid gap-4 sm:grid-cols-3">
              {dashboardStats.map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className={`mt-1 text-sm ${item.tone}`}>{item.delta} this week</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {activities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">Identity Snapshot</h3>
                <pre className="mt-3 text-xs text-slate-200 overflow-x-auto max-h-48">
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </article>
            </div>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Protected API Result</h3>
              <pre className="mt-3 text-xs text-slate-200 overflow-x-auto max-h-56">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </article>
          </section>
        </main>
      </div>

      {error ? (
        <section className="mx-auto mt-6 max-w-7xl rounded-2xl border border-rose-300/35 bg-rose-500/10 p-4">
          <h2 className="text-sm font-semibold text-rose-200">Error</h2>
          <p className="mt-1 text-sm text-rose-100">{error}</p>
        </section>
      ) : null}
    </div>
  );
}

export default App;
