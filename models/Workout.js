const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [
    {
      type: {
        type: String,
        trim: true,
        required: "This is required"
      },
      name: {
        type: String,
        trim: true,
        required: "This is required"
      },
      duration:{
        type: Number,
        trim: true,
        required: "This is required"
      },
      weight: {
        type: Number,
        trim: true,
      },
      reps: {
        type: Number,
        trim: true,
      },
      sets: {
        type: Number,
        trim: true,
      },
      distance: {
        type: Number,
        trim: true,
      },
    }
  ]
});
  
const Workout = mongoose.model("Workout", workoutSchema);
  
module.exports = Workout;
