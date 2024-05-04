const express = require('express')

const router=express.Router() 

const {check,validationResult} = require('express-validator') //For the validation
const bcrypt = require('bcrypt') // To encode the password
const {Customer} = require('../models');// Sequelize model for the user is included here
const multer  = require('multer'); //To upload the image
const { verifyToken, validateToken } = require('../jwt'); // To Validate the the user using token using JWT token
const fs = require('fs');
const path = require("path");
const { or } = require('sequelize');// For need or condition in customer search api so put this

// Image is uploaded in which destination and which name is inserted
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

// Upload the jpg or png file only so put filter here.
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
 
        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
 
        if (mimetype && extname) {
            return cb(null, true);
        }
 
        cb(
            "Error: File upload only supports the following filetypes - " + filetypes
        );
    },
});

// loginValidate is used for validation at the register time
const loginValidate = [check('Name').isAlphanumeric().withMessage('Name should be alphanumeric value').escape(),
                        check('Email').notEmpty().withMessage('Email is required').escape(),
                        check('Email').isEmail().withMessage('Email is not valid').escape(),
                        check('Password').notEmpty().withMessage('Password is required').escape(),
                        check('Password').isStrongPassword({minLength:8},{minLowercase:1},{minUppercase:1},{minSymbols:1}).withMessage("Password is invalid"),
                        check('PhoneNumber').isMobilePhone().isLength("10").withMessage("Phonenumber is invalid"),
                        check('Gender').isIn(['M','F','O']).withMessage("Gender is invalid"),
                        check('Address').isLength({max:255}).withMessage("Address should not be more than 255 characters")
                        ]

// updateValidate is used for validation at the update time because optional() is added here.
const updateValidate = [check('Name').optional().isAlphanumeric().withMessage('Name should be alphanumeric value').escape(),
                        check('Email').optional().notEmpty().withMessage('Email is required').escape(),
                        check('Email').optional().isEmail().withMessage('Email is not valid').escape(),
                        check('Password').optional().notEmpty().withMessage('Password is required').escape(),
                        check('Password').optional().isStrongPassword({minLength:8},{minLowercase:1},{minUppercase:1},{minSymbols:1}).withMessage("Password is invalid"),
                        check('PhoneNumber').optional().isMobilePhone().isLength("10").withMessage("Phonenumber is invalid"),
                        check('Gender').optional().isIn(['M','F','O']).withMessage("Gender is invalid"),
                        check('Address').optional().isLength({max:255}).withMessage("Address should not be more than 255 characters")
                        
                        ]

router.get('/', (req, res) => {
  res.send('Hello World!')
})
//validationResult is used for showing the error which are come from the express validator which is defined above in the loginValidate and updateValidate variable
router.post('/auth/register', upload.single('ProfileImage'), loginValidate, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.send({ errors: result.array() });
        return;
    }
    let Name = req.body.Name;
    let Email = req.body.Email;
    let Password = req.body.Password;
    let PhoneNumber = req.body.PhoneNumber;
    let Gender = req.body.Gender;

    //Address and ProfileImage is optional so put check this one
    if(req.body.Address) {
        var Address = req.body.Address;
    } else {
        var Address = "";
    }
    if(req.file) {
        var ProfileImage = req.file.filename;
    } else {
        var ProfileImage = "";
    }

    let customer = await Customer.findOne({ where: { Email: Email } });
    if (customer === null) {
        //Password encoded using bcrypt method with salt 10, you may change it
        bcrypt.hash(Password,10, async (Error, HashPassword) => {
            if(Error) {
                res.send(Error);
            }
            const insertId = await Customer.create({ Name: Name, Email: Email, Password: HashPassword, PhoneNumber: PhoneNumber, Gender:Gender, Address:Address, ProfileImage:ProfileImage});
            res.send("Successfully inserted User ID: " + insertId.id);
        })
    } else {
        res.send("Customer already exist");
    }
})

// here upload.none() is used because of the formdata will be get easily. If not want then need to use body-parser and then urlencode and json will be used 
router.post('/auth/login', upload.none(), async (req, res) => {
    let Email = req.body.Email;
    let Password = req.body.Password;
    let customer = await Customer.findOne({ where: { Email: Email } });
    if (customer === null) {
        res.send("Customer Not Exist");
        return;
    } else {
        let HashPassword = customer.Password;
        bcrypt.compare(Password,HashPassword, (err,result) => {
            if(result==true) {
                let Token = verifyToken(Email);
                res.send("Token: " + Token);
                return;
            } else {
                res.send("Password is not matched");
                return;
            }
        });
    }
})
// validateToken is used to check the user is authenticate or not
router.get('/customers/:id', upload.none(),validateToken, async (req, res) => {
    let customer = await Customer.findOne({ where: { id: req.params.id } });
    if(customer=== null) {
        res.send("Customer not found"); return;
    }
    res.send(customer);
})
//or is used in where condition because either Name or Email is entered, For Pagination, pass page parameter
router.get('/customers', upload.none(),validateToken, async (req, res) => {
    let page = parseInt(req.body.page);
    if(page==1) page = 0;
    let Name = req.body.Name ?? "";
    let Email = req.body.Email ?? "";
    if(req.body.Name!=undefined || req.body.Email!=undefined) {
        const { count, rows } = await Customer.findAndCountAll({
            where: or(
                {Email: Email},
                { Name: Name}
            ),
            offset:page,
            limit: 5,
        });
        res.send(rows);return;
    } else {
        const { count, rows } = await Customer.findAndCountAll({
            offset:page,
            limit: 5,
        });
        res.send(rows);return;
    }
})

router.post('/customers', upload.single('ProfileImage'), loginValidate,validateToken, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.send({ errors: result.array() });
        return;
    }
    let Name = req.body.Name;
    let Email = req.body.Email;
    let Password = req.body.Password;
    let PhoneNumber = req.body.PhoneNumber;
    let Gender = req.body.Gender;
    let Address = req.body.Address;

    if(req.file) {
        var ProfileImage = req.file.filename;
    } else {
        var ProfileImage = "";
    }

    let customer = await Customer.findOne({ where: { Email: Email } });
    if (customer === null) {
        bcrypt.hash(Password,10, async (Error, HashPassword) => {
            if(Error) {
                res.send(Error);
            }
            await Customer.create({ Name: Name, Email: Email, Password: HashPassword, PhoneNumber: PhoneNumber, Gender:Gender, Address:Address, ProfileImage:ProfileImage}).then(function(insertId){
                res.send("Successfully inserted User ID: " + insertId.id);
                return;
            }).catch(function (err) {
                res.send(err);
                return;
            });
        })
    } else {
        res.send("Customer already exist");return;
    }
})
router.put('/customers/:id', upload.single('ProfileImage'),updateValidate, validateToken,async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.send({ errors: result.array() });
        return;
    }
    let Id = req.params.id;

    let Name = req.body.Name;
    let Email = req.body.Email;
    let Password = req.body.Password ?? "";
    let PhoneNumber = req.body.PhoneNumber;
    let Gender = req.body.Gender;
    let Address = req.body.Address;

    if(req.file) {
        var ProfileImage = req.file.filename;
    }

    if(Password=="") {
        await Customer.update(
            { Name: Name, Email: Email, PhoneNumber: PhoneNumber, Gender:Gender, Address:Address,ProfileImage:ProfileImage},
            {where: {Id: Id}},
        ).then(function(item){
            res.send("Successfully updated User ID: " + Id);
            console.log(Id);
        }).catch(function (err) {
            res.send(err);
            return;
        });
    } else {
        bcrypt.hash(Password,10, async (Error, HashPassword) => {
            if(Error) {
                res.send(Error);
            }
            await Customer.update(
                { Name: Name, Email: Email,Password: HashPassword, PhoneNumber: PhoneNumber, Gender:Gender, Address:Address,ProfileImage:ProfileImage},
                {where: {Id: Id}},
            ).then(function(item){
                res.send("Successfully updated User ID: " + Id);
                console.log(Id);
            }).catch(function (err) {
                res.send(err);
                return;
            });
        })
    }
})
//customer is deleted and the file uploaded that also deleted from that folder
router.delete('/customers/:id', upload.none(),validateToken, (req, res) => {
    let Id = req.params.id;
    Customer.findOne({ where: { Id: Id } }).then(async function(customer){
        if(customer) {
            let filename = customer.ProfileImage;
            if(filename) {
                fs.unlink('uploads/'+filename, (err) => {
                    if (err) throw err;
                    console.log('File was deleted');
                });
            }
            await Customer.destroy({ where: { Id: Id },}).then(function(item){
                res.send("Successfully deleted User ID: " + Id);
                return;
            }).catch(function (err) {
                res.send(err);
                return;
            });
        } else {
            res.send("Customer does not exist");
        }
    }).catch(function (err) {
        res.send(err);
        return;
    })
})

module.exports=router