export type Landlord = {
  name: string;
  phone: string;
  email: string;
};

export type Listing = {
  id: number;
  slug: string;
  title: string;
  university: string;
  suburb: string;
  city: string;
  roomType: string;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  verified: boolean;
  landlord: Landlord;
};