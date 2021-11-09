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

// getLastWorkout
router.get("/workouts", (req, res) => {
    Workout.find({}).sort({_id:-1}).limit(1)
    // aggregate duration function
    Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }])
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

// addExercise 
router.put("/workouts/:id", async (req, res) => {
    try {
        const newExercise = await Workout.findByIdAndUpdate(req.params.id, 
            {
                $push: {
                    exercises: req.body
                }
            });
        res.status(200).json(newExercise);
    } catch(err) {
        res.status(500).json(err);
    };
});

// createWorkout 
router.post("/workouts", async (req, res) => {
    try {
        const newWorkout = await Workout.create({});
        res.status(200).json(newWorkout);
    } catch(err) {
        res.status(500).json(err)
    }
});

// getWorkoutsInRange 
router.get("/workouts/range", (req, res) => {
    Workout.find({
        day: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate()-7))
        }
    })
    // aggregate duration function
    Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }])
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

module.exports = router;
