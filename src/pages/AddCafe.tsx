import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Coffee, ArrowLeft, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

const AddCafe = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    price_range: "moderate" as "cheap" | "moderate" | "expensive",
    phone: "",
    hours: "",
    tags: [] as string[],
  });
  
  const [photos, setPhotos] = useState<{
    interior: string[];
    menu: string[];
    food: string[];
  }>({
    interior: [],
    menu: [],
    food: [],
  });
  
  const interiorInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const foodInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (category: "interior" | "menu" | "food", files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => ({
          ...prev,
          [category]: [...prev[category], reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (category: "interior" | "menu" | "food", index: number) => {
    setPhotos((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const availableTags = [
    "Wi-Fi", "電源コンセント", "屋外席", "ドッグカフェ", "キャットカフェ",
    "仕事向け", "静か", "駐車場", "喫煙可", "深夜営業"
  ];

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("ログインしてください");
      navigate("/auth");
      return;
    }

    if (!formData.name || !formData.address) {
      toast.error("名前と住所を入力してください");
      return;
    }

    // Create new cafe object
    const newCafe = {
      id: Date.now(),
      name: formData.name,
      address: formData.address,
      lat: 21.027 + Math.random() * 0.01,
      lng: 105.834 + Math.random() * 0.01,
      rating: 0,
      reviews: 0,
      price_range: formData.price_range,
      tags: formData.tags,
      description: formData.description,
      phone: formData.phone,
      hours: formData.hours,
      photos: {
        menu: photos.menu.length > 0 ? photos.menu : ["https://source.unsplash.com/600x400/?coffee,menu"],
        interior: photos.interior.length > 0 ? photos.interior : ["https://source.unsplash.com/600x400/?cafe,interior"],
        food: photos.food.length > 0 ? photos.food : ["https://source.unsplash.com/600x400/?coffee,food"],
      },
      distance: Math.random() * 10,
    };

    // Save to localStorage
    const userCafes = JSON.parse(localStorage.getItem("user_cafes") || "[]");
    userCafes.push(newCafe);
    localStorage.setItem("user_cafes", JSON.stringify(userCafes));

    toast.success("カフェを追加しました！");
    navigate("/search");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center space-y-4">
              <Coffee className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">ログインが必要です</h2>
              <p className="text-muted-foreground">
                カフェを追加するにはログインしてください
              </p>
              <Link to="/auth">
                <Button className="w-full">ログイン</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/search">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto shadow-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Coffee className="h-8 w-8 text-primary" />
              新しいカフェを追加
            </CardTitle>
            <CardDescription>
              コミュニティとお気に入りのカフェをシェアしましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">カフェ名 *</Label>
                <Input
                  id="name"
                  placeholder="例：ハイランズコーヒー"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">住所 *</Label>
                <Input
                  id="address"
                  placeholder="例：123 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  placeholder="このカフェについて教えてください..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">価格帯</Label>
                  <Select
                    value={formData.price_range}
                    onValueChange={(value: any) => setFormData({ ...formData, price_range: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cheap">₫ 安い (&lt;100k)</SelectItem>
                      <SelectItem value="moderate">₫₫ 普通 (100-200k)</SelectItem>
                      <SelectItem value="expensive">₫₫₫ 高い (&gt;200k)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">営業時間</Label>
                <Input
                  id="hours"
                  placeholder="例：月〜金 7:00-22:00 / 土日 8:00-23:00"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>タグ（設備・特徴）</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={formData.tags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label>写真を追加</Label>
                <Tabs defaultValue="interior" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                    <TabsTrigger value="interior">店内</TabsTrigger>
                    <TabsTrigger value="menu">メニュー</TabsTrigger>
                    <TabsTrigger value="food">料理と飲み物</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="interior" className="mt-4 space-y-4">
                    <input
                      type="file"
                      ref={interiorInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload("interior", e.target.files)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => interiorInputRef.current?.click()}
                      className="w-full gap-2"
                    >
                      <ImagePlus className="h-4 w-4" />
                      店内写真を追加
                    </Button>
                    {photos.interior.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {photos.interior.map((photo, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={photo}
                              alt={`店内 ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage("interior", idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="menu" className="mt-4 space-y-4">
                    <input
                      type="file"
                      ref={menuInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload("menu", e.target.files)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => menuInputRef.current?.click()}
                      className="w-full gap-2"
                    >
                      <ImagePlus className="h-4 w-4" />
                      メニュー写真を追加
                    </Button>
                    {photos.menu.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {photos.menu.map((photo, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={photo}
                              alt={`メニュー ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage("menu", idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="food" className="mt-4 space-y-4">
                    <input
                      type="file"
                      ref={foodInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload("food", e.target.files)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => foodInputRef.current?.click()}
                      className="w-full gap-2"
                    >
                      <ImagePlus className="h-4 w-4" />
                      料理・飲み物写真を追加
                    </Button>
                    {photos.food.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {photos.food.map((photo, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={photo}
                              alt={`料理 ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage("food", idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <Button type="submit" className="w-full" size="lg">
                カフェを追加
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCafe;
