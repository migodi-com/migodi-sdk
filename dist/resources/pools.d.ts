import { BaseResource } from './base.js';
/**
 * Parameters for creating a new mining pool
 */
export interface CreatePoolParams {
    /** Mining algorithm (e.g., "SHA256") */
    algorithm: string;
    /** Display name for the pool */
    title: string;
    /** Pool hostname or IP address */
    host: string;
    /** Pool port number */
    port: number;
    /** Pool username */
    username: string;
    /** Optional pool password */
    password?: string;
    /** Set as default/main pool */
    main?: boolean;
}
/**
 * List of mining pools with pagination
 */
export interface PoolsList {
    data: Pool[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}
/**
 * Mining pool response from the API
 */
export interface Pool {
    data: {
        id: string;
        created_at: string;
        algorithm: string;
        title: string;
        host: string;
        port: number;
        username: string;
        password: string | null;
        main: boolean;
    };
}
/**
 * Mining pool management
 *
 * Provides methods to create, update, and manage mining pools
 */
export declare class PoolsResource extends BaseResource {
    /**
     * Create a new mining pool
     *
     * @param params - Pool configuration parameters
     * @returns Created pool details
     *
     * @example
     * ```typescript
     * const pool = await migodi.pools.create({
     *   algorithm: 'SHA256',
     *   title: 'My Mining Pool',
     *   host: 'stratum.example.com',
     *   port: 3333,
     *   username: 'account.workername',
     *   main: true
     * });
     * ```
     */
    create(params: CreatePoolParams): Promise<Pool>;
    /**
     * Get details for a specific mining pool
     *
     * @param poolId - The pool ID
     * @returns Pool details
     */
    getPool(poolId: string): Promise<Pool>;
    /**
     * Update an existing mining pool
     *
     * @param poolId - The pool ID to update
     * @param params - Pool parameters to update
     * @returns Updated pool details
     *
     * @example
     * ```typescript
     * const updated = await migodi.pools.update('pool-id', {
     *   title: 'Updated Pool Name',
     *   main: false
     * });
     * ```
     */
    update(poolId: string, params: Partial<CreatePoolParams>): Promise<Pool>;
    /**
     * Delete a mining pool
     *
     * @param poolId - The pool ID to delete
     * @returns Promise that resolves when deletion is complete
     */
    deletePool(poolId: string): Promise<void>;
    /**
     * List all mining pools with optional filtering
     *
     * @param params - Optional filtering and pagination parameters
     * @returns List of pools with pagination metadata
     *
     * @example
     * ```typescript
     * const pools = await migodi.pools.list({
     *   algorithm: 'SHA256',
     *   page: 1,
     *   limit: 10
     * });
     * ```
     */
    list(params?: {
        /** Field to order by */
        order_by?: string;
        /** Sort direction */
        order?: 'asc' | 'desc';
        /** Page number for pagination */
        page?: number;
        /** Number of items per page */
        limit?: number;
        /** Filter by mining algorithm */
        algorithm?: string;
    }): Promise<PoolsList>;
}
//# sourceMappingURL=pools.d.ts.map