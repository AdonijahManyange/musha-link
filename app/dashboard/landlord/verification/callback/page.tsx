import { redirect } from "next/navigation";

export default function VerificationCallback() {
  redirect("/dashboard/landlord");
}
