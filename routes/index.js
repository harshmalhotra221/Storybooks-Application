const express=  require('express');
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const router = express.Router();

const Story = require('../models/Story')

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',
    {
        layout: 'login'
    });
})

router.get('/dashboard',ensureAuth, async(req,res)=>{
    try{
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard',{
            name : req.user.firstName,
            stories
        })
    } catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

// var backgroundImage = '<div style="background-image: url('+Session.get("RandomURL")+')"></div>';
// //return resultant variable to HTML via template
//     return backgroundImage;


module.exports = router;