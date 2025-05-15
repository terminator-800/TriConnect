const express = require("express")
const cors = require("cors"); // <-- Import CORS
const app = express()

const sequelize = require("./config/DatabaseConnection")
const jobseekerRegisterRoute = require("./routes/jobseekerRegisterRoute/jobseekerRegisterRoute")


app.use(cors()); // <-- Enable CORS
require('dotenv').config();

app.use("/register", jobseekerRegisterRoute)



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    
    sequelize.sync({ alter: true })
        .then(() => {
            console.log("Database synced successfully.");
        })
        .catch((err) => {
            console.error("Database sync failed:", err);
        });
});



module.exports = app;