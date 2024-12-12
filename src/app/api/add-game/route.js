import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define Schema and Model
const EmployeeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true, trim: true },
  villages: { type: [String], required: true },
  totalAccounts: { type: Number, required: true },
  orderType: { type: String, enum: ["sequential", "random"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  additionalInstructions: { type: String, default: "" },
});

const EmployeeModel = mongoose.models.adhavans || mongoose.model("adhavans", EmployeeSchema);

export async function POST(req) {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    const data = await req.json(); // Parse the incoming JSON body
    const newEmployee = new EmployeeModel(data);
    await newEmployee.save();

    return new Response(
      JSON.stringify({ message: "Data added successfully!" }), // Respond with a success message
      {
        status: 201,
        headers: {
          "Content-Type": "application/json", // Set response type to JSON
        },
      }
    );
  } catch (error) {
    console.error("Error adding data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to add data", error }), // Respond with an error message
      {
        status: 500,
        headers: {
          "Content-Type": "application/json", // Set response type to JSON
        },
      }
    );
  }
}
