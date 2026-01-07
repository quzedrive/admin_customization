"use client"; // This directive marks the component as a Client Component

import { useState, useEffect } from "react";

export default function HiddenDomainMeta() {
  const [isHiddenDomain, setIsHiddenDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      console.log("---------------------Current host:---------------------", host);
      // 👇 Replace with the domain you want to hide from indexing
      if (host.includes("kappa")) {
        console.log("---------------------Hiding domain from indexing:---------------------", host);

        setIsHiddenDomain(true);
      }
    }
  }, []);

  // Conditionally render the meta tag
  return (
    <>
      {isHiddenDomain && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </>
  );
}
