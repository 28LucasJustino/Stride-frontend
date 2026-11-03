export interface ProductImage {
  id: string;
  imageUrl: string;
  angleType: 'FRONT' | 'SIDE' | 'BACK' | 'DETAIL' | string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
