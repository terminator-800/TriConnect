const express = require("express")
const router = express.Router()

router.post("/jobseeker", (req, res) => {
    res.status(200).json({
        message: "Account created successfully"
    })

    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    
    console.log(data);

    res.status(400).json({
        message: "Account creation failed"
    })
})

module.exports = router
