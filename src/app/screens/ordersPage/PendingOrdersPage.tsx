import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { selectPendingOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { toastError } from "../../../lib/toastAlert";
import OrderService from "../../../services/OrderService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface PendingOrdersProps {
  setValue?: (value: string) => void;
}

const statusColors: Record<
  OrderStatus,
  "default" | "success" | "info" | "warning" | "error"
> = {
  PENDING: "info",
  PAID: "success",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "error",
  DELETE: "error",
};

export default function PendingOrders(props: PendingOrdersProps) {
  const pendingOrders: Order[] = useSelector(selectPendingOrders);
  const { authMember, setOrderBuilder } = useGlobals();

  /** ACTION HANDLER */
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      if (!authMember) throw new Error("User not authenticated");

      const confirmMsg =
        status === OrderStatus.DELETE
          ? "Are you sure you want to cancel this order?"
          : "Proceed with payment for this order?";
      if (!window.confirm(confirmMsg)) return;

      const orderService = new OrderService();
      await orderService.updateOrder({ orderId, orderStatus: status });
      setOrderBuilder(new Date());
    } catch (err) {
      console.error(err);
      toastError(err);
    }
  };

  if (!pendingOrders || pendingOrders.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={8}
        className="empty-orders"
      >
        <Box
          component="img"
          src="/icons/noimage-list.svg"
          alt="No orders"
          sx={{
            width: 280,
            height: 280,
            opacity: 0.6,
            mb: 3,
          }}
        />
        <Typography
          variant="h5"
          color="text.secondary"
          fontWeight={600}
          sx={{ mb: 1 }}
        >
          No Pending Orders
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ opacity: 0.7 }}
        >
          Your pending orders will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} className="orders-tab">
      {pendingOrders.map((order) => (
        <Card
          key={order._id.toString()}
          className="order-card"
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            {/* ORDER HEADER */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              mb={2.5}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    color: "text.primary",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalShippingIcon sx={{ fontSize: 20 }} />
                  Order #{order._id.toString().slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </Typography>
              </Box>
              <Chip
                label={order.orderStatus}
                color={statusColors[order.orderStatus]}
                variant="filled"
                size="medium"
                sx={{
                  fontWeight: 600,
                  px: 1,
                  height: 32,
                }}
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ORDER ITEMS */}
            <Stack spacing={2.5} mb={3}>
              {order.orderItems?.map((item: OrderItem) => {
                const product: Product = order.productData?.find(
                  (p) => p._id === item.productId,
                )!;
                const imageSrc = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/icons/noimage-list.svg";

                return (
                  <Box
                    key={item._id.toString()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Avatar
                      src={imageSrc}
                      alt={product.productName}
                      variant="rounded"
                      sx={{
                        width: 90,
                        height: 90,
                        border: "2px solid",
                        borderColor: "divider",
                        boxShadow: 1,
                      }}
                    />
                    <Stack flex={1} spacing={0.5}>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: "1.05rem",
                          color: "text.primary",
                          mb: 0.5,
                        }}
                      >
                        {product.productName}
                      </Typography>
                      <Typography
                        fontSize={13}
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={product.productCategory}
                          size="small"
                          variant="outlined"
                          sx={{ height: 22, fontSize: "0.75rem" }}
                        />
                        <Chip
                          label={product.productType}
                          size="small"
                          variant="outlined"
                          sx={{ height: 22, fontSize: "0.75rem" }}
                        />
                        {product.productColor && (
                          <Chip
                            label={product.productColor}
                            size="small"
                            variant="outlined"
                            sx={{ height: 22, fontSize: "0.75rem" }}
                          />
                        )}
                      </Typography>
                      <Typography
                        fontSize={14}
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ mt: 1 }}
                      >
                        Quantity: {item.itemQuantity} × $
                        {item.itemPrice.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: "1.2rem",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        minWidth: "80px",
                        textAlign: "right",
                      }}
                    >
                      ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ORDER TOTALS */}
            <Stack spacing={1.5} mb={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ px: 1 }}
              >
                <Typography color="text.secondary" fontWeight={500}>
                  Subtotal:
                </Typography>
                <Typography fontWeight={600}>
                  ${(order.orderTotal - order.orderDelivery).toFixed(2)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ px: 1 }}
              >
                <Typography color="text.secondary" fontWeight={500}>
                  Delivery Fee:
                </Typography>
                <Typography fontWeight={600}>
                  ${order.orderDelivery.toFixed(2)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  px: 1,
                  py: 1,
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                  borderRadius: 1,
                }}
              >
                <Typography fontWeight={700} sx={{ fontSize: "1.1rem" }}>
                  Total Amount:
                </Typography>
                <Typography
                  fontWeight={800}
                  sx={{
                    fontSize: "1.25rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ${order.orderTotal.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>

            {/* ACTION BUTTONS */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() =>
                    updateOrderStatus(order._id.toString(), OrderStatus.DELETE)
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Cancel Order
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={() =>
                    updateOrderStatus(order._id.toString(), OrderStatus.PAID)
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                    },
                  }}
                >
                  Proceed to Payment
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
