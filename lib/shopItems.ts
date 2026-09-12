export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  icon: "ghost" | "medal" | "crown" | "flame" | "gem" | "shield";
  rarity: "common" | "rare" | "legendary";
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "shadow-avatar", name: "Shadow Avatar", cost: 100, icon: "ghost", rarity: "rare" },
  { id: "golden-badge", name: "Golden Badge", cost: 50, icon: "medal", rarity: "common" },
  { id: "crown-of-focus", name: "Crown of Focus", cost: 150, icon: "crown", rarity: "legendary" },
  { id: "ember-cloak", name: "Ember Cloak", cost: 80, icon: "flame", rarity: "rare" },
  { id: "spirit-gem", name: "Spirit Gem", cost: 60, icon: "gem", rarity: "common" },
  { id: "aegis-shield", name: "Aegis Shield", cost: 120, icon: "shield", rarity: "legendary" },
];
