import { BaseResource } from './base.js';
/**
 * Hashrate order management resource
 *
 * Provides comprehensive methods to create, retrieve, and manage hashrate orders.
 * This resource handles traditional hashrate rental operations including order
 * creation, monitoring, statistics retrieval, and lifecycle management.
 *
 * Key features:
 * - Create hashrate orders with flexible time units (minute/hour/day)
 * - Monitor order status and statistics in real-time
 * - Pause and resume orders to optimize hashrate usage (v1.1.0+)
 * - Filter and sort orders with enhanced query parameters (v1.1.0+)
 * - Backward compatibility for pool_id → user_pool_id migration
 *
 * @example
 * ```typescript
 * const migodi = new Migodi('api-key');
 *
 * // Get current pricing
 * const pricing = await migodi.hashrate.getPricing();
 *
 * // Create an order
 * const order = await migodi.hashrate.createOrder({
 *   coin: 'BTC',
 *   term: 24,
 *   time_unit: 'hour',
 *   hashrate: 1000,
 *   user_pool_id: 'pool-uuid',
 *   wallet_id: 'wallet-uuid'
 * });
 *
 * // Monitor the order
 * const stats = await migodi.hashrate.getOrderStats(order.data.id);
 * ```
 *
 * @since 0.1.0
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
     * // Using the new user_pool_id parameter (recommended)
     * const order = await migodi.hashrate.createOrder({
     *   coin: 'BTC',
     *   term: 24,
     *   time_unit: 'hour',
     *   hashrate: 1000,
     *   user_pool_id: 'pool-uuid',
     *   wallet_id: 'wallet-uuid'
     * });
     *
     * // Using deprecated pool_id (backward compatibility)
     * const order = await migodi.hashrate.createOrder({
     *   coin: 'BTC',
     *   term: 24,
     *   time_unit: 'hour',
     *   hashrate: 1000,
     *   pool_id: 'pool-uuid', // @deprecated
     *   wallet_id: 'wallet-uuid'
     * });
     * ```
     */
    async createOrder(params) {
        // Create a copy of params to avoid mutating the input object
        // This ensures the caller's object remains unchanged
        const requestParams = { ...params };
        // === STEP 1: Validation ===
        // Ensure at least one pool identifier is provided
        // This maintains backward compatibility while enforcing the requirement
        if (!requestParams.user_pool_id && !requestParams.pool_id) {
            throw new Error('Either user_pool_id or pool_id must be provided');
        }
        // === STEP 2: Handle precedence when both parameters are provided ===
        // user_pool_id takes precedence as it's the new preferred parameter
        // This allows users to gradually migrate without breaking existing code
        if (requestParams.user_pool_id && requestParams.pool_id) {
            // Remove the deprecated parameter when both are present
            // This prevents confusion and ensures clean API requests
            delete requestParams.pool_id;
        }
        // === STEP 3: Automatic migration for backward compatibility ===
        // If only the deprecated pool_id is provided, transparently map it to user_pool_id
        // This ensures existing code continues to work without modification
        if (!requestParams.user_pool_id && requestParams.pool_id) {
            // Map the old parameter to the new one
            requestParams.user_pool_id = requestParams.pool_id;
            // Remove the old parameter to keep the request clean
            delete requestParams.pool_id;
        }
        // Send the request with the properly formatted parameters
        // At this point, only user_pool_id will be present in the request
        return this.post('/api/hashrate/order', requestParams);
    }
    /**
     * Get details for a specific hashrate order
     *
     * Retrieves comprehensive information about a hashrate order including its current status,
     * timing details, payment information, and pause-related fields if applicable.
     *
     * @param orderId - The unique identifier of the order to retrieve
     * @returns Complete order details including status, timestamps, and payment info
     * @throws {MigodiError} If the order ID is invalid or not found
     *
     * @example
     * ```typescript
     * // Get details for a specific order
     * const order = await migodi.hashrate.getOrder('b70597e1-5156-4a45-b6c7-1b116b341b31');
     *
     * // Check order status
     * console.log(`Order status: ${order.data.status}`);
     * console.log(`Started at: ${order.data.begin_at}`);
     * console.log(`Ends at: ${order.data.end_at}`);
     *
     * // Check if order is paused
     * if (order.data.status === 'paused') {
     *   console.log(`Paused at: ${order.data.paused_at}`);
     *   console.log(`Remaining duration: ${order.data.remaining_duration} seconds`);
     * }
     *
     * // Check payment status
     * if (order.data.payment) {
     *   console.log(`Payment status: ${order.data.payment.payment_status}`);
     *   console.log(`Amount: ${order.data.payment.amount} ${order.data.payment.currency}`);
     * }
     * ```
     */
    async getOrder(orderId) {
        return this.get(`/api/hashrate/order/${orderId}`);
    }
    /**
     * Get statistics for a hashrate order
     *
     * Retrieves time-series performance data for a hashrate order. Each data point includes
     * accepted/rejected speeds and share counts. Use the optional time range parameters to
     * filter statistics to specific periods for detailed analysis.
     *
     * @param orderId - The unique identifier of the order
     * @param params - Optional time range filtering parameters
     * @param params.since - Return statistics starting from this ISO 8601 timestamp
     * @param params.until - Return statistics up until this ISO 8601 timestamp
     * @returns Array of time-series data points with hashrate performance metrics
     * @throws {MigodiError} If the order ID is invalid or not found
     *
     * @example
     * ```typescript
     * // Get all statistics for an order
     * const allStats = await migodi.hashrate.getOrderStats('order-id');
     * console.log(`Total data points: ${allStats.data.length}`);
     *
     * // Analyze performance
     * allStats.data.forEach(stat => {
     *   const efficiency = (stat.speed_accepted / (stat.speed_accepted + stat.speed_rejected)) * 100;
     *   console.log(`Time: ${new Date(parseInt(stat.timestamp)).toISOString()}`);
     *   console.log(`Accepted: ${stat.speed_accepted} ${stat.unit}/s`);
     *   console.log(`Efficiency: ${efficiency.toFixed(2)}%`);
     * });
     *
     * // Get statistics for a specific day
     * const dailyStats = await migodi.hashrate.getOrderStats('order-id', {
     *   since: '2024-01-01T00:00:00Z',
     *   until: '2024-01-01T23:59:59Z'
     * });
     *
     * // Calculate average hashrate for the period
     * const avgHashrate = dailyStats.data.reduce((sum, stat) => sum + stat.speed_accepted, 0) / dailyStats.data.length;
     * console.log(`Average hashrate: ${avgHashrate.toFixed(2)} TH/s`);
     * ```
     *
     * @since 1.1.0 - Added time range filtering parameters
     */
    async getOrderStats(orderId, params) {
        // Convert the optional params to the generic Record type expected by the base class
        // This type casting is safe because GetOrderStatsParams only contains string properties
        return this.get(`/api/hashrate/order/${orderId}/stats`, params);
    }
    /**
     * Cancel a hashrate order
     *
     * Permanently cancels a hashrate order. Only orders in 'inactive' or 'active' status can be cancelled.
     * Once cancelled, the order cannot be reactivated. For temporary suspension, use pauseOrder() instead.
     *
     * @param orderId - The unique identifier of the order to cancel
     * @returns void on successful cancellation
     * @throws {MigodiError} If the order cannot be cancelled due to its current status
     *
     * @example
     * ```typescript
     * try {
     *   // Cancel an order
     *   await migodi.hashrate.cancelOrder('order-id');
     *   console.log('Order cancelled successfully');
     * } catch (error) {
     *   if (error.code === 'ORDER_ALREADY_CANCELLED') {
     *     console.log('Order was already cancelled');
     *   } else if (error.code === 'ORDER_NOT_FOUND') {
     *     console.log('Order not found');
     *   } else {
     *     console.error('Failed to cancel order:', error.message);
     *   }
     * }
     * ```
     *
     * @remarks
     * - Cancellation is permanent and cannot be undone
     * - Any remaining hashrate time will be forfeited
     * - Refunds are subject to the terms of service
     * - Consider using pauseOrder() for temporary suspension
     */
    async cancelOrder(orderId) {
        return this.delete(`/api/hashrate/order/${orderId}`);
    }
    /**
     * Pause an active hashrate order
     *
     * Temporarily suspends an active hashrate order, preserving the remaining duration for later use.
     * The order must be in 'active' status to be paused. When paused, no hashrate is consumed and
     * the remaining duration is saved. Use resumeOrder() to continue the order from where it left off.
     *
     * @param orderId - The unique identifier of the order to pause
     * @returns The updated order object with pause-related fields populated
     * @throws {MigodiError} If order cannot be paused (not in 'active' status)
     *
     * @example
     * ```typescript
     * try {
     *   // Pause an active order
     *   const pausedOrder = await migodi.hashrate.pauseOrder('order-id');
     *
     *   // Access pause information
     *   console.log('Order paused successfully');
     *   console.log('Paused at:', pausedOrder.data.paused_at);
     *   console.log('Remaining duration:', pausedOrder.data.remaining_duration, 'seconds');
     *   console.log('Time already used:', pausedOrder.data.duration - pausedOrder.data.remaining_duration, 'seconds');
     *
     *   // Calculate when the order would end if resumed now
     *   const resumeDate = new Date();
     *   const endDate = new Date(resumeDate.getTime() + pausedOrder.data.remaining_duration * 1000);
     *   console.log('Would end at:', endDate.toISOString(), 'if resumed now');
     * } catch (error) {
     *   if (error.code === 'INVALID_STATUS') {
     *     console.error('Order must be active to pause. Current status:', error.message);
     *   } else {
     *     console.error('Failed to pause order:', error.message);
     *   }
     * }
     * ```
     *
     * @remarks
     * State transitions:
     * - 'active' → 'paused': Valid transition
     * - 'inactive' → 'paused': Invalid (order must be started first)
     * - 'paused' → 'paused': Invalid (already paused)
     * - 'completed' → 'paused': Invalid (order already finished)
     * - 'cancelled' → 'paused': Invalid (order cancelled)
     *
     * @since 1.1.0
     */
    async pauseOrder(orderId) {
        return this.patch(`/api/hashrate/order/${orderId}/pause`);
    }
    /**
     * Resume a paused hashrate order
     *
     * Reactivates a paused hashrate order, continuing from where it left off with the remaining duration.
     * The order must be in 'paused' status to be resumed. The order will run for the duration that was
     * remaining when it was paused, and the end time will be recalculated based on the current time.
     *
     * @param orderId - The unique identifier of the order to resume
     * @returns The updated order object with status changed back to 'active'
     * @throws {MigodiError} If order cannot be resumed (not in 'paused' status)
     *
     * @example
     * ```typescript
     * try {
     *   // Resume a paused order
     *   const resumedOrder = await migodi.hashrate.resumeOrder('order-id');
     *
     *   // Verify order is active again
     *   console.log('Order resumed successfully');
     *   console.log('Current status:', resumedOrder.data.status); // 'active'
     *   console.log('Will end at:', resumedOrder.data.end_at);
     *
     *   // Check total pause duration (cumulative if paused multiple times)
     *   if (resumedOrder.data.pause_duration) {
     *     console.log('Total time paused:', resumedOrder.data.pause_duration, 'seconds');
     *     const hours = Math.floor(resumedOrder.data.pause_duration / 3600);
     *     const minutes = Math.floor((resumedOrder.data.pause_duration % 3600) / 60);
     *     console.log(`Total pause time: ${hours}h ${minutes}m`);
     *   }
     * } catch (error) {
     *   if (error.code === 'INVALID_STATUS') {
     *     console.error('Order must be paused to resume. Current status:', error.message);
     *   } else {
     *     console.error('Failed to resume order:', error.message);
     *   }
     * }
     *
     * // Example: Pause and resume workflow
     * async function pauseAndResumeWorkflow(orderId: string) {
     *   // Pause the order
     *   const pausedOrder = await migodi.hashrate.pauseOrder(orderId);
     *   console.log('Order paused, remaining:', pausedOrder.data.remaining_duration, 'seconds');
     *
     *   // Do something while paused...
     *   await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
     *
     *   // Resume the order
     *   const resumedOrder = await migodi.hashrate.resumeOrder(orderId);
     *   console.log('Order resumed, new end time:', resumedOrder.data.end_at);
     * }
     * ```
     *
     * @remarks
     * State transitions:
     * - 'paused' → 'active': Valid transition
     * - 'active' → 'active': Invalid (already active)
     * - 'inactive' → 'active': Invalid (use order start mechanism)
     * - 'completed' → 'active': Invalid (order already finished)
     * - 'cancelled' → 'active': Invalid (order cancelled)
     *
     * @since 1.1.0
     */
    async resumeOrder(orderId) {
        return this.patch(`/api/hashrate/order/${orderId}/resume`);
    }
    /**
     * List all hashrate orders with optional filtering and sorting
     *
     * Retrieves a paginated list of hashrate orders with powerful filtering and sorting capabilities.
     * Use this method to browse orders by status, sort by various fields, and control pagination.
     *
     * @param params - Optional filtering, sorting, and pagination parameters
     * @param params.page - Page number for pagination (default: 1)
     * @param params.limit - Number of items per page (default: 20)
     * @param params.status - Filter by order status (including new 'paused' status)
     * @param params.order_by - Field to sort results by
     * @param params.order - Sort direction: 'asc' or 'desc' (default: 'desc')
     * @returns Paginated list of orders with metadata
     *
     * @example
     * ```typescript
     * // Get all active orders
     * const activeOrders = await migodi.hashrate.listOrders({
     *   status: 'active',
     *   page: 1,
     *   limit: 50
     * });
     * console.log(`Found ${activeOrders.meta.total} active orders`);
     *
     * // Get recently created orders
     * const recentOrders = await migodi.hashrate.listOrders({
     *   order_by: 'created_at',
     *   order: 'desc',
     *   limit: 10
     * });
     *
     * // Get high-hashrate orders
     * const bigOrders = await migodi.hashrate.listOrders({
     *   order_by: 'hashrate',
     *   order: 'desc',
     *   limit: 20
     * });
     *
     * // Get all paused orders (new in v1.1.0)
     * const pausedOrders = await migodi.hashrate.listOrders({
     *   status: 'paused'
     * });
     * pausedOrders.data.forEach(order => {
     *   console.log(`Order ${order.data.id} paused with ${order.data.remaining_duration}s remaining`);
     * });
     *
     * // Paginate through all orders
     * async function* getAllOrders() {
     *   let page = 1;
     *   let hasMore = true;
     *
     *   while (hasMore) {
     *     const response = await migodi.hashrate.listOrders({ page, limit: 100 });
     *     yield* response.data;
     *
     *     hasMore = page < response.meta.last_page;
     *     page++;
     *   }
     * }
     *
     * // Process all orders
     * for await (const order of getAllOrders()) {
     *   console.log(`Processing order ${order.data.id}`);
     * }
     * ```
     *
     * @remarks
     * Sorting options (order_by):
     * - 'created_at': Sort by creation timestamp
     * - 'begin_at': Sort by start timestamp
     * - 'end_at': Sort by end timestamp
     * - 'status': Sort alphabetically by status
     * - 'coin': Sort alphabetically by coin type
     * - 'hashrate': Sort numerically by hashrate amount
     *
     * @since 1.1.0 - Added order_by, order parameters and 'paused' status filter
     */
    async listOrders(params) {
        // Convert the optional params to the generic Record type expected by the base class
        // This allows the strongly-typed interface to work with the base class's generic method
        return this.get('/api/hashrate/orders', params);
    }
}
