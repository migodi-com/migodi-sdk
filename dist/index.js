import { MigodiClient } from './client.js';
import { HashrateResource } from './resources/hashrate.js';
import { PoolsResource } from './resources/pools.js';
import { SoloMiningResource } from './resources/solo-mining.js';
import { ChannelMiningResource } from './resources/channel-mining.js';
import { PaymentResource } from './resources/payment.js';
export * from './errors.js';
export * from './resources/hashrate.js';
export * from './resources/pools.js';
export * from './resources/solo-mining.js';
export * from './resources/channel-mining.js';
export * from './resources/payment.js';
/**
 * Official Node.js SDK for the Migodi API
 *
 * Provides access to hashrate orders, mining pools, and other Migodi services.
 *
 * @example
 * ```typescript
 * import Migodi from '@migodi/sdk';
 *
 * const migodi = new Migodi('your-api-key');
 *
 * // Get current hashrate pricing
 * const pricing = await migodi.hashrate.getPricing();
 * console.log(pricing.data.BTC.price);
 *
 * // Create a hashrate order
 * const order = await migodi.hashrate.createOrder({
 *   coin: 'BTC',
 *   term: 24,
 *   hashrate: 100
 * });
 * ```
 */
export class Migodi {
    client;
    /**
     * Hashrate order management
     *
     * Access to hashrate pricing, order creation, and order management
     */
    hashrate;
    /**
     * Mining pool management
     *
     * Create, update, and manage mining pools
     */
    pools;
    /**
     * Solo mining management
     *
     * Browse packages and manage solo mining orders for potential full block rewards
     */
    soloMining;
    /**
     * Channel mining management
     *
     * Browse packages and manage channel mining orders for dedicated hashrate
     */
    channelMining;
    /**
     * Payment management
     *
     * Query payment status and manage payment addresses
     */
    payment;
    /**
     * Create a new Migodi SDK instance
     *
     * @param apiKey - Your Migodi API key (get from https://app.migodi.com/user/api-tokens)
     * @param config - Optional configuration options
     *
     * @example
     * ```typescript
     * // Basic usage
     * const migodi = new Migodi('your-api-key');
     *
     * // With custom configuration
     * const migodi = new Migodi('your-api-key', {
     *   baseURL: 'https://app.migodi.com',
     *   timeout: 30000
     * });
     * ```
     */
    constructor(apiKey, config) {
        this.client = new MigodiClient({ apiKey, ...config });
        this.hashrate = new HashrateResource(this.client);
        this.pools = new PoolsResource(this.client);
        this.soloMining = new SoloMiningResource(this.client);
        this.channelMining = new ChannelMiningResource(this.client);
        this.payment = new PaymentResource(this.client);
    }
}
export default Migodi;
