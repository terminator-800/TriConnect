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
// Your DB setup
const dbPromise = require("./config/DatabaseConnection");
const { createJobseekerTable } = require("./Schema/JobseekerSchema");
const { createBusinessEmployerTable } = require("./Schema/BusinessEmployerSchema");
const { createIndividualEmployerTable } = require("./Schema/IndividualEmployerSchema");
const { createManpowerProviderTable } = require("./Schema/ManpowerProviderSchema");
const { createUsersTable } = require("./Schema/UsersSchema");
const { createJobPostTable } = require("./Schema/JobPostSchema");
const { conversations } = require("./Schema/conversationsSchema")
const { messages } = require("./Schema/messagesSchema")
const { createAdminIfNotExists } = require("./controllers/adminController");

// Routes
const jobseekerRoute = require("./routes/jobseekerRoute");
const businessEmployerRoute = require("./routes/businessEmployerRoute");
const individualEmployerRoute = require("./routes/IndividualEmployerRoute");
const manpowerProviderRoute = require("./routes/ManpowerproviderRoute");
const loginRoute = require("./routes/loginRoute");
const forgotPasswordRoute = require("./routes/ForgotPasswordRoute");
const authRoute = require("./routes/authRoute");
const logoutRoute = require("./routes/logoutRoute");
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
app.use("/", loginRoute);
app.use("/", forgotPasswordRoute);
app.use("/", authRoute);
app.use("/", logoutRoute);
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
    await conversations(db)
    await messages(db)
    
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
