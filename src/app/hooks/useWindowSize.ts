import { useEffect, useState } from "react";
import { isServer } from "../utils/utils";

export default function useWindowSize() {
  const [size, setSize] = useState(() => {
    {
      if (isServer()) return { width: 0, height: 0 };
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
