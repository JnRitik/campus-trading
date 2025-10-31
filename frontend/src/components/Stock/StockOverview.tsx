import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StockOverviewProps {
  name: string;
  symbol: string;
  exchange: string;
  currentPrice: number;
  change?: number;
  changePercent?: number;
  logoUrl?: string;
}

const StockOverview = ({
  name,
  symbol,
  exchange,
  currentPrice,
  change,
  changePercent,
  logoUrl,
}: StockOverviewProps) => {
  const safeChange = change ?? 0;
  const safeChangePercent = changePercent ?? 0;
  const isPositive = safeChange >= 0;
  const normalizedSymbol = symbol?.toUpperCase?.() || symbol;
  const hasValidSymbol = typeof normalizedSymbol === "string" && normalizedSymbol.trim() !== "" && normalizedSymbol !== "—";
  const tradingViewUrl = hasValidSymbol
    ? `https://in.tradingview.com/chart/?symbol=${encodeURIComponent(normalizedSymbol)}`
    : undefined;
  const screenerUrl = hasValidSymbol
    ? `https://www.screener.in/company/${encodeURIComponent(normalizedSymbol)}/consolidated/`
    : undefined;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-12 w-12 rounded-lg" />
          ) : (
            <TrendingUp className="h-8 w-8 text-primary" />
          )}
        </div>

        {/* Stock Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{symbol}</h1>
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {exchange}
            </span>
          </div>

          {/* Price Info */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{currentPrice.toFixed(2)}
            </span>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {safeChange.toFixed(2)} ({isPositive ? "+" : ""}
                {safeChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {hasValidSymbol && (
            <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Need deeper analysis?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore {normalizedSymbol} across external tools
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <a
                    href={tradingViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span>View Chart</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <a
                    href={screenerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span>View Fundamentals</span>
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StockOverview;
