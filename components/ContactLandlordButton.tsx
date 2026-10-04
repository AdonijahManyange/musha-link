"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ContactLandlordButtonProps = {
  listingId: string;
};

export default function ContactLandlordButton({
  listingId,
}: ContactLandlordButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content = message.trim();

    if (!content || sending) {
      return;
    }

    try {
      setSending(true);
      setError(null);

      const response = await fetch(
        "/api/messages/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            listingId,
            message: content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to start the conversation."
        );
      }

      const conversationId =
        data?.conversation?.id;

      if (!conversationId) {
        throw new Error(
          "Conversation was created, but no conversation ID was returned."
        );
      }

      router.push(
        `/messages/${conversationId}`
      );
    } catch (error) {
      console.error(
        "Failed to contact landlord:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to contact landlord."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Contact Landlord Button */}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className="w-full rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
      >
        Contact Landlord
      </button>

      {/* Modal */}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Header */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Contact Landlord
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Send a message about this
                  property.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >
              <label
                htmlFor="contact-message"
                className="text-sm font-medium text-slate-700"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Hi, I'm interested in this property. Is it still available?"
                rows={5}
                disabled={sending}
                autoFocus
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Actions */}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={sending}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !message.trim()
                  }
                  className="flex-1 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}