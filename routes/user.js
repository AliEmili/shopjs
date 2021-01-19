require('dotenv').config();

const express = require('express');
const router = express.Router();

const { UserModel, validateUser } = require('../models/user');

router.post('/register', async (req, res, next) => {
     const userValidation = validateUser(req.body)
     if (userValidation.error) {
          return res.status(400).send(userValidation.error.details.map(detail => detail.message));
     }

     const newUser = new UserModel(req.body);
     try {
          await newUser.save();
          return res.send(newUser);
     }
     catch(error) {
          // console.log(error)
          res.status(500).send('something went wrong!')
     }
});

router.post('/login', async (req, res) => {
     const { email, phone, password } = req.body;
     const foundUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
     if (foundUser) {
          const passwordIsCorrect = await bcrypt.compare(password, foundUser.password);
          if (passwordIsCorrect) {
               const token = jwt.sign({ _id: foundUser._id, name: foundUser.name }, process.env.PASSWORD_HASH_KEY);
               return res.send(token);
          }
     }
     return res.send('false');
});


module.exports = router;