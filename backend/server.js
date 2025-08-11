const userSocketMap = {};
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const http = require("http");
const initializeSocket = require("./config/socketIO");
const app = express();
const path = require("path");
const server = http.createServer(app);
const io = initializeSocket(server, userSocketMap);
app.set('io', io);
app.set('userSocketMap', userSocketMap);
require('./utils/cronJobPost');
const pool = require("./config/databaseConnection2");

// Your DB setup
const { createJobseekerTable } = require("./Schema/jobseekerSchema");
const { createBusinessEmployerTable } = require("./Schema/businessEmployerSchema");
const { createIndividualEmployerTable } = require("./Schema/individualEmployerSchema");
const { createManpowerProviderTable } = require("./Schema/manpowerProviderSchema");
const { createUsersTable } = require("./Schema/usersSchema");
const { createJobPostTable } = require("./Schema/jobPostSchema");
const { conversations } = require("./Schema/conversationsSchema")
const { messages } = require("./Schema/messagesSchema")
const { createJobApplicationsTable } = require('./Schema/jobApplicationsSchema')
const { createAdministrator } = require("./controllers/administratorController/create-administrator");
const { createReportsTable } = require("./Schema/reportsSchema");
const { createReportProofsTable } = require("./Schema/reportProofSchema");
const { feedback } = require("./Schema/feedbackSchema");

// Routes
const jobseekerRoute = require("./routes/jobseekerRoute");
const businessEmployerRoute = require("./routes/businessEmployerRoute");
const individualEmployerRoute = require("./routes/IndividualEmployerRoute");
const manpowerProviderRoute = require("./routes/manpowerproviderRoute");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const verifyToken = require("./utils/verifyToken");
const administratorRoute = require("./routes/administratorRoute");
const jobPostRoute = require("./routes/jobPostRoute")

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Routes
app.use("/", jobseekerRoute);
app.use("/", businessEmployerRoute);
app.use("/", individualEmployerRoute);
app.use("/", manpowerProviderRoute);
app.use("/", authRoute);
app.use("/", forgotPasswordRoute);
app.use("/", verifyToken);
app.use("/", administratorRoute);
app.use("/", jobPostRoute)

async function startServer() {
  const connection = await pool.getConnection();
  try {

    await createUsersTable(connection);
    await createJobseekerTable(connection);
    await createBusinessEmployerTable(connection)
    await createIndividualEmployerTable(connection);
    await createManpowerProviderTable(connection);
    await createJobPostTable(connection);
    await conversations(connection);
    await messages(connection);
    await createJobApplicationsTable(connection);
    await createReportsTable(connection);
    await createReportProofsTable(connection);
    await feedback(connection)
    await createAdministrator();

    app.locals.db = connection;

    server.listen(process.env.API_PORT || 3001, () => {
      console.log(`✅ Server running with Socket.IO on port ${process.env.API_PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  } finally {
    if (connection) connection.release(); 
  }
}

startServer();
module.exports = { app, io };
