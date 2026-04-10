import { useEffect, useRef } from "react";
import { getStatus, getResult } from "../api/api";
import useStore from "../store/useStore";

const useJobPolling = (onComplete) => {
  const { jobId, setPhase, setResult } = useStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await getStatus(jobId);
        setPhase(data.phase, data.phase_label, data.progress);

        if (data.status === "done") {
          clearInterval(intervalRef.current);
          const { data: result } = await getResult(jobId);
          setResult(result);
          onComplete?.();
        }

        if (data.status === "error") {
          clearInterval(intervalRef.current);
          console.error("Job failed:", data.error);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [jobId]);
};

export default useJobPolling;
