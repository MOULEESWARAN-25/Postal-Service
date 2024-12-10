"use client";
import React, { useState } from "react";
import axios from "axios";
export default function Questions() {
  const [schemes, setSchemes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    panId: "",
    aadharId: "",
    age: "",
    address: "",
    gender: "",
    location: "",
    area: "",
    maritalStatus: "",
    occupation: "",
    monthlyIncome: "",
    educationLevel: "",
    financialGoal: "",
    riskAppetite: "",
    duration: "",
    digitalUsage: "",
    ownLandForAgriculture: "",
    taxPayer: "",
    numberOfChildren: "",
    numberOfGirlChildrenUnder10: "",
    creditScore: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formData);

    const sendData = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData
        );
        console.log(response.data);
        setSchemes(response.data[0]["Top 3 Schemes"]); // Update the schemes state
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

    sendData();
  };

  const handleDiscard = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      panId: "",
      aadharId: "",
      age: "",
      address: "",
      gender: "",
      location: "",
      area: "",
      maritalStatus: "",
      occupation: "",
      monthlyIncome: "",
      educationLevel: "",
      financialGoal: "",
      riskAppetite: "",
      duration: "",
      digitalUsage: "",
      ownLandForAgriculture: "",
      taxPayer: "",
      numberOfChildren: "",
      numberOfGirlChildrenUnder10: "",
      creditScore: "",
    });
  };
  console.log(schemes);
  return (
    <div className="bg-gray-100  items-center justify-center p-4 flex gap-10">
      <div>
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            USER DETAILS FORM
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Full Name"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Phone Number"
              />
            </div>

            {/* PAN ID */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">PAN ID</label>
              <input
                type="text"
                name="panId"
                value={formData.panId}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PAN ID"
              />
            </div>

            {/* Aadhar ID */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                AADHAR ID
              </label>
              <input
                type="text"
                name="aadharId"
                value={formData.aadharId}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Aadhar ID"
              />
            </div>

            {/* Age */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">AGE</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Age"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                ADDRESS
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Full Address"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">GENDER</label>
              <div className="flex space-x-4">
              <label className="label flex gap-3 cursor-pointer">
    <span className="label-text">Male</span>
    <input type="radio" 
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}  className="radio  checked:bg-blue-600" defaultChecked />
  </label>
                <label className="label flex gap-3 cursor-pointer">
    <span className="label-text">Female</span>
    <input type="radio" name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}  className="radio checked:bg-blue-600" defaultChecked />
  </label>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                LOCATION
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Location</option>
                <option value="Rural">Rural</option>
                <option value="Urban">Urban</option>
              </select>
            </div>

            {/* Area */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">AREA</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Area</option>
                <option value="Erode">Erode</option>
                <option value="Namakkal">Namakkal</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                MARITAL STATUS
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorse">Divorse</option>
              </select>
            </div>

            {/* Occupation */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                OCCUPATION
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Occupation</option>
                <option value="Farmer">Farmer</option>
                <option value="Teacher">Teacher</option>
                <option value="Labour">Labour</option>
                <option value="Salried Employee High">
                  Salaried Employee High
                </option>
                <option value="Salried Employee Low">
                  Salaried Employee Low
                </option>
                <option value="Self Employeed">Self Employeed</option>
                <option value="Government Employeed">
                  Government Employeed
                </option>
                <option value="Retired">Retired</option>
                <option value="Government Retire">Government Retired</option>
              </select>
            </div>

            {/* Monthly Income */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                MONTHLY INCOME
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Monthly Income"
              />
            </div>

            {/* Education Level */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                EDUCATION LEVEL
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Education Level</option>
                <option value="Graduated">Graduated</option>
                <option value="5th">5th</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="none">none</option>
              </select>
            </div>

            {/* Financial Goal */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                FINANCIAL GOAL
              </label>
              <select
                type="text"
                name="financialGoal"
                value={formData.financialGoal}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Retirement">Retirement</option>
                <option value="Investment">Investment</option>
                <option value="Savings">Savings</option>
              </select>
            </div>

            {/* Risk Appetite */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                RISK APPETITE
              </label>
              <select
                name="riskAppetite"
                value={formData.riskAppetite}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Risk Appetite</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Duration of Bank Account */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                DURATION OF THE INVESTMENT
              </label>
              <select
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Long">Long</option>
                <option value="Mid">Mid</option>
                <option value="Short">Short</option>
              </select>
            </div>

            {/* Digital Usage */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                DIGITAL USAGE
              </label>
              <select
                name="digitalUsage"
                value={formData.digitalUsage}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Own Land for Agriculture */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                OWN LAND FOR AGRICULTURE
              </label>
              <select
                name="ownLandForAgriculture"
                value={formData.ownLandForAgriculture}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Tax Payer */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                TAX PAYER
              </label>
              <select
                name="taxPayer"
                value={formData.taxPayer}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Number of Children */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                NUMBER OF CHILDREN
              </label>
              <input
                type="number"
                name="numberOfChildren"
                value={formData.numberOfChildren}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Number of Children"
              />
            </div>

            {/* Number of Girl Children under 10 */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                NUMBER OF GIRL CHILDREN UNDER 10
              </label>
              <input
                type="number"
                name="numberOfGirlChildrenUnder10"
                value={formData.numberOfGirlChildrenUnder10}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Number of Girl Children Under 10"
              />
            </div>

            {/* Credit Score */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                CREDIT SCORE
              </label>
              <input
                type="number"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                className="w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Credit Score"
              />
            </div>

            {/* Submit and Discard Buttons */}
            

          </form>
          <div className="flex border col-span-2 my-5   justify-between ">
              
              <button
                type="button"
                onClick={handleDiscard}
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
              >
                Discard
              </button>

              <button
                type="submit"
                onClick={() => {setIsOpen(true)}}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

        </div>
      </div>




      {/* <div className="w-[900px] h-96 bg-gray-300 rounded-2xl">
        <ul>
          {schemes.map((val, i) => (
            <li key={i}>{val}</li> // Properly render the list items
          ))}
        </ul>
      </div> */}


<div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "50%" }}
      >
        {/* Drawer Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Drawer Content</h2>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={()=> setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <p className="text-gray-600">
            This is the content of the drawer. You can put anything here.
          </p>
        </div>
      </div>





    </div>
  );
}



