export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  quantity: number;
  category: string | Category;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Omit<Product, "reviews" | "category"> {
  qty: number;
  category: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  user: string | UserInfo;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Redux State shapes
export interface AuthState {
  userInfo: Omit<UserInfo, "token"> | null;
  token: string | null;
}

export interface CartState {
  cartItems: CartItem[];
  shippingAddress: Partial<ShippingAddress>;
  paymentMethod: string;
  itemsPrice?: string;
  shippingPrice?: string;
  taxPrice?: string;
  totalPrice?: string;
}

export interface ShopState {
  categories: Category[];
  products: Product[];
  checked: string[];
  radio: number[];
  brandCheckboxes: Record<string, boolean>;
  checkedBrands: string[];
  selectedBrand?: string;
}
