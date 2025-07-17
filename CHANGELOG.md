# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-01-16

### 🔄 API Updates & Improvements

### Changed
- **Hashrate Orders**: `pool_id` and `wallet_id` parameters are now required (previously optional)
- **Payment Addresses**: Updated payment address endpoints to use `currency` and `payment_method` parameters instead of `address`
  - Payment methods now include `LIGHTNING` support
  - Response structure updated to include full payment object with addresses array
- **Statistics API**: Updated order statistics format across all mining types
  - Changed from single object to array of timestamp-based data points
  - New fields: `timestamp`, `unit`, `speed_accepted`, `speed_rejected`, `shares_accepted`
  - Removed fields: `total_earnings`, `total_hashrate`, `uptime_percentage`, `blocks_found`, `shares_rejected`
- **Mining Packages**: Simplified pricing structure
  - Solo Mining: `price` field changed from object to number
  - Channel Mining: `price` field changed from object to number
  - Channel Mining: `profitability` field changed from number to object with `min` and `max` values
- **Pagination**: Added `from` and `to` fields to all paginated responses
- **Solo Mining Orders**: Enhanced order data structure
  - Added `begin_at` and `end_at` timestamp fields
  - Added `potential_block_reward` field
  - Added `percent_to_reward` field
  - Added `reward` and `rewards` objects
- **Channel Mining Orders**: Enhanced order data structure
  - Added detailed `profitability` object with min/max values
  - Added `estimated_earnings_today` and `total_earnings` fields
  - Added comprehensive `earnings` array with transaction details
- **Payment Objects**: Enhanced payment structure across all order types
  - Added `payment_status` field
  - Added `addresses` array with detailed address information

### Fixed
- Timestamp parameters for statistics endpoints now use UNIX millisecond timestamps (was ISO 8601)
- Improved type safety for payment address handling
- Corrected API endpoint parameter requirements

### Technical Details
- Updated OpenAPI specification to version 1.0.1
- All endpoints maintain backward compatibility where possible
- Enhanced error handling for required parameters

## [1.0.0] - 2025-01-16

### 🎉 First Stable Release

This is the first stable release of the Migodi SDK with complete API coverage.

### Added
- **Solo Mining API** - Complete implementation with 6 endpoints
  - `getPackages()` - Browse available solo mining packages
  - `createOrder()` - Create solo mining orders
  - `getOrder()` - Get order details
  - `updatePaymentAddresses()` - Update payment addresses
  - `getOrderStats()` - Get order statistics
  - `listOrders()` - List all orders with filtering

- **Channel Mining API** - Complete implementation with 6 endpoints
  - `getPackages()` - Browse channel mining packages
  - `createOrder()` - Create channel mining orders
  - `getOrder()` - Get order details
  - `updatePaymentAddresses()` - Update payment addresses
  - `getOrderStats()` - Get order statistics
  - `listOrders()` - List all orders with filtering

- **Payment API** - New payment management with 2 endpoints
  - `getPayment()` - Get payment status and details
  - `updateAddresses()` - Update payment addresses

- **TypeScript Support**
  - Complete type definitions for all API responses
  - Comprehensive interfaces for all request/response objects
  - Full JSDoc documentation for better IDE integration

- **Tree-shaking Support**
  - Subpath exports for optimized bundle sizes
  - Import individual resources: `@migodi/sdk/hashrate`
  - Available for all resources: hashrate, pools, solo-mining, channel-mining, payment, errors

- **Developer Experience**
  - Comprehensive JSDoc comments for all public APIs
  - TypeScript strict mode compatibility
  - Better error messages with context

### Changed
- **BREAKING**: Replaced all `any` types with specific TypeScript interfaces
  - `payment: any` → `payment: { id, status, currency, amount } | null`
  - `body?: any` → `body?: unknown`
  - Return types are now explicitly defined for all methods

- Improved error handling with typed error classes
- Updated package metadata with correct repository URLs
- Enhanced README with TypeScript examples and complete API documentation

### Fixed
- Type safety issues throughout the codebase
- Missing return type annotations
- Inconsistent error handling

### Technical Details
- **API Coverage**: 100% (22/22 endpoints implemented)
- **Type Coverage**: 100% (no `any` types remaining)
- **Node.js**: Requires version 18 or higher
- **Module System**: ESM modules with CommonJS compatibility

## [0.1.0] - 2024-01-01

### Added
- Initial SDK implementation
- Hashrate Order API (5 endpoints)
- Pool Management API (5 endpoints)
- Basic TypeScript support
- Error handling with custom error classes
- HTTP client with Bearer token authentication

### Known Issues
- Limited to 45% API coverage (10/22 endpoints)
- Multiple `any` types reducing type safety
- Missing Solo Mining, Channel Mining, and Payment APIs

[1.0.1]: https://github.com/migodi-com/migodi-sdk/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/migodi-com/migodi-sdk/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/migodi-com/migodi-sdk/releases/tag/v0.1.0