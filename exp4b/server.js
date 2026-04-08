const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));

app.get("/quiz", async (req, res) => {
  try {
    const amount = Number(req.query.amount) || 10;
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    const response = await axios.get(apiUrl);

    if (!response.data || !Array.isArray(response.data.results)) {
      return res.status(502).json({ error: "Invalid API response" });
    }

    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz questions" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
