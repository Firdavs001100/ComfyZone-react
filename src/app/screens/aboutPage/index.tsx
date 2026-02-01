import { Box, Container, Grid, Typography } from "@mui/material";
import "../../../css/about.css";

export default function AboutPage() {
  return (
    <Box className="about-page">
      {/* HERO SECTION - SPLIT SCREEN */}
      <section className="about-hero">
        <div className="hero-left">
          <div className="hero-content">
            <span className="hero-eyebrow">Est. 2024</span>
            <h1 className="hero-title">
              About
              <br />
              <span className="hero-title-accent">ComfyZone</span>
            </h1>
            <div className="hero-decorative-line"></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-container">
            <div className="hero-overlay-text">
              Designed for comfort.
              <br />
              Crafted for living.
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="manifesto-section">
        <Container maxWidth="xl">
          <div className="manifesto-content">
            <div className="manifesto-number">01</div>
            <Typography className="manifesto-text">
              ComfyZone is a modern furniture brand focused on creating
              thoughtfully designed pieces that bring{" "}
              <span className="highlight">comfort</span>,{" "}
              <span className="highlight">balance</span>, and{" "}
              <span className="highlight">style</span> into everyday living.
            </Typography>
          </div>
        </Container>
      </section>

      {/* PHILOSOPHY SECTION - DIAGONAL SPLIT */}
      <section className="philosophy-section">
        <Container maxWidth="xl">
          <Grid container spacing={0} className="philosophy-grid">
            <Grid item xs={12} md={5} className="philosophy-left">
              <div className="section-label">Our Philosophy</div>
              <h2 className="philosophy-title">
                Form Meets
                <br />
                Function
              </h2>
            </Grid>
            <Grid item xs={12} md={7} className="philosophy-right">
              <div className="philosophy-card">
                <div className="card-number">02</div>
                <p className="philosophy-description">
                  We combine contemporary design with high-quality materials to
                  create furniture that lasts. Every piece is carefully selected
                  with attention to durability, functionality, and timeless
                  aesthetics.
                </p>
                <p className="philosophy-description">
                  We believe furniture should feel as good as it looks and fit
                  naturally into your lifestyle.
                </p>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* VALUES GRID */}
      <section className="values-section">
        <Container maxWidth="xl">
          <div className="section-header">
            <div className="section-label">Core Values</div>
            <h2 className="section-title">What Defines Us</h2>
          </div>

          <Grid container spacing={3} className="values-grid">
            <Grid item xs={12} sm={6} md={3}>
              <div className="value-card card-1">
                <div className="value-icon">
                  <div className="icon-circle"></div>
                </div>
                <h3 className="value-title">Minimal & Timeless</h3>
                <p className="value-text">
                  Design that transcends trends and remains relevant for years
                  to come.
                </p>
                <div className="card-corner"></div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="value-card card-2">
                <div className="value-icon">
                  <div className="icon-square"></div>
                </div>
                <h3 className="value-title">Comfort-Focused</h3>
                <p className="value-text">
                  Every curve, cushion, and contour crafted with your relaxation
                  in mind.
                </p>
                <div className="card-corner"></div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="value-card card-3">
                <div className="value-icon">
                  <div className="icon-triangle"></div>
                </div>
                <h3 className="value-title">Reliable Delivery</h3>
                <p className="value-text">
                  Swift, secure shipping across South Korea with care at every
                  step.
                </p>
                <div className="card-corner"></div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="value-card card-4">
                <div className="value-icon">
                  <div className="icon-diamond"></div>
                </div>
                <h3 className="value-title">Curated Quality</h3>
                <p className="value-text">
                  Hand-selected pieces that meet our exacting standards for
                  excellence.
                </p>
                <div className="card-corner"></div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* STORY SECTION - LAYERED */}
      <section className="story-section">
        <div className="story-background"></div>
        <Container maxWidth="lg">
          <div className="story-content">
            <div className="story-badge">
              <span>03</span>
            </div>
            <h2 className="story-title">Who We Are</h2>
            <div className="story-divider"></div>
            <p className="story-text">
              From browsing to delivery, we aim to make your experience simple,
              smooth, and satisfying. Your home deserves furniture that feels
              right — and we're here to help you find it.
            </p>
            <p className="story-text">
              Every piece in our collection tells a story of thoughtful design,
              quality craftsmanship, and unwavering commitment to comfort.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <Container maxWidth="xl">
          <div className="cta-content">
            <div className="cta-text-wrapper">
              <h2 className="cta-title">Ready to Transform Your Space?</h2>
              <p className="cta-subtitle">
                Explore our curated collection and discover furniture that feels
                like home.
              </p>
            </div>
            <div className="cta-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
        </Container>
      </section>
    </Box>
  );
}