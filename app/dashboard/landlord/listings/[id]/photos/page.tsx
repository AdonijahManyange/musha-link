"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Photo = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
};

const MAX_PHOTOS = 10;
const MIN_PHOTOS_TO_PUBLISH = 5;

export default function ManagePhotosPage() {
  const params = useParams();

  const listingId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [draggedPhotoId, setDraggedPhotoId] = useState<
    string | null
  >(null);

  // ============================================================
  // SAFE JSON RESPONSE
  // ============================================================

  async function getJsonResponse(response: Response) {
    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();

      console.error(
        "Expected JSON but received:",
        text
      );

      throw new Error(
        "The server returned an unexpected response. Check the terminal for more details."
      );
    }

    return response.json();
  }

  // ============================================================
  // LOAD PHOTOS
  // ============================================================

  async function loadPhotos() {
    try {
      setError("");

      const response = await fetch(
        `/api/listings/${listingId}/photos`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load listing photos."
        );
      }

      // API returns:
      //
      // {
      //   listingId,
      //   photos,
      //   photoCount,
      //   maxPhotos,
      //   canPublish
      // }

      setPhotos(
        Array.isArray(data.photos)
          ? data.photos
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load photos:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading photos."
      );

      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (listingId) {
      loadPhotos();
    }
  }, [listingId]);

  // ============================================================
  // UPLOAD PHOTOS
  // ============================================================

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const remainingSlots =
        MAX_PHOTOS - photos.length;

      if (files.length > remainingSlots) {
        throw new Error(
          `You can only upload ${remainingSlots} more ${
            remainingSlots === 1
              ? "photo"
              : "photos"
          }.`
        );
      }

      let uploadedCount = 0;

      for (const file of files) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          `/api/listings/${listingId}/photos`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data =
          await getJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to upload photo."
          );
        }

        if (data.photo) {
          setPhotos((currentPhotos) => [
            ...currentPhotos,
            data.photo,
          ]);
        }

        uploadedCount++;
      }

      setSuccess(
        `${uploadedCount} ${
          uploadedCount === 1
            ? "photo"
            : "photos"
        } uploaded successfully.`
      );
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ============================================================
  // OPEN FILE PICKER
  // ============================================================

  function openFilePicker() {
    if (photos.length >= MAX_PHOTOS) {
      setError(
        "You have reached the maximum of 10 photos."
      );

      return;
    }

    fileInputRef.current?.click();
  }

  // ============================================================
  // DELETE PHOTO
  // ============================================================

  async function handleDeletePhoto(
    photoId: string
  ) {
    const photo =
      photos.find(
        (item) => item.id === photoId
      );

    if (!photo) {
      return;
    }

    const confirmed = window.confirm(
      photo.isCover
        ? "This is your cover photo. Deleting it will make the next photo your cover photo. Continue?"
        : "Are you sure you want to delete this photo?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(photoId);

    try {
      const response = await fetch(
        `/api/listings/${listingId}/photos`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoId,
          }),
        }
      );

      const data =
        await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete photo."
        );
      }

      setPhotos((currentPhotos) =>
        currentPhotos.filter(
          (photo) =>
            photo.id !== photoId
        )
      );

      setSuccess(
        "Photo deleted successfully."
      );

      // Reload so cover/order exactly matches database.
      await loadPhotos();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the photo."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ============================================================
  // SAVE PHOTO ORDER
  // ============================================================

  async function savePhotoOrder(
    newPhotos: Photo[]
  ) {
    if (newPhotos.length === 0) {
      return;
    }

    setSavingOrder(true);
    setError("");
    setSuccess("");

    try {
      const photoIds =
        newPhotos.map(
          (photo) => photo.id
        );

      const response = await fetch(
        `/api/listings/${listingId}/photos`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoIds,
          }),
        }
      );

      const data =
        await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update photo order."
        );
      }

      // Make first photo the cover in local state.
      const updatedPhotos =
        newPhotos.map(
          (photo, index) => ({
            ...photo,
            sortOrder: index,
            isCover: index === 0,
          })
        );

      setPhotos(updatedPhotos);

      setSuccess(
        "Photo order updated successfully."
      );
    } catch (error) {
      console.error(
        "Reorder error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while reordering photos."
      );

      // Restore actual database state.
      await loadPhotos();
    } finally {
      setSavingOrder(false);
    }
  }

  // ============================================================
  // DRAG START
  // ============================================================

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    photoId: string
  ) {
    setDraggedPhotoId(photoId);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      photoId
    );
  }

  // ============================================================
  // DRAG OVER
  // ============================================================

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  }

  // ============================================================
  // DROP
  // ============================================================

  async function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetPhotoId: string
  ) {
    event.preventDefault();

    const sourcePhotoId =
      draggedPhotoId ||
      event.dataTransfer.getData(
        "text/plain"
      );

    setDraggedPhotoId(null);

    if (
      !sourcePhotoId ||
      sourcePhotoId === targetPhotoId
    ) {
      return;
    }

    const currentIndex =
      photos.findIndex(
        (photo) =>
          photo.id === sourcePhotoId
      );

    const targetIndex =
      photos.findIndex(
        (photo) =>
          photo.id === targetPhotoId
      );

    if (
      currentIndex === -1 ||
      targetIndex === -1
    ) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const [
      movedPhoto,
    ] = reorderedPhotos.splice(
      currentIndex,
      1
    );

    reorderedPhotos.splice(
      targetIndex,
      0,
      movedPhoto
    );

    // Update UI immediately.
    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover: index === 0,
        })
      )
    );

    // Persist to database.
    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // MAKE COVER PHOTO
  // ============================================================

  async function handleMakeCover(
    photoId: string
  ) {
    const photoIndex =
      photos.findIndex(
        (photo) =>
          photo.id === photoId
      );

    if (photoIndex === -1) {
      return;
    }

    if (photoIndex === 0) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const [
      selectedPhoto,
    ] = reorderedPhotos.splice(
      photoIndex,
      1
    );

    reorderedPhotos.unshift(
      selectedPhoto
    );

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover: index === 0,
        })
      )
    );

    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // MOVE LEFT
  // ============================================================

  async function movePhotoLeft(
    photoId: string
  ) {
    const index =
      photos.findIndex(
        (photo) =>
          photo.id === photoId
      );

    if (index <= 0) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const temp =
      reorderedPhotos[index];

    reorderedPhotos[index] =
      reorderedPhotos[index - 1];

    reorderedPhotos[index - 1] =
      temp;

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover: index === 0,
        })
      )
    );

    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // MOVE RIGHT
  // ============================================================

  async function movePhotoRight(
    photoId: string
  ) {
    const index =
      photos.findIndex(
        (photo) =>
          photo.id === photoId
      );

    if (
      index === -1 ||
      index >= photos.length - 1
    ) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const temp =
      reorderedPhotos[index];

    reorderedPhotos[index] =
      reorderedPhotos[index + 1];

    reorderedPhotos[index + 1] =
      temp;

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover: index === 0,
        })
      )
    );

    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">
              Loading photos...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to My Listings
        </Link>

        {/* Header */}

        <div className="mt-6">
          <p className="text-sm font-medium text-brand-blue">
            Manage Listing
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Property Photos
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Drag photos to rearrange them. The first
            photo is the cover photo students will see.
          </p>
        </div>

        {/* Alerts */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Photo Requirements */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Listing Photos
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Add clear photos so students can get a
                good idea of what the property looks like.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-2xl font-bold text-slate-900">
                {photos.length}/{MAX_PHOTOS}
              </p>

              <p className="text-sm text-slate-500">
                Photos uploaded
              </p>
            </div>

          </div>

          {/* Publishing Progress */}

          <div className="mt-6 rounded-xl bg-slate-50 p-4">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="font-semibold text-slate-900">
                  {photos.length >=
                  MIN_PHOTOS_TO_PUBLISH
                    ? "Ready to publish"
                    : "Add more photos to publish"}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {photos.length >=
                  MIN_PHOTOS_TO_PUBLISH
                    ? "You have enough photos to publish this listing."
                    : `You need at least ${MIN_PHOTOS_TO_PUBLISH} photos to publish this listing.`}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  photos.length >=
                  MIN_PHOTOS_TO_PUBLISH
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {photos.length >=
                MIN_PHOTOS_TO_PUBLISH
                  ? "Ready"
                  : "Draft"}
              </span>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-brand-blue transition-all"
                style={{
                  width: `${Math.min(
                    (photos.length /
                      MIN_PHOTOS_TO_PUBLISH) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          {/* Upload */}

          <div className="mt-6">

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={openFilePicker}
              disabled={
                uploading ||
                photos.length >= MAX_PHOTOS
              }
              className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-brand-blue hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <div className="text-3xl">
                📸
              </div>

              <p className="mt-2 font-semibold text-slate-900">
                {uploading
                  ? "Uploading photos..."
                  : photos.length >=
                    MAX_PHOTOS
                  ? "Maximum photos reached"
                  : "Add property photos"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG or WEBP · Maximum 10MB each
              </p>

              <p className="mt-1 text-xs text-slate-400">
                You can select multiple photos at once.
              </p>

            </button>

          </div>

        </section>

        {/* Photo Grid */}

        <section className="mt-8">

          {photos.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🏠
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No photos yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Add at least one photo to your listing.
                We recommend adding around 10 photos so
                students can properly view the property.
              </p>

              <button
                type="button"
                onClick={openFilePicker}
                className="mt-6 rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Upload First Photo
              </button>

            </div>
          ) : (
            <>
              {/* Instructions */}

              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
                <strong className="text-slate-900">
                  💡 Manage your photos:
                </strong>{" "}
                Drag a photo onto another photo to
                rearrange them. The first photo is
                automatically your cover photo.
              </div>

              {/* Saving indicator */}

              {savingOrder && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  Saving photo order...
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {photos.map(
                  (photo, index) => (
                    <div
                      key={photo.id}
                      draggable={!savingOrder}
                      onDragStart={(event) =>
                        handleDragStart(
                          event,
                          photo.id
                        )
                      }
                      onDragOver={
                        handleDragOver
                      }
                      onDrop={(event) =>
                        handleDrop(
                          event,
                          photo.id
                        )
                      }
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                        draggedPhotoId ===
                        photo.id
                          ? "border-brand-blue opacity-50"
                          : "border-slate-200"
                      }`}
                    >

                      {/* Image */}

                      <div className="relative aspect-[4/3] bg-slate-100">

                        <img
                          src={photo.url}
                          alt={`Property photo ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />

                        {/* Drag Handle */}

                        <div className="absolute left-3 top-3 flex h-9 w-9 cursor-grab items-center justify-center rounded-full bg-black/70 text-lg text-white shadow">
                          ⠿
                        </div>

                        {/* Cover */}

                        {photo.isCover && (
                          <div className="absolute left-14 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                            ⭐ Cover Photo
                          </div>
                        )}

                        {/* Number */}

                        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                          {index + 1}/
                          {photos.length}
                        </div>

                      </div>

                      {/* Info */}

                      <div className="p-4">

                        <p className="truncate text-sm font-medium text-slate-800">
                          {photo.fileName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {photo.isCover
                            ? "Main photo students will see"
                            : "Property photo"}
                        </p>

                        {/* Controls */}

                        <div className="mt-4 flex flex-wrap gap-2">

                          {/* Move Left */}

                          <button
                            type="button"
                            onClick={() =>
                              movePhotoLeft(
                                photo.id
                              )
                            }
                            disabled={
                              index === 0 ||
                              savingOrder
                            }
                            title="Move left"
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ←
                          </button>

                          {/* Move Right */}

                          <button
                            type="button"
                            onClick={() =>
                              movePhotoRight(
                                photo.id
                              )
                            }
                            disabled={
                              index ===
                                photos.length -
                                  1 ||
                              savingOrder
                            }
                            title="Move right"
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            →
                          </button>

                          {/* Make Cover */}

                          {!photo.isCover && (
                            <button
                              type="button"
                              onClick={() =>
                                handleMakeCover(
                                  photo.id
                                )
                              }
                              disabled={
                                savingOrder
                              }
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-brand-blue transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ⭐ Make Cover
                            </button>
                          )}

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePhoto(
                                photo.id
                              )
                            }
                            disabled={
                              deletingId ===
                              photo.id
                            }
                            className="ml-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            photo.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            </>
          )}

        </section>

        {/* Recommendation */}

        {photos.length > 0 &&
          photos.length < MAX_PHOTOS && (
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <p className="font-semibold text-slate-900">
                💡 Photo tip
              </p>

              <p className="mt-1 text-sm text-slate-600">
                We recommend around 10 photos:
                exterior, living areas, bedrooms,
                kitchen, bathroom, outdoor spaces,
                and other important areas.
              </p>

            </div>
          )}

        {/* Bottom Actions */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <Link
            href="/dashboard/landlord/listings"
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to My Listings
          </Link>

        </div>

      </div>
    </main>
  );
}