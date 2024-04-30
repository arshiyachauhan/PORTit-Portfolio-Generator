const mongoose= require("mongoose");
const portfolioSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required: true,
    },
    lastname:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    }

})
//new collection
const Register = new mongoose.model("Registers",portfolioSchema);
module.exports = Register;