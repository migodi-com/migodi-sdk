# Migodi SDK

[![npm version](https://img.shields.io/npm/v/@migodi/sdk.svg)](https://www.npmjs.com/package/@migodi/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Official Node.js SDK for the Migodi API.

Provides complete access to:
- **Hashrate Orders** - Traditional hashrate rental
- **Solo Mining** - Mine for full block rewards
- **Channel Mining** - Dedicated hashrate packages
- **Pool Management** - Create and manage mining pools
- **Payment System** - Track payments and addresses

## Installation

```bash
npm install @migodi/sdk
```

## Requirements

- Node.js 18 or higher
- Migodi API key (get yours at [app.migodi.com](https://app.migodi.com/user/api-tokens))

## Quick Start

```javascript
import Migodi from '@migodi/sdk';

const migodi = new Migodi('your-api-key-here');

// Get current hashrate pricing
const pricing = await migodi.hashrate.getPricing();
console.log(pricing.data.BTC.price);

// Create a 24-hour hashrate order
const order = await migodi.hashrate.createOrder({
  coin: 'BTC',
  term: 24,
  time_unit: 'hour',
  hashrate: 1000,
  user_pool_id: 'pool-uuid',  // Updated parameter name
  wallet_id: 'wallet-id'
});
console.log(`Order created: ${order.data.id}`);

// Browse solo mining packages
const soloPackages = await migodi.soloMining.getPackages();
console.log(`Solo mining: ${soloPackages.data[0].title}`);

// Browse channel mining packages  
const channelPackages = await migodi.channelMining.getPackages();
console.log(`Channel mining: ${channelPackages.data[0].title}`);
```

## Configuration

```javascript
const migodi = new Migodi('your-api-key', {
  baseURL: 'https://app.migodi.com', // optional, this is the default
  timeout: 30000                      // optional, request timeout in ms
});
```

## TypeScript Support

This SDK is written in TypeScript and provides complete type definitions for all APIs.

```typescript
import Migodi, { HashratePricing, HashrateOrdersList, SoloMiningPackagesList } from '@migodi/sdk';

const migodi = new Migodi('your-api-key');

// Fully typed responses
const pricing: HashratePricing = await migodi.hashrate.getPricing();
const orders: HashrateOrdersList = await migodi.hashrate.listOrders();
const packages: SoloMiningPackagesList = await migodi.soloMining.getPackages();

// Type-safe parameters
const order = await migodi.hashrate.createOrder({
  coin: 'BTC',         // string
  term: 24,            // number  
  time_unit: 'hour',   // 'minute' | 'hour' | 'day'
  hashrate: 1000,      // number
  user_pool_id: 'pool-uuid' // string (replaces pool_id)
});
```

## Migration Guide: pool_id → user_pool_id

Starting from version 1.1.0, the `pool_id` parameter in hashrate order creation is deprecated in favor of `user_pool_id`. The SDK maintains backward compatibility, so existing code will continue to work.

```javascript
// Old way (still works but deprecated)
const order = await migodi.hashrate.createOrder({
  coin: 'BTC',
  term: 24,
  time_unit: 'hour',
  hashrate: 1000,
  pool_id: 'pool-uuid',      // @deprecated
  wallet_id: 'wallet-uuid'
});

// New way (recommended)
const order = await migodi.hashrate.createOrder({
  coin: 'BTC',
  term: 24,
  time_unit: 'hour',
  hashrate: 1000,
  user_pool_id: 'pool-uuid',  // New parameter name
  wallet_id: 'wallet-uuid'
});
```

**Migration Timeline:**
- v1.1.0: Both `pool_id` and `user_pool_id` are supported
- v1.2.0: Using `pool_id` will trigger deprecation warnings
- v2.0.0: `pool_id` will be removed (major version)

## Tree-shaking and Bundle Optimization

Import only the resources you need to reduce bundle size:

```typescript
// Import specific resources (recommended for smaller bundles)
import { HashrateResource } from '@migodi/sdk/hashrate';
import { SoloMiningResource } from '@migodi/sdk/solo-mining';
import { MigodiClient } from '@migodi/sdk';

// Use resources independently
const client = new MigodiClient({ apiKey: 'your-api-key' });
const hashrate = new HashrateResource(client);
const soloMining = new SoloMiningResource(client);

// Or import everything (larger bundle)
import Migodi from '@migodi/sdk';
const migodi = new Migodi('your-api-key');
```

Available subpath imports:
- `@migodi/sdk/hashrate` - Hashrate orders
- `@migodi/sdk/solo-mining` - Solo mining  
- `@migodi/sdk/channel-mining` - Channel mining
- `@migodi/sdk/pools` - Pool management
- `@migodi/sdk/payment` - Payment system
- `@migodi/sdk/errors` - Error classes

## API Reference

### Hashrate

#### Get Pricing
```javascript
const pricing = await migodi.hashrate.getPricing();
// Returns current BTC hashrate pricing information
```

#### Create Order
```javascript
const order = await migodi.hashrate.createOrder({
  coin: 'BTC',
  term: 24,                  // Duration value (depends on time_unit)
  time_unit: 'hour',         // Time unit: 'minute', 'hour', or 'day'
  hashrate: 1000,            // Hashrate in TH/s (min: 120, max: 10000)
  user_pool_id: 'pool-uuid', // Required: specific pool
  wallet_id: 'wallet-id'     // Required: payment wallet
});
```

#### Get Order Details
```javascript
const order = await migodi.hashrate.getOrder('order-id');
```

#### Get Order Statistics
```javascript
// Get all stats for an order
const stats = await migodi.hashrate.getOrderStats('order-id');

// Get stats with time range filtering
const filteredStats = await migodi.hashrate.getOrderStats('order-id', {
  since: '2024-01-01T00:00:00Z',  // Optional: since timestamp
  until: '2024-01-02T00:00:00Z'   // Optional: until timestamp
});
```

#### List Orders
```javascript
// List orders with enhanced filtering and sorting
const orders = await migodi.hashrate.listOrders({
  status: 'active',      // Filter by status: 'inactive' | 'active' | 'paused' | 'completed' | 'cancelled'
  page: 1,
  limit: 20,
  order_by: 'created_at', // Sort by field
  order: 'desc'          // Sort direction
});
```

#### Pause/Resume Orders
```javascript
// Pause an active hashrate order
const pausedOrder = await migodi.hashrate.pauseOrder('order-id');
console.log('Order paused at:', pausedOrder.data.paused_at);
console.log('Remaining duration:', pausedOrder.data.remaining_duration);

// Resume a paused hashrate order
const resumedOrder = await migodi.hashrate.resumeOrder('order-id');
console.log('Order resumed, status:', resumedOrder.data.status); // 'active'
```

### Pools

#### Create Pool
```javascript
const pool = await migodi.pools.create({
  algorithm: 'SHA256',
  title: 'My Mining Pool',
  host: 'stratum.example.com',
  port: 3333,
  username: 'account.workername',
  password: 'x',         // Optional
  main: true            // Set as default pool
});
```

#### Update Pool
```javascript
const updated = await migodi.pools.update('pool-id', {
  title: 'Updated Pool Name',
  main: false
});
```

#### List Pools
```javascript
const pools = await migodi.pools.list({
  algorithm: 'SHA256'
});
```

### Solo Mining

Solo mining gives you the chance to find entire blocks and receive full block rewards.

#### Get Packages
```javascript
const packages = await migodi.soloMining.getPackages();
// Browse available solo mining packages
```

#### Create Order
```javascript
const order = await migodi.soloMining.createOrder({
  package_id: 'pkg-123',
  payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  confirmation_email: 'user@example.com' // Optional
});
```

#### Get Order Details
```javascript
const order = await migodi.soloMining.getOrder('order-id');
```

#### Get Order Statistics
```javascript
const stats = await migodi.soloMining.getOrderStats(
  'order-id',
  '2024-01-01T00:00:00Z', // Optional: since timestamp
  '2024-01-02T00:00:00Z'  // Optional: until timestamp
);
```

#### Get Payment Addresses
```javascript
const addresses = await migodi.soloMining.getPaymentAddresses('order-id', {
  currency: 'BTC',
  payment_method: 'LIGHTNING'
});
```

#### List Orders
```javascript
const orders = await migodi.soloMining.listOrders({
  status: 'active',
  page: 1,
  limit: 20
});
```

### Channel Mining

Channel mining provides dedicated hashrate for a specified duration with predictable returns.

#### Get Packages
```javascript
const packages = await migodi.channelMining.getPackages();
// Browse available channel mining packages
```

#### Create Order
```javascript
const order = await migodi.channelMining.createOrder({
  package_id: 'pkg-456',
  payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  confirmation_email: 'user@example.com' // Optional
});
```

#### Get Order Details
```javascript
const order = await migodi.channelMining.getOrder('order-id');
```

#### Get Order Statistics
```javascript
const stats = await migodi.channelMining.getOrderStats(
  'order-id',
  '2024-01-01T00:00:00Z', // Optional: since timestamp
  '2024-01-02T00:00:00Z'  // Optional: until timestamp
);
```

#### Get Payment Addresses
```javascript
const addresses = await migodi.channelMining.getPaymentAddresses('order-id', {
  currency: 'BTC',
  payment_method: 'LIGHTNING'
});
```

#### List Orders
```javascript
const orders = await migodi.channelMining.listOrders({
  status: 'active',
  coin: 'BTC',
  page: 1,
  limit: 20
});
```

### Payment

#### Get Payment Status
```javascript
const payment = await migodi.payment.getPayment('payment-id');
console.log(`Status: ${payment.data.payment_status}`);
console.log(`Amount: ${payment.data.amount} ${payment.data.currency}`);
```

#### Get Payment Addresses
```javascript
const addresses = await migodi.payment.getAddresses('payment-id', {
  currency: 'BTC',
  payment_method: 'LIGHTNING'
});
```

## Error Handling

The SDK provides typed error classes for better error handling:

```typescript
import { MigodiError, MigodiAuthError, MigodiRateLimitError } from '@migodi/sdk';
// Or import from subpath
import { MigodiError, MigodiAuthError, MigodiRateLimitError } from '@migodi/sdk/errors';

try {
  const order = await migodi.hashrate.createOrder({
    coin: 'BTC',
    term: 24,
    time_unit: 'hour',
    hashrate: 1000
  });
} catch (error) {
  if (error instanceof MigodiAuthError) {
    console.error('Invalid API key - check your credentials');
    console.error(`Status: ${error.status}`); // 401
  } else if (error instanceof MigodiRateLimitError) {
    console.error('Rate limit exceeded, retry after a minute');
    console.error(`Status: ${error.status}`); // 429
  } else if (error instanceof MigodiError) {
    console.error(`API error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    console.error(`Status: ${error.status}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Error Types

- **`MigodiError`** - Base error class for all API errors
- **`MigodiAuthError`** - Authentication failed (401) 
- **`MigodiRateLimitError`** - Rate limit exceeded (429)

All errors include:
- `message` - Human-readable error description
- `code` - Machine-readable error code
- `status` - HTTP status code (when applicable)

## Full Example

```javascript
import Migodi from '@migodi/sdk';

async function main() {
  const migodi = new Migodi(process.env.MIGODI_API_KEY);

  try {
    // Check hashrate pricing
    const pricing = await migodi.hashrate.getPricing();
    const btcPrice = pricing.data.BTC.price.BTC;
    console.log(`Current BTC hashrate price: ${btcPrice} BTC/TH`);

    // Create a mining pool
    const pool = await migodi.pools.create({
      algorithm: 'SHA256',
      title: 'Production Pool',
      host: 'pool.migodi.com',
      port: 3333,
      username: 'myAccount.001',
      main: true
    });
    console.log(`Pool created: ${pool.data.id}`);

    // Traditional hashrate order
    const hashrateOrder = await migodi.hashrate.createOrder({
      coin: 'BTC',
      term: 24,
      time_unit: 'hour',
      hashrate: 1000,
      user_pool_id: pool.data.id,
      wallet_id: 'wallet-id'
    });
    console.log(`Hashrate order: ${hashrateOrder.data.id}`);

    // Browse solo mining packages
    const soloPackages = await migodi.soloMining.getPackages();
    console.log(`Available solo packages: ${soloPackages.data.length}`);
    
    // Create solo mining order
    const soloOrder = await migodi.soloMining.createOrder({
      package_id: soloPackages.data[0].id,
      payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    });
    console.log(`Solo mining order: ${soloOrder.data.id}`);

    // Browse channel mining packages
    const channelPackages = await migodi.channelMining.getPackages();
    console.log(`Available channel packages: ${channelPackages.data.length}`);
    
    // Create channel mining order  
    const channelOrder = await migodi.channelMining.createOrder({
      package_id: channelPackages.data[0].id,
      payout_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    });
    console.log(`Channel mining order: ${channelOrder.data.id}`);

    // Monitor order statistics
    const hashrateStats = await migodi.hashrate.getOrderStats(hashrateOrder.data.id);
    const soloStats = await migodi.soloMining.getOrderStats(soloOrder.data.id);
    const channelStats = await migodi.channelMining.getOrderStats(channelOrder.data.id);
    
    console.log('Hashrate stats:', hashrateStats);
    console.log('Solo mining stats:', soloStats);
    console.log('Channel mining stats:', channelStats);

    // Check payment status (if available)
    if (hashrateOrder.data.payment?.id) {
      const payment = await migodi.payment.getPayment(hashrateOrder.data.payment.id);
      console.log(`Payment status: ${payment.data.payment_status}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## Development

### Running Tests

```bash
npm test           # Run all tests
npm run build      # Build the project
```

## Contributing

We welcome contributions! Please open an issue or submit a pull request on [GitHub](https://github.com/migodi-com/migodi-sdk).

## Support

- **Issues**: [GitHub Issues](https://github.com/migodi-com/migodi-sdk/issues)
- **Documentation**: [API Documentation](https://app.migodi.com/api-docs)

## License

MIT - see [LICENSE](https://github.com/migodi-com/migodi-sdk/blob/main/LICENSE) for details.
