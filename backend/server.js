const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/carbon-prices", async (req, res) => {
  try {
    console.log("🔄 Fetching live carbon prices...");

    const response = await axios.get("https://carboncredits.com/live-carbon-prices/index.php", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    console.log("✅ Successfully fetched data!");

    // Log the first 500 characters of the response to debug
    console.log("🔍 HTML Response Preview:", response.data.slice(0, 500));

    // Parse HTML using JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Try different selectors
    let priceTable = document.querySelector(".live-carbon-prices table");

    if (!priceTable) {
      console.error("❌ No price table found! Trying alternative selectors...");

      // Alternative selectors (if structure changes)
      priceTable = document.querySelector("table");
      if (!priceTable) {
        console.error("❌ Still no table found!");
        return res.status(500).json({ error: "Unable to extract carbon prices." });
      }
    }

    res.json({ prices: priceTable.outerHTML });
  } catch (error) {
    console.error("❌ Error fetching carbon prices:", error.message);
    res.status(500).json({ error: "Failed to fetch carbon prices." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
