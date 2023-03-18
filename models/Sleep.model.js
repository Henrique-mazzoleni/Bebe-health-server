const {model, Schema} = require('mongoose')

const sleepSchema = new Schema(
    {
      date: {
        type: Date,
        required: [true, "Date and Time are required."],
        lowercase: true,
        trim: true,
      },
        startTime: {
        type: Date,
        required: [true, "Start Time is required."],
      },
        endTime: {
        type: Date,
        required: [true, "End Time is required."],
      },
        duration: {
        type: Number
    },
        location: {
        type: String,
        enum: ["Parents Bed", "Crib", "Stroller", "Car"]
        }
    },
    {
      timestamps: true,
    }
  );
  
  const Sleep = model("Sleep", sleepSchema);
  
  module.exports = Sleep;