"use client";

import { useTUPCID } from "@/app/Provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Authenticate = (Component) => {
  return (props) => {
    const { TUPCID } = useTUPCID();
    const router = useRouter();
    const [delay, setDelay] = useState(true);

    useEffect(() => {
      if (TUPCID === '') {
        setDelay(false);
      } else {
        setDelay(false);
      }
    }, [TUPCID]);

    useEffect(() => {
      if (!delay) {
        if (!TUPCID) {
          router.push("/Login");
        }
      }
    }, [TUPCID, delay, router]);

    return !delay && <Component {...props} />;
  };
};

export default Authenticate;