import type { Listing } from "@/types/listing";

export const listings: Listing[] = [
  {
    id: "1",
    slug: "modern-student-room",
    title: "Modern Student Room",
    university: "Africa University",
    suburb: "Fairbridge Park",
    city: "Mutare",
    roomType: "Private Room",
    price: 120,
    images: [
      "/images/listings/room2.png",
    ],
    description:
      "A modern and comfortable student room located close to Africa University.",
    amenities: [],
    featured: true,
    verified: true,
    landlord: {
      name: "Musha Verified Landlord",
      phone: "",
      email: "",
    },
  },

  {
    id: "2",
    slug: "student-house-near-au",
    title: "Student House Near Africa University",
    university: "Africa University",
    suburb: "Old Mutare",
    city: "Mutare",
    roomType: "Shared Room",
    price: 100,
    images: [
      "/images/listings/room2.png",
    ],
    description:
      "Affordable student accommodation with convenient access to Africa University.",
    amenities: [],
    featured: false,
    verified: true,
    landlord: {
      name: "Musha Verified Landlord",
      phone: "",
      email: "",
    },
  },

  {
    id: "3",
    slug: "nust-student-accommodation",
    title: "NUST Student Accommodation",
    university: "National University of Science and Technology",
    suburb: "Selbourne Park",
    city: "Bulawayo",
    roomType: "Private Room",
    price: 150,
    images: [
      "/images/listings/room2.png",
    ],
    description:
      "Comfortable student accommodation in Bulawayo near NUST.",
    amenities: [],
    featured: false,
    verified: true,
    landlord: {
      name: "Musha Verified Landlord",
      phone: "",
      email: "",
    },
  },

  {
    id: "4",
    slug: "msu-student-room",
    title: "MSU Student Room",
    university: "Midlands State University",
    suburb: "Senga",
    city: "Gweru",
    roomType: "Private Room",
    price: 130,
    images: [
      "/images/listings/room2.png",
    ],
    description:
      "Student-friendly accommodation near Midlands State University.",
    amenities: [],
    featured: false,
    verified: true,
    landlord: {
      name: "Musha Verified Landlord",
      phone: "",
      email: "",
    },
  },
];