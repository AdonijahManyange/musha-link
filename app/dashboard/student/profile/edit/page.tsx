"use client";

import { FormEvent, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useRouter } from "next/navigation";
import Link from "next/link";

type University = {
  id: string;
  name: string;
  city: string;
};

type StudentProfile = {
  universityId: string | null;
  phone: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  profilePhotoUrl: string | null;
  bio: string | null;
};

type User = {
  name: string | null;
  email: string;
  studentProfile: StudentProfile | null;
};

export default function StudentProfileEditPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);

  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============================================================
     Load profile + universities
  ============================================================ */

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, universitiesResponse] =
          await Promise.all([
            fetch("/api/student/profile", {
              cache: "no-store",
            }),
            fetch("/api/universities", {
              cache: "no-store",
            }),
          ]);

        const profileData = await profileResponse.json();
        const universitiesData = await universitiesResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.error || "Failed to load profile."
          );
        }

        if (!universitiesResponse.ok) {
          throw new Error(
            universitiesData.error ||
              "Failed to load universities."
          );
        }

        const currentUser: User = profileData.user;

        setUser(currentUser);
        setUniversities(universitiesData);

        setName(currentUser.name || "");

        setUniversityId(
          currentUser.studentProfile?.universityId || ""
        );

        setPhone(
          currentUser.studentProfile?.phone || ""
        );

        setCity(
          currentUser.studentProfile?.city || ""
        );

        setProvince(
          currentUser.studentProfile?.province || ""
        );

        setCountry(
          currentUser.studentProfile?.country || ""
        );

        setBio(
          currentUser.studentProfile?.bio || ""
        );
        
        setProfilePhotoUrl(
          currentUser.studentProfile?.profilePhotoUrl || ""
        );

      } catch (err) {
        console.error("Failed to load student profile:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* ============================================================
    Upload profile photo
    ============================================================ */

    async function createCroppedImage(
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob> {
        const image = new Image();

        image.src = imageSrc;

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () =>
            reject(new Error("Failed to load image."));
        });

        const canvas = document.createElement("canvas");

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Could not create image canvas.");
        }

        context.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
             (blob) => {
                if (blob) {
                resolve(blob);
                } else {
                reject(
                    new Error("Failed to create cropped image.")
                );
                }
            },
            "image/jpeg",
            0.9
            );
        });
    }


    async function handlePhotoUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Create a temporary browser URL for the selected image.
        const imageUrl = URL.createObjectURL(file);

        // Open the cropper with the selected image.
        setSelectedImage(imageUrl);

        // Reset crop position and zoom for the new image.
        setCrop({ x: 0, y: 0 });
        setZoom(1);

        // Clear any previous crop selection.
        setCroppedAreaPixels(null);

        // Allow the user to select the same file again later.
        event.target.value = "";
    }

    function handleCropComplete(
        _croppedArea: Area,
        croppedAreaPixels: Area
    ) {
        setCroppedAreaPixels(croppedAreaPixels);
    }


  /* ============================================================
     Save profile
  ============================================================ */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          universityId,
          phone,
          city,
          province,
          country,
          bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update profile."
        );
      }

      setUser(data.user);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        router.push("/dashboard/student/profile");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Failed to update student profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     Loading state
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-600">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     Page
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back */}

        <Link
          href="/dashboard/student/profile"
          className="text-sm font-medium text-slate-600 hover:text-brand-blue"
        >
          ← Back to Profile
        </Link>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Student Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Keep your student information up to date.
          </p>
        </div>

        {/* Errors */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-8"
        >
            {/* ================================================== */}
            {/* PROFILE PHOTO */}
            {/* ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-xl font-semibold text-slate-900">
                    Profile Photo
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Add a profile photo so your account is easy to recognize.
                </p>

                <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">

                    {/* Avatar */}

                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue text-2xl font-bold text-white">

                    {profilePhotoUrl ? (
                        <img
                            src={profilePhotoUrl}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                    (name || "Student")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    )}

                </div>

                {/* Upload controls */}

                <div>

                    <label
                    htmlFor="profile-photo"
                    className={`inline-flex cursor-pointer items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${
                        uploadingPhoto
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                    >
                    {uploadingPhoto
                        ? "Uploading..."
                        : profilePhotoUrl
                        ? "Change Photo"
                        : "Upload Photo"}

                    <input
                        id="profile-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                    />
                    </label>

                    <p className="mt-2 text-xs text-slate-500">
                    JPG, PNG, or WEBP. Maximum 5MB.
                    </p>

                </div>

                </div>

        </section>

          {/* ================================================== */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Basic information associated with your account.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Full Name */}

              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Your email address cannot be changed here.
                </p>
              </div>

            </div>
          </section>

          {/* ================================================== */}
          {/* UNIVERSITY */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              University
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell us which university you attend.
            </p>

            <div className="mt-6">

              <label
                htmlFor="university"
                className="text-sm font-medium text-slate-700"
              >
                University
              </label>

              <select
                id="university"
                value={universityId}
                onChange={(event) =>
                  setUniversityId(event.target.value)
                }
               className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              >
                <option value="">
                  Select your university
                </option>

                {universities.map((university) => (
                  <option
                    key={university.id}
                    value={university.id}
                  >
                    {university.name} — {university.city}
                  </option>
                ))}
              </select>

            </div>
          </section>

          {/* ================================================== */}
          {/* CONTACT & LOCATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              Contact & Location
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Optional information that can help personalize your
              accommodation experience.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="+263..."
                />
              </div>

              {/* City */}

              <div>
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="e.g. Mutare"
                />
              </div>

              {/* Province */}

              <div>
                <label
                  htmlFor="province"
                  className="text-sm font-medium text-slate-700"
                >
                  Province
                </label>

                <input
                  id="province"
                  type="text"
                  value={province}
                  onChange={(event) =>
                    setProvince(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="e.g. Manicaland"
                />
              </div>

              {/* Country */}

              <div>
                <label
                  htmlFor="country"
                  className="text-sm font-medium text-slate-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(event) =>
                    setCountry(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="e.g. Zimbabwe"
                />
              </div>

            </div>
          </section>

          {/* ================================================== */}
          {/* ABOUT ME */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              About Me
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell us a little about yourself.
            </p>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              rows={5}
              maxLength={500}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              placeholder="Tell us a little about yourself..."
            />

            <p className="mt-2 text-xs text-slate-500">
              {bio.length}/500 characters
            </p>

          </section>

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard/student/profile"
              className="rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

        {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold text-slate-900">
                Crop Your Photo
            </h2>

            <p className="mt-1 text-sm text-slate-600">
                Adjust your photo so it looks perfect in your profile.
            </p>

            {/* Cropper */}
            <div className="relative mt-6 h-80 w-full overflow-hidden rounded-xl bg-slate-900">
                <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
                />
            </div>

            {/* Zoom */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                <label
                    htmlFor="zoom"
                    className="text-sm font-medium text-slate-700"
                >
                    Zoom
                </label>

                <span className="text-sm text-slate-500">
                    {zoom.toFixed(1)}x
                </span>
                </div>

                <input
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) =>
                    setZoom(Number(event.target.value))
                }
                className="mt-3 w-full"
                />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">

                <button
                type="button"
                onClick={() => {
                    if (selectedImage) {
                    URL.revokeObjectURL(selectedImage);
                    }

                    setSelectedImage(null);
                    setCroppedAreaPixels(null);
                }}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                Cancel
                </button>

                <button
                    type="button"
                    disabled={uploadingPhoto || !croppedAreaPixels}
                    onClick={async () => {
                        if (!selectedImage || !croppedAreaPixels) {
                        return;
                        }

                        setUploadingPhoto(true);
                        setError("");
                        setSuccess("");

                        try {
                        const croppedImage = await createCroppedImage(
                            selectedImage,
                            croppedAreaPixels
                        );

                        const formData = new FormData();

                        formData.append(
                            "file",
                            croppedImage,
                            "profile-photo.jpg"
                        );

                        const response = await fetch(
                            "/api/student/profile/photo",
                            {
                            method: "POST",
                            body: formData,
                            }
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(
                            data.error || "Failed to upload profile photo."
                            );
                        }

                        setProfilePhotoUrl(data.profilePhotoUrl);

                        setSuccess(
                            "Profile photo updated successfully."
                        );

                        URL.revokeObjectURL(selectedImage);

                        setSelectedImage(null);
                        setCroppedAreaPixels(null);
                        setZoom(1);
                        setCrop({ x: 0, y: 0 });
                        } catch (err) {
                        console.error(
                            "Failed to save profile photo:",
                            err
                        );

                        setError(
                            err instanceof Error
                            ? err.message
                            : "Failed to upload profile photo."
                        );
                        } finally {
                        setUploadingPhoto(false);
                        }
                    }}
                    className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                    {uploadingPhoto
                        ? "Saving..."
                        : "Save Photo"}
                </button>

            </div>

            </div>
        </div>
        )}
      </div>
    </main>
  );
}
