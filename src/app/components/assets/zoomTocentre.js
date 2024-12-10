import { useMap } from "react-leaflet";
import { ScanSearch } from "lucide-react";
const ZoomToCenterButton = ({ center, zoom }) => {
    const map = useMap();
  
    const zoomToCenter = () => {
      map.setView(center, zoom);
    };
  
    return (
      <div
        style={{ zIndex: 1000 }}
        className="absolute top-2 left-4 tooltip tooltip-right tooltip-info shadow-lg rounded-full z-50"
        data-tip="Centre map"
      >
        <button
          onClick={zoomToCenter}
          className=" rounded-full  bg-blue-600 text-white  p-2  shadow-md z-[1000] hover:bg-blue-700"
        >
          <ScanSearch />
        </button>
      </div>
    );
  };
  
  export default ZoomToCenterButton;