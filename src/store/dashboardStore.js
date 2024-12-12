import { create } from "zustand";

const useDashboardStore = create((set) => ({
  demographicData: null,
  totalDemographicData: null,
  State: null,
  District: null,
  village: null,

  subpostoffice: null,
  postoffice: null,
  activeTab: "",
  loading: false,

  individualProfile: null,

  headData: null,
  setHeadData: (data) => set({ headData: data }),

  sathyBranchOffices:{
    Araipalayam: [
      "Arasur",
      "Ayyampalayam",
      "Baguthampalayam",
      "Byannapuram",
      "Chikkahajanur",
      "Chikkarasampalayam",
      "Dasaripalayam",
      "Dhoddahajanur",
    ],
    Bannari: [
      "Rajan Nagar",
      "Pudupeerkadavu",
      "Bhavanisagar",
      "Pungar",
      "Dhoddampalayam",
      "Kothamangalam",
      "Akkaraithathappalli",
    ],
    Chikkarasampalayam: [
      "Chikkarasampalayam",
      "Ikkarainegamam",
      "Ikkaraithathappalli",
      "Vinnappalli",
      "Periyakallipatti",
      "Sunkakaranpalayam",
    ],
    Dhimbam: [
      "Erahanahalli",
      "Gettavadi",
      "Dhoddamudukkarai",
      "Kongahalli",
      "Talamalai",
    ],
    Germalam: [
      "Boosaripalayam",
      "Ikkarainegamam",
      "Ikkaraithathappalli",
      "Indiampalayam",
      "Madahalli",
      "Madampalayam",
      "Makkinancombai",
      "Malayadipudur",
      "Shenbagapudur",
    ],
    Hassanur: [
      "Marur",
      "Neithalapuram",
      "Thiginarai",
      "Gundri",
      "Guthiyalathur",
      "Guthiyalathur extension RF",
      "Guthiyalathur addition RF",
      "Akkurinjieri RF",
      "Akkurinjieri Extn RF",
      "Barabetta RF",
      "Velamundi RF",
    ],
    Ikkarainegamam: [
      "Ikkarainegamam",
      "Ikkaraithathappalli",
      "Kurumbapalayam",
      "Vinnappalli",
      "Periyakallipatti",
      "Sunkakaranpalayam",
    ],
    Komarapalayam: [
      "Komarapalayam",
      "Konamoolai",
      "Koothampalayam",
      "Kothamangalam",
    ],
    Kottuveerampalayam: [
      "Pudupeerkadavu",
      "Rajan Nagar",
      "Bhavani Sagar",
      "Pungar",
      "Dhoddampalayam",
      "Kothamangalam",
    ],
    Puduvadavalli: [
      "Talavadi",
      "Talamalai",
      "Talamalai Extn. RF",
      "Talamalai R.F.",
    ],
    Thingalur: [
      "Thingalur",
      "Thoppampalayam",
      "Talamalai",
      "Thiginarai",
      "Ukkaram",
    ],
    Varadampalayam: ["Alathucombai", "Mallankuli", "Karalavadi", "Karapadi"],
  },
  
  SchemePerformanceVisible: false,

  setSchemePerformanceVisible: (visible) => set({ SchemePerformanceVisible: visible }),
  setindividualProfile: (profile) => set({ individualProfile: profile }),
  setLoading: (loading) => set({ loading: loading }),

  setSubpostoffice: (subpostoffice) => set({ subpostoffice }),
  setPostoffice: (postoffice) => set({ postoffice }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setState: (State) => set({ State }),
  setDistrict: (District) => set({ District }),
  setVillage: (village) => set({ village }),

  setDemographicData: (data) => set({ demographicData: data }),
  setTotalDemographicData: (data) => set({ totalDemographicData: data }),

  filterDemographicData: () =>
    set((state) => {
      const filtered =
        state.totalDemographicData?.find((item) => item.tru === "Total") ||
        state.totalDemographicData?.find((item) => item.tru === "Urban") ||
        state.totalDemographicData?.find((item) => item.tru === "Rural");
        
      return { demographicData: filtered || null };
    }),
  
}));

export default useDashboardStore;
