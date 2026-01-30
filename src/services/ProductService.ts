import axios from "axios";
import { serverApi } from "../lib/config";
import { Product, ProductInquiry } from "../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }
  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.productCategory)
        url += `&productCategory=${input.productCategory}`;
      if (input.productType) url += `&productType=${input.productType}`;
      if (input.productProvider)
        url += `&productProvider=${input.productProvider}`;
      if (input.search) url += `&search=${input.search}`;

      const result = await axios.get(url);
      console.log("getProducts: ", result);
      return result.data;
    } catch (err) {
      console.log("error, getProducts:", err);

      throw err;
    }
  }
  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = axios.get(url, { withCredentials: true });
      console.log("getProduct", result);
      return (await result).data;
    } catch (err) {
      console.log("error, getProduct:", err);

      throw err;
    }
  }
}

export default ProductService;
