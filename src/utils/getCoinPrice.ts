import axios from "axios";

export const getCoinPrice = async (symbol: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
    );
    const data = response.data;

    const coinData: CoinData = data.find((coin: CoinData) => coin.symbol === symbol.toLowerCase());

    if (!coinData) {
      console.error("Coin not found");
      return null;
    }

    const result = {
      name: coinData.name,
      price: coinData.current_price,
    };

    console.log(`${symbol} data:`, result);

    return result;
  } catch (error: any) {
    console.error("Error getting price", error.message);
  }
};

interface CoinData {
  id:                               string;
  symbol:                           string;
  name:                             string;
  image:                            string;
  current_price:                    number;
  market_cap:                       number;
  market_cap_rank:                  number;
  fully_diluted_valuation:          number;
  total_volume:                     number;
  high_24h:                         number;
  low_24h:                          number;
  price_change_24h:                 number;
  price_change_percentage_24h:      number;
  market_cap_change_24h:            number;
  market_cap_change_percentage_24h: number;
  circulating_supply:               number;
  total_supply:                     number;
  max_supply:                       null;
  ath:                              number;
  ath_change_percentage:            number;
  ath_date:                         Date;
  atl:                              number;
  atl_change_percentage:            number;
  atl_date:                         Date;
  roi:                              null;
  last_updated:                     Date;
}
