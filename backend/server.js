const express = require("express")
const cors = require("cors");
const app = express()
const dbPromise = require("./config/DatabaseConnection")
const { createJobseekerTable } = require("./Schema/JobseekerSchema")
const { createEmployerTable } = require("./Schema/EmployerSchema")
const jobseekerRoute = require("./routes/jobseekerRoute/jobseekerRoute")
const employerRoute = require("./routes/employerRoute/employerRoute")

app.use(express.json());
app.use(cors());
require('dotenv').config();
app.use("/register", jobseekerRoute)
app.use("/register", employerRoute)


async function startServer() {
    try {
        const db = await dbPromise
        await createJobseekerTable(db);
        await createEmployerTable(db);
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