pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed; 
    mapping(string => AggregatorV3Interface) public priceFeeds;

    // All the price feeds will return a dollar amount (<token_symbol>/USD)
    constructor(){
        priceFeeds["ETH"]   =  AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        priceFeeds["DAI"]   =  AggregatorV3Interface(0xeE636E1f7A0A846EEc2385E729CeA7D1b339D40D);
        priceFeeds["AAVE"]  =  AggregatorV3Interface(0x547a514d5e3769680Ce22B2361c10Ea13619e8a9);
        priceFeeds["BAT"]   =  AggregatorV3Interface(0x9441D7556e7820B5ca42082cfa99487D56AcA958);
        priceFeeds["CAKE"]  =  AggregatorV3Interface(0xEb0adf5C06861d6c07174288ce4D0a8128164003);
        priceFeeds["COMP"]  =  AggregatorV3Interface(0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5);
        priceFeeds["LINK"]  =  AggregatorV3Interface(0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c);
        priceFeeds["FLOW"]  =  AggregatorV3Interface(0xD9BdD9f5ffa7d89c846A5E3231a093AE4b3469D2);
        priceFeeds["ZRX"]   =  AggregatorV3Interface(0x2885d15b8Af22648b98B122b22FDF4D2a56c6023);
        priceFeeds["YFI"]   =  AggregatorV3Interface(0xA027702dbb89fbd58938e4324ac03B58d812b0E1);
        priceFeeds["USDC"]  =  AggregatorV3Interface(0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60);
        priceFeeds["USDT"]  =  AggregatorV3Interface(0x2ca5A90D34cA333661083F89D831f757A9A50148);
        priceFeeds["UNI"]   =  AggregatorV3Interface(0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39);
        priceFeeds["SUSHI"] =  AggregatorV3Interface(0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7);
    }

    /****
        @notice this function returns the price of a token in USD through chainlink data feeds
        @param _symbol the symbol of the token to get the price for (for example: ETH)
        @return (int) the price of the token in USD
    *****/
    function getLatestPriceOfToken(string memory _symbol) public view returns (int) {
          (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        )  = priceFeeds[_symbol].latestRoundData();
        return price / 10 ** 8;
    }
}