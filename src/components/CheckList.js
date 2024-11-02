import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAntHNI4o-WKe8SnJ4wXCrdpg_YiNv0N-4",
  authDomain: "canis-in-25eae.firebaseapp.com",
  projectId: "canis-in-25eae",
  storageBucket: "canis-in-25eae.appspot.com",
  messagingSenderId: "229881686835",
  appId: "1:229881686835:web:b5858bab7df094b5962c46",
  measurementId: "G-HDCBSY3404",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function CheckList() {
  const [checklist, setChecklist] = useState("");
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [allDescriptions, setAllDescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checklistOptions] = useState(["5K", "T1", "T2"]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [submittedDescriptions, setSubmittedDescriptions] = useState(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch location data
      const locationsCollection = collection(db, "Locations");
      const locationsSnapshot = await getDocs(locationsCollection);
      const locationsData = locationsSnapshot.docs.map(
        doc => doc.data().Location_Name
      );
      setLocationOptions(locationsData);

      // Fetch checklist entries data
      const entriesCollection = collection(
        db,
        "5K_Process_Audit_Checklist",
        "B1jaR1gqvf5rVTvQBChi",
        "entries"
      );
      const querySnapshot = await getDocs(entriesCollection);

      const uniqueOwners = new Set();
      const uniqueDepartments = new Set();
      const data = [];

      querySnapshot.forEach(doc => {
        const item = doc.data();
        if (item.owner) uniqueOwners.add(item.owner);
        if (item.department) uniqueDepartments.add(item.department);

        data.push({
          description: item.description,
          owner: item.owner || "",
          department: item.department || "",
          uniqueId: item["Unique ID"] || "",
        });
      });

      setAllDescriptions(data);
      setDescriptions(data);
      setOwnerOptions([...uniqueOwners]);
      setDepartmentOptions([...uniqueDepartments]);

      console.log("Fetched data:", data);
      console.log("Owners:", [...uniqueOwners]);
      console.log("Departments:", [...uniqueDepartments]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checklist) {
      fetchData();
    }
  }, [checklist]);

  useEffect(() => {
    if (owner) {
      const filteredDescriptions = allDescriptions.filter(
        item => item.owner === owner
      );
      setDescriptions(filteredDescriptions);

      const uniqueDepartments = new Set(
        filteredDescriptions.map(item => item.department)
      );
      setDepartmentOptions([...uniqueDepartments]);

      setDepartment("");
    } else {
      setDescriptions(allDescriptions);
      setDepartmentOptions([
        ...new Set(allDescriptions.map(item => item.department)),
      ]);
      setDepartment("");
    }
  }, [owner, allDescriptions]);

  useEffect(() => {
    if (owner) {
      let filteredDescriptions;
      if (department) {
        filteredDescriptions = allDescriptions.filter(
          item => item.owner === owner && item.department === department
        );
      } else {
        filteredDescriptions = allDescriptions.filter(
          item => item.owner === owner
        );
      }
      setDescriptions(filteredDescriptions);
    } else {
      setDescriptions(allDescriptions);
    }
  }, [department, owner, allDescriptions]);

  const openPopup = desc => {
    if (!location) {
      alert("Please select a location first");
      return;
    }
    setSelectedDescription(desc);
    setShowPopup(true);
  };

  const handleSubmitSuccess = desc => {
    setSubmittedDescriptions(prev => new Set([...prev, desc]));
    setShowPopup(false);
  };

  const handleChecklistChange = e => {
    setChecklist(e.target.value);
  };

  const handleLocationChange = e => {
    setLocation(e.target.value);
  };

  const handleOwnerChange = e => {
    setOwner(e.target.value);
  };

  const handleDepartmentChange = e => {
    setDepartment(e.target.value);
  };

  return (
    <div className="container max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checklist App</h1>

      <label className="block text-sm font-medium text-gray-700">
        Checklist:
      </label>
      <select
        value={checklist}
        onChange={handleChecklistChange}
        className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Red-600"
      >
        <option value="">--Select--</option>
        {checklistOptions.map((item, idx) => (
          <option key={idx} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Location:
      </label>
      <select
        value={location}
        onChange={handleLocationChange}
        className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">--Select--</option>
        {locationOptions.map((loc, idx) => (
          <option key={idx} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Owner:
      </label>
      <select
        value={owner}
        onChange={handleOwnerChange}
        className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">--Select--</option>
        {ownerOptions.map((ownerName, idx) => (
          <option key={idx} value={ownerName}>
            {ownerName}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Department:
      </label>
      <select
        value={department}
        onChange={handleDepartmentChange}
        className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!owner}
      >
        <option value="">--Select--</option>
        {departmentOptions.map((dept, idx) => (
          <option key={idx} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Search:
      </label>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search descriptions..."
        className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          descriptions
            .filter(desc =>
              desc.description.toLowerCase().includes(search.toLowerCase())
            )
            .map((desc, idx) => (
              <div
                key={idx}
                className={`description-item p-4 rounded-md shadow-sm mb-2 cursor-pointer 
                  ${
                    submittedDescriptions.has(desc.description)
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                onClick={() => openPopup(desc.description)}
              >
                {desc.description}
              </div>
            ))
        )}
      </div>

      {showPopup && (
        <Popup
          closePopup={() => setShowPopup(false)}
          selectedDescription={selectedDescription}
          location={location}
          allDescriptions={allDescriptions}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}

export default CheckList;
