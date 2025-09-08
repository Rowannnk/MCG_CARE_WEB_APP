import React, { useState, useEffect } from "react";
import {
  Wrench,
  Calendar,
  Clock,
  User,
  Home,
  Phone,
  Camera,
  Video,
} from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const AirconServiceBooking = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    serviceType: "",
    title: "",
    description: "",
    photos: [],
    videos: [],
    date: "",
    timeSlot: "",
    name: "",
    address: "",
    phone: "",
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const serviceTypes = [
    "Emergency Repair",
    "Regular Maintenance",
    "Chemical Cleaning",
    "Gas Top-up",
    "New Installation",
    "Duct Cleaning",
  ];

  const popularBrands = [
    "Daikin",
    "Mitsubishi",
    "LG",
    "Panasonic",
    "Toshiba",
    "Samsung",
    "Carrier",
    "York",
  ];

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (formData.date) {
      // Simulate API call to get available time slots
      setIsLoading(true);
      setTimeout(() => {
        setAvailableTimeSlots([
          "09:00-11:00",
          "11:00-13:00",
          "13:00-15:00",
          "15:00-17:00",
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [formData.date]);

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    if (type === "photos") {
      setFormData({ ...formData, photos: [...formData.photos, ...files] });
    } else {
      setFormData({ ...formData, videos: [...formData.videos, ...files] });
    }
  };

  const removeFile = (index, type) => {
    if (type === "photos") {
      const updatedPhotos = [...formData.photos];
      updatedPhotos.splice(index, 1);
      setFormData({ ...formData, photos: updatedPhotos });
    } else {
      const updatedVideos = [...formData.videos];
      updatedVideos.splice(index, 1);
      setFormData({ ...formData, videos: updatedVideos });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      toast.error("Please select date and time slot");
      return;
    }

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "photos" || key === "videos") {
          formData[key].forEach((file) => formPayload.append(key, file));
        } else {
          formPayload.append(key, formData[key]);
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 mt-30 relative">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        {/* Available Time Slots */}
        <div className="w-full md:w-80 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-30 mb-6 md:mb-0 md:mr-8">
          <h2 className="text-xl font-semibold px-6 mb-4">
            Schedule Your Service
          </h2>

          <div className="px-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Service Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border rounded-md"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                    timeSlot: "",
                  })
                }
              />
            </div>

            {formData.date && (
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Available Time Slots
                </label>
                {isLoading ? (
                  <div className="text-center py-4">Loading slots...</div>
                ) : (
                  <div className="space-y-2">
                    {availableTimeSlots.map((slot) => (
                      <div
                        key={slot}
                        onClick={() =>
                          setFormData({ ...formData, timeSlot: slot })
                        }
                        className={`px-3 py-2 border rounded-md cursor-pointer transition ${
                          formData.timeSlot === slot
                            ? "bg-primary text-white border-primary"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Service Booking Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Aircon Details */}
            <div className="p-6 border-b border-gray-100">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Book Your Aircon Service
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Fill in the details below to schedule your air conditioning
                  service appointment
                </p>
              </div>
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Aircon Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Brand
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  >
                    <option value="">Select Brand</option>
                    {popularBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. ARNU18GSSA2"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Service Type
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                >
                  <option value="">Select Service Type</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Issue Description
                </label>
                <input
                  type="text"
                  required
                  className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Briefly describe the issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Detailed Notes
                </label>
                <textarea
                  className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                  placeholder="Provide any additional details..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Media Upload */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Upload Media (Optional)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Photos (Max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, "photos")}
                      className="hidden focus:outline-none focus:ring-0"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center py-8 cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG up to 5MB
                      </p>
                    </label>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.photos.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index, "photos")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Videos (Max 2)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, "videos")}
                      className="hidden focus:outline-none focus:ring-0"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center py-8 cursor-pointer"
                    >
                      <Video className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4 up to 10MB
                      </p>
                    </label>
                  </div>
                  {formData.videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.videos.map((file, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full rounded-lg"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index, "videos")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Your Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Service Address
                </label>
                <textarea
                  required
                  className="focus:outline-none focus:ring-0 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                  placeholder="Where should we perform the service?"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-8 bg-primary hover:bg-red-400 cursor-pointer text-white font-medium py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleSubmit}
          >
            Request Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default AirconServiceBooking;
