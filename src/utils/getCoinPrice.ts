import axios from "axios";

export const getCoinPrice = async (coin: string): Promise<Response | undefined> => {
  try {
    const coinPrice = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    const data = coinPrice.data.filter((token: Response) => token.symbol === "eth");
    const eth = {
      name: data[0].name,
      price: data[0].current_price,
    };
    console.log("eth", eth);

    return eth;
  } catch (error: any) {
    console.error("Error getting price", error.message);
  }
};

export interface Response {
    id?:                           string;
    symbol?:                       string;
    name?:                         string;
    image?:                        string;
    currentPrice?:                 number;
    marketCap?:                    number;
    marketCapRank?:                number;
    fullyDilutedValuation?:        number;
    totalVolume?:                  number;
    high24H?:                      number;
    low24H?:                       number;
    priceChange24H?:               number;
    priceChangePercentage24H?:     number;
    marketCapChange24H?:           number;
    marketCapChangePercentage24H?: number;
    circulatingSupply?:            number;
    totalSupply?:                  number;
    maxSupply?:                    number;
    ath?:                          number;
    athChangePercentage?:          number;
    athDate?:                      Date;
    atl?:                          number;
    atlChangePercentage?:          number;
    atlDate?:                      Date;
    roi?:                          null;
    lastUpdated?:                  Date;
}
