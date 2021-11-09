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

// addExercise to existing workout
router.put("/api/workouts/:id", async (req, res) => {
    try {
        const newExercise = await db.workouts.insert({ _id: mongojs.ObjectId(req.params.id)}, { $push: { exercises: 
            {
                type: req.body.type,
                name: req.body.name,
                duration: req.body.duration,
                weight: req.body.weight,
                reps: req.body.reps,
                sets: req.body.sets,
                distance: req.body.distance
            }
        }
        });
        res.status(200).json(newExercise);
    } catch(err) {
        res.status(500).json(err);
    };
});

// createWorkout 
router.post("/api/workouts", async (req, res) => {
    try {
        const newWorkout = await Workout.create({})
    } catch(err) {
        res.status(500).json(err)
    }
});

// getWorkoutsInRange 
router.get("/api/workouts/range", (req, res) => {
    Workout.find({
        day: {
            $lte: Date(),
            $gt: new Date(new Date().setDate(new Date().getDate() - 7))
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
