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
} from "@mui/material";
import { useSelector } from "react-redux";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { selectPaidOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../../services/OrderService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { toastError } from "../../../lib/toastAlert";

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

// ✅ KRW formatter (no decimals, Korean style)
const krw = new Intl.NumberFormat("ko-KR");

export default function PaidOrdersTab() {
  const paidOrders: Order[] = useSelector(selectPaidOrders);
  const { authMember, setOrderBuilder } = useGlobals();

  const cancelOrder = async (orderId: string) => {
    try {
      if (!authMember) throw new Error("User not authenticated");
      if (!window.confirm("Are you sure you want to cancel this order?"))
        return;

      const orderService = new OrderService();
      await orderService.updateOrder({
        orderId,
        orderStatus: OrderStatus.DELETE,
      });
      setOrderBuilder(new Date());
    } catch (err) {
      console.error(err);
      toastError(err);
    }
  };

  if (!paidOrders || paidOrders.length === 0) {
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
          sx={{ width: 280, height: 280, opacity: 0.6, mb: 3 }}
        />
        <Typography variant="h5" color="text.secondary" fontWeight={600} mb={1}>
          No Paid Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
          Your paid orders will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} className="orders-tab">
      {paidOrders.map((order) => (
        <Card
          key={order._id.toString()}
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 3 }}>
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
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <LocalShippingIcon sx={{ fontSize: 20 }} />
                  Order #{order._id.toString().slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </Typography>
              </Box>
              <Chip
                label={order.orderStatus}
                color={statusColors[order.orderStatus]}
                sx={{ fontWeight: 600, height: 32 }}
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
                    display="flex"
                    alignItems="center"
                    gap={2.5}
                    p={2}
                    borderRadius={2}
                    bgcolor="rgba(0,0,0,0.02)"
                  >
                    <Avatar
                      src={imageSrc}
                      variant="rounded"
                      sx={{
                        width: 90,
                        height: 90,
                        border: "2px solid",
                        borderColor: "divider",
                      }}
                    />

                    <Stack flex={1} spacing={0.5}>
                      <Typography fontWeight={700}>
                        {product.productName}
                      </Typography>

                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <Chip
                          label={product.productCategory}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={product.productType}
                          size="small"
                          variant="outlined"
                        />
                        {product.productColor && (
                          <Chip
                            label={product.productColor}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      <Typography fontSize={14} color="text.secondary" mt={1}>
                        Quantity: {item.itemQuantity} × ₩
                        {krw.format(item.itemPrice)}
                      </Typography>
                    </Stack>

                    <Typography
                      fontWeight={700}
                      fontSize="1.2rem"
                      textAlign="right"
                      sx={{
                        background:
                          "linear-gradient(135deg,#667eea,#764ba2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        minWidth: 90,
                      }}
                    >
                      ₩{krw.format(item.itemPrice * item.itemQuantity)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* TOTALS */}
            <Stack spacing={1.5} mb={3}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography fontWeight={600}>
                  ₩{krw.format(order.orderTotal - order.orderDelivery)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Delivery Fee:</Typography>
                <Typography fontWeight={600}>
                  ₩{krw.format(order.orderDelivery)}
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                p={1}
                borderRadius={1}
                bgcolor="rgba(102,126,234,0.05)"
              >
                <Typography fontWeight={700}>Total Amount:</Typography>
                <Typography
                  fontWeight={800}
                  fontSize="1.25rem"
                  sx={{
                    background:
                      "linear-gradient(135deg,#667eea,#764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₩{krw.format(order.orderTotal)}
                </Typography>
              </Stack>
            </Stack>

            {/* CANCEL */}
            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="large"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => cancelOrder(order._id.toString())}
              sx={{ py: 1.5, fontWeight: 600, borderWidth: 2 }}
            >
              Cancel Order
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
