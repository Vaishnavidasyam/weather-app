const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  preferences: {
    units: {
      type: String,
      enum: ["metric", "imperial"],
      default: "metric",
    },
    theme: {
      type: String,
      enum: ["dark", "light", "auto"],
      default: "dark",
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  savedLocations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
