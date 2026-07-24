import {
  Wifi,
  Sun,
  Droplets,
  ShieldCheck,
  Car,
  Shield,
  Bed,
  CookingPot,
  WashingMachine,
} from "lucide-react";

export function getAmenityIcon(amenity: string) {
  switch (amenity) {
    case "Wi-Fi":
      return <Wifi size={18} />;

    case "Solar":
      return <Sun size={18} />;

    case "Borehole":
      return <Droplets size={18} />;

    case "Parking":
      return <Car size={18} />;

    case "Security":
      return <Shield size={18} />;

    case "Furnished":
      return <Bed size={18} />;

    case "Kitchen":
      return <CookingPot size={18} />;

    case "Laundry":
      return <WashingMachine size={18} />;

    default:
      return <ShieldCheck size={18} />;
  }
}