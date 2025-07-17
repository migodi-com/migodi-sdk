import { MigodiAuthError, MigodiRateLimitError, MigodiError } from './errors.js';
/**
 * HTTP client for Migodi API requests
 *
 * Handles authentication, error handling, and request/response processing.
 * All API requests are automatically authenticated using the Bearer token method.
 */
export class MigodiClient {
    apiKey;
    baseURL;
    timeout;
    /**
     * Create a new Migodi HTTP client
     *
     * @param config - Client configuration including API key
     * @throws {Error} When API key is missing
     */
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('API key is required');
        }
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://app.migodi.com';
        this.timeout = config.timeout || 30000;
    }
    /**
     * Make an authenticated HTTP request to the Migodi API
     *
     * @template T - The expected response type
     * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param path - API endpoint path (e.g., '/api/hashrate/pricing')
     * @param body - Request body for POST/PUT requests
     * @param query - Query parameters for GET requests
     * @returns Promise resolving to the API response
     *
     * @throws {MigodiAuthError} When authentication fails (401)
     * @throws {MigodiRateLimitError} When rate limit is exceeded (429)
     * @throws {MigodiError} For other API errors
     *
     * @example
     * ```typescript
     * // GET request with query parameters
     * const response = await client.request('GET', '/api/hashrate/orders', null, { page: 1 });
     *
     * // POST request with body
     * const order = await client.request('POST', '/api/hashrate/order', {
     *   coin: 'BTC',
     *   term: 24,
     *   hashrate: 100
     * });
     * ```
     */
    async request(method, path, body, query) {
        const url = new URL(path, this.baseURL);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url.toString(), {
                method,
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new MigodiAuthError();
                }
                if (response.status === 429) {
                    throw new MigodiRateLimitError();
                }
                const error = await response.json().catch(() => ({}));
                throw new MigodiError(error.message || `Request failed with status ${response.status}`, error.code || 'API_ERROR', response.status);
            }
            return response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof MigodiError) {
                throw error;
            }
            if (error instanceof Error && error.name === 'AbortError') {
                throw new MigodiError('Request timeout', 'TIMEOUT');
            }
            throw new MigodiError(error instanceof Error ? error.message : 'Unknown error', 'NETWORK_ERROR');
        }
    }
}
