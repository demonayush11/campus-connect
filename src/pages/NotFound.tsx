import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Change page title
    document.title = "404 - Page Not Found | campusConnect";

    // Change favicon
    const favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (favicon) {
      favicon.href = "https://i.ibb.co/NEW_ERROR_IMAGE.png";
    }

    // Reset title & favicon when user navigates away
    return () => {
      document.title = "campusConnect - Connect, Learn, Grow Together";
      if (favicon) {
        favicon.href = "https://i.ibb.co/RkBPPvcT/Chat-GPT-Image-Aug-16-2025-12-41-24-PM.png";
      }
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
