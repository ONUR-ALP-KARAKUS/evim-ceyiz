export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  isCampaign?: boolean;
  images: string[];
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
