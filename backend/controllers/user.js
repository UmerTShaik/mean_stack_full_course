const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.createUser = (req, res, next)=>{
    bcrypt.hash(req.body.password , 10 ).then(
        hash => {
            const user = new User({ email: req.body.email, password: hash});
            console.log(user);
            user.save().then(result =>{
                res.status(201).json({
                    message:'User created!',
                    result:result
                })
            }).catch(err =>{
                res.status(500).json({
                        message:"Invalid authentication credentials"
                })
            })
        });
}


exports.userLogin = (req, res, next) =>{
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then(user =>{
        if(!user){
            return res.status(401).json({
                message:"AuthFiled"
            })
        }
        fetchedUser = user;
        //unhash the hash and compare password
        return bcrypt.compare( req.body.password,  user.password)
    })
    .then(result =>{//if we get result or match
        if(!result){
            return res.status(401).json({
                message:"Auth Failed"
            })
        }
        //now create json web token 
        const token = jwt.sign({email:fetchedUser.email , userId: fetchedUser._id }, process.env.JWT_KEY , {expiresIn:"1h"})//you can use any to geenraete signhere we user email userid 
        
        res.status(200).json({
            token:token,
            expiresIn: "3600", //seconds mean 1hr
            userId: fetchedUser._id//even fetchedUser._id it will be in taoken decoding will be extrra so sending it seprately so ony guy who created can delete or edit his posts 
        })
    }).catch(err =>{//if we run into other erros 
        return res.status(401).json({
            message:"Invalid authentication credentials"
        })
    });
}