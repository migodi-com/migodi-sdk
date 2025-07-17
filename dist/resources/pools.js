import { BaseResource } from './base.js';
/**
 * Mining pool management
 *
 * Provides methods to create, update, and manage mining pools
 */
export class PoolsResource extends BaseResource {
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
    async create(params) {
        return this.post('/api/pool', params);
    }
    /**
     * Get details for a specific mining pool
     *
     * @param poolId - The pool ID
     * @returns Pool details
     */
    async getPool(poolId) {
        return this.get(`/api/pool/${poolId}`);
    }
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
    async update(poolId, params) {
        return this.patch(`/api/pool/${poolId}`, params);
    }
    /**
     * Delete a mining pool
     *
     * @param poolId - The pool ID to delete
     * @returns Promise that resolves when deletion is complete
     */
    async deletePool(poolId) {
        return this.delete(`/api/pool/${poolId}`);
    }
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
    async list(params) {
        return this.get('/api/pools', params);
    }
}
