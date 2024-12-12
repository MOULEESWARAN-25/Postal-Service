"use client";
import useDashboardStore from "@/store/dashboardStore";
import React, { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    melaHelpfulness: "",
    schemeSuitability: "",
    positiveFeedback: "",
    negativeFeedback: "",
    schemeIdentification: "",
    submissionTimestamp: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const{headData,setHeadData}=useDashboardStore();
const handleclick=()=>{
  console.log(formData);
  setHeadData(formData)
}

  const generateAndAnalyzeFeedback = (e) => {
    e.preventDefault();

    // Validate form (ensure all fields are filled)
    const isFormValid = Object.keys(formData)
      .filter((key) => key !== "submissionTimestamp")
      .every((key) => formData[key] !== "");

    if (!isFormValid) {
      setErrorMessage("Please fill out all fields before submitting.");
      return;
    }

    // Add timestamp
    const dataWithTimestamp = {
      ...formData,
      submissionTimestamp: new Date().toISOString(),
    };

    // Simple sentiment analysis function
    const analyzeSentiment = (text) => {
      const positiveWords = [
        "support",
        "help",
        "beneficial",
        "excellent",
        "great",
        "wonderful",
      ];
      const negativeWords = [
        "limited",
        "insufficient",
        "complex",
        "challenging",
        "inadequate",
      ];

      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter((word) =>
        lowerText.includes(word)
      ).length;
      const negativeCount = negativeWords.filter((word) =>
        lowerText.includes(word)
      ).length;

      if (positiveCount > negativeCount) return "Positive";
      if (negativeCount > positiveCount) return "Negative";
      return "Neutral";
    };

    // Perform sentiment analysis
    const positiveSentiment = analyzeSentiment(formData.positiveFeedback);
    const negativeSentiment = analyzeSentiment(formData.negativeFeedback);

    // Suggestions for improvement
    const improvementSuggestions = [
      "Conduct frequent melas to educate more people.",
      "Engage local influencers to spread awareness.",
      "Provide dedicated help desks for elderly and uneducated people.",
      "Offer workshops for women and youth to understand postal schemes better.",
      "Set up temporary service points in nearby villages.",
      "Ensure regular follow-up visits to address issues and update us about new schemes.",
    ];

    // Map one suggestion to negative feedback
    const mappedSuggestion = formData.negativeFeedback
      ? improvementSuggestions[0]
      : null;

    // Create comprehensive analysis result
    const analysisOutput = {
      ...dataWithTimestamp,
      sentimentAnalysis: {
        positiveFeedback: {
          text: formData.positiveFeedback,
          sentiment: positiveSentiment,
        },
        negativeFeedback: {
          text: formData.negativeFeedback,
          sentiment: negativeSentiment,
          suggestion: mappedSuggestion,
        },
        overallSentiment:
          positiveSentiment === "Positive"
            ? "Positive"
            : negativeSentiment === "Positive"
            ? "Negative"
            : "Neutral",
      },
    };

    // Convert analysis result to JSON
    const jsonString = JSON.stringify(analysisOutput, null, 2);
    console.log("JSON Output:", jsonString); // Log JSON output to console
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // Reset form 
    setFormData({
      melaHelpfulness: "",
      schemeSuitability: "",
      positiveFeedback: "",
      negativeFeedback: "",
      schemeIdentification: "",
      submissionTimestamp: "",
    });
  };

  const positiveFeedbackOptions = [
    "The scheme provides exceptional support",
    "Clear and comprehensive guidance was offered",
    "Extremely beneficial and well-structured approach",
    "Remarkable assistance that exceeded expectations",
    "Highly informative and user-friendly process",
  ];

  const negativeFeedbackOptions = [
    "Melas did not reach all target groups effectively.",
    "Influencers did not accurately communicate necessary information.",
    "Help desks did not provide adequate assistance or accessibility.",
    "Workshops did not include other important groups.",
    "Temporary service points did not offer consistent support.",
    "Follow-up visits did not reach everyone or were not sustainable.",
  ];

  const schemeIdentificationOptions = [
    "Post Office Savings Account(POSA)",
    "Recurring Deposit (RD)",
    "Time Deposit (TD)",
    "Public Provident Fund (PPF)",
    "National Savings Certificate (NSC)",
    "Kisan Vikas Patra (KVP)",
    "Sukanya Samriddhi Yojana (SSY)",
    "Senior Citizen Savings Scheme (SCSS)",
    "Atal Pension Yojana (APY)",
    "Postal Life Insurance (PLI)",
    "Rural Postal Life Insurance (RPLI)",
    "Mahila Samman Savings Certificate (MSSC)",
    "Kisan Credit Card (KCC)",
    "Fixed Deposit(FD)",
    "Monthly Income Account (MIS)",
  ];

  return (
    <div className="w-full flex justify-center items-center  h-full max-w-md mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-black text-center">
          Mela Scheme Feedback Form
        </h2>

        {errorMessage && (
          <div
            className={`
            p-4 rounded-md text-center mb-4
            ${
              errorMessage.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={generateAndAnalyzeFeedback} className="space-y-6">
          {/* Mela Helpfulness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Was the Mela Helpful?
            </label>
            <div className="flex space-x-4">
              {["Yes", "No"].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="melaHelpfulness"
                    value={option.toLowerCase()}
                    checked={
                      formData.melaHelpfulness === option.toLowerCase()
                    }
                    onChange={() =>
                      handleInputChange(
                        "melaHelpfulness",
                        option.toLowerCase()
                      )
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Scheme Suitability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Is the Scheme Suitable?
            </label>
            <div className="flex space-x-4">
              {["Yes", "No"].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="schemeSuitability"
                    value={option.toLowerCase()}
                    checked={
                      formData.schemeSuitability === option.toLowerCase()
                    }
                    onChange={() =>
                      handleInputChange(
                        "schemeSuitability",
                        option.toLowerCase()
                      )
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Positive Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Positive Feedback
            </label>
            <select
              value={formData.positiveFeedback}
              onChange={(e) =>
                handleInputChange("positiveFeedback", e.target.value)
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-black"
            >
              <option value="">Select Positive Feedback</option>
              {positiveFeedbackOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Negative Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negative Feedback
            </label>
            <select
              value={formData.negativeFeedback}
              onChange={(e) =>
                handleInputChange("negativeFeedback", e.target.value)
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-black"
            >
              <option value="">Select Negative Feedback</option>
              {negativeFeedbackOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Scheme Identification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Identify Suitable Scheme
            </label>
            <select
              value={formData.schemeIdentification}
              onChange={(e) =>
                handleInputChange("schemeIdentification", e.target.value)
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-black"
            >
              <option value="">Select Suitable Scheme</option>
              {schemeIdentificationOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"

              onClick={handleclick}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;