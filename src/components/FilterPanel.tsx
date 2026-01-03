import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface FilterPanelProps {
  sortBy: string;
  filters: {
    // Cafe types
    dogFriendly: boolean;
    catFriendly: boolean;
    // Purpose
    workFriendly: boolean;
    conversationFriendly: boolean;
    soloFriendly: boolean;
    quiet: boolean;
    touristFriendly: boolean;
    japanesePopular: boolean;
    // Facilities
    wifi: boolean;
    powerOutlets: boolean;
    stableWifi: boolean;
    longStayOk: boolean;
    nonSmoking: boolean;
    outdoor: boolean;
    // Price
    cheap: boolean;
    moderate: boolean;
    expensive: boolean;
  };
  onSortChange: (value: string) => void;
  onFilterChange: (key: string, value: boolean) => void;
  resultCount: number;
}

export const FilterPanel = ({
  sortBy,
  filters,
  onSortChange,
  onFilterChange,
  resultCount,
}: FilterPanelProps) => {
  return (
    <Card className="bg-card border-border/50 shadow-card sticky top-4 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-2 p-6 pb-4 border-b border-border flex-shrink-0">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">フィルター & ソート</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 pt-4 space-y-6">
          <div className="space-y-2">
        <Label className="text-sm font-medium">並べ替え</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">評価が高い順</SelectItem>
            <SelectItem value="distance">近い順</SelectItem>
            <SelectItem value="price-low">安い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">目的</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="work"
              checked={filters.workFriendly}
              onCheckedChange={(checked) => onFilterChange("workFriendly", checked as boolean)}
            />
            <Label htmlFor="work" className="text-sm cursor-pointer">
              💼 作業向き
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="conversation"
              checked={filters.conversationFriendly}
              onCheckedChange={(checked) => onFilterChange("conversationFriendly", checked as boolean)}
            />
            <Label htmlFor="conversation" className="text-sm cursor-pointer">
              💬 会話向き
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="solo"
              checked={filters.soloFriendly}
              onCheckedChange={(checked) => onFilterChange("soloFriendly", checked as boolean)}
            />
            <Label htmlFor="solo" className="text-sm cursor-pointer">
              👤 一人でも入りやすい
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="quiet"
              checked={filters.quiet}
              onCheckedChange={(checked) => onFilterChange("quiet", checked as boolean)}
            />
            <Label htmlFor="quiet" className="text-sm cursor-pointer">
              🤫 静か
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tourist"
              checked={filters.touristFriendly}
              onCheckedChange={(checked) => onFilterChange("touristFriendly", checked as boolean)}
            />
            <Label htmlFor="tourist" className="text-sm cursor-pointer">
              ✈️ 観光向け
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="japanese"
              checked={filters.japanesePopular}
              onCheckedChange={(checked) => onFilterChange("japanesePopular", checked as boolean)}
            />
            <Label htmlFor="japanese" className="text-sm cursor-pointer">
              🇯🇵 日本人が多い
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">設備</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="power"
              checked={filters.powerOutlets}
              onCheckedChange={(checked) => onFilterChange("powerOutlets", checked as boolean)}
            />
            <Label htmlFor="power" className="text-sm cursor-pointer">
              🔌 電源あり
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stable-wifi"
              checked={filters.stableWifi}
              onCheckedChange={(checked) => onFilterChange("stableWifi", checked as boolean)}
            />
            <Label htmlFor="stable-wifi" className="text-sm cursor-pointer">
              📶 Wi-Fi安定
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="long-stay"
              checked={filters.longStayOk}
              onCheckedChange={(checked) => onFilterChange("longStayOk", checked as boolean)}
            />
            <Label htmlFor="long-stay" className="text-sm cursor-pointer">
              🪑 長時間OK
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="non-smoking"
              checked={filters.nonSmoking}
              onCheckedChange={(checked) => onFilterChange("nonSmoking", checked as boolean)}
            />
            <Label htmlFor="non-smoking" className="text-sm cursor-pointer">
              🚭 禁煙
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="outdoor"
              checked={filters.outdoor}
              onCheckedChange={(checked) => onFilterChange("outdoor", checked as boolean)}
            />
            <Label htmlFor="outdoor" className="text-sm cursor-pointer">
              ☀️ 屋外席
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">価格帯</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cheap"
              checked={filters.cheap}
              onCheckedChange={(checked) => onFilterChange("cheap", checked as boolean)}
            />
            <Label htmlFor="cheap" className="text-sm cursor-pointer">
              100,000 VND以下
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="moderate"
              checked={filters.moderate}
              onCheckedChange={(checked) => onFilterChange("moderate", checked as boolean)}
            />
            <Label htmlFor="moderate" className="text-sm cursor-pointer">
              100,000-200,000 VND
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="expensive"
              checked={filters.expensive}
              onCheckedChange={(checked) => onFilterChange("expensive", checked as boolean)}
            />
            <Label htmlFor="expensive" className="text-sm cursor-pointer">
              200,000 VND以上
            </Label>
          </div>
        </div>
      </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{resultCount}</span> 件のカフェが見つかりました
            </p>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
