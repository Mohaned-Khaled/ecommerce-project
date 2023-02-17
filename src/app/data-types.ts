export interface Product {
  name: string;
  price: string;
  category: string;
  color: string;
  description: string;
  url: string;
  id?: number;
  quanttity?: number;
}

export interface Cart {
  name: string;
  price: string;
  category: string;
  color: string;
  description: string;
  url: string;
  id?: number;
  quanttity?: number;
  userId: number;
  productId: number;
}

export interface OrderData {
  address: string;
  contact: string;
  email: string;
  totalPrice: number;
  userId: number;
  id?: number;
}
