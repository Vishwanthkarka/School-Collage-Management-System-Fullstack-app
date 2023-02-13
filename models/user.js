const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken")

const usermodel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is mandatory"],
  },
  email: {
    type: String,
    required: [true, "Email in mandatory"],
    validate: [validator.isEmail, "enter the email correctly"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is mandatory"],
    minlength: [6, "password length should atleast 6  "],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  parent_email:{
    type: String,

    validate: [validator.isEmail, "enter the email correctly"],
  },
  student_email:{
    type: String,
   
    validate: [validator.isEmail, "enter the email correctly"],
  },
  student_id :{
    type: mongoose.Schema.ObjectId,
        ref: 'user',
  },
  photo: {
    id: {
      type: String,
      // required:true
    },
    secure_url: {
      type: String,
    },
  },
  sections: [
  { section: String}
  ],
  departments: [
    {
    department: String,
    },
   
],
  isLoginGoogle: {
    type: Boolean,
    default: false,
  },
  phoneNo: {
    type: String,
    maxlength: [10, "Number should be 10 digits"],
    validate: [
      validator.isMobilePhone,
      "en-IN",
      "enter the phone number correctly",
    ],
  },
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

usermodel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

usermodel.methods.isValidatePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};
usermodel.methods.getJwtToken = async function(){
  return await Jwt.sign({id:this._id},process.env.JWT_SCREATE,{
    expiresIn:process.env.JWT_EXPIRY
  })
}




module.exports = mongoose.model("user", usermodel);
