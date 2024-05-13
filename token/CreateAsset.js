const algosdk = require('algosdk');
const fs = require('fs');

const token = '';
const server = 'https://testnet-api.algonode.cloud';
const port = 443;

const client = new algosdk.Algodv2(token, server, port);

async function deployToken() {
  // Read the account details from JSON
  const accountData = JSON.parse(fs.readFileSync('account.json', 'utf8'));
  const { address, privateKey } = accountData;

  // Convert the private key from base64 string back to Uint8Array
  const privateKeyUint8 = new Uint8Array(Buffer.from(privateKey, 'base64'));

  // Get suggested transaction parameters
  const suggestedParams = await client.getTransactionParams().do();

  // Create an asset creation transaction
  console.log("Creating the Token Metadata");
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: address,
    suggestedParams,
    defaultFrozen: false,
    unitName: 'Pepe', // Symbol
    assetName: 'Pepe Coin', // Name of the asset
    manager: address,
    reserve: address,
    freeze: address,
    clawback: address,
    total: 1000,
    decimals: 0, // Decimals
  });

  // Sign the transaction
  const signedTxn = algosdk.signTransaction(txn, privateKeyUint8);

  // Submit the transaction to the network
  await client.sendRawTransaction(signedTxn.blob).do();

  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(client, txn.txID().toString(), 3);
  
  console.log("Token deployed");
  const assetIndex = result['asset-index'];
  console.log(`Asset ID created: ${assetIndex}`);

  // Display AlgoExplorer URL
  const url = `https://testnet.explorer.perawallet.app/asset/${assetIndex}`;
  console.log(`Asset URL: ${url}`);

  // End the console
  process.exit();
}

deployToken().catch(console.error);