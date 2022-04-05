import axios from "axios";

export const getCoinPrice = async (coin: string) => {
  try {
    const coinPrice = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    );
    const data = coinPrice.data.filter((token: any) => token.symbol === coin);
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
const API_KEY = 'PWRYSUPZUUD8Q218AH834UAVW518SVWX1C';
const ACTION = 'gasoracle';
const BASE_URL = 'https://api.etherscan.io/api';
const url = `${BASE_URL}?module=gastracker&action=${ACTION}&apikey=${API_KEY}`;
const getGas = async () => {
const response = axios.get(url);

console.log('response', (await response).data);
}

const getBalance = async () => {
  // https://api.etherscan.io/api
  //  ?module=account
  //  &action=balance
  //  &address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
  //  &tag=latest
  //  &apikey=YourApiKeyToken
  const modules = 'account';
  const action = 'balace';
  const address = '0x4E488e7C4814cb502d972AaC485a17B498A75E0C';
  const tag = 'latest';
  const url = `${BASE_URL}?module=${modules}&action=${action}&address=${address}&tag=latest&apikey=${API_KEY}`;

  const response = axios.get(url);
  console.log('balance', (await response).data);
}

// getGas();
getBalance()
