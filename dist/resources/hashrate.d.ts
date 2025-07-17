import { BaseResource } from './base.js';
/**
 * Hashrate pricing information from the API
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
 */
export interface CreateHashrateOrderParams {
    /** Cryptocurrency coin (e.g., "BTC") */
    coin: string;
    /** Duration value. The actual duration depends on the time_unit parameter. Current limits (in minute): min 15, max 10080 */
    term: number;
    /** Time unit for the duration. Supported values: ["minute","hour","day"] */
    time_unit: 'minute' | 'hour' | 'day';
    /** Hashrate in TH/s. Current limits: min 120, max 10000 */
    hashrate: number;
    /** Pool ID to use for mining */
    pool_id: string;
    /** Wallet ID for payments */
    wallet_id: string;
    /** Optional email for order confirmations */
    confirmation_email?: string;
}
/**
 * Hashrate order statistics from the API
 */
export interface HashrateOrderStats {
    data: {
        timestamp: string;
        unit: string;
        speed_accepted: number;
        speed_rejected: number;
        shares_accepted: number;
    }[];
}
/**
 * List of hashrate orders with pagination
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
 */
export interface HashrateOrder {
    data: {
        id: string;
        created_at: string;
        begin_at: string | null;
        end_at: string | null;
        status: string;
        coin: string;
        term: number;
        time_unit: string;
        duration: number;
        hashrate: number;
        hashrate_unit: string;
        pool_id: string;
        payment: {
            id: string;
            status: string;
            payment_status: string;
            method: string;
            currency: string;
            amount: number;
            amount_to_pay: number;
        } | null;
    };
}
/**
 * Hashrate order management
 *
 * Provides methods to create, retrieve, and manage hashrate orders
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
    createOrder(params: CreateHashrateOrderParams): Promise<HashrateOrder>;
    /**
     * Get details for a specific hashrate order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    getOrder(orderId: string): Promise<HashrateOrder>;
    /**
     * Get statistics for a hashrate order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (ISO 8601)
     * @param until - Optional end timestamp (ISO 8601)
     * @returns Order statistics
     */
    getOrderStats(orderId: string, since?: string, until?: string): Promise<HashrateOrderStats>;
    /**
     * Cancel a hashrate order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    cancelOrder(orderId: string): Promise<void>;
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
    listOrders(params?: {
        /** Field to order by */
        order_by?: string;
        /** Sort direction */
        order?: 'asc' | 'desc';
        /** Page number for pagination */
        page?: number;
        /** Number of items per page */
        limit?: number;
        /** Filter by order status */
        status?: string;
        /** Filter by coin type */
        coin?: string;
    }): Promise<HashrateOrdersList>;
}
//# sourceMappingURL=hashrate.d.ts.map