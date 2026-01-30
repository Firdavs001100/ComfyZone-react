import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveProducts = createSelector(
  selectProductsPage,
  (page) => page.products,
);

export const retrieveChosenProduct = createSelector(
  selectProductsPage,
  (page) => page.chosenProduct,
);

export const retrieveProvider = createSelector(
  selectProductsPage,
  (page) => page.provider,
);
