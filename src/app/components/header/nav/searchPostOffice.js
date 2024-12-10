// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { debounce } from "lodash";
// import useDashboardStore from "@/store/dashboardStore";

// const SearchPostOffice = () => {
//   // State management
//   const [searchTerm, setSearchTerm] = useState("");
//   const [PostOffice, setPostOffice] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const {
//     District,
//     setPostoffice,
//     subpostoffice,
//     setVillage,
//     setActiveTab,
//     setSubpostoffice,
//   } = useDashboardStore();

//   // Sample data for Erode (Sathiyamangalam)
//   const sathiyamangalamData = [
//     {
//       "Post Office": "Araipalayam BO",
//       "Pin Code": "638401",
//       Phone: "04256-260238",
//     },
//     {
//       "Post Office": "Bannari BO",
//       "Pin Code": "638401",
//       Phone: "04256-233035",
//     },
//     {
//       "Post Office": "Chikkarasampalayam BO",
//       "Pin Code": "638401",
//       Phone: "0424-259111",
//     },
//     {
//       "Post Office": "Dhimbam BO",
//       "Pin Code": "638401",
//       Phone: "04285-241028",
//     },
//     {
//       "Post Office": "Germalam BO",
//       "Pin Code": "638401",
//       Phone: "0424-2500280",
//     },
//     {
//       "Post Office": "Hassanur BO",
//       "Pin Code": "638401",
//       Phone: "04285-267432",
//     },
//     {
//       "Post Office": "Ikkarainegamam BO",
//       "Pin Code": "638401",
//       Phone: "04294-220530",
//     },
//     {
//       "Post Office": "Komarapalayam-sathy BO",
//       "Pin Code": "638401",
//       Phone: "04295-2220208",
//     },
//     {
//       "Post Office": "Kottuveerampalayam BO",
//       "Pin Code": "638401",
//       Phone: "04295-245521",
//     },
//     {
//       "Post Office": "Puduvadavalli BO",
//       "Pin Code": "638401",
//       Phone: "04256-260238",
//     },
//     {
//       "Post Office": "Sathy Bazaar SO",
//       "Pin Code": "638401",
//       Phone: "04256-233035",
//     },
//     {
//       "Post Office": "Sathiyamangalam SO",
//       "Pin Code": "638401",
//       Phone: "0424-259111",
//     },
//     {
//       "Post Office": "Thingalur BO",
//       "Pin Code": "638401",
//       Phone: "04285-241028",
//     },
//     {
//       "Post Office": "Varadampalayam BO",
//       "Pin Code": "638401",
//       Phone: "0424-2500280",
//     },
//   ];

//   // Sample data for random post offices
//   const randomPostOffices = [
//     {
//       "Post Office": "Sample Post Office 1",
//       "Pin Code": "123456",
//       Phone: "12345-67890",
//     },
//     {
//       "Post Office": "Sample Post Office 2",
//       "Pin Code": "654321",
//       Phone: "98765-43210",
//     },
//   ];

//   // Function to fetch PostOffice or post offices based on the district
//   const fetchVillages = async () => {
//     setLoading(true);

//     try {
//       if (subpostoffice === "Sathiyamangalam S.O") {
//         setPostOffice(sathiyamangalamData); // Use the data for Sathiyamangalam
//       } else {
//         setPostOffice(randomPostOffices); // Use random data if district is not Sathiyamangalam
//       }
//     } catch (error) {
//       console.error("Error fetching PostOffice:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle input change and search
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     debouncedSearch(value);
//   };

//   const debouncedSearch = useCallback(
//     debounce((query) => {
//       if (query.trim()) {
//         // Filter PostOffice based on search query
//         setPostOffice((prevPostOffices) =>
//           prevPostOffices.filter((postOffice) =>
//             postOffice["Post Office"]
//               .toLowerCase()
//               .includes(query.toLowerCase())
//           )
//         );
//       } else {
//         fetchVillages(); // Fetch the list again if search is cleared
//       }
//     }, 300),
//     []
//   );

//   // Handle selecting a post office
//   const handleClick = (postOffice) => {
//     setPostoffice(postOffice["Post Office"]);
//     setVillage("");
//     setActiveTab("village");
//   };

//   useEffect(() => {
//     if (District) {
//       fetchVillages();
//     }
//   }, [District]);

//   return (
//     <div
//       onClick={(e) => e.stopPropagation()}
//       className="absolute top-full right--1/3 w-96 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10"
//     >
//       {/* Search Input */}
//       <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={handleInputChange}
//           className="flex-grow outline-none bg-transparent text-sm"
//           placeholder="Search for a post office"
//         />
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="h-5 w-5 text-gray-500"
//         >
//           <path
//             fillRule="evenodd"
//             d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </label>

//       {/* Scrollable List */}
//       <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-3">
//         {loading ? (
//           <div className="text-center py-2 text-gray-500">Loading...</div>
//         ) : PostOffice.length > 0 ? (
//           PostOffice.map((postOffice, index) => (
//             <div
//               key={index}
//               onClick={() => handleClick(postOffice)}
//               className="text-center py-2 px-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
//             >
//               <p className="text-sm font-medium text-gray-700">
//                 {postOffice["Post Office"]}{" "}
//                 <span className="text-gray-500 ml-1">
//                   ({postOffice["Pin Code"]})
//                 </span>
//               </p>
//               <p className="text-xs text-gray-500">{postOffice["Phone"]}</p>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-2 text-gray-500">
//             No post offices found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPostOffice;




"use client";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useDashboardStore from "@/store/dashboardStore";
import axios from 'axios'; // Make sure to install axios: npm install axios


const SearchPostOffice = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [PostOffice, setPostOffice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    District,
    setPostoffice,
    subpostoffice,
    setVillage,
    setActiveTab,
    setSubpostoffice,
  } = useDashboardStore();


  // Function to fetch PostOffice based on pincode
  const fetchPostOffices = async (pincode = null) => {
    setLoading(true);
    setError(null);

    try {
      // If no specific pincode is provided, use a default or derive from subpostoffice
      const searchPincode = subpostoffice ? subpostoffice.pincode : pincode; 

      const response = await axios.get(`https://api.postalpincode.in/pincode/${searchPincode}`);
      
      if (response.data[0]?.Status === "Success") {
        const postOffices = response.data[0].PostOffice || [];
        
        // Transform API data to match existing component structure
        const transformedPostOffices = postOffices.map(office => ({
          "Post Office": office.Name,
          "Pin Code": office.Pincode,
          "Phone": "N/A", // API doesn't provide phone numbers
          "District": office.District,
          "State": office.State
        }));

        setPostOffice(transformedPostOffices);
      } else {
        setError("No post offices found");
        setPostOffice([]);
      }
    } catch (error) {
      console.error("Error fetching post offices:", error);
      setError("Failed to fetch post offices");
      setPostOffice([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        // Filter PostOffice based on search query
        setPostOffice((prevPostOffices) =>
          prevPostOffices.filter((postOffice) =>
            postOffice["Post Office"]
              .toLowerCase()
              .includes(query.toLowerCase())
          )
        );
      } else {
        fetchPostOffices(); // Fetch the list again if search is cleared
      }
    }, 300),
    []
  );

  // Handle selecting a post office
  const handleClick = (postOffice) => {
    setPostoffice(postOffice["Post Office"]);
    setVillage("");
    setActiveTab("village");
  };

  useEffect(() => {
    if (District || subpostoffice) {
      fetchPostOffices();
    }
  }, [District, subpostoffice]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full right--1/3 w-96 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10"
    >
      {/* Search Input */}
      <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-grow outline-none bg-transparent text-sm"
          placeholder="Search for a post office"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-5 w-5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      {/* Error Handling */}
      {error && (
        <div className="text-center text-red-500 py-2 mt-2">
          {error}
        </div>
      )}

      {/* Scrollable List */}
      <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-center py-2 text-gray-500">Loading...</div>
        ) : PostOffice.length > 0 ? (
          PostOffice.map((postOffice, index) => (
            <div
              key={index}
              onClick={() => handleClick(postOffice)}
              className="text-center py-2 px-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-700">
                {postOffice["Post Office"]}{" "}
                <span className="text-gray-500 ml-1">
                  ({postOffice["Pin Code"]})
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {postOffice["District"]}, {postOffice["State"]}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-gray-500">
            No post offices found
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPostOffice;