/**
 * Base class for all API resource classes
 *
 * Provides common HTTP methods (GET, POST, PATCH, PUT, DELETE) that are used
 * by all resource implementations. All API resources should extend this class.
 */
export class BaseResource {
    client;
    /**
     * Create a new base resource instance
     *
     * @param client - The HTTP client to use for API requests
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Make a GET request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param query - Optional query parameters
     * @returns Promise resolving to the API response
     */
    get(path, query) {
        return this.client.request('GET', path, undefined, query);
    }
    /**
     * Make a POST request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    post(path, body) {
        return this.client.request('POST', path, body);
    }
    /**
     * Make a PATCH request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    patch(path, body) {
        return this.client.request('PATCH', path, body);
    }
    /**
     * Make a PUT request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @param body - Request body data
     * @returns Promise resolving to the API response
     */
    put(path, body) {
        return this.client.request('PUT', path, body);
    }
    /**
     * Make a DELETE request to the API
     *
     * @template T - The expected response type
     * @param path - API endpoint path
     * @returns Promise resolving to the API response
     */
    delete(path) {
        return this.client.request('DELETE', path);
    }
}
