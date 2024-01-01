const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");
const router = Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  await Admin.create({
    username,
    password,
  });

  res.json({
    message: "Admin Created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  console.log(JWT_SECRET);

  const user = await Admin.find({ username, password });
  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.status(200).json({ message: token });
  } else {
    return res.status(411).json({ message: "incorrect email or password" });
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
