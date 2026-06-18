import { Clock1, Globe2, HomeIcon, MapPinCheck, TagIcon } from "lucide-react";
import React from "react";

export default function Location({ timingData, scheme, areaType }) {
  const month = [scheme?.ruralAvailability];

  console.log("month = ", month);

  return (
    <div className="w-full h-full rounded-lg shadow-sm p-6 bg-white border border-border">
      <div className="flex gap-8">
        {/* Left Section: State, District, Sub-district, Pincode */}
        <div className="space-y-6 w-1/2">
          {/* State Section */}
          <div className="flex items-center space-x-3">
            <Globe2 className="h-5 w-5 text-[#1A2B4A]" />
            <p className="text-base font-semibold text-[#1A2B4A]">TamilNadu</p>
          </div>

          {/* District Section */}
          <div className="flex items-center space-x-3">
            <HomeIcon className="h-5 w-5 text-[#1A2B4A]" />
            <p className="text-sm text-foreground font-semibold">
              {timingData?.result?.district}
            </p>
          </div>

          {/* Sub-district Section */}
          <div className="flex items-center space-x-3">
            <MapPinCheck className="h-5 w-5 text-[#C8102E]" />
            <p className="text-sm text-[#C8102E] font-semibold">
              Sathyamangalam
            </p>
          </div>

          {/* Pincode Section */}
          <div className="flex items-center space-x-3">
            <TagIcon className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-semibold">638402</p>
          </div>
        </div>

        {/* Right Section: Time and Month */}
        <div className="w-1/2 text-foreground flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Clock1 className="h-5 w-5 text-[#1A2B4A]" />
            <div className="text-sm text-foreground font-semibold">
              <ul className="flex text-sm flex-col gap-1 p-0">
                {month.flat().map((mon, index) => (
                  <li key={index} className="list-none text-foreground">
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
