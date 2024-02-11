const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require('../db');

async function userExists(username, password) {
    const userExists = await User.findOne({username: username, password: password});
    
    if (userExists) {
        return true;
    } else {
        return false;
    }
}

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
        // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userExistsResult = await userExists(username, password);
    if (!userExistsResult) {
        await User.create({
            username: username,
            password: password
        })
        res.json({msg: 'User created successfully'});
    } else {
        res.status(403).send('Error occured');
    }
});


router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({}); 
    res.json({
        courses: allCourses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;
    await User.updateOne(
        {username: username},
        {"$push": {purchasedCourses: courseId}});
    res.json({message: 'Course purchased successfully'})
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({username})
    const purchasedCourses = await Course.find({ 
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.json({  
        purchasedCourses: purchasedCourses
    })
});

module.exports = router