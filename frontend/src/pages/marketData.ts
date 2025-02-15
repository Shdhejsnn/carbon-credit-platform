import { MarketPrice } from './types';

// Base prices from real market data
const baseMarketPrices: MarketPrice[] = [
  { market: 'European Union', price: 0, currency: '€', change: 0, type: 'compliance', baseVolatility: 0.015 },
  { market: 'UK', price: 0, currency: '$', change: 0, type: 'compliance', baseVolatility: 0.02 },
  { market: 'Australia', price: 0, currency: 'AUD', change: 0, type: 'compliance', baseVolatility: 0.018 },
  { market: 'New Zealand', price: 0, currency: 'NZD', change: 0, type: 'compliance', baseVolatility: 0.016 },
  { market: 'South Korea', price: 0, currency: '$', change: 0, type: 'compliance', baseVolatility: 0.025 },
  { market: 'China', price: 0, currency: '¥', change: 0, type: 'compliance', baseVolatility: 0.022 },
  { market: 'Aviation Industry Offset', price: 0, currency: '$', change: 0, type: 'voluntary', baseVolatility: 0.03 },
  { market: 'Nature Based Offset', price: 0, currency: '$', change: 0, type: 'voluntary', baseVolatility: 0.028 },
  { market: 'Tech Based Offset', price: 0, currency: '$', change: 0, type: 'voluntary', baseVolatility: 0.026 }
];

// Market trends simulation
const trends = {
  bullish: 0.6,    // 60% chance of price increase
  bearish: 0.4,    // 40% chance of price decrease
  momentum: 0.7    // Price movement tends to continue in the same direction
};

let previousPrices = new Map<string, number>();
let previousTrends = new Map<string, 'up' | 'down'>();

// Initialize with realistic base prices
export function initializeMarketPrices(): MarketPrice[] {
  return baseMarketPrices.map(market => {
    let basePrice: number;
    
    switch (market.market) {
      case 'European Union':
        basePrice = 79.90;
        break;
      case 'UK':
        basePrice = 46.78;
        break;
      case 'Australia':
        basePrice = 34.10;
        break;
      case 'New Zealand':
        basePrice = 63.25;
        break;
      case 'South Korea':
        basePrice = 6.68;
        break;
      case 'China':
        basePrice = 91.14;
        break;
      case 'Aviation Industry Offset':
        basePrice = 0.39;
        break;
      case 'Nature Based Offset':
        basePrice = 0.50;
        break;
      case 'Tech Based Offset':
        basePrice = 0.35;
        break;
      default:
        basePrice = 50.00;
    }
    
    previousPrices.set(market.market, basePrice);
    return { ...market, price: basePrice, change: 0 };
  });
}

// Simulate market movements with realistic price dynamics
export function getUpdatedPrices(): MarketPrice[] {
  return baseMarketPrices.map(market => {
    const prevPrice = previousPrices.get(market.market) || market.price;
    const prevTrend = previousTrends.get(market.market);
    
    // Calculate price movement probability
    let upwardProbability = trends.bullish;
    if (prevTrend === 'up') {
      upwardProbability *= trends.momentum;
    } else if (prevTrend === 'down') {
      upwardProbability *= (1 - trends.momentum);
    }

    // Determine price movement direction
    const movement = Math.random() < upwardProbability ? 1 : -1;
    
    // Calculate new price with volatility
    const volatility = (market.baseVolatility ?? 0.015) * (1 + Math.random() * 0.5);
    const priceChange = prevPrice * volatility * movement;
    const newPrice = Math.max(0.01, prevPrice + priceChange);
    
    // Calculate percentage change
    const percentageChange = ((newPrice - prevPrice) / prevPrice) * 100;
    
    // Update previous values for next iteration
    previousPrices.set(market.market, newPrice);
    previousTrends.set(market.market, movement > 0 ? 'up' : 'down');

    return {
      ...market,
      price: Number(newPrice.toFixed(2)),
      change: Number(percentageChange.toFixed(2))
    };
  });
}

export type { MarketPrice };
