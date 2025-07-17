import { BaseResource } from './base.js';
/**
 * Payment status information
 */
export interface Payment {
    data: {
        /** Unique payment identifier */
        id: string;
        /** Payment creation timestamp */
        created_at: string;
        /** Overall payment status */
        status: string;
        /** Detailed payment status */
        payment_status: string;
        /** Payment method */
        method: string;
        /** Payment currency */
        currency: string;
        /** Payment amount */
        amount: number;
        /** Payment amount to pay*/
        amount_to_pay: number;
        /** Available payment addresses */
        addresses: {
            address: string;
            currency: string;
            type: string;
            amount: number;
        }[];
    };
}
/**
 * Parameters for getting payment addresses
 */
export interface GetPaymentAddressParams {
    /** Currency for payment */
    currency: string;
    /** Payment method */
    payment_method: string;
}
/**
 * Payment management
 *
 * Provides methods to query payment status and manage payment addresses
 */
export declare class PaymentResource extends BaseResource {
    /**
     * Get payment status and details
     *
     * @param paymentId - The payment ID
     * @returns Payment status and details
     *
     * @example
     * ```typescript
     * const payment = await migodi.payment.getPayment('payment-123');
     * console.log(`Payment status: ${payment.data.payment_status}`);
     * console.log(`Amount: ${payment.data.amount} ${payment.data.currency}`);
     * ```
     */
    getPayment(paymentId: string): Promise<Payment>;
    /**
     * Get payment addresses for a specific currency and method
     *
     * @param paymentId - The payment ID
     * @param params - Payment address parameters
     * @returns Payment addresses
     *
     * @example
     * ```typescript
     * const addresses = await migodi.payment.getAddresses('payment-123', {
     *   currency: 'BTC',
     *   payment_method: 'LIGHTNING'
     * });
     * console.log('Addresses:', addresses.data.addresses);
     * ```
     */
    getAddresses(paymentId: string, params: GetPaymentAddressParams): Promise<Payment>;
}
//# sourceMappingURL=payment.d.ts.map