export const subscribers: Subscriber[] = [
  {
    number: "1234567890",
    token: "eth",
    targetPrice: 2500,
  },
];

export interface Subscriber {
  number: string;
  token: string;
  targetPrice: number;
}
