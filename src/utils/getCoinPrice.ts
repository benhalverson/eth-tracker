import axios from "axios";

export const getCoinPrice = async (coin: string) => {
  try {
    const coinPrice = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    const data = coinPrice.data.filter((token: any) => token.symbol === "eth");
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
