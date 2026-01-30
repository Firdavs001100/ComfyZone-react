import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";
import { Provider } from "./provider";

/** REACT APP STATE */
export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

/** HOME PAGE */
export interface HomePageState {
  popularProducts: Product[];
  newProducts: Product[];
  topProviders: Provider[];
}

/** PRODUCTS PAGE*/
export interface ProductsPageState {
  provider: Provider | null;
  chosenProduct: Product | null;
  products: Product[];
}

/** ORDERS PAGE*/
export interface OrdersPageState {
  pausedOrders: Order[];
  finishedOrders: Order[];
  processOrders: Order[];
}
