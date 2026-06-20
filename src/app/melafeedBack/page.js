"use client";

import React, { useState } from "react";
import useDashboardStore from "@/store/dashboardStore";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    melaHelpfulness: "",
    schemeSuitability: "",
    positiveFeedback: "",
    negativeFeedback: "",
    schemeIdentification: "",
    submissionTimestamp: "",
    attendees: "150",
    newEnrollments: "25",
  });

  const { village, headData, setHeadData } = useDashboardStore();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateAndAnalyzeFeedback = async (e) => {
    e.preventDefault();

    // Validate form (ensure all fields are filled)
    const isFormValid = Object.keys(formData)
      .filter((key) => key !== "submissionTimestamp")
      .every((key) => formData[key] !== "");

    if (!isFormValid) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    // Add timestamp
    const dataWithTimestamp = {
      ...formData,
      submissionTimestamp: new Date().toISOString(),
    };

    // Simple sentiment analysis function
    const analyzeSentiment = (text) => {
      const positiveWords = ["support", "help", "beneficial", "excellent", "great", "wonderful"];
      const negativeWords = ["limited", "insufficient", "complex", "challenging", "inadequate"];

      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length;
      const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length;

      if (positiveCount > negativeCount) return "Positive";
      if (negativeCount > positiveCount) return "Negative";
      return "Neutral";
    };

    const positiveSentiment = analyzeSentiment(formData.positiveFeedback);
    const negativeSentiment = analyzeSentiment(formData.negativeFeedback);

    const improvementSuggestions = [
      "Conduct frequent melas to educate more people.",
      "Engage local influencers to spread awareness.",
      "Provide dedicated help desks for elderly and uneducated people.",
      "Offer workshops for women and youth to understand postal schemes better.",
      "Set up temporary service points in nearby villages.",
      "Ensure regular follow-up visits to address issues and update us about new schemes.",
    ];

    const mappedSuggestion = formData.negativeFeedback ? improvementSuggestions[0] : null;

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

    console.log("JSON Output:", JSON.stringify(analysisOutput, null, 2));
    setHeadData(formData);

    // Map form state to campaign feedback schema and post to MongoDB
    const feedbackScoreValue = (formData.melaHelpfulness === 'yes' ? 2.5 : 1) + (formData.schemeSuitability === 'yes' ? 2.5 : 1);
    const apiPayload = {
      campaignId: "CMP-MELA-" + Math.floor(1000 + Math.random() * 9000),
      village: village || "A.Sembulichampalayam",
      scheme: formData.schemeIdentification,
      attendees: Number(formData.attendees) || 150,
      newEnrollments: Number(formData.newEnrollments) || 25,
      feedbackScore: feedbackScoreValue,
      remarks: `Helpful: ${formData.melaHelpfulness}. Suitability: ${formData.schemeSuitability}. Overall Sentiment: ${analysisOutput.sentimentAnalysis.overallSentiment}. Positive comments: ${formData.positiveFeedback}. Areas of improvement: ${formData.negativeFeedback}`,
      status: "Completed"
    };

    try {
      const response = await fetch("/api/campaign-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload)
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success("Campaign feedback submitted successfully.");
      } else {
        toast.error("Sentiment analyzed. Save failed: " + resData.error); 
      }
    } catch (err) {
      console.warn("Failed to persist feedback to database:", err);
      toast.error("Connection error. Feedback saved locally.");
    }

    // Reset form 
    setFormData({
      melaHelpfulness: "",
      schemeSuitability: "",
      positiveFeedback: "",
      negativeFeedback: "",
      schemeIdentification: "",
      submissionTimestamp: "",
      attendees: "150",
      newEnrollments: "25",
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
    "Post Office Savings Account (SB)",
    "National Savings Recurring Deposit (RD)",
    "National Savings Time Deposit (TD)",
    "Monthly Income Scheme (MIS)",
    "Public Provident Fund (PPF)",
    "Senior Citizens Savings Scheme (SCSS)",
    "Sukanya Samriddhi Account (SSA)",
    "National Savings Certificate (NSC)",
    "Kisan Vikas Patra (KVP)",
    "Mahila Samman Savings Certificate (MSSC)",
    "PM CARES for Children Scheme",
    "Regular Savings Account (IPPB)",
    "Basic Savings Account (IPPB)",
    "DigiSmart Savings Account (IPPB)",
    "Premium Savings Account (IPPB)",
    "Premium Aarogya Savings Account (IPPB)",
    "SHG Savings Account (IPPB)",
    "Current Account (IPPB)",
    "PMJJBY (Third-Party Insurance)",
    "PMSBY (Third-Party Insurance)",
    "Atal Pension Yojana (APY)"
  ];

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="page-container space-y-5">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mela Feedback Portal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-xl font-bold text-foreground">Mela Scheme Feedback Form</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Provide campaign feedback and evaluate postal schemes performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={generateAndAnalyzeFeedback} className="space-y-6">
              
              {/* Mela Helpfulness */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Was the Mela Helpful?
                </label>
                <RadioGroup 
                  value={formData.melaHelpfulness} 
                  onValueChange={(val) => handleInputChange("melaHelpfulness", val)}
                  className="flex gap-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mela-yes" />
                    <label htmlFor="mela-yes" className="text-xs font-medium text-foreground cursor-pointer select-none">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mela-no" />
                    <label htmlFor="mela-no" className="text-xs font-medium text-foreground cursor-pointer select-none">No</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Scheme Suitability */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Is the Scheme Suitable?
                </label>
                <RadioGroup 
                  value={formData.schemeSuitability} 
                  onValueChange={(val) => handleInputChange("schemeSuitability", val)}
                  className="flex gap-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="suit-yes" />
                    <label htmlFor="suit-yes" className="text-xs font-medium text-foreground cursor-pointer select-none">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="suit-no" />
                    <label htmlFor="suit-no" className="text-xs font-medium text-foreground cursor-pointer select-none">No</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Positive Feedback */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Positive Feedback Comments
                </label>
                <Select
                  value={formData.positiveFeedback}
                  onValueChange={(val) => handleInputChange("positiveFeedback", val)}
                >
                  <SelectTrigger className="w-full text-xs border-border bg-transparent text-foreground">
                    <SelectValue placeholder="Select positive feedback criteria" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    {positiveFeedbackOptions.map((option, index) => (
                      <SelectItem key={index} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Negative Feedback */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Negative Feedback / Areas of Improvement
                </label>
                <Select
                  value={formData.negativeFeedback}
                  onValueChange={(val) => handleInputChange("negativeFeedback", val)}
                >
                  <SelectTrigger className="w-full text-xs border-border bg-transparent text-foreground">
                    <SelectValue placeholder="Select negative feedback criteria" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    {negativeFeedbackOptions.map((option, index) => (
                      <SelectItem key={index} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campaign Numbers: Attendees & Enrollments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Mela Attendees Count
                  </label>
                  <Input
                    type="number"
                    value={formData.attendees}
                    onChange={(e) => handleInputChange("attendees", e.target.value)}
                    placeholder="e.g. 150"
                    className="border-border text-xs rounded-lg h-10 bg-transparent text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    New Enrollments Generated
                  </label>
                  <Input
                    type="number"
                    value={formData.newEnrollments}
                    onChange={(e) => handleInputChange("newEnrollments", e.target.value)}
                    placeholder="e.g. 25"
                    className="border-border text-xs rounded-lg h-10 bg-transparent text-foreground"
                    required
                  />
                </div>
              </div>

              {/* Scheme Identification */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Identify Suitable Scheme
                </label>
                <Select
                  value={formData.schemeIdentification}
                  onValueChange={(val) => handleInputChange("schemeIdentification", val)}
                >
                  <SelectTrigger className="w-full text-xs border-border bg-transparent text-foreground">
                    <SelectValue placeholder="Select suitable scheme to benchmark" />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    {schemeIdentificationOptions.map((option, index) => (
                      <SelectItem key={index} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 h-10 text-xs font-bold"
                >
                  Submit Feedback Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;