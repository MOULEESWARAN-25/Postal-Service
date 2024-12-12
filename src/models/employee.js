const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true, // Employee name is mandatory
        trim: true, // Removes whitespace from the beginning and end
    },
    villages: {
        type: [String], // Array of strings
        required: true, // Villages are mandatory
    },
    totalAccounts: {
        type: Number, // Total accounts should be a number
        required: true, // Mandatory field
    },
    orderType: {
        type: String,
        enum: ["sequential", "random"], // Restricted to specific order types
        required: true, // Mandatory field
    },
    startDate: {
        type: Date, // Stored as a Date object
        required: true, // Start date is mandatory
    },
    endDate: {
        type: Date, // Stored as a Date object
        required: true, // End date is mandatory
    },
    additionalInstructions: {
        type: String, // String field
        default: "", // Default to empty string if not provided
    },
});

// Use your collection name as the model name
const EmployeeModel = mongoose.model("adhavans", EmployeeSchema);

module.exports = EmployeeModel;