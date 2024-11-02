import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const AuditPopup = ({
  selectedDescription,
  allDescriptions,
  closePopup,
  onSubmitSuccess,
}) => {
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchUniqueId = async () => {
      try {
        const entriesRef = collection(
          db,
          "5K_Process_Audit_Checklist",
          "B1jaR1gqvf5rVTvQBChi",
          "entries"
        );
        const q = query(
          entriesRef,
          where("description", "==", selectedDescription)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const entry = querySnapshot.docs[0].data();
          setUniqueId(entry.uniqueId || "Not found");
        } else {
          setUniqueId("Not found");
        }
      } catch (error) {
        console.error("Error fetching uniqueId:", error);
      }
    };

    if (selectedDescription) {
      fetchUniqueId();
    }

    // Fetch location from the DOM with retry logic
    const maxAttempts = 5;
    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;
      const labels = document.querySelectorAll("label");
      for (let label of labels) {
        if (label.textContent.includes("Location:")) {
          const locationDiv = label.nextElementSibling;
          if (
            locationDiv &&
            locationDiv.getAttribute("aria-hidden") === "true"
          ) {
            const fetchedLocation = locationDiv.textContent.trim();
            setLocation(fetchedLocation);
            console.log("Fetched Location:", fetchedLocation); // Debug log
            clearInterval(interval); // Clear the interval if found
            break; // Exit the loop
          }
        }
      }

      if (attempts >= maxAttempts) {
        console.log("Location element not found after maximum attempts."); // Debug log
        clearInterval(interval); // Stop the interval after max attempts
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedDescription]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!score) {
      alert("Please select a score");
      return;
    }

    if (score !== "5" && !remarks) {
      alert("Remarks are required for the selected score");
      return;
    }

    try {
      const descriptionObj = allDescriptions.find(
        desc => desc.description === selectedDescription
      );

      if (!descriptionObj) {
        throw new Error("Description details not found");
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const auditData = {
        "Audit Score": score,
        "Auditor Name": "indore@example.com",
        Date: formattedDate,
        Department: descriptionObj.department || "",
        Owner: descriptionObj.owner || "",
        Description: selectedDescription,
        Location: location || "Not Available", // Capture the fetched location or set default
        Remarks: remarks,
        "Unique ID": uniqueId || "Not found",
        timestamp: currentDate,
      };

      // Remove any undefined fields from auditData
      const filteredAuditData = Object.fromEntries(
        Object.entries(auditData).filter(([_, v]) => v !== undefined)
      );

      console.log("Submitting Audit Data:", filteredAuditData); // Debug log
      await addDoc(collection(db, "audit_reports"), filteredAuditData);
      onSubmitSuccess(selectedDescription);
      alert("Audit report submitted successfully!");
      closePopup();
    } catch (error) {
      console.error("Error submitting audit report:", error);
      alert(`Error submitting audit report: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Audit Form
          </h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <p className="text-gray-600">{selectedDescription}</p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="score"
              >
                Score*
              </label>
              <select
                id="score"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Score</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="0">0</option>
                <option value="NA">NA</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="remarks"
              >
                Remarks{score !== "5" && "*"}
              </label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required={score !== "5"}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditPopup;
