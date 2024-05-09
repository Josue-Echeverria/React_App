// server/index.js

const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
    res.json({ "message": "Hola desde el servidor!" });
  });
