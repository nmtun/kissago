// Vietnamese location names to Japanese katakana/kanji mapping
const locationMap: Record<string, string> = {
  // Cities
  "Hanoi": "ハノイ",
  "Ha Noi": "ハノイ",
  "Ho Chi Minh City": "ホーチミン",
  "Ho Chi Minh": "ホーチミン",
  "Da Nang": "ダナン",
  "Hai Phong": "ハイフォン",
  "Can Tho": "カントー",
  "Nha Trang": "ニャチャン",
  "Hue": "フエ",
  "Vung Tau": "ブンタウ",
  "Da Lat": "ダラット",
  
  // Hanoi Districts
  "Hoan Kiem": "ホアンキエム区",
  "Hoàn Kiếm": "ホアンキエム区",
  "Ba Dinh": "バーディン区",
  "Ba Đình": "バーディン区",
  "Dong Da": "ドンダー区",
  "Đống Đa": "ドンダー区",
  "Hai Ba Trung": "ハイバーチュン区",
  "Hai Bà Trưng": "ハイバーチュン区",
  "Tay Ho": "タイホー区",
  "Tây Hồ": "タイホー区",
  "Cau Giay": "カウザイ区",
  "Cầu Giấy": "カウザイ区",
  "Thanh Xuan": "タインスアン区",
  "Thanh Xuân": "タインスアン区",
  "Long Bien": "ロンビエン区",
  "Long Biên": "ロンビエン区",
  "Ha Dong": "ハードン区",
  "Hà Đông": "ハードン区",
  "Nam Tu Liem": "ナムトゥリエム区",
  "Nam Từ Liêm": "ナムトゥリエム区",
  "Bac Tu Liem": "バックトゥリエム区",
  "Bắc Từ Liêm": "バックトゥリエム区",
  "Hoang Mai": "ホアンマイ区",
  "Hoàng Mai": "ホアンマイ区",
  
  // Ho Chi Minh Districts
  "District 1": "1区",
  "Quan 1": "1区",
  "Quận 1": "1区",
  "District 2": "2区",
  "District 3": "3区",
  "District 4": "4区",
  "District 5": "5区",
  "District 7": "7区",
  "District 10": "10区",
  "Binh Thanh": "ビンタン区",
  "Bình Thạnh": "ビンタン区",
  "Phu Nhuan": "フーニュアン区",
  "Phú Nhuận": "フーニュアン区",
  "Tan Binh": "タンビン区",
  "Tân Bình": "タンビン区",
  "Go Vap": "ゴーヴァップ区",
  "Gò Vấp": "ゴーヴァップ区",
  "Thu Duc": "トゥードゥック区",
  "Thủ Đức": "トゥードゥック区",
  
  // Common terms
  "Ward": "坊",
  "Phuong": "坊",
  "Phường": "坊",
  "Street": "通り",
  "Road": "通り",
  "Duong": "通り",
  "Đường": "通り",
  "Pho": "通り",
  "Phố": "通り",
  "Avenue": "大通り",
  "Highway": "国道",
  "National Highway": "国道",
  "Boulevard": "大通り",
  "Lane": "路地",
  "Alley": "路地",
  "Vietnam": "ベトナム",
  "Viet Nam": "ベトナム",
  "Chu Van An": "チュー・ヴァン・アン",
  "Chu Văn An": "チュー・ヴァン・アン",
};

// Convert Vietnamese characters to basic Latin for fallback
const vietnameseMap: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

const removeVietnameseTones = (str: string): string => {
  return str.split('').map(char => vietnameseMap[char] || char).join('');
};

export const translateLocationToJapanese = (englishText: string): string => {
  if (!englishText) return "現在地";
  
  let result = englishText;
  
  // Replace numbers in patterns like "National Highway 37" → "国道37号"
  result = result.replace(/National Highway (\d+)/gi, '国道$1号');
  result = result.replace(/Highway (\d+)/gi, '国道$1号');
  
  // Replace known locations - sort by length (longest first) to avoid partial matches
  const sortedEntries = Object.entries(locationMap).sort((a, b) => b[0].length - a[0].length);
  
  for (const [eng, jp] of sortedEntries) {
    // Case-insensitive global replace
    const regex = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, jp);
  }
  
  // Clean up multiple commas or spaces
  result = result.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim();
  
  return result || "現在地";
};
