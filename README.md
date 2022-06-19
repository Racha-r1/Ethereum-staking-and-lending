# Blockchain staking and lending

Decentralised Lending/Staking platform where users can earn a competitive intrest rate based on the amount of tokens staked.
During the migration the second account in the local blockchain will receive the following tokens:

- 1 000 000 (COMP)
- 1 000 000 (FLOW)
- 1 000 000 (AAVE)
- 1 000 000 (DAI)
- 1 000 000 (USDC)
- 1 000 000 (USDT)
- 1 000 000 (ZRX)
- 1 000 000 (SUSHI)
- 1 000 000 (LINK)
- 1 000 000 (YFI)
- 1 000 000 (BAT) 
- 1 000 000 (CAKE)
- 1 000 000 (UNI)

The staking reward is a token distributed by Dapperbank namely the DPK token. The user receives a staking reward every 2 minutes (this is pure for testing purposes).
The user also has the ability to borrow tokens if there is enough liquidity but the user will have to provide an equal amount as the borrow amount so that it can be used as a colleteral in case the user doesn't pay back the loan. The user will still receive staking rewards on the colleteral. The time window in which a user has to repay the loan is again 2 minutes (this is also pure for testing purposes).

```Disclaimer: All the tokens that are used in this project are mock tokens, they hold no real value and they are only being used for testing purposes!``` 

## How to run the project locally

### Install the Truffle framework

Truffle is a smart contract framework that allows you to compile, test, debug and deploy your smart contracts. You can use npm to install the truffle framework
```
npm install -g truffle
```

### Installation of a local blockchain (Ganache)

In this example we'll install ganache-cli, this is a CLI tool that runs a local blockchain on your computer. You can use npm to do the installation.
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
npm start
```
