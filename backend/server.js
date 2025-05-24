const express = require("express")
const cors = require("cors");
const app = express()
const dbPromise = require("./config/DatabaseConnection")
const { createJobseekerTable } = require("./Schema/JobseekerSchema")
const { createBusinessEmployerTable } = require("./Schema/BusinessEmployerSchema")
const { createIndividualEmployerTable } = require("./Schema/IndividualEmployerSchema")
const { createManpowerProviderTable } = require("./Schema/ManpowerProviderSchema")
const jobseekerRoute = require("./routes/JobseekerRoute")
const businessEmployerRoute = require("./routes/BusinessEmployerRoute")
const individualEmployerRoute = require("./routes/IndividualEmployerRoute")
const manpowerProviderRoute = require("./routes/ManpowerproviderRoute")

app.use(express.json());
app.use(cors());
require('dotenv').config();
app.use("/", jobseekerRoute)
app.use("/", businessEmployerRoute)
app.use("/", individualEmployerRoute)
app.use("/", manpowerProviderRoute)

async function startServer() {
    try {
        const db = await dbPromise
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