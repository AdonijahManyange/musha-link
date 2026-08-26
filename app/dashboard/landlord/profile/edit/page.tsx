"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

type ProfileData = {
  id: string;
  name: string | null;
  email: string;

  landlordProfile: {
    phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    profilePhotoUrl: string | null;
  } | null;
};

type FormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
};

export default function EditLandlordProfilePage() {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [form, setForm] =
    useState<FormState>({
      name: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      country: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD PROFILE
  ========================================================== */

  useEffect(() => {
    async function loadProfile() {
      try {
        const response =
          await fetch(
            "/api/landlord/profile"
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load profile."
          );
        }

        const user =
          data.user as ProfileData;

        setProfile(user);

        setForm({
          name:
            user.name || "",

          phone:
            user.landlordProfile?.phone ||
            "",

          address:
            user.landlordProfile?.address ||
            "",

          city:
            user.landlordProfile?.city ||
            "",

          province:
            user.landlordProfile?.province ||
            "",

          country:
            user.landlordProfile?.country ||
            "",
        });
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* ==========================================================
     INPUT
  ========================================================== */

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /* ==========================================================
     SAVE PROFILE
  ========================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response =
        await fetch(
          "/api/landlord/profile",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(form),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save profile."
        );
      }

      setProfile(data.user);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     PHOTO UPLOAD
  ========================================================== */

  async function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/landlord/profile/photo",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload photo."
        );
      }

      setProfile(
        (current) =>
          current
            ? {
                ...current,

                landlordProfile: {
                  ...(current.landlordProfile || {
                    phone: null,
                    address: null,
                    city: null,
                    province: null,
                    country: null,
                    profilePhotoUrl: null,
                  }),

                  profilePhotoUrl:
                    data.profilePhotoUrl,
                },
              }
            : current
      );

      setMessage(
        "Profile photo updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload photo."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-24">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2
              size={20}
              className="animate-spin"
            />
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          href="/dashboard/landlord/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mt-6">

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Edit Your Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Keep your profile information up to date
            so students can better understand who they
            are dealing with.
          </p>

        </div>

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ====================================================
            PROFILE PHOTO
        ==================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-slate-900">
            Profile Photo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a professional photo so students can
            put a face to the landlord.
          </p>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Photo */}

            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">

              {profile?.landlordProfile
                ?.profilePhotoUrl ? (
                <img
                  src={
                    profile
                      .landlordProfile
                      .profilePhotoUrl
                  }
                  alt={
                    profile.name ||
                    "Landlord"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-brand-blue">
                  {getInitials(
                    profile?.name ||
                      "Landlord"
                  )}
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2
                    size={26}
                    className="animate-spin text-white"
                  />
                </div>
              )}

            </div>

            {/* Upload */}

            <div>

              <label
                htmlFor="profile-photo"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark ${
                  uploading
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
              >
                <Camera size={17} />

                {uploading
                  ? "Uploading..."
                  : "Choose Photo"}

              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handlePhotoChange
                }
                className="hidden"
              />

              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG, or WEBP · Maximum 5MB
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            PERSONAL INFORMATION
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <h2 className="text-lg font-bold text-slate-900">
              Personal Information
            </h2>

            <div className="mt-6 space-y-5">

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  placeholder="Your full name"
                />

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  value={
                    profile?.email || ""
                  }
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Your email address cannot be
                  changed here.
                </p>

              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  placeholder="+263 7X XXX XXXX"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              LOCATION
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <h2 className="text-lg font-bold text-slate-900">
              Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This information helps students understand
              where you are based.
            </p>

            <div className="mt-6 space-y-5">

              {/* Address */}

              <div>

                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-slate-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={
                    handleChange
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  placeholder="Street address"
                />

              </div>

              {/* City / Province */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-slate-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={
                      handleChange
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                    placeholder="Mutare"
                  />

                </div>

                <div>

                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Province
                  </label>

                  <input
                    id="province"
                    name="province"
                    value={
                      form.province
                    }
                    onChange={
                      handleChange
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                    placeholder="Manicaland"
                  />

                </div>

              </div>

              {/* Country */}

              <div>

                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-slate-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  value={
                    form.country
                  }
                  onChange={
                    handleChange
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  placeholder="Zimbabwe"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              SAVE
          ================================================== */}

          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>
    </main>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(
  name: string
) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
    )
    .join("");

  return initials || "L";
}