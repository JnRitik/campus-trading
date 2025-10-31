import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ENDPOINTS, apiClient } from '@/api/config';

interface StockData {
  symbol: string;
  name?: string;
  lastPrice: number;
  changePercent: number;
  change: number;
  totalTradedVolume: number;
}

interface StockDataContextType {
  stockData: StockData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getStockBySymbol: (symbol: string) => StockData | undefined;
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined);

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};

interface StockDataProviderProps {
  children: ReactNode;
}

export const StockDataProvider = ({ children }: StockDataProviderProps) => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toNumber = (value: unknown) => {
    if (value === null || value === undefined) return 0;
    const normalized = String(value).replace(/,/g, '').trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const hasValidName = (item: any) => {
    const name = (item?.name ?? item?.companyName ?? '').toString().trim();
    return name.length > 0;
  };

  const extractStocks = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const normalizeStock = (item: any): StockData => {
    const symbol = (item?.symbol || '').toString();
    return {
      symbol,
      name: (item?.name ?? item?.companyName ?? '').toString().trim(),
      lastPrice: toNumber(item?.lastPrice ?? item?.price ?? item?.ltp),
      changePercent: toNumber(item?.changePercent ?? item?.pChange),
      change: toNumber(item?.change),
      totalTradedVolume: toNumber(item?.totalTradedVolume ?? item?.volume),
    };
  };

  const fetchStockData = async () => {
    try {
      setError(null);
      const response = await apiClient.get(ENDPOINTS.allStocks);
      const rawStocks = extractStocks(response.data ?? []);

      const sanitized = rawStocks
        .filter(item => item && item.symbol && hasValidName(item))
        .map(item => ({
          item,
          price: toNumber(item?.lastPrice ?? item?.price ?? item?.ltp),
        }))
        .filter(({ price }) => price > 0)
        .map(({ item }) => normalizeStock(item));

      setStockData(sanitized);
    } catch (err) {
      // Silently handle errors
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchStockData();
  };

  const getStockBySymbol = (symbol: string): StockData | undefined => {
    return stockData.find(stock => 
      stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  };

  useEffect(() => {
    fetchStockData();
    
    // Set up auto-refresh every 15 seconds
    const interval = setInterval(fetchStockData, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const value: StockDataContextType = {
    stockData,
    loading,
    error,
    refreshData,
    getStockBySymbol
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};
