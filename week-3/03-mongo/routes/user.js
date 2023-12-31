const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { default: mongoose } = require("mongoose");

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

router.get("/courses", (req, res) => {
  // Implement listing all courses logic
  Course.find().then((courses) => res.status(200).json(courses));
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  Course.findById({ _id: courseId })
    .then((course) => {
      // add the courseId to the user entry
      User.findOneAndUpdate(
        { username: req.headers.username },
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
  let purchasedCourses = await User.aggregate([
    {
      $match: { username: req.headers.username },
    },
    {
      $lookup: {
        from: "courses",
        localField: "purchasedCourses", // Users localField
        foreignField: "_id", // Courses foreign field
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

  console.log(purchasedCourses);
  if (!purchasedCourses) {
    return res.status(400).json({ msg: "no courses" });
  } else {
    return res.status(200).json(purchasedCourses);
  }
});

module.exports = router;
