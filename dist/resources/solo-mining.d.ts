import { BaseResource } from './base.js';
/**
 * Solo mining package information
 */
export interface SoloMiningPackage {
    /** Unique package identifier */
    id: string;
    /** Package display name */
    title: string;
    /** Cryptocurrency coin */
    coin: string;
    /** Mining duration in hours */
    duration: number;
    /** Probability of finding a block (0-1) */
    probability: number;
    /** Potential block reward amount */
    potential_block_reward: number;
    /** Package pricing information */
    price: number;
}
/**
 * Parameters for creating a new solo mining order
 */
export interface CreateSoloMiningOrderParams {
    /** Package ID to order */
    package_id: string;
    /** Payout address for rewards */
    payout_address: string;
    /** Optional email for order confirmations */
    confirmation_email?: string;
}
/**
 * Solo mining order response from the API
 */
export interface SoloMiningOrder {
    data: {
        /** Unique order identifier */
        id: string;
        /** Order creation timestamp */
        created_at: string;
        /** Order begin timestamp */
        begin_at: string;
        /** Order end timestamp */
        end_at: string;
        /** Current order status */
        status: string;
        /** Package display name */
        title: string;
        /** Cryptocurrency coin */
        coin: string;
        /** Mining duration in hours */
        duration: number;
        /** Potential block reward */
        potential_block_reward: number;
        /** Mining progress (0-100) */
        progress: number;
        /** Payout address for rewards */
        payout_address: string;
        /** Percentage reached until rewards */
        percent_to_reward: number;
        reward: object;
        rewards: object;
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
 * List of solo mining packages
 */
export interface SoloMiningPackagesList {
    data: SoloMiningPackage[];
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
 * Solo mining order statistics
 */
export interface SoloMiningOrderStats {
    data: {
        timestamp: number;
        unit: string;
        speed_accepted: number;
        speed_rejected: number;
        shares_accepted: number;
    }[];
}
/**
 * List of solo mining orders
 */
export interface SoloMiningOrdersList {
    data: SoloMiningOrder[];
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
export interface GetSoloMiningPaymentAddressParams {
    /** Currency for payment */
    currency: string;
    /** Payment method */
    payment_method: string;
}
/**
 * Solo mining order management
 *
 * Provides methods to browse packages and manage solo mining orders.
 * Solo mining gives you a chance to find entire blocks and receive full block rewards.
 */
export declare class SoloMiningResource extends BaseResource {
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
    getPackages(params?: {
        /** Page number for pagination */
        page?: number;
        /** Number of items per page */
        limit?: number;
    }): Promise<SoloMiningPackagesList>;
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
    createOrder(params: CreateSoloMiningOrderParams): Promise<SoloMiningOrder>;
    /**
     * Get details for a specific solo mining order
     *
     * @param orderId - The order ID
     * @returns Order details
     */
    getOrder(orderId: string): Promise<SoloMiningOrder>;
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
    getPaymentAddresses(orderId: string, params: GetSoloMiningPaymentAddressParams): Promise<SoloMiningOrder>;
    /**
     * Get statistics for a solo mining order
     *
     * @param orderId - The order ID
     * @param since - Optional start timestamp (UNIX millisecond timestamp)
     * @param until - Optional end timestamp (UNIX millisecond timestamp)
     * @returns Order statistics and progress
     */
    getOrderStats(orderId: string, since?: string, until?: string): Promise<SoloMiningOrderStats>;
    /**
     * Cancel a solo mining order
     *
     * @param orderId - The order ID to cancel
     * @returns Cancellation confirmation
     */
    cancelOrder(orderId: string): Promise<void>;
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
    }): Promise<SoloMiningOrdersList>;
}
//# sourceMappingURL=solo-mining.d.ts.map