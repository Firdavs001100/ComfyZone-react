import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";
import { Product } from "../../../lib/types/product";
import { Provider } from "../../../lib/types/provider";

const initialState: ProductsPageState = {
  products: [],
  chosenProduct: null,
  provider: null,
};

const productsPageSlice = createSlice({
  name: "ProductsPage",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChosenProduct: (state, action: PayloadAction<Product | null>) => {
      state.chosenProduct = action.payload;
    },
    setProvider: (state, action: PayloadAction<Provider | null>) => {
      state.provider = action.payload;
    },
  },
});

export const { setProducts, setChosenProduct, setProvider } =
  productsPageSlice.actions;

export default productsPageSlice.reducer;
