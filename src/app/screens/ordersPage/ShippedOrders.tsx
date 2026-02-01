import React from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { selectShippedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { OrderStatus } from "../../../lib/enums/order.enum";

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

export default function ShippedOrdersTab() {
  const shippedOrders: Order[] = useSelector(selectShippedOrders);

  if (!shippedOrders || shippedOrders.length === 0) {
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
        <Typography
          variant="h5"
          color="text.secondary"
          fontWeight={600}
          sx={{ mb: 1 }}
        >
          No Shipped Orders
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ opacity: 0.7 }}
        >
          Your shipped orders will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} className="orders-tab">
      {shippedOrders.map((order) => (
        <Card
          key={order._id.toString()}
          className="order-card"
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
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
                variant="filled"
                size="medium"
                sx={{ fontWeight: 600, px: 1, height: 32 }}
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
            <Stack spacing={1.5}>
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
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
