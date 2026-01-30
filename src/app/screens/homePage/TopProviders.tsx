import React from "react";
import {
  Box,
  Container,
  Stack,
  Avatar,
  Typography,
  Rating,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Verified } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopProviders } from "./selector";
import { Provider } from "../../../lib/types/provider";
import { serverApi } from "../../../lib/config";

const topProvidersRetriever = createSelector(
  retrieveTopProviders,
  (topProviders) => ({ topProviders }),
);

export default function TopProviders() {
  const { topProviders } = useSelector(topProvidersRetriever);

  return (
    <div className="top-providers-frame">
      <Container>
        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            className="title"
          >
            Top Providers
          </Typography>

          <Stack
            className="providers-cards-frame"
            direction="row"
            flexWrap="wrap"
            gap={3}
            justifyContent="center"
          >
            {topProviders.length !== 0 ? (
              topProviders.map((provider: Provider) => {
                const logoPath = provider.providerLogo
                  ? `${serverApi}/${provider.providerLogo}`
                  : "/icons/default-provider.svg";

                return (
                  <Box key={provider._id} className="provider-card">
                    {/* Logo */}
                    <Avatar
                      src={logoPath}
                      alt={provider.providerName}
                      className="provider-logo"
                    />

                    {/* Content wrapper */}
                    <Stack
                      spacing={1.5}
                      sx={{
                        mt: 5,
                        px: 2,
                        pb: 2,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                      alignItems="center"
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {provider.providerName.length > 18
                            ? `${provider.providerName.slice(0, 18)}...`
                            : provider.providerName}
                        </Typography>
                        {provider.isVerified && (
                          <Verified color="primary" fontSize="small" />
                        )}
                      </Stack>

                      {/* Rating */}
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating
                          value={provider.providerRating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body1" color="text.secondary">
                          ({provider.providerTotalReviews})
                        </Typography>
                      </Stack>

                      {/* Categories */}
                      <Stack className="categories-wrapper">
                        {provider.providerCategories
                          .slice(0, 4)
                          .map((cat, idx) => (
                            <Chip key={idx} label={cat} size="small" />
                          ))}
                      </Stack>

                      {/* Bottom section: sticks to bottom */}
                      <Stack className="bottom-section">
                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontStyle="italic"
                          textAlign="center"
                        >
                          {provider.providerDesc
                            ? provider.providerDesc.slice(0, 60) + "..."
                            : "No description available."}
                        </Typography>

                        {/* Popularity bar */}
                        <LinearProgress
                          variant="determinate"
                          value={provider.providerPopularityScore}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            width: "100%",
                            background: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              background:
                                "linear-gradient(90deg, #c1a36f, #b38b5b)",
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Top providers are not available!
              </Typography>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
