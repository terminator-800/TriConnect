require('dotenv').config();
const express = require("express")
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express()
const dbPromise = require("./config/DatabaseConnection")
const { createJobseekerTable } = require("./Schema/JobseekerSchema")
const { createBusinessEmployerTable } = require("./Schema/BusinessEmployerSchema")
const { createIndividualEmployerTable } = require("./Schema/IndividualEmployerSchema")
const { createManpowerProviderTable } = require("./Schema/manpowerProviderSchema")
const { createUsersTable } = require("./Schema/UsersSchema")
const { createJobPostTable } = require("./Schema/businessEmployerJobPostSchema")
const jobseekerRoute = require("./routes/jobseekerRoute")
const businessEmployerRoute = require("./routes/businessEmployerRoute")
const individualEmployerRoute = require("./routes/IndividualEmployerRoute")
const manpowerProviderRoute = require("./routes/ManpowerproviderRoute")
const loginRoute = require("./routes/loginRoute")
const forgotPasswordRoute = require("./routes/ForgotPasswordRoute")
const authRoute = require("./routes/authRoute")
const logoutRoute = require("./routes/logoutRoute")


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,// Use a strong secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));



app.use("/", jobseekerRoute)
app.use("/", businessEmployerRoute)
app.use("/", individualEmployerRoute)
app.use("/", manpowerProviderRoute)
app.use("/", loginRoute);
app.use("/", forgotPasswordRoute)
app.use("/", authRoute)
app.use("/", logoutRoute)

async function startServer() {
    try {
        const db = await dbPromise
        await createUsersTable(db);
        await createJobPostTable(db);
        await createJobseekerTable(db);
        await createBusinessEmployerTable(db);
        await createIndividualEmployerTable(db);
        await createManpowerProviderTable(db);
        
        app.locals.db = db;
        app.listen(process.env.PORT, () => {
            console.log(`✅ Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1); 
    }
}

startServer();
module.exports = app;