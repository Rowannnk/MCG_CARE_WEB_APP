import logo from "./brand_logo.png";
import hero from "./hero.png";
import slider1 from "./slider1.jpg";
import slider2 from "./slider2.jpg";
import slider3 from "./slider3.jpg";
import googlePlay from "./googlePlay.svg";
import appStore from "./appStore.svg";
import profile from "./profile.png";

export const assets = {
  logo,
  hero,
  googlePlay,
  appStore,
  profile,
};

export const dummyAds = [
  {
    image: slider1,
    title: "One Day AC Specail Training",
  },
  {
    image: slider2,
    title: "Summer AC Promo - 20% Off ",
  },
  {
    image: slider3,
    title: "CHIGO Brand 4 Years Warranty",
  },
];

export const dummyACProducts = [
  {
    _id: "ac001",
    id: 1,
    title: "CHIGO 1.5 Ton Split AC",
    overview:
      "Efficient and quiet cooling with CHIGO's 1.5 Ton Split AC, perfect for medium-sized rooms. Features auto clean and turbo mode.",
    poster_path: "https://pbs.twimg.com/media/Dw82caBVsAAMu55.jpg:large",
    backdrop_path: "https://example.com/images/ac-chigo-15ton-banner.jpg",
    brand: "CHIGO",
    specs: {
      capacity: "1.5 Ton",
      type: "Split",
      energy_rating: "5.0",
      cooling_power: "5200W",
      refrigerant: "R32",
      warranty: "4 Years",
    },
    release_date: "2023-03-15",
    original_language: "en",
    tagline: "Cool Smart. Live Smart.",
    vote_average: 4.8,
    vote_count: 124,
    runtime: null,
    stock: 3,
    price: 5000,
  },
  {
    _id: "ac002",
    id: 2,
    title: "Daikin 1 Ton Inverter AC",
    overview:
      "Daikin inverter AC with Econo mode and PM 2.5 filter for cleaner air and optimal efficiency in small rooms.",
    poster_path:
      "https://ankurelectricals.com/cdn/shop/files/5_435702ac-e82a-4afc-83c5-d9f54ced1041_1024x1024.png?v=1727098406",
    backdrop_path: "https://example.com/images/daikin-banner.jpg",
    brand: "Daikin",
    specs: {
      capacity: "1 Ton",
      type: "Split Inverter",
      energy_rating: "4.0",
      cooling_power: "3500W",
      refrigerant: "R32",
      warranty: "3 Years",
    },
    release_date: "2024-06-10",
    original_language: "en",
    tagline: "Next-gen Cooling.",
    vote_average: 4.5,
    vote_count: 97,
    runtime: null,
    stock: 0,
    price: 3000,
  },
  {
    _id: "ac003",
    id: 3,
    title: "LG Dual Inverter 2 Ton AC",
    overview:
      "Stay cool with LG's 2 Ton Dual Inverter AC with AI Convertible 6-in-1 cooling and HD filter with anti-virus protection.",
    poster_path:
      "https://m.media-amazon.com/images/I/81PcW0XtwnL._UF1000,1000_QL80_.jpg",
    backdrop_path: "https://example.com/images/lg-ac-banner.jpg",
    brand: "LG",
    specs: {
      capacity: "2 Ton",
      type: "Dual Inverter",
      energy_rating: "5.0",
      cooling_power: "6200W",
      refrigerant: "R32",
      warranty: "5 Years",
    },
    release_date: "2025-01-05",
    original_language: "en",
    tagline: "AI Cooling that Listens.",
    vote_average: 4.9,
    vote_count: 208,
    runtime: null,
    stock: 5,
    price: 1000,
  },
  {
    _id: "ac004",
    id: 4,
    title: "Midea Portable AC 1 Ton",
    overview:
      "Compact and efficient, Midea's 1 Ton portable AC is easy to install and ideal for single rooms or temporary setups.",
    poster_path:
      "https://5.imimg.com/data5/SELLER/Default/2023/1/JP/AQ/UF/45525116/midea-portable-ac.jpg",
    backdrop_path: "https://example.com/images/midea-banner.jpg",
    brand: "Midea",
    specs: {
      capacity: "1 Ton",
      type: "Portable",
      energy_rating: "3.0 ",
      cooling_power: "3300W",
      refrigerant: "R410A",
      warranty: "2 Years",
    },
    release_date: "2024-07-22",
    original_language: "en",
    tagline: "Move Your Cool.",
    vote_average: 4.2,
    vote_count: 55,
    runtime: null,
    stock: 0,
    price: 1000,
  },
];

export const dummyTrailers = [
  {
    image: "https://img.youtube.com/vi/JFWoLSxc7G8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=JFWoLSxc7G8",
  },
  {
    image: "https://img.youtube.com/vi/-sAOWhvheK8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=-sAOWhvheK8",
  },
  {
    image: "https://img.youtube.com/vi/1pHDWnXmK7Y/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=1pHDWnXmK7Y",
  },
  {
    image: "https://img.youtube.com/vi/umiKiW4En9g/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=umiKiW4En9g",
  },
];

export const dummyDashboardData = {
  totalBookings: 28,
  totalRevenue: 12780, // total in your currency
  totalUsers: 12,
  totalTechnicians: 4,
  recentBookings: [
    {
      _id: "bkg001",
      customerName: "John Doe",
      serviceType: "AC Cleaning",
      technician: "Alex Smith",
      date: "2025-08-05T10:30:00.000Z",
      status: "Completed",
      price: 1500,
    },
    {
      _id: "bkg002",
      customerName: "Jane Lee",
      serviceType: "AC Repair",
      technician: "Emily Johnson",
      date: "2025-08-06T14:00:00.000Z",
      status: "Pending",
      price: 2200,
    },
    {
      _id: "bkg003",
      customerName: "Michael Brown",
      serviceType: "Installation",
      technician: "David Kim",
      date: "2025-08-07T09:00:00.000Z",
      status: "In Progress",
      price: 3200,
    },
  ],
  topServices: [
    {
      name: "AC Cleaning",
      count: 14,
    },
    {
      name: "AC Repair",
      count: 9,
    },
    {
      name: "Installation",
      count: 5,
    },
  ],
  technicianPerformance: [
    {
      name: "Alex Smith",
      jobsCompleted: 10,
      rating: 4.9,
    },
    {
      name: "Emily Johnson",
      jobsCompleted: 8,
      rating: 4.7,
    },
    {
      name: "David Kim",
      jobsCompleted: 6,
      rating: 4.5,
    },
    {
      name: "Sarah Wong",
      jobsCompleted: 4,
      rating: 4.8,
    },
  ],
};
