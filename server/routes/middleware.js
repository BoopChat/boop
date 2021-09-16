const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    // If no authorization header return unauthorized message.
    if (!req.header("Authorization")) 
        return res.status(401).json({
        success: false,
        msg: "Unauthorized"
    })

    // Check for the authorization bearer header.
    if (req.header('Authorization') && req.header('Authorization').split(' ')[0] === "Bearer") {
        // Gets jwt token from the header.
        const token = req.header("Authorization").split(" ")[1];

        try {
            // Verifies jwt token returns the decoded user information.
            // Throws an error if jwt is invalid (tampered with or encoded with a different secret).
            const userInfo = jwt.verify(token, process.env.TOKEN_SECRET)

            // Adds user info to the request object
            req.user = userInfo;
            next(); 
        
        } catch (e) {
            res.status(401).json({
            success: false,
            msg: "Invalid token"
        })   
        }

    } else {
        return res.status(401).json({
        success: false,
        msg: "Unauthorized"
        })   
    }
}

module.exports = { verifyToken }