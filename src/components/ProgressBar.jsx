import { useState,useEffect } from "react";

export default function ProgressBar({ timer }) {
  const [clearTimer, setClearTimer] = useState(timer);
  useEffect(() => {
    const interval = setInterval(() => {
      setClearTimer((pre) => pre - 10);
    }, 10);

    return () => {
      clearTimeout(interval);
    };
  }, []);
  return <progress value={clearTimer} max={timer} />;
}
