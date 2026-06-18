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

  chatbotOpen: false,
  chatbotQuery: "",
  setChatbotOpen: (open) => set({ chatbotOpen: open }),
  setChatbotQuery: (query) => set({ chatbotQuery: query }),
  triggerChatbot: (query) => set({ chatbotOpen: true, chatbotQuery: query }),

  filterDemographicData: (freshData) =>
    set((state) => {
      const source = freshData || state.totalDemographicData;
      const filtered =
        source?.find((item) => item.tru === "Total") ||
        source?.find((item) => item.tru === "Urban") ||
        source?.find((item) => item.tru === "Rural");
        
      return { demographicData: filtered || null };
    }),
  
}));

export default useDashboardStore;
