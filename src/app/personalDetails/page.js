"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Smartphone,
  MapPin,
  Users,
  UserPlus,
  DollarSign,
  Target,
  Briefcase,
  Compass,
  Pickaxe,
  IndianRupee,
  Banknote,
  ChevronLeft,
} from "lucide-react";
import CreditScore from "../components/Charts/CreditScore";
import { useRouter } from 'next/navigation'
import useDashboardStore from "@/store/dashboardStore";

export default function PersonDashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const{individualProfile}= useDashboardStore();
  // Use the provided JSON data directly
  console.log("individualProfile",individualProfile);
  const user = individualProfile;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const schemeBenefits = [
    {
      name: "Kisan Credit Card (KCC)",
      benefits: [
        "Interest rate varies between 7% to 9% (as of 2024), depending on the loan type and repayment",
        "Government-backed, designed for farmers and agriculturalists",
        "Linked to the crop cycle, usually 1 year",
        "Loans can be rolled over and repayment is based on crop harvest",
      ],
    },
    {
      name: "Sukanya Samriddhi Yojana (SSA)",
      benefits: [
        "Earns 8.2% annual interest, compounded yearly",
        "Government-backed scheme for the financial security of a girl child",
        "Fixed for 15 years, or until marriage after age 18",
        "Withdraw up to 50% for education after 18 years; premature closure allowed under specific circumstances",
      ],
    },
    {
      name: "National Savings Certificate (NSC)",
      benefits: [
        "Provides 7.7% annual interest, compounded annually and paid at maturity",
        "Fully backed by the government, offering secure returns",
        "Fixed for 5 years",
        "Can be closed only in cases of death, legal orders, or specific circumstances",
      ],
    },
    {
      name: "Kisan Vikas Patra (KVP)",
      benefits: [
        "Earns 7.5% annual interest, compounded annually, and doubles your money in 115 months",
        "Government-backed investment, offering reliable returns",
        "Matures in 115 months (approximately 9 years and 7 months)",
        "Premature closure allowed after 2 years and 6 months, or under specific conditions",
      ],
    },
    {
      name: "Mahila Samman Savings Certificate",
      benefits: [
        "Offers 7.5% quarterly-compounded interest, paid at maturity",
        "Government-backed, focused on women’s savings",
        "Fixed for 2 years",
        "Allows withdrawal of up to 40% after 1 year; premature closure with reduced interest after 6 months",
      ],
    },
    {
      name: "Post Office Savings Account (POSA)",
      benefits: [
        "Earns 4.0% annual interest, credited to your account",
        "Fully government-backed with safe and accessible savings",
        "No fixed period, account stays active indefinitely",
        "Withdraw anytime without restrictions",
      ],
    },
    {
      name: "Senior Citizen Savings Scheme (SCSS)",
      benefits: [
        "Offers 8.2% quarterly interest payouts",
        "Designed for senior citizens, fully government-backed",
        "Fixed for 5 years, extendable by 3 years",
        "Premature closure allowed after 1 year (with penalty); after 2 years, reduced penalty",
      ],
    },
    {
      name: "Public Provident Fund (PPF)",
      benefits: [
        "Earns 7.1% annual interest, compounded yearly",
        "Government-backed, long-term tax-free savings",
        "15 years, extendable in blocks of 5 years",
        "Partial withdrawal allowed after 6 years; premature closure after 5 years for specific reasons",
      ],
    },
    {
      name: "Recurring Deposit Scheme (RD)",
      benefits: [
        "Provides 6.7% interest, compounded quarterly",
        "Safe and secure government-backed investment",
        "Fixed for 5 years with monthly contributions",
        "No premature withdrawals, but loans are available against the deposit",
      ],
    },
    {
      name: "Time Deposits",
      benefits: [
        "Rates vary from 6.9% to 7.5% depending on the tenure, compounded quarterly",
        "Government-backed, safe investment for various durations",
        "Choose from 1, 2, 3, or 5 years",
        "Premature closure allowed after 6 months with reduced interest rates",
      ],
    },
    {
      name: "Monthly Income Account (MIS)",
      benefits: [
        "Earns 7.4% monthly interest, paid directly to your account",
        "Safe, government-backed account providing stable income",
        "Fixed for 5 years",
        "Premature closure allowed after 1 year with a penalty",
      ],
    },
    {
      name: "Postal Life Insurance (PLI)",
      benefits: [
        "Loans can be availed after a certain number of years at 10% per annum (semi-annual calculation)",
        "Provides life insurance with various policy types (whole life, endowment, etc.)",
        "Depends on the policy type",
        "Loans, policy surrender, or beneficiary changes are possible based on the policy terms",
      ],
    },
    {
      name: "Rural Postal Life Insurance (RPLI)",
      benefits: [
        "Premiums accumulate on endowment policies; no fixed interest rate stated",
        "Life insurance with various plans (whole life, endowment, etc.) for rural individuals",
        "Varies by plan (e.g., 15 years for endowment policies)",
        "Loans against policies; no premature withdrawal, but policy can be surrendered",
      ],
    },
    {
      name: "Fixed Deposit (FD)",
      benefits: [
        "Interest: Offers 3.50%–7.25% (general) and 4.00%–7.75% (seniors). Tax-saving FD: 6.50%–7.50%.",
        "Security: Safe investment with DICGC insurance up to ₹5 lakh.",
        "Savings Period: Flexible tenure from 7 days to 10 years.",
        "Liquidity: Premature withdrawals allowed with penalty; loans available against FDs.",
      ],
    },{
      name: "Atal Pension Yojana (APY)",
      benefits: [
        
      ],
    }
  ];



  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-screen h-screen overflow-x-hidden bg-[#f2f7fb] overflow-y-scroll"
    >
      <motion.div variants={itemVariants} className="p-6 h-fit m-0 w-screen">
        <motion.h2
          variants={itemVariants}
          className="font-semibold flex gap-5 items-center text-2xl text-gray-700"
        >
          <ChevronLeft onClick={() => router.back()} className="cursor-pointer" />
          Personal Information
        </motion.h2>

        <hr className="my-2 border-[1.5px] border-gray-200" />

        <div className="flex flex-row space-x-4">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white shadow-md rounded-lg w-full my-2 p-6 text-justify h-full"
          >
            <h3 className="text-gray-700 text-xl mb-4 font-semibold">
              Profile Summary
            </h3>
            <p className="text-gray-600 text-lg pb-2">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-gray-600 text-lg pb-2">
              <strong>Age:</strong> {user.age}
            </p>
            <p className="text-gray-600 text-lg pb-2">
              <strong>Phone Number:</strong>{" "}
              <a href={`tel:${user.phoneNumber}`} className="text-gray-600">
                {user.phoneNumber}
              </a>
            </p>
            <p className="text-gray-600 text-lg pb-2">
              <strong>Address:</strong> {user.address}
            </p>
            <p className="text-gray-600 text-lg pb-2">
              <strong>Education Level:</strong> {user.educationLevel}
            </p>
          </motion.div>

          <div className="flex flex-col justify-between">
            {[
              {
                icon: Heart,
                label: "Marital Status",
                value: user.maritalStatus,
              },
              { icon: Briefcase, label: "Occupation", value: user.occupation },
              { icon: MapPin, label: "Area Name", value: user.area },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white shadow-md rounded-lg w-[335px] min-h-[80px] my-2 p-4 flex items-center h-full"
              >
                <item.icon className="text-blue-700 h-7 w-7 mr-4" />
                <p className="text-gray-600 text-lg">
                  <strong>{item.label}:</strong> {item.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col justify-between">
            {[
              {
                title: "Family Details",
                details: [
                  {
                    icon: Users,
                    label: "Number of Children",
                    value: user.numberOfChildren,
                  },
                  {
                    icon: UserPlus,
                    label: "Number of Girl Children",
                    value: user.numberOfGirlChildrenUnder10,
                  },
                ],
              },
              {
                icon: Compass,
                label: "Location",
                value: user.location,
              },
            ].map((section, index) =>
              section.details ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white shadow-md rounded-lg w-[335px] m-h-[200px] h-full my-2 p-4"
                >
                  <h3 className="text-gray-700 font-semibold text-lg mb-2 pb-3">
                    {section.title}
                  </h3>
                  <div className="flex flex-col space-y-4">
                    {section.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <detail.icon className="text-blue-700 h-7 w-7" />
                        <p className="text-gray-600 text-lg">
                          <strong>{detail.label}:</strong> {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white shadow-md rounded-lg w-[335px] min-h-[80px] h-full my-2 p-4 flex items-center"
                >
                  <section.icon className="text-blue-700 h-7 w-7" />
                  <p className="text-gray-600 text-lg items-center break-all">
                    <strong className="ml-2">{section.label}:</strong>
                    <span className="ml-2 text-sm">{section.value}</span>
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>

     

      {/* Loan and Other Data */}
      <motion.div variants={itemVariants} className="px-6 h-fit w-full">
        <div className="flex justify-between gap-2">
          {/* Loan Details */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col w-full"
          >
            <h2 className="font-semibold text-2xl text-gray-700">
              Loan Details
            </h2>
            <hr className="my-2 border-[1.5px] border-gray-200" />
            <div className="bg-white shadow-md rounded-lg w-full min-h-[80px] my-2 p-4 h-full">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <strong className="text-gray-600">Already in Loan:</strong>
                  <span className="text-gray-600">{user.alreadyInLoan}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <strong className="text-gray-600">Need New Loan:</strong>
                  <span className="text-gray-600">{user.needNewLoan}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <strong className="text-gray-600">
                    Need Education Loan:
                  </strong>
                  <span className="text-gray-600">{user.needEducationLoan}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post Office Details */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col"
          >
            <h2 className="font-semibold text-2xl text-gray-700">
              Post Office Details
            </h2>
            <hr className="my-2 border-[1.5px] border-gray-200" />
            <div className="bg-white shadow-md rounded-lg w-[355px] min-h-[80px] h-full my-2 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <strong className="text-gray-600">Location:</strong>
                  <span className="text-gray-600">{user.location}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-600">Area:</strong>
                  <span className="text-gray-600">{user.area}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scheme Recommendations */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.002 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col"
          >
            <h2 className="font-semibold text-2xl text-gray-700">
              Scheme Recommendation
            </h2>
            <hr className="my-2 border-[1.5px] border-gray-200" />
            <div className="bg-white shadow-md rounded-lg w-[630px] min-h-[80px] h-full my-2 p-4">
              <div className="space-y-1">
                {user.recommendedSchemes.map((scheme, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 font-medium pb-2">
                      {scheme}
                    </span>
                    <button className="text-blue-700 hover:underline bg-white">
                      Details
                    </button>
                  </motion.div>
                ))}
              </div>
                <div className="flex justify-center">

              <button
                className="py-1 px-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                onClick={() => setShowPopup(!showPopup)}
              >
                Compare
              </button>
                </div>
            



            </div>
          </motion.div>
        </div>
      </motion.div>


      {showPopup && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60"
    onClick={() => setShowPopup(false)}
  >
    <motion.div
      className="bg-white rounded-lg shadow-xl p-6 max-w-4xl space-y-6 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">Recommended Schemes</h2>
        <p className="text-sm text-gray-600">Based on your profile, here are the schemes that suit you best:</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {user.recommendedSchemes.map((scheme, index) => (
          <div
            key={index}
            className="relative group rounded-xl border border-gray-200 bg-gray-50 shadow-md hover:shadow-lg p-5 transition-transform hover:scale-105"
          >
            <h5 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              {scheme}
            </h5>
            <ul className="list-disc text-sm text-gray-600 leading-relaxed pl-6">
              {(schemeBenefits.find((item) => item.name === scheme)?.benefits || []).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowPopup(false)}
        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Close
      </button>
    </motion.div>
  </div>
)}


    </motion.div>
  );
}
