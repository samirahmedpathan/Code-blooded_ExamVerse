declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            ux_mode?: "popup" | "redirect";
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (
            listener?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
              getNotDisplayedReason: () => string;
              getSkippedReason: () => string;
              getDismissedReason: () => string;
            }) => void,
          ) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: "popup" | "redirect";
            callback: (response: { code?: string; error?: string }) => void;
          }) => { requestCode: () => void };
        };
      };
    };
  }
}

let cached: Promise<typeof window.google> | null = null;

export function getClientId(): string | null {
  const fromEnv = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return null;
}

export function loadGoogleScript(): Promise<typeof window.google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in requires a browser"));
  }
  if (cached) return cached;
  cached = new Promise((resolve, reject) => {
    const start = Date.now();
    function poll() {
      if (window.google?.accounts?.id) {
        resolve(window.google);
        return;
      }
      if (Date.now() - start > 8000) {
        reject(new Error("Google sign-in script failed to load"));
        return;
      }
      setTimeout(poll, 80);
    }
    poll();
  });
  return cached;
}

export async function promptGoogleSignIn(
  clientId: string,
): Promise<string> {
  const google = await loadGoogleScript();
  if (!google) throw new Error("Google sign-in unavailable");

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (settled) return;
        settled = true;
        if (response.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Google did not return a credential"));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: false,
      ux_mode: "popup",
      use_fedcm_for_prompt: true,
    });
    google.accounts.id.prompt((notification) => {
      if (settled) return;
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment() ||
        notification.isDismissedMoment()
      ) {
        settled = true;
        const reason =
          notification.getNotDisplayedReason?.() ||
          notification.getSkippedReason?.() ||
          notification.getDismissedReason?.() ||
          "dismissed";
        reject(new Error(`Google sign-in was cancelled (${reason})`));
      }
    });
  });
}
