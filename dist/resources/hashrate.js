import { BaseResource } from './base.js';
/**
 * Hashrate order management
 *
 * Provides methods to create, retrieve, and manage hashrate orders
 */
export class HashrateResource extends BaseResource {
    /**
     * Get current hashrate pricing information
     *
     * @returns Current BTC hashrate pricing and constraints
     *
     * @example
     * ```typescript
     * const pricing = await migodi.hashrate.getPricing();
     * console.log(`BTC price: ${pricing.data.BTC.price.BTC} BTC/TH`);
     * ```
     */
    async getPricing() {
        return this.get('/api/hashrate/pricing');
    }
    /**
     * Create a new hashrate order
     *
     * @param params - Order parameters
     * @returns Created hashrate order
     *
     * @example
     * ```typescript
     * const order = await migodi.hashrate.createOrder({
     *   coin: 'BTC',
     *   term: 24,
     *   time_unit: 'hour',
     *   hashrate: 1000,
     *   pool_id: 'pool-uuid',
     *   wallet_id: 'wallet-uuid'
     * });
     * ```
     */
    async createOrder(params) {
        return this.post('/api/hashrate/order', params);
    }
    /**
     * Get details for a specific hashrate order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    async getOrder(orderId) {
        return this.get(`/api/hashrate/order/${orderId}`);
    }
    /**
     * Get statistics for a hashrate order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (ISO 8601)
     * @param until - Optional end timestamp (ISO 8601)
     * @returns Order statistics
     */
    async getOrderStats(orderId, since, until) {
        return this.get(`/api/hashrate/order/${orderId}/stats`, { since, until });
    }
    /**
     * Cancel a hashrate order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    async cancelOrder(orderId) {
        return this.delete(`/api/hashrate/order/${orderId}`);
    }
    /**
     * List all hashrate orders with optional filtering
     *
     * @param params - Optional filtering and pagination parameters
     * @returns List of orders with pagination metadata
     *
     * @example
     * ```typescript
     * const orders = await migodi.hashrate.listOrders({
     *   status: 'active',
     *   page: 1,
     *   limit: 20
     * });
     * ```
     */
    async listOrders(params) {
        return this.get('/api/hashrate/orders', params);
    }
}
