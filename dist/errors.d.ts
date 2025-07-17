/**
 * Base error class for Migodi API errors
 *
 * All API errors extend this class and include an error code and optional HTTP status code.
 */
export declare class MigodiError extends Error {
    code: string;
    status?: number | undefined;
    /**
     * Create a new Migodi API error
     *
     * @param message - Human-readable error message
     * @param code - Machine-readable error code
     * @param status - HTTP status code (if applicable)
     */
    constructor(message: string, code: string, status?: number | undefined);
}
/**
 * Authentication error (HTTP 401)
 *
 * Thrown when the API key is invalid, missing, or expired.
 * Check your API key at https://app.migodi.com/user/api-tokens
 */
export declare class MigodiAuthError extends MigodiError {
    /**
     * Create a new authentication error
     *
     * @param message - Error message (default: 'Authentication failed')
     */
    constructor(message?: string);
}
/**
 * Rate limit error (HTTP 429)
 *
 * Thrown when the API rate limit is exceeded for your API token or IP address.
 * The quota resets every minute.
 */
export declare class MigodiRateLimitError extends MigodiError {
    /**
     * Create a new rate limit error
     *
     * @param message - Error message (default: 'Rate limit exceeded')
     */
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map