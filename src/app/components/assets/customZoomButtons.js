import { useMap } from "react-leaflet";
import { Plus, Minus } from "lucide-react";
const CustomZoombuttons = () => {
    const map = useMap();
    const zoomIn = () => {
      map.setZoom(map.getZoom() + 1);
    };
    const zoomOut = () => {
      map.setZoom(map.getZoom() - 1);
    };
  
    return (
      <div
        style={{
          position: "absolute",
          gap: "10px",
          backgroundColor: "white",
          borderRadius: "10px",
          // bottom: "15%",
          bottom: "105px",
          display: "flex",
          left: "20px",
          zIndex: 1000,
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
        }}
      >
        <button
          onClick={zoomIn}
          className="bg-white rounded-none px-1 text-blue-600 shadow-2xl p-1 flex rounded-l-lg items-center justify-center"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white px-1 text-blue-600 rounded-none shadow-2xl p-1  flex items-center rounded-r-lg justify-center"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    );
  };

  export default CustomZoombuttons