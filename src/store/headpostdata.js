import { create } from "zustand";

const useheaddata = create((set, get) => ({ 
  Sta: "", 
  Dis: null, 
  sub: null, 
  loa: false, 
  sch: null, 
 
  // Setters 
  setsch: (sch) => set({ sch }), 
  setLoa: (loa) => set({ loa }), 
  setSub: (sub) => set({ sub }), 
  setSta: (Sta) => set({ Sta }), 
  setDis: (Dis) => set({ Dis }), 
 
  // Handle the logic for fetching the data 
  fetchHeadData: async () => { 
    const { Sta, Dis, sub, setLoa, setsch } = get(); // Access current store values 
 
    if (!Sta && !Dis && !sub) { 
      return; 
    } 
 
    setLoa(true); // Set loading state 
 
    try { 
      const response = await fetch("/api/headPostData", { 
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({ 
          State: Sta?.name, 
          District: Dis, 
          SubpostOffice: sub?.name?.split(" ").slice(0, 1).join(" "), 
        }), 
      }); 
 
      if (!response.ok) { 
        throw new Error("Failed to fetch demographics"); 
      } 
 
      const data = await response.json(); 
      setsch(data); // Update store with the fetched data 
    } catch (error) { 
      console.error("Error fetching demographics:", error); 
    } finally { 
      setLoa(false); // Reset loading state 
    } 
  }, 
})); 
 
export default useheaddata;