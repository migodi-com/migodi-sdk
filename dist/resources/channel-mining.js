import { BaseResource } from './base.js';
/**
 * Channel mining order management
 *
 * Provides methods to browse packages and manage channel mining orders.
 * Channel mining provides dedicated hashrate for a specified duration with predictable returns.
 */
export class ChannelMiningResource extends BaseResource {
    /**
     * Get available channel mining packages
     *
     * @param params - Optional pagination parameters
     * @returns List of available channel mining packages
     *
     * @example
     * ```typescript
     * const packages = await migodi.channelMining.getPackages();
     * for (const pkg of packages.data) {
     *   console.log(`${pkg.title}: ${pkg.hashrate} ${pkg.hashrate_unit} for ${pkg.duration}h`);
     * }
     * ```
     */
    async getPackages(params) {
        return this.get('/api/channel-mining/packages', params);
    }
    /**
     * Create a new channel mining order
     *
     * @param params - Order parameters
     * @returns Created channel mining order
     *
     * @example
     * ```typescript
     * const order = await migodi.channelMining.createOrder({
     *   package_id: 'pkg-456',
     *   payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
     *   confirmation_email: 'user@example.com'
     * });
     * console.log(`Channel mining order created: ${order.data.id}`);
     * ```
     */
    async createOrder(params) {
        return this.post('/api/channel-mining/order', params);
    }
    /**
     * Get details for a specific channel mining order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    async getOrder(orderId) {
        return this.get(`/api/channel-mining/order/${orderId}`);
    }
    /**
     * Get payment addresses for a channel mining order
     *
     * @param orderId - The order ID
     * @param params - Payment address parameters
     * @returns Payment addresses
     *
     * @example
     * ```typescript
     * const addresses = await migodi.channelMining.getPaymentAddresses('order-456', {
     *   currency: 'BTC',
     *   payment_method: 'LIGHTNING'
     * });
     * ```
     */
    async getPaymentAddresses(orderId, params) {
        return this.put(`/api/channel-mining/order/${orderId}/payment/addresses`, params);
    }
    /**
     * Get statistics for a channel mining order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (UNIX millisecond timestamp)
     * @param until - Optional end timestamp (UNIX millisecond timestamp)
     * @returns Order statistics and mining progress
     */
    async getOrderStats(orderId, since, until) {
        return this.get(`/api/channel-mining/order/${orderId}/stats`, { since, until });
    }
    /**
     * Cancel a channel mining order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    async cancelOrder(orderId) {
        return this.delete(`/api/channel-mining/order/${orderId}`);
    }
    /**
     * List all channel mining orders with optional filtering
     *
     * @param params - Optional filtering and pagination parameters
     * @returns List of orders with pagination metadata
     *
     * @example
     * ```typescript
     * const orders = await migodi.channelMining.listOrders({
     *   status: 'active',
     *   page: 1,
     *   limit: 20
     * });
     * ```
     */
    async listOrders(params) {
        return this.get('/api/channel-mining/orders', params);
    }
}
