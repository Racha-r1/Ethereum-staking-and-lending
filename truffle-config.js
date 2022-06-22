const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
    compilers: {
        solc: {
            version: "0.8.4",
        },
    },
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        develop: {
            host: "127.0.0.1",
            port: 8545,
            network_id: 5777,
        },
        kovan: {
            provider: () => new HDWalletProvider({
                mnemonic: {
                  phrase: process.env.MNEMONIC
                },
                providerOrUrl: process.env.INFURA_API_KEY
            }),
            network_id: 42,
            gasPrice: 25000000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    }
}
