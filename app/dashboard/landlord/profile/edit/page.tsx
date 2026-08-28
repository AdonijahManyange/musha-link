"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Cropper, {
  Area,
} from "react-easy-crop";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  X,
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
    coverPhotoUrl: string | null;
    bio: string | null;
  } | null;
};

type FormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  bio: string;
};

type CropType = "profile" | "cover";

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
      bio: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadingCover, setUploadingCover] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ==========================================================
     CROP STATE
  ========================================================== */

  const [cropImage, setCropImage] =
    useState<string | null>(null);

  const [cropType, setCropType] =
    useState<CropType | null>(null);

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [cropFileName, setCropFileName] =
    useState("image.jpg");

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

          bio:
            user.landlordProfile?.bio ||
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
     SELECT PROFILE PHOTO
  ========================================================== */

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile photos must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setCropImage(imageUrl);
    setCropType("profile");
    setCropFileName(
      file.name || "profile-photo.jpg"
    );

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setCroppedAreaPixels(null);

    setMessage("");
    setError("");

    event.target.value = "";
  }

  /* ==========================================================
     SELECT COVER PHOTO
  ========================================================== */

  function handleCoverPhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Cover photos must be smaller than 10MB."
      );

      event.target.value = "";
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setCropImage(imageUrl);
    setCropType("cover");
    setCropFileName(
      file.name || "cover-photo.jpg"
    );

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setCroppedAreaPixels(null);

    setMessage("");
    setError("");

    event.target.value = "";
  }

  /* ==========================================================
     CROP COMPLETE
  ========================================================== */

  function handleCropComplete(
    _: Area,
    croppedPixels: Area
  ) {
    setCroppedAreaPixels(
      croppedPixels
    );
  }

  /* ==========================================================
     CANCEL CROP
  ========================================================== */

  function cancelCrop() {
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    setCropImage(null);
    setCropType(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({
      x: 0,
      y: 0,
    });
  }

  /* ==========================================================
     CREATE CROPPED IMAGE
  ========================================================== */

  async function createCroppedImage(
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> {
    const image =
      await loadImage(imageSrc);

    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Unable to create image."
      );
    }

    const outputSize =
      cropType === "profile"
        ? 800
        : 1600;

    const outputWidth =
      cropType === "profile"
        ? outputSize
        : outputSize;

    const outputHeight =
      cropType === "profile"
        ? outputSize
        : Math.round(
            outputSize / 2.5
          );

    canvas.width =
      outputWidth;

    canvas.height =
      outputHeight;

    ctx.imageSmoothingEnabled =
      true;

    ctx.imageSmoothingQuality =
      "high";

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new Error(
                  "Failed to create cropped image."
                )
              );
            }
          },
          "image/jpeg",
          0.9
        );
      }
    );
  }

  /* ==========================================================
     SAVE CROPPED IMAGE
  ========================================================== */

  async function saveCrop() {
    if (
      !cropImage ||
      !cropType ||
      !croppedAreaPixels
    ) {
      return;
    }

    if (cropType === "profile") {
      setUploading(true);
    } else {
      setUploadingCover(true);
    }

    setMessage("");
    setError("");

    try {
      const croppedBlob =
        await createCroppedImage(
          cropImage,
          croppedAreaPixels
        );

      const formData =
        new FormData();

      formData.append(
        "file",
        croppedBlob,
        getCroppedFileName(
          cropFileName
        )
      );

      const endpoint =
        cropType === "profile"
          ? "/api/landlord/profile/photo"
          : "/api/landlord/profile/cover";

      const response =
        await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to upload image."
        );
      }

      setProfile(
        (current) => {
          if (!current) {
            return current;
          }

          const existingProfile =
            current.landlordProfile || {
              phone: null,
              address: null,
              city: null,
              province: null,
              country: null,
              profilePhotoUrl: null,
              coverPhotoUrl: null,
              bio: null,
            };

          return {
            ...current,

            landlordProfile: {
              ...existingProfile,

              ...(cropType === "profile"
                ? {
                    profilePhotoUrl:
                      data.profilePhotoUrl,
                  }
                : {
                    coverPhotoUrl:
                      data.coverPhotoUrl,
                  }),
            },
          };
        }
      );

      setMessage(
        cropType === "profile"
          ? "Profile photo updated successfully."
          : "Cover photo updated successfully."
      );

      cancelCrop();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);
      setUploadingCover(false);
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
     CROP MODAL
  ========================================================== */

  if (cropImage && cropType) {
    const isProfile =
      cropType === "profile";

    return (
      <main className="min-h-screen bg-slate-950">
        <div className="flex min-h-screen flex-col">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-5 py-4">

            <div>
              <h1 className="font-semibold text-white">
                {isProfile
                  ? "Crop Profile Photo"
                  : "Crop Cover Photo"}
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                {isProfile
                  ? "Move and zoom your photo until it looks right."
                  : "Position your image to create the perfect cover."}
              </p>
            </div>

            <button
              type="button"
              onClick={cancelCrop}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>

          </div>

          {/* Crop Area */}

          <div className="relative flex-1">

            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={
                isProfile
                  ? 1
                  : 2.5
              }
              cropShape={
                isProfile
                  ? "round"
                  : "rect"
              }
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={
                handleCropComplete
              }
            />

          </div>

          {/* Controls */}

          <div className="border-t border-white/10 bg-slate-950 px-5 py-5">

            <div className="mx-auto max-w-xl">

              {/* Zoom */}

              <div className="flex items-center gap-4">

                <span className="text-xs font-medium text-slate-400">
                  Zoom
                </span>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(event) =>
                    setZoom(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full accent-brand-blue"
                />

                <span className="w-10 text-right text-xs text-slate-400">
                  {zoom.toFixed(1)}x
                </span>

              </div>

              {/* Buttons */}

              <div className="mt-5 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={cancelCrop}
                  disabled={
                    uploading ||
                    uploadingCover
                  }
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveCrop}
                  disabled={
                    !croppedAreaPixels ||
                    uploading ||
                    uploadingCover
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {uploading ||
                  uploadingCover ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={17}
                      />
                      Save Crop
                    </>
                  )}

                </button>

              </div>

            </div>

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

        {/* BACK */}

        <Link
          href="/dashboard/landlord/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        {/* HEADER */}

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

        {/* ALERTS */}

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
            COVER PHOTO
        ==================================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="p-6 sm:p-7">

            <h2 className="text-lg font-bold text-slate-900">
              Cover Photo
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a cover image to personalize your
              landlord profile.
            </p>

          </div>

          {/* Preview */}

          <div className="relative h-48 w-full bg-slate-200 sm:h-64">

            {profile?.landlordProfile?.coverPhotoUrl ? (
              <img
                src={
                  profile.landlordProfile
                    .coverPhotoUrl
                }
                alt="Profile cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-brand-blue to-blue-400">
                <p className="text-sm font-medium text-white">
                  No cover photo yet
                </p>
              </div>
            )}

            {uploadingCover && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2
                  size={28}
                  className="animate-spin text-white"
                />
              </div>
            )}

          </div>

          {/* Upload */}

          <div className="p-6 sm:p-7">

            <label
              htmlFor="cover-photo"
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark ${
                uploadingCover
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              <Camera size={17} />

              {uploadingCover
                ? "Uploading..."
                : profile?.landlordProfile
                    ?.coverPhotoUrl
                  ? "Change Cover Photo"
                  : "Choose Cover Photo"}
            </label>

            <input
              id="cover-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleCoverPhotoChange
              }
              className="hidden"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG, or WEBP · Maximum 10MB
            </p>

          </div>

        </section>

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

            {/* PHOTO */}

            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">

              {profile?.landlordProfile
                ?.profilePhotoUrl ? (
                <img
                  src={
                    profile.landlordProfile
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

            {/* UPLOAD */}

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
                  : profile?.landlordProfile
                      ?.profilePhotoUrl
                    ? "Change Photo"
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

              {/* NAME */}

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

              {/* EMAIL */}

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

              {/* PHONE */}

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

              {/* ABOUT */}

              <div>

                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-slate-700"
                >
                  About You
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  rows={5}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  placeholder="Tell students a little about yourself..."
                />

                <p className="mt-2 text-xs text-slate-500">
                  This will appear publicly on your landlord
                  profile. Maximum 500 characters.
                </p>

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

              {/* ADDRESS */}

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

              {/* CITY / PROVINCE */}

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

              {/* COUNTRY */}

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

          {/* SAVE */}

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
   LOAD IMAGE
============================================================ */

function loadImage(
  src: string
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.addEventListener(
        "load",
        () => resolve(image)
      );

      image.addEventListener(
        "error",
        (error) =>
          reject(error)
      );

      image.src = src;
    }
  );
}

/* ============================================================
   CROPPED FILE NAME
============================================================ */

function getCroppedFileName(
  originalName: string
) {
  const baseName =
    originalName
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      );

  return `${baseName}-cropped.jpg`;
}

/* ============================================================
   INITIALS
============================================================ */

function getInitials(
  name: string
) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("");

  return initials || "L";
}