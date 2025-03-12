const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure you have a User model defined

const authenticate =(req,res,next)=>{
  const token = req.header("Authorization")
  if(!token){
      res.status(401).send({error:"not authorized"})
  }
  const decoded =jwt.verify(token.replace("Bearer ",""),process.env.JWT_SECRET)
  req.user = decoded
  next()
    
}

module.exports = authenticate;