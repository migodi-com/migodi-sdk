import { BaseResource } from './base.js';
/**
 * Solo mining order management
 *
 * Provides methods to browse packages and manage solo mining orders.
 * Solo mining gives you a chance to find entire blocks and receive full block rewards.
 */
export class SoloMiningResource extends BaseResource {
    /**
     * Get available solo mining packages
     *
     * @param params - Optional pagination parameters
     * @returns List of available solo mining packages
     *
     * @example
     * ```typescript
     * const packages = await migodi.soloMining.getPackages();
     * for (const pkg of packages.data) {
     *   console.log(`${pkg.title}: ${pkg.probability}% chance for ${pkg.coin}`);
     * }
     * ```
     */
    async getPackages(params) {
        return this.get('/api/solo-mining/packages', params);
    }
    /**
     * Create a new solo mining order
     *
     * @param params - Order parameters
     * @returns Created solo mining order
     *
     * @example
     * ```typescript
     * const order = await migodi.soloMining.createOrder({
     *   package_id: 'pkg-123',
     *   payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
     *   confirmation_email: 'user@example.com'
     * });
     * console.log(`Order created: ${order.data.id}`);
     * ```
     */
    async createOrder(params) {
        return this.post('/api/solo-mining/order', params);
    }
    /**
     * Get details for a specific solo mining order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    async getOrder(orderId) {
        return this.get(`/api/solo-mining/order/${orderId}`);
    }
    /**
     * Get payment addresses for a solo mining order
     *
     * @param orderId - The order ID
     * @param params - Payment address parameters
     * @returns Payment addresses
     *
     * @example
     * ```typescript
     * const addresses = await migodi.soloMining.getPaymentAddresses('order-123', {
     *   currency: 'BTC',
     *   payment_method: 'LIGHTNING'
     * });
     * ```
     */
    async getPaymentAddresses(orderId, params) {
        return this.put(`/api/solo-mining/order/${orderId}/payment/addresses`, params);
    }
    /**
     * Get statistics for a solo mining order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (UNIX millisecond timestamp)
     * @param until - Optional end timestamp (UNIX millisecond timestamp)
     * @returns Order statistics and progress
     */
    async getOrderStats(orderId, since, until) {
        return this.get(`/api/solo-mining/order/${orderId}/stats`, { since, until });
    }
    /**
     * Cancel a solo mining order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    async cancelOrder(orderId) {
        return this.delete(`/api/solo-mining/order/${orderId}`);
    }
    /**
     * List all solo mining orders with optional filtering
     *
     * @param params - Optional filtering and pagination parameters
     * @returns List of orders with pagination metadata
     *
     * @example
     * ```typescript
     * const orders = await migodi.soloMining.listOrders({
     *   status: 'active',
     *   page: 1,
     *   limit: 20
     * });
     * ```
     */
    async listOrders(params) {
        return this.get('/api/solo-mining/orders', params);
    }
}
