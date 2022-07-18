import fetch from "node-fetch";

export const getCoinPrice = async (coin) => {
  const resp = await fetch(`${process.env.TICKER_URL}/${coin}/`)
  const { data } = await resp.json();
  return data;
};
