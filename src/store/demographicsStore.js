import { create } from "zustand";

const useDemographicsStore = create((set) => ({
    demographicData: null,
    setDemographicData: (data) => set({ demographicData: data }),
}));

export default useDemographicsStore;





