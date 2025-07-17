import { MigodiClient } from '../client.js';
/**
 * Base class for all API resource classes
 *
 * Provides common HTTP methods (GET, POST, PATCH, PUT, DELETE) that are used
 * by all resource implementations. All API resources should extend this class.
 */
export declare abstract class BaseResource {
    protected client: MigodiClient;
    /**
     * Create a new base resource instance
     *
     * @param client - The HTTP client to use for API requests
     */
    constructor(client: MigodiClient);
    /**
     * Make a GET request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param query - Optional query parameters
     * @returns Promise resolving to the API response
     */
    protected get<T>(path: string, query?: Record<string, unknown>): Promise<T>;
    /**
     * Make a POST request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    protected post<T>(path: string, body?: unknown): Promise<T>;
    /**
     * Make a PATCH request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    protected patch<T>(path: string, body?: unknown): Promise<T>;
    /**
     * Make a PUT request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    protected put<T>(path: string, body?: unknown): Promise<T>;
    /**
     * Make a DELETE request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @returns Promise resolving to the API response
     */
    protected delete<T>(path: string): Promise<T>;
}
//# sourceMappingURL=base.d.ts.map