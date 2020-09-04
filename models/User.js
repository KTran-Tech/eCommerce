const mongoose = require('mongoose');
const crypto = require('crypto');
//generate unique strings
const uuidv1 = require('uuid/v1');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //spacecs in the beginning or end are trimmed out
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      //spacecs in the beginning or end are trimmed out
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      //spacecs in the beginning or end are trimmed out
      trim: true,
    },
    //used to generate hashed password
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
