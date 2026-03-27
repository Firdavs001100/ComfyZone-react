import {
  ProductType,
  ProductCategory,
  ProductStatus,
} from "../enums/products.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productName: string;
  productDesc?: string;
  productSlug: string;
  productPrice: number;
  productSalePrice?: number;
  productCategory: ProductCategory;
  productType: ProductType;
  productMaterial?: string;
  productColor: string;
  productImages: string[];
  productStockCount: number;
  productViews: number;
  productProvider: string;
  productRating: number;
  productTotalReviews: number;
  productSales: number;
  isDiscounted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productName: string;
  productDesc?: string;
  productPrice: number;
  productSalePrice?: number;
  productCategory: ProductCategory;
  productType: ProductType;
  productMaterial?: string;
  productColor: string;
  productImages?: string[];
  productStockCount: number;
  productProvider: string;
}

export interface ProductUpdateInput {
  _id: string;
  productStatus?: ProductStatus;
  productName?: string;
  productDesc?: string;
  productSlug?: string;
  productPrice?: number;
  productSalePrice?: number;
  productCategory?: ProductCategory;
  productType?: ProductType;
  productMaterial?: string;
  productColor?: string;
  productImages?: string[];
  productStockCount?: number;
  isDiscounted?: boolean;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCategory?: ProductCategory;
  productType?: ProductType;
  productProvider?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
