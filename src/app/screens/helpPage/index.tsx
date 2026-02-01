import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Tabs,
  Tab,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import "../../../css/help.css";

export default function HelpPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const tabFromUrl = params.get("tab");

  const tabMap: Record<string, string> = {
    terms: "1",
    faq: "2",
    contact: "3",
  };

  const [value, setValue] = useState(tabMap[tabFromUrl || ""] || "1");

  useEffect(() => {
    if (tabFromUrl && tabMap[tabFromUrl]) {
      setValue(tabMap[tabFromUrl]);
    }
    window.scrollTo(0, 0);
  }, [tabFromUrl]);

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className="help-page">
      <Container className="help-container">
        <Typography className="help-title">How Can We Help You?</Typography>

        <TabContext value={value}>
          <Box className="help-tabs">
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Terms" value="1" />
              <Tab label="FAQ" value="2" />
              <Tab label="Contact" value="3" />
            </Tabs>
          </Box>

          {/* TERMS */}
          <TabPanel value="1">
            <Stack className="help-card">
              <section className="terms-section">
                <Container maxWidth="md">
                  <Stack className="terms-container" spacing={3}>
                    <Typography variant="h4" className="terms-title">
                      Terms & Conditions
                    </Typography>
                    {terms.map((item, index) => (
                      <Typography key={index} className="terms-item">
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Container>
              </section>
            </Stack>
          </TabPanel>

          {/* FAQ */}
          <TabPanel value="2">
            <Stack className="help-card" spacing={2}>
              {faq.map((item, idx) => (
                <Accordion key={idx} className="faq-accordion">
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="faq-question">
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="faq-answer">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </TabPanel>

          {/* CONTACT */}
          <TabPanel value="3">
            <Stack className="help-card" spacing={3}>
              <Typography className="contact-title">Contact Us</Typography>
              <Typography className="contact-desc">
                Fill out the form below and we will get back to you as soon as
                possible.
              </Typography>

              <Stack component="form" spacing={2}>
                <TextField label="Your Name" variant="outlined" fullWidth />
                <TextField label="Your Email" variant="outlined" fullWidth />
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained">Send Message</Button>
                </Box>
              </Stack>
            </Stack>
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
}
