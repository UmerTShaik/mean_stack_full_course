const jwt = require("jsonwebtoken")


//middleweare is just a function in node
module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];//splitting below bearer space  token
        // "Bearer thentokenword"
         const decodedToken = jwt.verify(token, process.env.JWT_KEY);
         //addin gthis to get user id to set to post model creator foeld for authorization of user to his post obnly
         req.userData = {email: decodedToken.email , userId: decodedToken.userId};//express you can use it to add nformation to req without modify existing req
         next();
    } catch(error){
        res.status(401).json({
            messsage:"You are not authenticated"
        })
    }

};