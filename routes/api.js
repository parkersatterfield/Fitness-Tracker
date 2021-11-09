const router = require("express").Router();
const path = require("path")
const Workout = require("../models/Workout");
const mongojs = require("mongojs");

const databaseUrl = "workout";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

// render Exercise.html
router.get('/exercise', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/exercise.html'))
);

// render Exercise.html
router.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/index.html'))
);

// render Exercise.html
router.get('/stats', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/stats.html'))
);

// getLastWorkout
router.get("/api/workouts", (req, res) => {
    Workout.find({}).sort({_id:-1}).limit(1)
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

// addExercise 
router.put("/api/workouts/:id", async (req, res) => {
    try {
        const newExercise = await Workout.findByIdAndUpdate(req.params.id, 
            {
                $push: {
                    exercises: req.body
                }
            });
        console.log(req.params.id)
        console.log(req.body)
        res.status(200).json(newExercise);
    } catch(err) {
        res.status(500).json(err);
    };
});

// createWorkout 
router.post("/api/workouts", async (req, res) => {
    try {
        const newWorkout = await Workout.create({});
        res.status(200).json(newWorkout);
    } catch(err) {
        res.status(500).json(err)
    }
});

// getWorkoutsInRange 
router.get("/api/workouts/range", (req, res) => {
    Workout.find({
        day: {
            $lte: Date(),
            $gt: new Date().getDate() - 7
        }
    })
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

module.exports = router;
