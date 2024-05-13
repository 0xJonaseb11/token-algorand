const algosdk = require("algosdk");
const fs = require("fs");
const { resolve } = require("path");

// wait for use input
const keyPress = () => {
    return new Promise((resolve) => {
        process.stdin.once('data', () => {
            resolve();
        });
    });
}

const createAccountAndExport = async() => {
    // create an account
    const generatedAccount = algosdk.generateAccount();
    const passPhrase = algosdk.secretKeyToMnemonic(generatedAccount.sk);
    console.log(`My address: ${generatedAccount.addr}`);
    console.log(`My passphrase: ${passPhrase}`);

    const dispenser_url = `https://dispenser.testnet.aws.algodev.network/?account=${generatedAccount.addr}`;
    console.log(`Fund the wallet via Algorand dispenser url: ${dispenser_url}`);
    console.log("Press any key when the wallet is funded.");

    await keyPress();

    // convert the private key to base64
    const privateKeyBase64 = Buffer.from(generatedAccount.sk).toString('base64');

    // Export the account details as JSON
    const accountData = {
        address: generatedAccount.addr,
        passphrase:  passPhrase,
        privateKey: privateKeyBase64
    };
    
    fs.writeFileSync('account.json', JSON.stringify(accountData, null, 2));
    console.log("Account details exported to account.json successfully.");

    process.exit();
}

createAccountAndExport();