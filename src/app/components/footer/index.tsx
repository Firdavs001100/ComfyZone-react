import { useState } from "react";
import "../../../css/footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing email:", email);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand and Address */}
          <div>
            <h2 className="footer-brand">ComfyZone.</h2>
            <address className="footer-address">
              88 Olympic-ro, Songpa-gu
              <br />
              Seoul 05500
              <br />
              South Korea
            </address>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="footer-section-title">Links</h3>
            <nav className="footer-nav">
              <a href="/home" className="footer-link">
                Home
              </a>
              <a href="/shop" className="footer-link">
                Shop
              </a>
              <a href="/about" className="footer-link">
                About
              </a>
              <a href="/help?tab=contact" className="footer-link">
                Contact
              </a>
            </nav>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="footer-section-title">Help</h3>
            <nav className="footer-nav">
              <a href="/help" className="footer-link">
                Terms
              </a>
              <a href="/help?tab=faq" className="footer-link">
                Guide
              </a>
              <a href="/help?tab=faq" className="footer-link">
                FAQ
              </a>
            </nav>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="footer-section-title">Newsletter</h3>
            <div className="footer-subscribe">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                className="footer-input"
              />
              <button
                onClick={handleSubscribe}
                className="footer-subscribe-button"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider">
          <p className="footer-copyright">
            2026 ComfyZone. All rights reverved
          </p>
        </div>
      </div>
    </footer>
  );
}
