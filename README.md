# Blockchain staking and lending

Decentralised Lending/Staking platform where users can earn a competitive intrest rate based on the amount of tokens staked.
During the migration, the second and the third account in the local blockchain will receive the following tokens (when migrating to a testnet you'll need to specify the 2 accounts yourself. More information on that later):

- 500 000 (COMP)
- 500 000 (FLOW)
- 500 000 (AAVE)
- 500 000 (DAI)
- 500 000 (USDC)
- 500 000 (USDT)
- 500 000 (ZRX)
- 500 000 (SUSHI)
- 500 000 (LINK)
- 500 000 (YFI)
- 500 000 (BAT) 
- 500 000 (CAKE)
- 500 000 (UNI)

The staking reward is a token distributed by Dapperbank also known as the DPK token. The user receives a staking reward every minute (this is pure for testing purposes).
The user also has the ability to borrow tokens if there is enough liquidit. However there is one condition: the user will have to provide an equal amount as the borrow amount so that it can be used as a colleteral. This is to assure that the contract does not lose any money if the user doesn't pay back the loan. The user will still receive staking rewards on the colleteral. The time window in which a user has to repay the loan is again 2 minutes (this is also pure for testing purposes).

```Disclaimer: All the tokens that are used in this project are mock tokens, they hold no real value and they are only being used for testing purposes!``` 

## How to run the project locally

### Install the Truffle framework

Truffle is a smart contract framework that allows you to compile, test, debug and deploy your smart contracts. You can use npm to install the truffle framework
```
npm install -g truffle
```

### Installation of a local blockchain (Ganache)

In this example we'll install ganache-cli. This is a CLI tool that runs a local blockchain on your computer. You can use npm to do the installation.
```
npm install ganache --global
```

### Run your local blockchain

Run the ganache-cli with a network Id of 5777
```
ganache-cli -i 5777
```

### Deploying the smart contracts

Deploy your smart contracts on the local blockchain using the Truffle framework

```
truffle migrate --network develop --reset
```

### Run the React website

```
cd ./client
npm install
npm start
```

### Deploying the smart contracts an a test network

This project is configured for deployment to the Kovan network. In order to do the deployment you'll need to make a .env file in the root of the project with the following environment variables 

#### DEPLOYER

This will be the account that is responsible to deploy the contracts on the testnet. Be sure that it is well funded... You can use the faucet of chainlink to get some test ETH and LINK (https://faucets.chain.link/)

#### ACCOUNT1

The first account that will receive half of all tokens

#### ACCOUNT2

The second account that will receive the other half of the tokens

#### INFURA_API_KEY

In order to deploy the smart contracts on the test network we need a node that is connected to the KOVAN network. Use infura to make a new project that is connected to the a node of the KOVAN network. Use the websocket url to connect to the node in the .env file. (https://infura.io/)

#### Run the migrate command of Truffle

```
truffle migrate --network kovan --reset
```

### Deployed addresses of the smart contract on the KOVAN network

All the contracts are verified and deployed on the KOVAN network. Visit https://kovan.etherscan.io/ to have a look.

#### TOKENS
##### 0x21bfa9c42bfdc2e510bec94b1d1db9ec0d67326c - BAT.sol
##### 0x9eff2923c161ec0e65ff6b9d4916b9f2f00b489e - DAI.sol
##### 0xc1aa6f5c153c9c679f8570b43f4507bb95cbdf00 - UNI.sol
##### 0x69d6c981af95b6810f65e29c85fb5257cf517491 - USDC.sol
##### 0x37d449999b9bf24771726d2be06b250f3a3d4b93 - USDT.sol
##### 0x37dd408cfc5cc3babccb071c8ab7e82657cdd556 - ZRX.sol
##### 0x0f5557740a31d984466aab786bbac22591783137 - DPK.sol

#### CONTRACTS
##### 0x3ee5821790573a1900eee3613ba730c6ee418198 - PriceConsumerV3.sol
##### 0xf9363c70071a47e6deb9d3685574426948ce0356 - DapperBankKovan.sol

