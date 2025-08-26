import { useEffect, useState, useContext, createContext } from "react";

const TUPCIDcontext = createContext();
function Provider({ children }) {
  const [TUPCID, setTUPCID] = useState("");

  useEffect(() => {
    const storedTUPCID = localStorage.getItem("TUPCID");
    if (storedTUPCID) {
      setTUPCID(storedTUPCID);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("TUPCID", TUPCID);
  }, [TUPCID]);
  return (
    <TUPCIDcontext.Provider value={{ TUPCID, setTUPCID }}>
      {children}
    </TUPCIDcontext.Provider>
  );
}

export const useTUPCID = () => useContext(TUPCIDcontext);
export default Provider;

