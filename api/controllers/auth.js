const {generateToken,validateToken} = require("../middleware/auth");


module.exports = {

    getToken : (req,res) => {
        try {
            const token = generateToken();
            return res.status(200).json({
                "msg" : "Token Generated Successfully",
                "token" : token
            });
            
        } catch (error) {
            return res.status(500).json({
                "msg" : "Internal Error",
                "error" : error
            });
            
        }
        

    },

    validateTokens : (req,res) => {
        try {
            console.log("check 0");
            var token = req.header("x-auth-token");
            if(!token){
                return res.status(401).json({msg : 'No token, authorization denied'});
           }
            result = validateToken(token);
            console.log("check 4");
            if (result) {
                console.log("check 5",result);
                return res.status(200).json({"msg":"token validate"});
            } else {
                console.log("check 6");
                return res.status(400).json({"msg":"token invalidate"});
            }
        } catch (error) {
            console.log("check 7",error);
            return res.status(500).json({
                "msg" : "Internal Error",
                "error" : error
            });
            
        }
        
    }

    
}