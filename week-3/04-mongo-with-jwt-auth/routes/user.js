const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  if (req.headers.username && req.headers.password) {
    User.create({
      username: req.headers.username,
      password: req.headers.password,
    });
    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "invalid username or password" });
  }
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  if (req.headers.username && req.headers.password) {
    const user = await User.find({
      username: req.headers.username,
      password: req.headers.password,
    });
    if (user)
      return res.status(200).json({
        message: jwt.sign({ username: req.headers.username }, JWT_SECRET),
      });
    else
      return res
        .status(400)
        .json({ success: false, message: "invalid username or password" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "invalid username or password" });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const courses = await Course.find({});
  return res.status(200).json({ courses });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  console.log(courseId);
  Course.findById({ _id: courseId })
    .then((course) => {
      // add the courseId to the user entry
      console.log("found coureser", course);
      User.findOneAndUpdate(
        { username: req.username },
        {
          $addToSet: {
            purchasedCourses: {
              $each: [course._id],
            },
          },
        },
        { new: true }
      )
        .then((data) => {
          console.log("purchased course data!: ", data);
          res.status(200).json({ message: "Course purchased successfully" });
        })
        .catch((err) => res.status(500).json({ success: false, msg: err }));
    })
    .catch((err) => res.status(404).json({ success: false, msg: err }));
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const courses = await User.aggregate([
    {
      $match: { username: req.username },
    },
    {
      $lookup: {
        from: "courses",
        localField: "purchasedCourses",
        foreignField: "_id",
        as: "purchasedCourses",
      },
    },
    {
      $project: {
        _id: 0,
        purchasedCourses: 1,
      },
    },
  ]);

  if (!courses) {
    return res.status(400).json({ msg: "no courses" });
  } else {
    return res.status(200).json(courses);
  }
});

module.exports = router;
