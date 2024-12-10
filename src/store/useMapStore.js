// src/store/useMapStore.js
import { create } from "zustand";

const useMapStore = create((set) => ({
  mapState: {
    selectedState: null,
    geoData: null,
    selectedDistrict: null,
    selectedPosition: null,
    selectedSubdistrict: null,
    districtGeoJSON: null,
    subdistrictGeoJSON: null,
    districtPostalsGeoJSON: null,
    selectedPostalDetails: null,
    searchPosition: null,
    // searchDetails: null,
    searchDetails: {
      name: 'Poovali',
      district: 'Sivaganga',
      position: {
        lat: 9.7903694,
        lng: 78.53769059999999
      },
      state: 'Tamil Nadu'
    }
    ,
    activeMapTile: "",
    activeIndex: null,
    history: [],
    isPopupOpen: false,
    activeTab: 1,
    postOfficeCoordinates:[]
  },
  setMapState: (newState) =>
    set((state) => ({ mapState: { ...state.mapState, ...newState } })),
}));

export default useMapStore;



// src/store/useMapStore.js
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useMapStore = create(
//   persist(
//     (set) => ({
//       mapState: {
//         selectedState: null,
//         geoData: null,
//         selectedDistrict: null,
//         selectedPosition: null,
//         selectedSubdistrict: null,
//         districtGeoJSON: null,
//         subdistrictGeoJSON: null,
//         districtPostalsGeoJSON: null,
//         selectedPostalDetails: null,
//         searchPosition: null,
//         searchDetails: null,
//         activeMapTile: "",
//         activeIndex: null,
//         history: [],
//       },
//       setMapState: (newState) =>
//         set((state) => ({ mapState: { ...state.mapState, ...newState } })),
//     }),
//     {
//       name: "map-storage", // Name of the key in localStorage
//       getStorage: () => localStorage, // Use localStorage to persist the state
//     }
//   )
// );

// export default useMapStore;



