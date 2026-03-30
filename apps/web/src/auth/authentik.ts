import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

const authority =
  import.meta.env.VITE_AUTHENTIK_ISSUER_URL ??
  'http://localhost:9100/application/o/bun-nx/';
const callbackPath = '/auth/callback';
const redirectUri =
  import.meta.env.VITE_AUTHENTIK_REDIRECT_URI ??
  `${window.location.origin}${callbackPath}`;
const postLogoutRedirectUri =
  import.meta.env.VITE_AUTHENTIK_POST_LOGOUT_REDIRECT_URI ??
  window.location.origin;
const clientId = import.meta.env.VITE_AUTHENTIK_CLIENT_ID ?? 'web-client';
const scope = import.meta.env.VITE_AUTHENTIK_SCOPE ?? 'openid profile email';

export const authentik = new UserManager({
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: 'code',
  scope,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

function hasSigninCallbackParams() {
  const search = new URLSearchParams(window.location.search);
  return search.has('code') && search.has('state');
}

function hasSignoutCallbackParams() {
  const search = new URLSearchParams(window.location.search);
  return search.has('state') && !search.has('code');
}

export async function initAuthentik(): Promise<boolean> {
  if (hasSigninCallbackParams()) {
    await authentik.signinCallback();
    const afterLogin = window.sessionStorage.getItem('ak_after_login');
    window.sessionStorage.removeItem('ak_after_login');
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash,
    );
    if (afterLogin) {
      window.location.replace(afterLogin);
      return false;
    }
  }

  if (hasSignoutCallbackParams()) {
    const result = await authentik.signoutCallback();
    const stateReturnTo =
      typeof result?.state === 'string' ? result.state : undefined;
    const savedReturnTo = window.sessionStorage.getItem('ak_return_to');
    const returnTo = stateReturnTo ?? savedReturnTo;

    window.sessionStorage.removeItem('ak_return_to');

    if (returnTo) {
      window.location.replace(returnTo);
      return false;
    }
  }

  const user = await authentik.getUser();
  return Boolean(user && !user.expired);
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const user = await authentik.getUser();
  if (!user || user.expired) return null;
  return user;
}

export async function login() {
  window.sessionStorage.setItem('ak_after_login', window.location.href);
  await authentik.signinRedirect({
    redirect_uri: redirectUri,
  });
}

export async function logout() {
  const returnTo = window.location.href;
  const user = await authentik.getUser();
  window.sessionStorage.setItem('ak_return_to', returnTo);

  await authentik.signoutRedirect({
    post_logout_redirect_uri: postLogoutRedirectUri,
    id_token_hint: user?.id_token,
    state: returnTo,
  });
}
