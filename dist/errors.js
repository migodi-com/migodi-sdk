/**
 * Base error class for Migodi API errors
 *
 * All API errors extend this class and include an error code and optional HTTP status code.
 */
export class MigodiError extends Error {
    code;
    status;
    /**
     * Create a new Migodi API error
     *
     * @param message - Human-readable error message
     * @param code - Machine-readable error code
     * @param status - HTTP status code (if applicable)
     */
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
        this.name = 'MigodiError';
    }
}
/**
 * Authentication error (HTTP 401)
 *
 * Thrown when the API key is invalid, missing, or expired.
 * Check your API key at https://app.migodi.com/user/api-tokens
 */
export class MigodiAuthError extends MigodiError {
    /**
     * Create a new authentication error
     *
     * @param message - Error message (default: 'Authentication failed')
     */
    constructor(message = 'Authentication failed') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'MigodiAuthError';
    }
}
/**
 * Rate limit error (HTTP 429)
 *
 * Thrown when the API rate limit is exceeded for your API token or IP address.
 * The quota resets every minute.
 */
export class MigodiRateLimitError extends MigodiError {
    /**
     * Create a new rate limit error
     *
     * @param message - Error message (default: 'Rate limit exceeded')
     */
    constructor(message = 'Rate limit exceeded') {
        super(message, 'RATE_LIMIT', 429);
        this.name = 'MigodiRateLimitError';
    }
}
