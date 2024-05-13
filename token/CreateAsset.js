const algosdk = require("algosdk");
const { default: AlgodClient } = require("algosdk/dist/types/client/v2/algod/algod");
const fs = require("fs");

const token = "";
const server = "https://testnet-api.algonode.cloud";
const port = 443;

const client = new algosdk.Algodv2(token, server, port);

// deploy token
const deployToken = async() => {
    
    const accountData = JSON.parse(fs.readFileSync('account.json', 'utf-8'));
    const { address, privateKey } = accountData;
    const privateKeyUint8 = new Uint8Array(Buffer.from(privateKey, "base64"));

    const suggestedParams = await client.getTransactionParams().do();

    console.log("Creating token Metadata....");
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams({
        from: address,
        suggestedParams,
        defaultFrozen: false,
        unitName: "Pepe", // symbol
        assetName: "Pepe coin", // name of the asset
        manager: address,
        reserve: address,
        freeze: address,
        clawback: address,
        total: 1000,
        decimals: 0, // decimals
    })

    const signedTxn = algosdk.signTransaction(txn, privateKeyUint8);

    await algodClient.sendRawTransaction(signedTxn.blob).do();

    const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

    console.log("Token deployed successfully!!");

    const assetIndex = result['asset-index'];

    console.log(`Asset ID created: ${assetIndex}`);
}