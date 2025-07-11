const userSocketMap = {};
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const http = require("http");
const initializeSocket = require("./config/socketIO"); 
const app = express();
const server = http.createServer(app);
const io = initializeSocket(server, userSocketMap); 
app.set('io', io); 
app.set('userSocketMap', userSocketMap);
require('./utils/cronJobPost');

// Your DB setup
const dbPromise = require("./config/DatabaseConnection");
const { createJobseekerTable } = require("./Schema/jobseekerSchema");
const { createBusinessEmployerTable } = require("./Schema/businessEmployerSchema");
const { createIndividualEmployerTable } = require("./Schema/individualEmployerSchema");
const { createManpowerProviderTable } = require("./Schema/manpowerProviderSchema");
const { createUsersTable } = require("./Schema/usersSchema");
const { createJobPostTable } = require("./Schema/jobPostSchema");
const { conversations } = require("./Schema/conversationsSchema")
const { messages } = require("./Schema/messagesSchema")
const { createJobApplicationsTable } =  require('./Schema/jobApplicationsSchema')
const { createAdminIfNotExists } = require("./controllers/administratorController");

// Routes
const jobseekerRoute = require("./routes/jobseekerRoute");
const businessEmployerRoute = require("./routes/businessEmployerRoute");
const individualEmployerRoute = require("./routes/IndividualEmployerRoute");
const manpowerProviderRoute = require("./routes/manpowerproviderRoute");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/ForgotPasswordRoute");
const verifyToken = require("./utils/verifyToken");
const adminRoute = require("./routes/adminRoute");

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// Routes
createAdminIfNotExists();
app.use("/", jobseekerRoute);
app.use("/", businessEmployerRoute);
app.use("/", individualEmployerRoute);
app.use("/", manpowerProviderRoute);
app.use("/", authRoute);
app.use("/", forgotPasswordRoute);
app.use("/", verifyToken);
app.use("/", adminRoute);

async function startServer() {
  try {
    const db = await dbPromise;
    await createUsersTable(db);
    await createJobPostTable(db);
    await createJobseekerTable(db);
    await createBusinessEmployerTable(db);
    await createIndividualEmployerTable(db);
    await createManpowerProviderTable(db);
    await conversations(db);
    await messages(db);
    await createJobApplicationsTable(db);

    app.locals.db = db;

    server.listen(process.env.PORT, () => {
      console.log(`✅ Server running with Socket.IO on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
module.exports = { app, io };
