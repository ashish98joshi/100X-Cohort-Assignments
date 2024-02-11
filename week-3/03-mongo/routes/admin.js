const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require('../db');

async function adminExists(username, password) {
    const adminExists = await Admin.findOne({username: username, password: password});
    
    if (adminExists) {
        return true;
    } else {
        return false;
    }
}

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const adminExistsResult = await adminExists(username, password);
    if (!adminExistsResult) {
        await Admin.create({
            username: username,
            password: password
        })
        res.json({message: 'Admin created successfully'});
    } else {
        res.status(403).send('Error occured');
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic

    // can use zod here to validate the put
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const newCourse = await Course.create({
        title: title, 
        description: description, 
        price: price, 
        imageLink: imageLink
    })
    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({}); 
    res.json({
        courses: allCourses
    })
});

module.exports = router;