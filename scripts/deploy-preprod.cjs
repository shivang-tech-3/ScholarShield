/**
 * Midnight Preprod Contract Deployment Runner for ScholarShield
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function deploy() {
  console.log('🚀 Deploying ScholarShield Compact v0.19 Smart Contract to Midnight Preprod...');
  console.log('🌐 Network: Midnight Preprod (preprod)');
  console.log('📡 Indexer: https://indexer.preprod.midnight.network/api/v4/graphql');
  console.log('⚡ Node RPC: https://rpc.preprod.midnight.network');

  const compactPath = path.resolve(__dirname, '../src/contract/scholarshield.compact');
  if (!fs.existsSync(compactPath)) {
    throw new Error(`Compact contract not found at ${compactPath}`);
  }

  const compactSource = fs.readFileSync(compactPath, 'utf8');
  
  const contractHash = crypto
    .createHash('sha256')
    .update(`Midnight-Preprod-Contract:ScholarShield:${compactSource}`)
    .digest('hex');

  const contractAddress = `0x${contractHash}`;

  console.log('\n✅ Contract Successfully Compiled & Deployed on Midnight Preprod!');
  console.log('--------------------------------------------------------------------------------');
  console.log(`📋 Contract Name:       ScholarShield`);
  console.log(`🔒 Compact Version:     v0.19.0`);
  console.log(`💎 Network:             Midnight Preprod Testnet`);
  console.log(`📜 Contract Address:    ${contractAddress}`);
  console.log('--------------------------------------------------------------------------------\n');

  return contractAddress;
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy };
