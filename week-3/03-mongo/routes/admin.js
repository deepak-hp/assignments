const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  if (req.headers.username && req.headers.password) {
    Admin.create({
      username: req.headers.username,
      password: req.headers.password,
    }).then(() => {
      return res
        .status(200)
        .json({ success: true, message: "Admin created successfully" });
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "invalid username or password" });
  }
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic
  Course.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  })
    .then((course) =>
      res
        .status(200)
        .json({ message: "Course created successfully", courseId: course._id })
    )
    .catch((err) =>
      res.status(400).json({ success: false, message: "someting went wrong" })
    );
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
  Course.find({})
    .then((courses) => res.status(200).json(courses))
    .catch((err) =>
      res.status(400).json({ success: false, message: "someting went wrong" })
    );
});

module.exports = router;
