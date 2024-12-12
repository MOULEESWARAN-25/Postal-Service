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

export async function GET() {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    const data = await EmployeeModel.find(); // Fetch all documents
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch data", error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
