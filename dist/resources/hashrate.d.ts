import { BaseResource } from './base.js';
/**
 * Hashrate pricing information from the API
 *
 * Contains current pricing data and constraints for BTC hashrate rental.
 * Use this to determine costs and validate order parameters before creation.
 *
 * @example
 * ```typescript
 * const pricing = await migodi.hashrate.getPricing();
 * const btcPrice = pricing.data.BTC.price.BTC;
 * const minHashrate = pricing.data.BTC.hashrate.min;
 * const maxHashrate = pricing.data.BTC.hashrate.max;
 * ```
 */
export interface HashratePricing {
    data: {
        BTC: {
            term: {
                unit: string;
                min: number;
                max: number;
            };
            hashrate: {
                unit: string;
                min: number;
                max: number;
            };
            price: {
                time_unit: string;
                unit: string;
                BTC: number;
            };
        };
    };
}
/**
 * Parameters for creating a new hashrate order
 *
 * @example
 * ```typescript
 * // Using the new user_pool_id parameter (recommended)
 * const params: CreateHashrateOrderParams = {
 *   coin: 'BTC',
 *   term: 24,
 *   time_unit: 'hour',
 *   hashrate: 1000,
 *   user_pool_id: 'pool-uuid-123',
 *   wallet_id: 'wallet-uuid-456'
 * };
 * ```
 */
export interface CreateHashrateOrderParams {
    /**
     * Cryptocurrency coin symbol
     * @example "BTC"
     */
    coin: string;
    /**
     * Duration value that works in conjunction with time_unit
     * - For 'minute': min 15, max 10080 (7 days)
     * - For 'hour': min 1, max 168 (7 days)
     * - For 'day': min 1, max 7
     * @example 24
     */
    term: number;
    /**
     * Time unit for the duration parameter
     * Determines how the 'term' value is interpreted
     * @example "hour"
     */
    time_unit: 'minute' | 'hour' | 'day';
    /**
     * Hashrate amount in TH/s (Terahashes per second)
     * Current limits: minimum 120 TH/s, maximum 10000 TH/s
     * @example 1000
     */
    hashrate: number;
    /**
     * Pool ID to use for mining operations
     *
     * @deprecated Since version 1.1.0. Use {@link user_pool_id} instead.
     *
     * Migration timeline:
     * - v1.1.0 (current): Both pool_id and user_pool_id accepted
     * - v1.2.0: Using pool_id will trigger console warnings
     * - v2.0.0: pool_id will be completely removed
     *
     * The SDK automatically maps pool_id to user_pool_id for backward compatibility.
     *
     * @example "7167ba75-db9d-476c-b175-e8a4d59a8147"
     */
    pool_id?: string;
    /**
     * Pool ID to use for mining operations (new parameter name)
     *
     * This is the preferred parameter replacing the deprecated pool_id.
     * When both pool_id and user_pool_id are provided, user_pool_id takes precedence.
     *
     * @example "7167ba75-db9d-476c-b175-e8a4d59a8147"
     */
    user_pool_id?: string;
    /**
     * MIGODI Wallet ID for payment processing
     * This wallet will be charged for the hashrate order
     * @example "wallet-123"
     */
    wallet_id: string;
    /**
     * Optional email address for order confirmation
     * If provided, order details will be sent to this email
     * @example "user@example.com"
     */
    confirmation_email?: string;
}
/**
 * Hashrate order statistics response from the API
 *
 * Contains time-series data points showing hashrate performance over time.
 * Each data point represents statistics for a specific time period.
 */
export interface HashrateOrderStats {
    /** Array of statistical data points */
    data: {
        /**
         * Unix timestamp in milliseconds
         * @example 1672531200000
         */
        timestamp: string;
        /**
         * Unit of measurement for speed values
         * @example "TH"
         */
        unit: string;
        /**
         * Accepted hashrate speed in the specified unit
         * @example 98.5
         */
        speed_accepted: number;
        /**
         * Rejected hashrate speed in the specified unit
         * @example 1.5
         */
        speed_rejected: number;
        /**
         * Total number of accepted shares
         * @example 1234567
         */
        shares_accepted: number;
    }[];
}
/**
 * List of hashrate orders with pagination metadata
 *
 * Contains an array of hashrate orders along with pagination information
 * for navigating through large result sets.
 *
 * @example
 * ```typescript
 * const orders = await migodi.hashrate.listOrders({ page: 1, limit: 50 });
 * console.log(`Showing ${orders.data.length} of ${orders.meta.total} orders`);
 * console.log(`Page ${orders.meta.current_page} of ${orders.meta.last_page}`);
 * ```
 */
export interface HashrateOrdersList {
    data: HashrateOrder[];
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
 * Hashrate order response from the API
 *
 * Represents a complete hashrate order with all its details including
 * status, timing, payment information, and pause-related fields.
 *
 * @example
 * ```typescript
 * const order: HashrateOrder = {
 *   data: {
 *     id: "b70597e1-5156-4a45-b6c7-1b116b341b31",
 *     status: "active",
 *     hashrate: 1000,
 *     // ... other fields
 *   }
 * };
 * ```
 */
export interface HashrateOrder {
    data: {
        /**
         * Unique identifier for the order
         * @example "b70597e1-5156-4a45-b6c7-1b116b341b31"
         */
        id: string;
        /**
         * ISO 8601 timestamp when the order was created
         * @example "2023-04-17T11:15:20.162020Z"
         */
        created_at: string;
        /**
         * ISO 8601 timestamp when the order started (null if not started)
         * @example "2023-04-17T12:00:00.000000Z"
         */
        begin_at: string | null;
        /**
         * ISO 8601 timestamp when the order ended (null if not ended)
         * @example "2023-04-18T12:00:00.000000Z"
         */
        end_at: string | null;
        /**
         * Current status of the order
         * - 'inactive': Order created but not yet started
         * - 'active': Order is currently running
         * - 'paused': Order is temporarily paused (new in v1.1.0)
         * - 'completed': Order finished successfully
         * - 'cancelled': Order was cancelled by user
         */
        status: 'inactive' | 'active' | 'paused' | 'completed' | 'cancelled';
        /**
         * Cryptocurrency coin symbol
         * @example "BTC"
         */
        coin: string;
        /**
         * Duration value as specified in order creation
         * @example 24
         */
        term: number;
        /**
         * Time unit for the term value
         * @example "hour"
         */
        time_unit: string;
        /**
         * Total duration in seconds
         * @example 86400
         */
        duration: number;
        /**
         * Hashrate amount
         * @example 1000
         */
        hashrate: number;
        /**
         * Unit of hashrate measurement
         * @example "TH"
         */
        hashrate_unit: string;
        /**
         * ID of the pool being used for this order
         * @example "7167ba75-db9d-476c-b175-e8a4d59a8147"
         */
        pool_id: string;
        /**
         * ISO 8601 timestamp when the order was paused (null if never paused)
         * Only populated when status is 'paused' or was previously paused
         * @example "2024-01-15T10:30:00Z"
         * @since 1.1.0
         */
        paused_at: string | null;
        /**
         * Total accumulated pause duration in seconds
         * Tracks the total time this order has been paused (cumulative if paused multiple times)
         * @example 3600
         * @since 1.1.0
         */
        pause_duration: number | null;
        /**
         * Remaining duration in seconds when the order was paused
         * Only populated when status is 'paused', null otherwise
         * @example 82800
         * @since 1.1.0
         */
        remaining_duration: number | null;
        /**
         * Payment information for the order
         * Null if payment is not yet processed
         */
        payment: {
            /** Payment ID */
            id: string;
            /** Overall payment status */
            status: string;
            /** Detailed payment status */
            payment_status: string;
            /** Payment method used */
            method: string;
            /** Currency code */
            currency: string;
            /** Total amount */
            amount: number;
            /** Remaining amount to pay */
            amount_to_pay: number;
        } | null;
    };
}
/**
 * Parameters for listing hashrate orders with enhanced filtering and sorting
 *
 * @example
 * ```typescript
 * const params: ListHashrateOrdersParams = {
 *   status: 'active',
 *   order_by: 'created_at',
 *   order: 'desc',
 *   page: 1,
 *   limit: 50
 * };
 * ```
 * @since 1.1.0 - Added order_by, order, and paused status option
 */
export interface ListHashrateOrdersParams {
    /**
     * Page number for pagination
     * @default 1
     * @example 1
     */
    page?: number;
    /**
     * Number of items per page
     * @default 20
     * @example 50
     */
    limit?: number;
    /**
     * Filter orders by status
     * Note: 'paused' status was added in v1.1.0
     * @example "active"
     */
    status?: 'inactive' | 'active' | 'paused' | 'completed' | 'cancelled';
    /**
     * Field to sort results by
     * - 'created_at': Sort by creation timestamp
     * - 'begin_at': Sort by start timestamp
     * - 'end_at': Sort by end timestamp
     * - 'status': Sort alphabetically by status
     * - 'coin': Sort alphabetically by coin type
     * - 'hashrate': Sort numerically by hashrate amount
     * @default "created_at"
     * @example "created_at"
     * @since 1.1.0
     */
    order_by?: 'created_at' | 'begin_at' | 'end_at' | 'status' | 'coin' | 'hashrate';
    /**
     * Sort direction
     * - 'asc': Ascending order (oldest/smallest first)
     * - 'desc': Descending order (newest/largest first)
     * @default "desc"
     * @example "desc"
     * @since 1.1.0
     */
    order?: 'asc' | 'desc';
}
/**
 * Parameters for retrieving order statistics with optional time range filtering
 *
 * Allows filtering statistics to a specific time window for better analysis
 * of hashrate performance during specific periods.
 *
 * @example
 * ```typescript
 * // Get stats for a specific day
 * const params: GetOrderStatsParams = {
 *   since: '2024-01-01T00:00:00Z',
 *   until: '2024-01-01T23:59:59Z'
 * };
 *
 * // Get stats from a specific point onwards
 * const recentStats: GetOrderStatsParams = {
 *   since: '2024-01-15T12:00:00Z'
 * };
 * ```
 * @since 1.1.0
 */
export interface GetOrderStatsParams {
    /**
     * Return statistics starting from this timestamp
     * Format: ISO 8601 datetime string
     * If omitted, returns stats from order start
     * @example "2024-01-01T00:00:00Z"
     */
    since?: string;
    /**
     * Return statistics up until this timestamp
     * Format: ISO 8601 datetime string
     * If omitted, returns stats until current time
     * @example "2024-01-02T00:00:00Z"
     */
    until?: string;
}
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
export declare class HashrateResource extends BaseResource {
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
    getPricing(): Promise<HashratePricing>;
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
    createOrder(params: CreateHashrateOrderParams): Promise<HashrateOrder>;
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
    getOrder(orderId: string): Promise<HashrateOrder>;
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
    getOrderStats(orderId: string, params?: GetOrderStatsParams): Promise<HashrateOrderStats>;
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
    cancelOrder(orderId: string): Promise<void>;
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
    pauseOrder(orderId: string): Promise<HashrateOrder>;
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
    resumeOrder(orderId: string): Promise<HashrateOrder>;
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
    listOrders(params?: ListHashrateOrdersParams): Promise<HashrateOrdersList>;
}
//# sourceMappingURL=hashrate.d.ts.map