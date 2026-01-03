import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllCafes, Cafe } from "@/lib/mock-data";
import { CafeCard } from "@/components/CafeCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SearchBar } from "@/components/SearchBar";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Coffee, MapPin } from "lucide-react";
import { flexibleMatch } from "@/lib/normalize-text";
import { calculateDistance } from "@/lib/distance";
import { useLocation } from "@/contexts/LocationContext";

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [sortBy, setSortBy] = useState("distance");
  const { userLocation, locationError } = useLocation();
  const [cafesWithDistance, setCafesWithDistance] = useState<Cafe[]>([]);
  const [filters, setFilters] = useState({
    // Cafe types
    dogFriendly: false,
    catFriendly: false,
    // Purpose
    workFriendly: false,
    conversationFriendly: false,
    soloFriendly: false,
    quiet: false,
    touristFriendly: false,
    japanesePopular: false,
    // Facilities
    wifi: false,
    powerOutlets: false,
    stableWifi: false,
    longStayOk: false,
    nonSmoking: false,
    outdoor: false,
    // Price
    cheap: false,
    moderate: false,
    expensive: false,
  });

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation) {
      const allCafes = getAllCafes();
      const cafesWithDist = allCafes.map((cafe) => ({
        ...cafe,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          cafe.lat,
          cafe.lng
        ),
      }));
      setCafesWithDistance(cafesWithDist);
    }
  }, [userLocation]);

  const handleFilterChange = (key: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedCafes = () => {
    const allCafes = cafesWithDistance.length > 0 ? cafesWithDistance : getAllCafes();
    let results = allCafes.filter((cafe) => {
      // Text search with Vietnamese diacritic support
      if (queryParam) {
        const matchesQuery =
          flexibleMatch(cafe.name, queryParam) ||
          flexibleMatch(cafe.address, queryParam) ||
          cafe.tags.some((tag) => flexibleMatch(tag, queryParam));
        if (!matchesQuery) return false;
      }

      // Type filters
      if (filters.dogFriendly && !cafe.tags.some(t => t.toLowerCase().includes("dog") || t.toLowerCase().includes("ドッグ") || t.toLowerCase().includes("犬"))) return false;
      if (filters.catFriendly && !cafe.tags.some(t => t.toLowerCase().includes("cat") || t.toLowerCase().includes("キャット") || t.toLowerCase().includes("猫"))) return false;

      // Purpose filters
      if (filters.workFriendly && !cafe.tags.some(t => t.toLowerCase().includes("work") || t.toLowerCase().includes("作業") || t.toLowerCase().includes("仕事"))) return false;
      if (filters.conversationFriendly && !cafe.tags.some(t => t.toLowerCase().includes("会話") || t.toLowerCase().includes("conversation") || t.toLowerCase().includes("talk"))) return false;
      if (filters.soloFriendly && !cafe.tags.some(t => t.toLowerCase().includes("一人") || t.toLowerCase().includes("solo") || t.toLowerCase().includes("alone"))) return false;
      if (filters.quiet && !cafe.tags.some(t => t.toLowerCase().includes("quiet") || t.toLowerCase().includes("静か") || t.toLowerCase().includes("落ち着"))) return false;
      if (filters.touristFriendly && !cafe.tags.some(t => t.toLowerCase().includes("観光") || t.toLowerCase().includes("tourist") || t.toLowerCase().includes("旅行"))) return false;
      if (filters.japanesePopular && !cafe.tags.some(t => t.toLowerCase().includes("日本人") || t.toLowerCase().includes("japanese"))) return false;

      // Facility filters
      if (filters.powerOutlets && !cafe.tags.some(t => t.toLowerCase().includes("power") || t.toLowerCase().includes("電源") || t.toLowerCase().includes("outlet") || t.toLowerCase().includes("コンセント"))) return false;
      if (filters.stableWifi && !cafe.tags.some(t => t.toLowerCase().includes("wi-fi") || t.toLowerCase().includes("wifi") || t.toLowerCase().includes("安定"))) return false;
      if (filters.longStayOk && !cafe.tags.some(t => t.toLowerCase().includes("長時間") || t.toLowerCase().includes("long stay") || t.toLowerCase().includes("work"))) return false;
      if (filters.nonSmoking && !cafe.tags.some(t => t.toLowerCase().includes("禁煙") || t.toLowerCase().includes("non-smoking") || t.toLowerCase().includes("smoke-free"))) return false;
      if (filters.outdoor && !cafe.tags.some(t => t.toLowerCase().includes("outdoor") || t.toLowerCase().includes("屋外") || t.toLowerCase().includes("garden") || t.toLowerCase().includes("庭園"))) return false;

      // Price filters (OR logic if any price is selected)
      const priceFilters = [filters.cheap, filters.moderate, filters.expensive];
      const anyPriceSelected = priceFilters.some(f => f);
      if (anyPriceSelected) {
        const matchesPrice =
          (filters.cheap && cafe.price_range === "cheap") ||
          (filters.moderate && cafe.price_range === "moderate") ||
          (filters.expensive && cafe.price_range === "expensive");
        if (!matchesPrice) return false;
      }

      return true;
    });

    // Sorting - Primary by distance, secondary by rating
    results.sort((a, b) => {
      if (sortBy === "distance") {
        const distDiff = (a.distance || 0) - (b.distance || 0);
        // If distances are very close (within 0.1km), sort by rating
        if (Math.abs(distDiff) < 0.1) {
          return b.rating - a.rating;
        }
        return distDiff;
      }
      if (sortBy === "rating") {
        const ratingDiff = b.rating - a.rating;
        // If ratings are equal, sort by distance
        if (ratingDiff === 0) {
          return (a.distance || 0) - (b.distance || 0);
        }
        return ratingDiff;
      }
      if (sortBy === "price-low") {
        const priceOrder = { cheap: 1, moderate: 2, expensive: 3 };
        const priceDiff = priceOrder[a.price_range] - priceOrder[b.price_range];
        // If prices are equal, sort by rating (high to low)
        if (priceDiff === 0) {
          return b.rating - a.rating;
        }
        return priceDiff;
      }
      return 0;
    });

    return results;
  };

  const results = filteredAndSortedCafes();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Search Bar Section */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <SearchBar defaultValue={queryParam} variant="compact" />
        {locationError && (
          <div className="mt-2 text-sm text-amber-600 dark:text-amber-500 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{locationError} - デフォルトの位置を使用しています</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block">
            <FilterPanel
              sortBy={sortBy}
              filters={filters}
              onSortChange={setSortBy}
              onFilterChange={handleFilterChange}
              resultCount={results.length}
            />
          </aside>

          {/* Results Grid */}
          <main>
            {queryParam && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                  「{queryParam}」の検索結果
                </h1>
                <p className="text-muted-foreground mt-1">
                  {results.length} 件のカフェが見つかりました
                </p>
              </div>
            )}

            {results.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Coffee className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">カフェが見つかりませんでした</h2>
                <p className="text-muted-foreground mb-6">
                  フィルターや検索条件を変更してみてください
                </p>
                <Link to="/search">
                  <Button variant="outline">すべてのフィルターをクリア</Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Toggle (placeholder for future implementation) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <Button className="shadow-hover bg-primary hover:bg-primary/90">
          フィルター & ソート ({results.length})
        </Button>
      </div>
    </div>
  );
};

export default Search;
