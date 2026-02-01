import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

// Base selector for the orders slice
const selectOrders = (state: AppRootState) => state.ordersPage;

// Individual selectors
export const selectPendingOrders = createSelector(
  selectOrders,
  (OrdersPage) => OrdersPage.pendingOrders,
);

export const selectPaidOrders = createSelector(
  selectOrders,
  (OrdersPage) => OrdersPage.paidOrders,
);

export const selectShippedOrders = createSelector(
  selectOrders,
  (OrdersPage) => OrdersPage.shippedOrders,
);

export const selectDeliveredOrders = createSelector(
  selectOrders,
  (OrdersPage) => OrdersPage.deliveredOrders,
);

export const selectCancelledOrders = createSelector(
  selectOrders,
  (OrdersPage) => OrdersPage.cancelledOrders,
);
