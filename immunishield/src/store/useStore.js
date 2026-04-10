import { create } from "zustand";

const useStore = create((set) => ({
  jobId: null,
  phase: 0,
  phaseLabel: "",
  progress: 0,
  config: {
    allowBackground: true,
    allowColorGrade: true,
    allowFaceSwap: false,
    strength: 0.72,
  },
  result: null,

  setJobId: (jobId) => set({ jobId }),
  setPhase: (phase, phaseLabel, progress) =>
    set({ phase, phaseLabel, progress }),
  setConfig: (config) => set((s) => ({ config: { ...s.config, ...config } })),
  setResult: (result) => set({ result }),
  reset: () =>
    set({ jobId: null, phase: 0, phaseLabel: "", progress: 0, result: null }),
}));

export default useStore;
