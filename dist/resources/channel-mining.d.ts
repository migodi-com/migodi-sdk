import { BaseResource } from './base.js';
/**
 * Channel mining package information
 */
export interface ChannelMiningPackage {
    /** Unique package identifier */
    id: string;
    /** Package display name */
    title: string;
    /** Cryptocurrency coin */
    coin: string;
    /** Mining duration in hours */
    duration: number;
    /** Hashrate amount */
    hashrate: number;
    /** Hashrate unit (e.g., "TH/s") */
    hashrate_unit: string;
    /** Expected profitability */
    profitability: {
        min: number;
        max: number;
    };
    /** Potential payout amount */
    potential_payout: number;
    /** Package pricing information */
    price: number;
}
/**
 * Parameters for creating a new channel mining order
 */
export interface CreateChannelMiningOrderParams {
    /** Package ID to order */
    package_id: string;
    /** Payout address for rewards */
    payout_address: string;
    /** Optional email for order confirmations */
    confirmation_email?: string;
}
/**
 * Channel mining order response from the API
 */
export interface ChannelMiningOrder {
    data: {
        /** Unique order identifier */
        id: string;
        /** Order creation timestamp */
        created_at: string;
        /** Current order status */
        status: string;
        /** Package display name */
        title: string;
        /** Cryptocurrency coin */
        coin: string;
        /** Mining duration in hours */
        duration: number;
        /** Hashrate amount */
        hashrate: number;
        /** Hashrate unit (e.g., "TH") */
        hashrate_unit: string;
        /** Expected profitability */
        profitability: {
            min: number;
            max: number;
        };
        /** Mining progress (0-100) */
        progress: number;
        /** Payout address for rewards */
        payout_address: string;
        /** Estimated earnings for today */
        estimated_earnings_today: number;
        /** Total earnings */
        total_earnings: number;
        /** List of earnings */
        earnings: {
            created_at: string;
            earned_at: string;
            hashrate_avg: number;
            hashrate_avg_unit: string;
            status: string;
            coin: string;
            tx: string;
            payout: number;
        }[];
        /** Payment information */
        payment: {
            id: string;
            status: string;
            payment_status: string;
            currency: string;
            amount: number;
            addresses: {
                address: string;
                currency: string;
                type: string;
                amount: number;
            }[];
        } | null;
    };
}
/**
 * List of channel mining packages
 */
export interface ChannelMiningPackagesList {
    data: ChannelMiningPackage[];
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
 * Channel mining order statistics
 */
export interface ChannelMiningOrderStats {
    data: {
        timestamp: number;
        unit: string;
        speed_accepted: number;
        speed_rejected: number;
        shares_accepted: number;
    }[];
}
/**
 * List of channel mining orders
 */
export interface ChannelMiningOrdersList {
    data: ChannelMiningOrder[];
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
 * Parameters for getting payment addresses
 */
export interface GetChannelMiningPaymentAddressParams {
    /** Currency for payment */
    currency: string;
    /** Payment method */
    payment_method: string;
}
/**
 * Channel mining order management
 *
 * Provides methods to browse packages and manage channel mining orders.
 * Channel mining provides dedicated hashrate for a specified duration with predictable returns.
 */
export declare class ChannelMiningResource extends BaseResource {
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
    getPackages(params?: {
        /** Page number for pagination */
        page?: number;
        /** Number of items per page */
        limit?: number;
    }): Promise<ChannelMiningPackagesList>;
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
    createOrder(params: CreateChannelMiningOrderParams): Promise<ChannelMiningOrder>;
    /**
     * Get details for a specific channel mining order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    getOrder(orderId: string): Promise<ChannelMiningOrder>;
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
    getPaymentAddresses(orderId: string, params: GetChannelMiningPaymentAddressParams): Promise<ChannelMiningOrder>;
    /**
     * Get statistics for a channel mining order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (UNIX millisecond timestamp)
     * @param until - Optional end timestamp (UNIX millisecond timestamp)
     * @returns Order statistics and mining progress
     */
    getOrderStats(orderId: string, since?: string, until?: string): Promise<ChannelMiningOrderStats>;
    /**
     * Cancel a channel mining order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    cancelOrder(orderId: string): Promise<void>;
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
    }): Promise<ChannelMiningOrdersList>;
}
//# sourceMappingURL=channel-mining.d.ts.map