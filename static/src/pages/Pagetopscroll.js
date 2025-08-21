import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Pagetopscroll = () => {
  const location = useLocation();  // Get the current location (route) in the app

  useEffect(() => {
    // Scroll to the top when the route changes
    window.scrollTo(0, 0);
  }, [location]);  // Runs whenever the location changes (i.e., route changes)

  return null;  // This component doesn't render anything
};

export default Pagetopscroll;