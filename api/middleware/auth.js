
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const  config = require('config');

module.exports = {
    generateToken : () => {
        var randomVal = crypto.randomBytes(64).toString();
        payload = {
            randomValue : randomVal
        }
        var jwtToken = jwt.sign(payload,config.get("jwtSecret") , {expiresIn : 36000});

        return jwtToken
    },
    validateToken : (token)=> {
        try {

            console.log("check 1")
            
            console.log("check 1.1",token);
            var decoded = jwt.verify(token, config.get("jwtSecret"));
            console.log("check 2", decoded);
            return decoded;
        } catch (error) {
            console.log("check 3",error);
            return false;
        }

        
    }
}