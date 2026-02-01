import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, Navigation, Pagination]);

// Example data for furniture store events
const furnitureEvents = [
  {
    title: "Luxury Sofa Launch",
    img: "/events/sofa.png",
    author: "Design Team",
    desc: "Discover our new premium sofa collection, crafted with comfort and elegance in mind.",
    date: "Feb 10, 2026",
    location: "Seoul Showroom",
  },
  {
    title: "Living Room Makeover Workshop",
    img: "/events/workshop.png",
    author: "Interior Experts",
    desc: "Learn tips and tricks for creating a cozy and stylish living room.",
    date: "Mar 5, 2026",
    location: "Online Webinar",
  },
  {
    title: "Eco-Friendly Furniture Expo",
    img: "/events/eco.png",
    author: "Sustainable Living Co.",
    desc: "Explore furniture made from sustainable materials for a greener home.",
    date: "Apr 12, 2026",
    location: "Seoul Expo Center",
  },
];

export default function FurnitureEvents() {
  return (
    <div className="events-frame">
      <Stack className="events-main">
        <Box className="events-text">
          <Typography variant="h4" className="category-title">
            Upcoming Events
          </Typography>
        </Box>

        <Swiper
          className="events-swiper"
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
        >
          {furnitureEvents.map((event, idx) => (
            <SwiperSlide key={idx} className="event-card">
              <Box
                className="event-img"
                style={{
                  width: "100%",
                  height: 420,
                  borderRadius: 2,
                  backgroundImage: `url(${event.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <Box className="event-desc">
                <Typography className="event-title">{event.title}</Typography>
                <Typography className="event-author">{event.author}</Typography>
                <Typography className="event-text">{event.desc}</Typography>
                <Stack direction="row" spacing={2} className="event-info">
                  <Box className="event-info-item">
                    <img src="/icons/calendar.svg" alt="date" />
                    <span>{event.date}</span>
                  </Box>
                  <Box className="event-info-item">
                    <img src="/icons/location.svg" alt="location" />
                    <span>{event.location}</span>
                  </Box>
                </Stack>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </div>
  );
}
