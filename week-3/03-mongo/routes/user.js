const { Router } = require("express");
const mongoose=require('mongoose');
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course}=require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username=req.body.username;
    const password=req.body.password;

    await User.create({
        username: username,
        password: password,
    })

    res.json({
        message: 'User created successfully'
    })
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username=req.headers.username;
    const password=req.headers.password;
    const courseId=req.params.courseId;

    await User.updateOne({
        username: username
    },{
        "$push":{
            purchasedCourses:new mongoose.Types.ObjectId(courseId)
        }
    })

    res.json({
        message: 'Course purchased successfully'
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.headers.username;
    
    const user = await User.findOne({
        username: username
    });

    const purchases = user.purchasedCourses;
    console.log(purchases);

    const courses=await Course.find({
        _id:{
            "$in":purchases
        }
    });

    res.json({
        courses: courses
    });
});

module.exports = router