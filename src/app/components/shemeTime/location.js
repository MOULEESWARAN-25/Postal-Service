import { Clock1, Globe2, HomeIcon, MapPinCheck, TagIcon } from "lucide-react";
import React, { useState } from "react";

export default function Location({ timingData, scheme, areaType }) {
  // console.log("scheme = ",scheme);
  // const [month, setMonth] = useState([scheme?.ruralAvailability]);
  // const month = [
  //   areaType === "Rural"
  //     ? scheme?.ruralAvailability
  //     : scheme?.urbanAvailability,
  // ];

  const month = [scheme?.ruralAvailability]

  console.log("month = ", month);

  return (
    <div className="w-full h-full  rounded-lg shadow-lg p-8 bg-white">
      <div className="flex gap-8">
        {/* Left Section: State, District, Sub-district, Pincode */}
        <div className="space-y-8 w-1/2">
          {/* State Section */}
          <div className="flex items-center space-x-4">
            <Globe2 className="h-8 w-8 text-purple-800" />
            <p className="text-2xl text-purple-800 font-semibold">TamilNadu</p>
          </div>

          {/* District Section */}
          <div className="flex items-center space-x-4">
            <HomeIcon className="h-8 w-8 text-black" />
            <p className="text-xl text-black font-semibold">
              {timingData?.result?.district}
            </p>
          </div>

          {/* Sub-district Section */}
          <div className="flex items-center space-x-4">
            <MapPinCheck className="h-8 w-8 text-orange-600" />
            <p className="text-xl text-orange-600 font-semibold">
              Sathyamangalam
            </p>
          </div>

          {/* Pincode Section */}
          <div className="flex items-center space-x-4">
            <TagIcon className="h-8 w-8 text-gray-600" />
            <p className="text-xl text-gray-600 font-semibold">638402</p>
          </div>
        </div>

        {/* Right Section: Time and Month */}
        <div className="w-1/2 text-black flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Clock1 className="h-6 w-6 text-blue-600" />
            <div className="text-xl text-black font-semibold">
              <ul className="flex text-[17px] flex-col gap-1 p-0">
                {month.flat().map((mon, index) => (
                  <li key={index} className="list-none text-black">
                    {"\u2022"} {mon}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
