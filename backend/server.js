const express = require("express")
const cors = require("cors");
const app = express()
const dbPromise = require("./config/DatabaseConnection")
const { createJobseekerTable } = require("./Schema/JobseekerSchema")
const { createEmployerTable } = require("./Schema/BusinessEmployerSchema")
const { createIndividualEmployerTable } = require("./Schema/IndividualEmployerSchema")
const jobseekerRoute = require("./routes/JobseekerRoute")
const businessEmployerRoute = require("./routes/BusinessEmployerRoute")
const indivualEmployerRoute = require("./routes/IndividualEmployerRoute")
const validateRegisterInput = require("./middleware/validateRegisterInput")

app.use(express.json());
app.use(cors());
require('dotenv').config();
app.use("/register", validateRegisterInput, jobseekerRoute)
app.use("/register/employer/business", validateRegisterInput, businessEmployerRoute)
app.use("/register/employer/individual", validateRegisterInput, indivualEmployerRoute)

async function startServer() {
    try {
        const db = await dbPromise
        await createJobseekerTable(db);
        await createEmployerTable(db);
        await createIndividualEmployerTable(db);
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