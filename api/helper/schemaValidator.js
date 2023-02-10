const Validator = require("jsonschema").Validator;
const { Draft04, Draft06, Draft07, Draft, JSONError } =  require("json-schema-library");
const fileSystem = require("fs");
const path = require("path");

const validate = new Validator();
const correctSchema = fileSystem.readFileSync(path.join(__dirname, 'correctSchema.json'),(err, data)=> {
    if(err){
        console.log("error in readfilr sync")
        console.log(err);
    }else{
        console.log(data);
    }
   
});
const correctSchemaJSON = JSON.parse(correctSchema);

// const correctSchemaJSON = {       }






const payloadValidation = (req) => {

    // console.log("inside payload validation");
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",correctSchemaJSON)
    // const error = validate.validate(req.body,correctSchemaJSON)

    // if (error.errors.length <1){
    //     console.log("Request body",req.body)
    //     console.log("$$$$$$$$$$$$$$$$$$",error)
    //     console.log("!!!!!!!!!!!!!",error.errors);
    //     console.log("!!!!!!!!!!!!!",error.errors.length);
    //     return true; //no error
    // } else{
    //     return false // error
    // }

    const jsonSchema = new Draft07(correctSchemaJSON);
    const error  = jsonSchema.isValid(req.body);
    const errorList  = jsonSchema.validate(req.body);
    console.log("Error List !!!!!!!",errorList,error)

    return error

}

module.exports = {
    payloadValidation
}