# MetaMask Test Dapp Multichain for Tron

A test dapp for the MetaMask Multichain API on Tron.

## Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd test-dapp-tron
yarn install
```

### 2. Configure Environment Variables (Optional)

For basic testing, you can use the public TronGrid API (rate limited). For production use or higher rate limits, get an API key from [TronGrid](https://www.trongrid.io/).

Copy the example environment file:

```bash
cp .env.example .env
```

If you have a TRON PRO API key, edit the `.env` file:

```env
# TRON PRO API Key (optional)
# Get your API key from: https://www.trongrid.io/
VITE_TRON_PRO_API_KEY=your-tron-pro-api-key-here

# Default recipient address for testing (optional)
# If not provided, uses a default test address
VITE_DEFAULT_RECIPIENT=your-custom-test-address
```

**Note**: If no API key is provided, the application will use the public API which has rate limits but works for basic testing.

### 3. Development

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:8081`.

### 4. Build for Production

```bash
yarn build
```

## Usage

Once the development server is running, you can:

1. Connect your Tron wallet (TronLink, MetaMask, etc.)
2. Test message signing functionality
3. Test TRX transfers
4. Test USDT TRC-20 transfers

## Configuration

The application supports multiple Tron networks:

- **Mainnet**: Production network
- **Shasta**: Testnet for development
- **Nile**: Alternative testnet

Network configuration and contract addresses are managed in `src/config.ts`.
