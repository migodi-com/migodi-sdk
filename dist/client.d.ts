/**
 * Configuration options for the Migodi client
 */
export interface MigodiConfig {
    /** Your Migodi API key - required for all requests */
    apiKey: string;
    /** Base URL for API requests (default: https://app.migodi.com) */
    baseURL?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
}
/**
 * HTTP client for Migodi API requests
 *
 * Handles authentication, error handling, and request/response processing.
 * All API requests are automatically authenticated using the Bearer token method.
 */
export declare class MigodiClient {
    private apiKey;
    private baseURL;
    private timeout;
    /**
     * Create a new Migodi HTTP client
     *
     * @param config - Client configuration including API key
     * @throws {Error} When API key is missing
     */
    constructor(config: MigodiConfig);
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
    request<T>(method: string, path: string, body?: unknown, query?: Record<string, unknown>): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map