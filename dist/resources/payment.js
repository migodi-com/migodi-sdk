import { BaseResource } from './base.js';
/**
 * Payment management
 *
 * Provides methods to query payment status and manage payment addresses
 */
export class PaymentResource extends BaseResource {
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
    async getPayment(paymentId) {
        return this.get(`/api/payment/${paymentId}`);
    }
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
    async getAddresses(paymentId, params) {
        return this.put(`/api/payment/${paymentId}/addresses`, params);
    }
}
