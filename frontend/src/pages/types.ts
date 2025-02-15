// types.ts
export interface MarketPrice {
    market: string;
    price: number;
    currency: string;
    change: number;
    type: 'compliance' | 'voluntary'; // This is for market prices
    baseVolatility?: number; // Optional property for volatility
}

export interface Transaction {
    id: number;
    type: 'buy' | 'sell'; // This is for transactions
    amount: number;
    price: number;
    date: string;
}