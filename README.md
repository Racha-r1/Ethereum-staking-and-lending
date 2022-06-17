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

The staking reward is a token distributed by Dapperbank namely the DPK token

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

### Deploying the smart contracts

Deploy your smart contracts on the local blockchain using the Truffle framework

```
truffle migrate --network develop --reset
```
