import axios from "axios";

export const getCoinPrice = async (symbol: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
    );
    const data = response.data;

    const coinData = data.find((coin: any) => coin.symbol === symbol);

    console.log('coinData', coinData);
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