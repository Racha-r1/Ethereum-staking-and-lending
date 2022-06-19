const path = require("path");

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
        mainlocal: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            skipDryRun: true,
            gas: 6000000
        }
    },
};
