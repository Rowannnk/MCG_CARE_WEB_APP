/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Title from "../../components/admin/Title";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiClock,
  FiUser,
  FiMail,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";
import { FaTools } from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Service categories enum
const BookingServiceCategory = {
  ROUTINE_CLEANING: "routine_cleaning",
  GAS_TOPUP_AND_LEAK_CHECK: "gas_topup_and_leak_check",
  REPAIR_AND_FIX: "repair_and_fix",
  INSTALLATION_AND_RELOCATION: "installation_and_relocation",
  SPECIALIZED_TREATMENTS: "specialized_treatments",
  OTHER_SERVICES: "other_services",
};

const serviceCategoryLabels = {
  [BookingServiceCategory.ROUTINE_CLEANING]: "Routine Cleaning",
  [BookingServiceCategory.GAS_TOPUP_AND_LEAK_CHECK]: "Gas Top-up & Leak Check",
  [BookingServiceCategory.REPAIR_AND_FIX]: "Repair and Fix",
  [BookingServiceCategory.INSTALLATION_AND_RELOCATION]:
    "Installation & Relocation",
  [BookingServiceCategory.SPECIALIZED_TREATMENTS]: "Specialized Treatments",
  [BookingServiceCategory.OTHER_SERVICES]: "Other Services",
};

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-2">{type === "success" ? "✓" : "⚠"}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AddTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [currentTech, setCurrentTech] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    skills: [],
    availableSlots: [],
  });
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const [slotDropdownOpen, setSlotDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  React.useEffect(() => {
    fetchTechnicians();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get("/api/admin/technicians", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTechnicians(response.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
      setError("Failed to load technicians");
    }
  };

  const handleAddTechnician = () => {
    setIsEditMode(false);
    setCurrentTech({
      _id: "",
      name: "",
      email: "",
      password: "",
      skills: [],
      availableSlots: [],
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const handleEditTechnician = (tech) => {
    setIsEditMode(true);
    setCurrentTech({
      _id: tech._id,
      name: tech.name,
      email: tech.email,
      password: "",
      skills: [...tech.skills],
      availableSlots: [...tech.availableSlots],
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (tech) => {
    setTechToDelete(tech);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!techToDelete) return;

    try {
      await axios.delete(`/api/admin/technicians/${techToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTechnicians(
        technicians.filter((tech) => tech._id !== techToDelete._id)
      );
      showToast("Technician deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting technician:", err);
      showToast("Failed to delete technician", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setTechToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTechToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEditMode) {
        const updateData = {
          name: currentTech.name,
          email: currentTech.email,
          skills: currentTech.skills,
          availableSlots: currentTech.availableSlots,
        };

        if (currentTech.password) {
          updateData.password = currentTech.password;
        }

        const response = await axios.patch(
          `/api/admin/technicians/${currentTech._id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTechnicians(
          technicians.map((tech) =>
            tech._id === currentTech._id ? response.data : tech
          )
        );

        showToast("Technician updated successfully!", "success");
      } else {
        await axios.post(
          "/api/auth/technician/signup",
          {
            name: currentTech.name,
            email: currentTech.email,
            password: currentTech.password,
            skills: currentTech.skills,
            availableSlots: currentTech.availableSlots,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        showToast("Technician created successfully!", "success");
      }

      setIsModalOpen(false);
      fetchTechnicians();
    } catch (err) {
      console.error("Error saving technician:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} technician`
      );
      showToast(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} technician`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTech({
      ...currentTech,
      [name]: value,
    });
  };

  const toggleSkill = (skill) => {
    if (currentTech.skills.includes(skill)) {
      setCurrentTech({
        ...currentTech,
        skills: currentTech.skills.filter((s) => s !== skill),
      });
    } else {
      setCurrentTech({
        ...currentTech,
        skills: [...currentTech.skills, skill],
      });
    }
  };

  const toggleSlot = (slot) => {
    if (currentTech.availableSlots.includes(slot)) {
      setCurrentTech({
        ...currentTech,
        availableSlots: currentTech.availableSlots.filter((s) => s !== slot),
      });
    } else {
      setCurrentTech({
        ...currentTech,
        availableSlots: [...currentTech.availableSlots, slot],
      });
    }
  };

  const selectAllSlots = () => {
    setCurrentTech({
      ...currentTech,
      availableSlots: timeSlots,
    });
  };

  const clearAllSlots = () => {
    setCurrentTech({
      ...currentTech,
      availableSlots: [],
    });
  };

  return (
    <div className="p-6 max-w-7xl">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <Title text1="Technician" text2="Management" />
        <button
          onClick={handleAddTechnician}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          <FiPlus /> Add Technician
        </button>
      </div>

      {/* Technician Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-primary/80 text-left text-lg text-white">
                <th className="p-2 font-medium pl-5">Name</th>
                <th className="p-2 font-medium ">Email</th>
                <th className="p-2 font-medium ">Skills</th>
                <th className="p-2 font-medium ">Available Slots</th>
                <th className="p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicians.map((tech) => (
                <tr key={tech._id} className="hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tech.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FiShield className="text-xs" /> {tech.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <FiMail className="text-sm" /> {tech.email}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {tech.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                        >
                          <FaTools className="text-xs" />{" "}
                          {serviceCategoryLabels[skill] || skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {tech.availableSlots.map((slot, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
                        >
                          <FiClock className="text-xs" /> {slot}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className=" p-2   text-sm font-medium">
                    <div className="flex  space-x-2">
                      <button
                        onClick={() => handleEditTechnician(tech)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tech)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Technician Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {isEditMode ? "Edit Technician" : "Add New Technician"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentTech.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentTech.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={currentTech.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder={
                      isEditMode ? "Leave blank to keep current password" : ""
                    }
                    minLength={6}
                    required={!isEditMode}
                  />
                  {isEditMode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to keep current password
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <button
                    type="button"
                    onClick={() => setSkillDropdownOpen(!skillDropdownOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <span>
                      {currentTech.skills.length > 0
                        ? `${currentTech.skills.length} skill${
                            currentTech.skills.length !== 1 ? "s" : ""
                          } selected`
                        : "Select skills"}
                    </span>
                    {skillDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {skillDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                      {Object.entries(serviceCategoryLabels).map(
                        ([key, label]) => (
                          <div
                            key={key}
                            onClick={() => toggleSkill(key)}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                              currentTech.skills.includes(key)
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-900"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="ml-3 block font-normal truncate">
                                {label}
                              </span>
                            </div>
                            {currentTech.skills.includes(key) && (
                              <span className="text-blue-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                ✓
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentTech.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {serviceCategoryLabels[skill] || skill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Time Slots
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={selectAllSlots}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={clearAllSlots}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlotDropdownOpen(!slotDropdownOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <span>
                      {currentTech.availableSlots.length > 0
                        ? `${currentTech.availableSlots.length} slot${
                            currentTech.availableSlots.length !== 1 ? "s" : ""
                          } selected`
                        : "Select available time slots"}
                    </span>
                    {slotDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {slotDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot}
                          onClick={() => toggleSlot(slot)}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-50 ${
                            currentTech.availableSlots.includes(slot)
                              ? "bg-green-50 text-green-700"
                              : "text-gray-900"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="ml-3 block font-normal truncate">
                              {slot}
                            </span>
                          </div>
                          {currentTech.availableSlots.includes(slot) && (
                            <span className="text-green-600 absolute inset-y-0 right-0 flex items-center pr-4">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentTech.availableSlots.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {slot}
                        <button
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          className="ml-1 text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Technician"
                      : "Create Technician"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 bg-opacity/10 ">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete technician{" "}
                <span className="font-semibold">{techToDelete?.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete Technician
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTechnician;
