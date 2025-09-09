import {
  Calendar,
  ChartLineIcon,
  CheckCircle,
  CircleDollarSignIcon,
  Star,
  Target,
  ToolCaseIcon,
  User,
  UserCheck,
  UserIcon,
  Wrench,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Title from "../../components/admin/Title";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalTechnicians: 0,
    totalUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [technicianPerformance, setTechnicianPerformance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalsRes = await axios.get("/api/booking/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDashboardData(totalsRes.data);

        const recentRes = await axios.get(
          "/api/booking/admin/recent-bookings",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const mappedBookings = recentRes.data.map((b) => ({
          id: b._id,
          serviceType: b.serviceType,
          price: b.serviceFee,
          paymentStatus:
            b.paymentStatus === "paid"
              ? "Paid"
              : b.paymentStatus === "pending"
              ? "Pending"
              : "Unknown",
          customerName: b.user?.name || "Unknown",
          technician: b.assignedTechnician?.name || null,
          date: b.date,
        }));
        setRecentBookings(mappedBookings);

        // Fetch popular services
        const servicesRes = await axios.get(
          "/api/booking/admin/popular-services",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const mappedServices = servicesRes.data.map((s) => ({
          name: s.serviceType,
          count: s.totalRequests,
        }));
        setTopServices(mappedServices);

        // Fetch technician performance
        const techRes = await axios.get("/api/booking/technician-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const mappedTech = techRes.data.map((t) => ({
          name: t.name,
          jobsCompleted: t.completedServices,
          rating: t.rating,
          points: t.points,
        }));
        setTechnicianPerformance(mappedTech);
        setError("");
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || 0,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: "$ " + (dashboardData.totalRevenue || 0),
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Technicians",
      value: dashboardData.totalTechnicians || 0,
      icon: ToolCaseIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers || 0,
      icon: UserIcon,
    },
  ];

  const formatServiceType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <>
        <Title text1="Admin" text2="Dashboard" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Title text1="Admin" text2="Dashboard" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap-4 mt-6">
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
              >
                <div>
                  <h1 className="text-sm">{card.title}</h1>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <Icon className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="relative mt-8 max-w-5xl">
        <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Recent Service Bookings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor:
                      booking.paymentStatus === "Paid"
                        ? "#E6F6EC"
                        : booking.paymentStatus === "Pending"
                        ? "#FEEBEB"
                        : "#FFF8E6",
                    color:
                      booking.paymentStatus === "Paid"
                        ? "#067647"
                        : booking.paymentStatus === "Pending"
                        ? "#B54708"
                        : "#D92D20",
                  }}
                >
                  {booking.paymentStatus}
                </span>

                <span className="text-lg font-semibold text-primary">
                  ${booking.price}
                </span>
              </div>

              <h3 className="text-lg font-medium mb-1">
                {formatServiceType(booking.serviceType)}
              </h3>

              <div className="space-y-2 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{booking.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-gray-500" />
                  <span>{booking.technician || "Technician not assigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services Section */}
      <div className="relative mt-12 max-w-5xl">
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Popular Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {formatServiceType(service.name)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.count} requests
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technician Performance Section */}
          <div className="mt-12">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Technician Performance
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-100">
                <div className="col-span-5 font-medium text-gray-600">
                  Technician
                </div>
                <div className="col-span-3 font-medium text-center text-gray-600">
                  Jobs Completed
                </div>
                <div className="col-span-2 font-medium text-center text-gray-600">
                  Points
                </div>
              </div>

              {technicianPerformance.map((tech, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {tech.name.charAt(0)}
                    </div>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                  <div className="col-span-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {tech.jobsCompleted}
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <Target className="w-4 h-4" />
                      {tech.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
