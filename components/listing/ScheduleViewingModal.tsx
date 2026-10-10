"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ScheduleViewingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  listingId?: string;
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
  listingTitle: string;
};

type StudentProfile = {
  name: string;
  email: string;
  phone: string;
};

export default function ScheduleViewingModal({
  isOpen,
  onClose,
  listingId,
  landlord,
  listingTitle,
}: ScheduleViewingModalProps) {
  // Student contact information
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Viewing details
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  // Loading and submission states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load the authenticated student's contact information.
  useEffect(() => {
    if (!isOpen || !listingId) {
      return;
    }

    let isCancelled = false;

    async function loadStudentProfile() {
      setIsLoadingProfile(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/viewing-requests", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Please sign in to your student account before requesting a viewing."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "Only students can request property viewings."
            );
          }

          throw new Error(
            data?.error || "Unable to load your contact information."
          );
        }

        if (!data?.student) {
          throw new Error(
            "We couldn't retrieve your profile information."
          );
        }

        if (!isCancelled) {
          const profile: StudentProfile = data.student;

          setName(profile.name || "");
          setPhoneNumber(profile.phone || "");
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to load student profile:", error);

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your contact information."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadStudentProfile();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, listingId]);

  // Use the browser's local date for the minimum date.
  const today = new Date();

  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Reset the form when the modal closes.
  function resetForm() {
    setName("");
    setPhoneNumber("");
    setDate("");
    setTime("");
    setNote("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  // Validate and submit the viewing request.
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (isLoadingProfile) {
      setErrorMessage(
        "Please wait while your profile information loads."
      );
      return;
    }

    console.log("Viewing form values:", {
      date,
      time,
      name,
      phoneNumber,
    });

    // Identify exactly which required fields are missing.
    const missingFields: string[] = [];

    if (!name.trim()) missingFields.push("your name");
    if (!phoneNumber.trim()) {
      missingFields.push("your phone number");
    }
    if (!date) missingFields.push("a preferred date");
    if (!time) missingFields.push("a preferred time");

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please provide ${missingFields.join(", ")}.`
      );
      return;
    }

    if (name.trim().length > 100) {
      setErrorMessage("Your name cannot exceed 100 characters.");
      return;
    }

    if (phoneNumber.trim().length > 40) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    // Validate the calendar date format.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setErrorMessage("Please select a valid viewing date.");
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const calendarDate = new Date(
      Date.UTC(year, month - 1, day)
    );

    if (
      calendarDate.getUTCFullYear() !== year ||
      calendarDate.getUTCMonth() !== month - 1 ||
      calendarDate.getUTCDate() !== day
    ) {
      setErrorMessage("Please select a valid calendar date.");
      return;
    }

    // Validate the time format.
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setErrorMessage("Please select a valid viewing time.");
      return;
    }

    if (!listingId) {
      setErrorMessage(
        "This sample listing cannot accept viewing requests yet. Please open a published property listing."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/viewing-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          date,
          time,
          note: note.trim(),
          name: name.trim(),
          phone: phoneNumber.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage(
            "Please sign in to your student account before requesting a viewing."
          );
        } else if (response.status === 403) {
          setErrorMessage(
            "Only student accounts can request property viewings."
          );
        } else {
          setErrorMessage(
            data?.error ||
              "We couldn't submit your viewing request. Please try again."
          );
        }

        return;
      }

      setSuccessMessage(
        "Your viewing request has been submitted! The landlord has been notified."
      );

      setName("");
      setPhoneNumber("");
      setDate("");
      setTime("");
      setNote("");
    } catch (error) {
      console.error("Viewing request submission failed:", error);

      setErrorMessage(
        "Unable to connect to MushaLink. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
    >
      {/* Modal container */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-lg shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-viewing-title"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="schedule-viewing-title"
              className="text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Schedule Viewing
            </h2>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close viewing request"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X size={22} />
            </button>
          </div>

          <p className="mt-3 text-slate-600">
            Choose your preferred date and time to visit this property.
          </p>

          {/* Property summary */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Property
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {listingTitle}
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Landlord
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {landlord.name}
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          {successMessage ? (
            <div
              role="status"
              className="rounded-2xl border border-green-200 bg-green-50 p-5"
            >
              <CheckCircle2
                size={32}
                className="text-green-600"
              />

              <h3 className="mt-3 text-lg font-bold text-green-900">
                Request submitted!
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-800">
                {successMessage}
              </p>

              <p className="mt-3 text-sm text-green-800">
                You can close this window now.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-5 w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              id="viewing-request-form"
              noValidate
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Profile loading indicator */}
              {isLoadingProfile && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <Loader2
                    size={18}
                    className="shrink-0 animate-spin"
                  />
                  <p>Loading your profile information...</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="viewing-name"
                  className="mb-2 flex items-center gap-2 font-medium text-slate-700"
                >
                  <User size={18} />
                  Your Name
                </label>

                <input
                  id="viewing-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(event) =>
                    setName(event.currentTarget.value)
                  }
                  maxLength={100}
                  required
                  disabled={isLoadingProfile || isSubmitting}
                  className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-wait disabled:bg-slate-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="viewing-phone"
                  className="mb-2 flex items-center gap-2 font-medium text-slate-700"
                >
                  <Phone size={18} />
                  Phone Number
                </label>

                <input
                  id="viewing-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. +263 77 123 4567"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.currentTarget.value)
                  }
                  maxLength={40}
                  required
                  disabled={isLoadingProfile || isSubmitting}
                  className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-wait disabled:bg-slate-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Include your country code.
                </p>
              </div>

              {/* Date and time */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="viewing-date"
                    className="mb-2 flex items-center gap-2 font-medium text-slate-700"
                  >
                    <Calendar size={18} />
                    Preferred Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="viewing-date"
                    name="date"
                    type="date"
                    min={minimumDate}
                    value={date}
                    onChange={(event) => setDate(event.currentTarget.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full min-w-0 rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:bg-slate-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Choose a date for your visit.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="viewing-time"
                    className="mb-2 flex items-center gap-2 font-medium text-slate-700"
                  >
                    <Clock size={18} />
                    Preferred Time <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="viewing-time"
                    name="time"
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.currentTarget.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full min-w-0 rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:bg-slate-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Select your preferred visiting time.
                  </p>
                </div>
              </div>

              {/* Additional note */}
              <div>
                <label
                  htmlFor="viewing-note"
                  className="mb-2 flex items-center gap-2 font-medium text-slate-700"
                >
                  <MessageSquare size={18} />
                  Additional Note
                  <span className="text-sm font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="viewing-note"
                  name="note"
                  rows={4}
                  placeholder="Anything you'd like the landlord to know..."
                  value={note}
                  onChange={(event) =>
                    setNote(event.currentTarget.value)
                  }
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="w-full resize-y rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:bg-slate-100"
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {note.length}/1000
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Fixed footer */}
        {!successMessage && (
          <div className="shrink-0 border-t border-slate-200 bg-white p-6 sm:p-8">
            <button
              type="submit"
              form="viewing-request-form"
              disabled={isSubmitting || isLoadingProfile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting Request...
                </>
              ) : isLoadingProfile ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Loading Profile...
                </>
              ) : (
                "Request Viewing"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Your request will be sent to the landlord for confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}