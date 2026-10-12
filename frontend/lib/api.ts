/**
 * @file frontend/lib/api.ts
 * @description Enterprise-grade, centralized API client for Project LOOP.
 * Ensures strict multi-tenant header propagation (x-workspace-id),
 * token authentication, normalized URLs (no double /api/api), and unified error handling.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  meta?: Record<string, unknown>;
}

/**
 * Normalizes the backend API base URL.
 * Handles environment configurations whether NEXT_PUBLIC_API_URL includes '/api' or not.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

/**
 * Retrieves the current session token from localStorage safely.
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('loop_auth_token');
  } catch {
    return null;
  }
};

/**
 * Retrieves the currently active workspace ID from localStorage.
 */
export const getActiveWorkspaceId = (): string => {
  if (typeof window === 'undefined') return 'ws-001';
  try {
    const stored = localStorage.getItem('loop_active_workspace');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) return parsed.id;
      } catch {
        return stored;
      }
    }
  } catch {
    // fallback
  }
  return 'ws-001';
};

/**
 * Prepares standard enterprise headers with auth token and workspace tenant ID.
 */
export const createApiHeaders = (customHeaders?: HeadersInit): Headers => {
  const headers = new Headers(customHeaders);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const workspaceId = getActiveWorkspaceId();
  if (workspaceId && !headers.has('x-workspace-id')) {
    headers.set('x-workspace-id', workspaceId);
  }

  return headers;
};

/**
 * Builds the fully qualified URL for a given API endpoint without double slashes or double /api.
 */
export const buildApiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl();
  let path = endpoint.trim();
  if (path.startsWith('/api/')) {
    path = path.slice(5);
  } else if (path.startsWith('/api')) {
    path = path.slice(4);
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${base}${path}`;
};

/**
 * Performs a typed HTTP request with standard headers and error handling.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(endpoint);
  const headers = createApiHeaders(options.headers);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    let json: any = {};
    if (contentType.includes('application/json')) {
      json = await res.json().catch(() => ({}));
    } else {
      const text = await res.text();
      return {
        success: res.ok,
        data: text as unknown as T,
        error: res.ok ? undefined : text || res.statusText,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: json.error || json.message || `Request failed with status ${res.status}`,
        message: json.message,
      };
    }

    return {
      success: json.success ?? true,
      data: json.data !== undefined ? json.data : json,
      message: json.message,
      meta: json.meta,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network communication failed with backend server',
    };
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T = any>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
