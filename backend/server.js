const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const historyLogRoutes = require("./routes/historyLogRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes");
const groupRoutes = require("./routes/groupRoutes");
const chatMessageRoutes = require("./routes/chatMessageRoutes");

dotenv.config({ path: __dirname + '/.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/historylogs", historyLogRoutes);
app.use("/api/teammembers", teamMemberRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chatmessages", chatMessageRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((error) => {
  console.log(error);
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
