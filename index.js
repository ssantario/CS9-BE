const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://cs-9-fe.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions)); // Menerapkan middleware CORS
app.use(express.json());

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route")); // Tambahkan ini

app.get("/api/data", (req, res) => {
  res.json({ message: "Data berhasil diambil" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
