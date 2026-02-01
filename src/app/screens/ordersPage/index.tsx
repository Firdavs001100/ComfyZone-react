import { Tabs, Tab, Container, Stack, Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import {
  setPendingOrders,
  setPaidOrders,
  setShippedOrders,
  setDeliveredOrders,
  setCancelledOrders,
} from "./slice";
import "../../../css/orders.css";
import PendingOrdersPage from "./PendingOrdersPage";
import PaidOrdersTab from "./PaidOrdersPage";
import ShippedOrdersTab from "./ShippedOrders";
import DeliveredOrdersTab from "./DeliveredOrders";
import CancelledOrdersTab from "./CancelledOrders";
import { useGlobals } from "../../hooks/useGlobals";

// Action dispatcher
const actionDispatch = (dispatch: Dispatch) => ({
  setPendingOrders: (data: Order[]) => dispatch(setPendingOrders(data)),
  setPaidOrders: (data: Order[]) => dispatch(setPaidOrders(data)),
  setShippedOrders: (data: Order[]) => dispatch(setShippedOrders(data)),
  setDeliveredOrders: (data: Order[]) => dispatch(setDeliveredOrders(data)),
  setCancelledOrders: (data: Order[]) => dispatch(setCancelledOrders(data)),
});

export default function OrdersPage() {
  const dispatch = useDispatch();
  const {
    setPendingOrders,
    setPaidOrders,
    setShippedOrders,
    setDeliveredOrders,
    setCancelledOrders,
  } = actionDispatch(dispatch);

  const { orderBuilder } = useGlobals(); // Add this
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderService = new OrderService();
        const [pending, paid, shipped, delivered, cancelled] =
          await Promise.all([
            orderService.getMyOrders({
              ...orderInquiry,
              orderStatus: OrderStatus.PENDING,
            }),
            orderService.getMyOrders({
              ...orderInquiry,
              orderStatus: OrderStatus.PAID,
            }),
            orderService.getMyOrders({
              ...orderInquiry,
              orderStatus: OrderStatus.SHIPPED,
            }),
            orderService.getMyOrders({
              ...orderInquiry,
              orderStatus: OrderStatus.DELIVERED,
            }),
            orderService.getMyOrders({
              ...orderInquiry,
              orderStatus: OrderStatus.CANCELLED,
            }),
          ]);

        setPendingOrders(pending);
        setPaidOrders(paid);
        setShippedOrders(shipped);
        setDeliveredOrders(delivered);
        setCancelledOrders(cancelled);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [orderInquiry, orderBuilder]); // Add orderBuilder here

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container
      className="order-container"
      maxWidth={false}
      sx={{ backgroundColor: "#faf8f5" }}
    >
      <Stack className="order-main-content">
        <Box className="order-nav-frame">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Pending" value="1" />
            <Tab label="Paid" value="2" />
            <Tab label="Shipped" value="3" />
            <Tab label="Delivered" value="4" />
            <Tab label="Cancelled" value="5" />
          </Tabs>
        </Box>

        <TabContext value={value}>
          <Box>
            {value === "1" && <PendingOrdersPage />}
            {value === "2" && <PaidOrdersTab />}
            {value === "3" && <ShippedOrdersTab />}
            {value === "4" && <DeliveredOrdersTab />}
            {value === "5" && <CancelledOrdersTab />}
          </Box>
        </TabContext>
      </Stack>
    </Container>
  );
}
