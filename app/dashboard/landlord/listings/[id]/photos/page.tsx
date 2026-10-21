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

// ============================================================
// TYPES
// ============================================================

type PhotoCategory =
  | "LIVING_ROOM"
  | "BEDROOM"
  | "BATHROOM"
  | "FRONT_YARD"
  | "PARKING"
  | "MAIN_ENTRANCE"
  | "VERANDA"
  | "BED"
  | "CORRIDOR"
  | "BACK_YARD";

type Photo = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
  category: PhotoCategory | null;
};

type CategoryConfig = {
  key: PhotoCategory;
  label: string;
  icon: string;
  required: number;
  description: string;
};

type CategorySectionProps = {
  category: CategoryConfig;
  photos: Photo[];
  count: number;
  complete: boolean;
  uploading: boolean;
  savingOrder: boolean;
  deletingId: string | null;
  draggedPhotoId: string | null;
  firstPhotoId: string | null;
  lastPhotoId: string | null;
  onAddPhotos: () => void;
  onDelete: (photoId: string) => void;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    photoId: string
  ) => void;
  onDragOver: (
    event: DragEvent<HTMLDivElement>
  ) => void;
  onDrop: (
    event: DragEvent<HTMLDivElement>,
    photoId: string
  ) => void;
  onMakeCover: (photoId: string) => void;
  onMoveLeft: (photoId: string) => void;
  onMoveRight: (photoId: string) => void;
};

// ============================================================
// PHOTO CATEGORY CONFIGURATION
// ============================================================

const REQUIRED_CATEGORIES: CategoryConfig[] = [
  {
    key: "LIVING_ROOM",
    label: "Living Room",
    icon: "🛋️",
    required: 2,
    description: "Show the main living area from different angles.",
  },
  {
    key: "BEDROOM",
    label: "Bedrooms",
    icon: "🛏️",
    required: 2,
    description: "Show the available bedroom spaces clearly.",
  },
  {
    key: "BATHROOM",
    label: "Bathrooms",
    icon: "🚿",
    required: 2,
    description: "Show the bathroom facilities and condition.",
  },
  {
    key: "FRONT_YARD",
    label: "Front Yard / Exterior",
    icon: "🌳",
    required: 1,
    description: "Show the property from the front.",
  },
  {
    key: "PARKING",
    label: "Parking",
    icon: "🚗",
    required: 1,
    description: "Show available parking space.",
  },
  {
    key: "MAIN_ENTRANCE",
    label: "Main Entrance",
    icon: "🚪",
    required: 1,
    description: "Show the main entrance to the property.",
  },
  {
    key: "VERANDA",
    label: "Veranda",
    icon: "🏡",
    required: 1,
    description: "Show the veranda or covered outdoor area.",
  },
];

const OPTIONAL_CATEGORIES: CategoryConfig[] = [
  {
    key: "BED",
    label: "Beds",
    icon: "🛏️",
    required: 0,
    description: "Show beds or sleeping arrangements.",
  },
  {
    key: "CORRIDOR",
    label: "Corridors",
    icon: "🚪",
    required: 0,
    description: "Show hallways and common passageways.",
  },
  {
    key: "BACK_YARD",
    label: "Back Yard",
    icon: "🌳",
    required: 0,
    description: "Show the back yard or outdoor space.",
  },
];

const ALL_CATEGORIES = [
  ...REQUIRED_CATEGORIES,
  ...OPTIONAL_CATEGORIES,
];

const MAX_PHOTOS = 20;
const MIN_PHOTOS_TO_PUBLISH = 10;

// ============================================================
// REUSABLE THEME CLASSES
// ============================================================

const PAGE_CLASS =
  "min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-12";

const CARD_CLASS =
  "rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900";

const MUTED_TEXT_CLASS =
  "text-slate-600 dark:text-slate-400";

const INPUT_BUTTON_CLASS =
  "rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

// ============================================================
// PAGE
// ============================================================

export default function ManagePhotosPage() {
  const params = useParams();
  const listingId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedCategoryRef = useRef<PhotoCategory | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(
    null
  );

  // ============================================================
  // SAFE JSON RESPONSE
  // ============================================================

  async function getJsonResponse(response: Response) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const responseText = await response.text();

      console.error(
        "Expected JSON but received:",
        responseText
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
          data.error || "Failed to load listing photos."
        );
      }

      const loadedPhotos: Photo[] = Array.isArray(data.photos)
        ? data.photos
        : [];

      setPhotos(
        [...loadedPhotos].sort(
          (a, b) => a.sortOrder - b.sortOrder
        )
      );
    } catch (error) {
      console.error("Failed to load photos:", error);

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
    // loadPhotos is intentionally invoked when the listing ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  // ============================================================
  // CATEGORY COUNTS
  // ============================================================

  function getCategoryCount(category: PhotoCategory) {
    return photos.filter(
      (photo) => photo.category === category
    ).length;
  }

  // ============================================================
  // REQUIRED PHOTO PROGRESS
  // ============================================================

  function getRequiredPhotoCount() {
    return REQUIRED_CATEGORIES.reduce(
      (total, category) =>
        total +
        Math.min(
          getCategoryCount(category.key),
          category.required
        ),
      0
    );
  }

  const requiredPhotoCount = getRequiredPhotoCount();
  const totalUploadedPhotos = photos.length;

  // Every required category must meet its own minimum.
  // Extra photos in one category cannot compensate for a missing category.
  const publishingReady = REQUIRED_CATEGORIES.every(
    (category) =>
      getCategoryCount(category.key) >= category.required
  );

  const remainingRequiredPhotos = Math.max(
    0,
    MIN_PHOTOS_TO_PUBLISH - requiredPhotoCount
  );

  // ============================================================
  // OPEN FILE PICKER
  // ============================================================

  function openFilePicker(category: PhotoCategory) {
    if (photos.length >= MAX_PHOTOS) {
      setError(
        `You have reached the maximum of ${MAX_PHOTOS} photos.`
      );
      return;
    }

    selectedCategoryRef.current = category;

    setError("");
    setSuccess("");

    fileInputRef.current?.click();
  }

  // ============================================================
  // UPLOAD PHOTOS
  // ============================================================

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);
    const category = selectedCategoryRef.current;

    if (files.length === 0 || !category) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const remainingSlots = MAX_PHOTOS - photos.length;

      if (files.length > remainingSlots) {
        throw new Error(
          `You can only upload ${remainingSlots} more ${
            remainingSlots === 1 ? "photo" : "photos"
          }.`
        );
      }

      let uploadedCount = 0;

      for (const file of files) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("category", category);

        const response = await fetch(
          `/api/listings/${listingId}/photos`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await getJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to upload photo."
          );
        }

        if (data.photo) {
          setPhotos((currentPhotos) =>
            [...currentPhotos, data.photo].sort(
              (a, b) => a.sortOrder - b.sortOrder
            )
          );
        }

        uploadedCount++;
      }

      const categoryLabel =
        ALL_CATEGORIES.find(
          (item) => item.key === category
        )?.label || "category";

      setSuccess(
        `${uploadedCount} ${
          uploadedCount === 1 ? "photo" : "photos"
        } added to ${categoryLabel}.`
      );
    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
      selectedCategoryRef.current = null;

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ============================================================
  // DELETE PHOTO
  // ============================================================

  async function handleDeletePhoto(photoId: string) {
    const photo = photos.find(
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
          body: JSON.stringify({ photoId }),
        }
      );

      const data = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete photo."
        );
      }

      await loadPhotos();

      setSuccess("Photo deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);

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

  async function savePhotoOrder(newPhotos: Photo[]) {
    if (newPhotos.length === 0) {
      return;
    }

    setSavingOrder(true);
    setError("");
    setSuccess("");

    try {
      // Send the complete listing-wide order to the existing API.
      const photoIds = newPhotos.map((photo) => photo.id);

      const response = await fetch(
        `/api/listings/${listingId}/photos`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoIds }),
        }
      );

      const data = await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update photo order."
        );
      }

      const updatedPhotos = newPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover: index === 0,
        })
      );

      setPhotos(updatedPhotos);

      setSuccess("Photo order updated successfully.");
    } catch (error) {
      console.error("Reorder error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while reordering photos."
      );

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

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", photoId);
  }

  // ============================================================
  // DRAG OVER
  // ============================================================

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  // ============================================================
  // DROP AND REORDER
  // ============================================================

  async function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetPhotoId: string
  ) {
    event.preventDefault();

    const sourcePhotoId =
      draggedPhotoId ||
      event.dataTransfer.getData("text/plain");

    setDraggedPhotoId(null);

    if (
      !sourcePhotoId ||
      sourcePhotoId === targetPhotoId
    ) {
      return;
    }

    const currentIndex = photos.findIndex(
      (photo) => photo.id === sourcePhotoId
    );

    const targetIndex = photos.findIndex(
      (photo) => photo.id === targetPhotoId
    );

    if (currentIndex === -1 || targetIndex === -1) {
      return;
    }

    const reorderedPhotos = [...photos];
    const [movedPhoto] = reorderedPhotos.splice(
      currentIndex,
      1
    );

    reorderedPhotos.splice(
      targetIndex,
      0,
      movedPhoto
    );

    const updatedPhotos = reorderedPhotos.map(
      (photo, index) => ({
        ...photo,
        sortOrder: index,
        isCover: index === 0,
      })
    );

    setPhotos(updatedPhotos);

    await savePhotoOrder(updatedPhotos);
  }

  // ============================================================
  // MAKE COVER PHOTO
  // ============================================================

  async function handleMakeCover(photoId: string) {
    const photoIndex = photos.findIndex(
      (photo) => photo.id === photoId
    );

    if (photoIndex <= 0) {
      return;
    }

    const reorderedPhotos = [...photos];
    const [selectedPhoto] = reorderedPhotos.splice(
      photoIndex,
      1
    );

    reorderedPhotos.unshift(selectedPhoto);

    const updatedPhotos = reorderedPhotos.map(
      (photo, index) => ({
        ...photo,
        sortOrder: index,
        isCover: index === 0,
      })
    );

    setPhotos(updatedPhotos);

    await savePhotoOrder(updatedPhotos);
  }

  // ============================================================
  // MOVE PHOTO LEFT
  // ============================================================

  async function movePhotoLeft(photoId: string) {
    const index = photos.findIndex(
      (photo) => photo.id === photoId
    );

    if (index <= 0 || savingOrder) {
      return;
    }

    const reorderedPhotos = [...photos];

    [
      reorderedPhotos[index - 1],
      reorderedPhotos[index],
    ] = [
      reorderedPhotos[index],
      reorderedPhotos[index - 1],
    ];

    const updatedPhotos = reorderedPhotos.map(
      (photo, index) => ({
        ...photo,
        sortOrder: index,
        isCover: index === 0,
      })
    );

    setPhotos(updatedPhotos);

    await savePhotoOrder(updatedPhotos);
  }

  // ============================================================
  // MOVE PHOTO RIGHT
  // ============================================================

  async function movePhotoRight(photoId: string) {
    const index = photos.findIndex(
      (photo) => photo.id === photoId
    );

    if (
      index === -1 ||
      index >= photos.length - 1 ||
      savingOrder
    ) {
      return;
    }

    const reorderedPhotos = [...photos];

    [
      reorderedPhotos[index],
      reorderedPhotos[index + 1],
    ] = [
      reorderedPhotos[index + 1],
      reorderedPhotos[index],
    ];

    const updatedPhotos = reorderedPhotos.map(
      (photo, index) => ({
        ...photo,
        sortOrder: index,
        isCover: index === 0,
      })
    );

    setPhotos(updatedPhotos);

    await savePhotoOrder(updatedPhotos);
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className={PAGE_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className={`${CARD_CLASS} p-8`}>
            <p className={MUTED_TEXT_CLASS}>
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
    <main className={PAGE_CLASS}>
      <div className="mx-auto max-w-5xl">
        {/* Back */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue dark:text-slate-400 dark:hover:text-blue-400"
        >
          ← Back to My Listings
        </Link>

        {/* Header */}

        <div className="mt-6">
          <p className="text-sm font-medium text-brand-blue dark:text-blue-400">
            Manage Listing
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Property Photos
          </h1>

          <p className={`mt-2 max-w-2xl text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
            Add clear photos of your property by category.
            The first photo is the cover photo students will see.
          </p>
        </div>

        {/* Publishing Explanation */}

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
          <div className="flex gap-3">
            <div className="mt-0.5 text-xl">💡</div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                How publishing works
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                New properties are saved as{" "}
                <strong className="text-slate-900 dark:text-white">
                  Drafts
                </strong>
                . Draft listings are private and are not visible to students.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                To satisfy the photo requirement, upload at least{" "}
                <strong className="text-slate-900 dark:text-white">
                  10 photos
                </strong>{" "}
                and complete every required category. Optional categories
                can be added for additional detail.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  🔒 Draft = Private
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  📸 10 required photos
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  ⭐ Up to 20 photos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
          >
            {success}
          </div>
        )}

        {/* Overall Progress */}

        <section className={`${CARD_CLASS} mt-8 p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Photo Requirements
              </h2>

              <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
                Each required category must contain its minimum number
                of photos before the photo requirement is complete.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold">
                {requiredPhotoCount}/{MIN_PHOTOS_TO_PUBLISH}
              </p>

              <p className={`text-sm ${MUTED_TEXT_CLASS}`}>
                Required photos completed
              </p>

              <p className={`mt-1 text-xs ${MUTED_TEXT_CLASS}`}>
                {totalUploadedPhotos}/{MAX_PHOTOS} total uploaded
              </p>
            </div>
          </div>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            role="progressbar"
            aria-label="Required photo progress"
            aria-valuemin={0}
            aria-valuemax={MIN_PHOTOS_TO_PUBLISH}
            aria-valuenow={requiredPhotoCount}
          >
            <div
              className={`h-full rounded-full transition-all ${
                publishingReady
                  ? "bg-green-500"
                  : "bg-brand-blue"
              }`}
              style={{
                width: `${Math.min(
                  (requiredPhotoCount / MIN_PHOTOS_TO_PUBLISH) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            {publishingReady ? (
              <>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  ✅ Required photo coverage complete
                </p>

                <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
                  Every required category has enough photos. Your listing
                  can proceed once the other listing requirements are met.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  📸 {remainingRequiredPhotos} more required{" "}
                  {remainingRequiredPhotos === 1 ? "photo" : "photos"}
                </p>

                <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
                  Complete the required categories below to make your
                  listing ready for publishing.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Required Categories */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Required Photos
            </h2>

            <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
              These categories must be completed before your property
              can be published.
            </p>
          </div>

          <div className="space-y-4">
            {REQUIRED_CATEGORIES.map((category) => {
              const categoryPhotos = photos.filter(
                (photo) => photo.category === category.key
              );

              const count = categoryPhotos.length;
              const complete = count >= category.required;

              return (
                <CategorySection
                  key={category.key}
                  category={category}
                  photos={categoryPhotos}
                  count={count}
                  complete={complete}
                  uploading={uploading}
                  savingOrder={savingOrder}
                  deletingId={deletingId}
                  draggedPhotoId={draggedPhotoId}
                  firstPhotoId={photos[0]?.id ?? null}
                  lastPhotoId={photos[photos.length - 1]?.id ?? null}
                  onAddPhotos={() => openFilePicker(category.key)}
                  onDelete={handleDeletePhoto}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onMakeCover={handleMakeCover}
                  onMoveLeft={movePhotoLeft}
                  onMoveRight={movePhotoRight}
                />
              );
            })}
          </div>
        </section>

        {/* Optional Categories */}

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Optional Photos
            </h2>

            <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
              These categories are optional but can give students a
              better understanding of the property.
            </p>
          </div>

          <div className="space-y-4">
            {OPTIONAL_CATEGORIES.map((category) => {
              const categoryPhotos = photos.filter(
                (photo) => photo.category === category.key
              );

              return (
                <CategorySection
                  key={category.key}
                  category={category}
                  photos={categoryPhotos}
                  count={categoryPhotos.length}
                  complete={false}
                  uploading={uploading}
                  savingOrder={savingOrder}
                  deletingId={deletingId}
                  draggedPhotoId={draggedPhotoId}
                  firstPhotoId={photos[0]?.id ?? null}
                  lastPhotoId={photos[photos.length - 1]?.id ?? null}
                  onAddPhotos={() => openFilePicker(category.key)}
                  onDelete={handleDeletePhoto}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onMakeCover={handleMakeCover}
                  onMoveLeft={movePhotoLeft}
                  onMoveRight={movePhotoRight}
                />
              );
            })}
          </div>
        </section>

        {/* Hidden File Input */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Photo Management Info */}

        {photos.length > 0 && (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
            <p className="font-semibold">
              💡 Managing your photos
            </p>

            <p className={`mt-1 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
              Drag photos to rearrange them. The first photo in the
              listing-wide gallery is the cover photo and will be shown
              first to students.
            </p>

            <p className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
              You currently have{" "}
              <strong className="text-slate-900 dark:text-white">
                {photos.length}
              </strong>{" "}
              of {MAX_PHOTOS} photos uploaded.
            </p>
          </div>
        )}

        {/* Bottom Actions */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/landlord/listings"
            className={`${INPUT_BUTTON_CLASS} px-6 py-3 text-center font-semibold`}
          >
            Back to My Listings
          </Link>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// CATEGORY SECTION COMPONENT
// ============================================================

function CategorySection({
  category,
  photos,
  count,
  complete,
  uploading,
  savingOrder,
  deletingId,
  draggedPhotoId,
  firstPhotoId,
  lastPhotoId,
  onAddPhotos,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onMakeCover,
  onMoveLeft,
  onMoveRight,
}: CategorySectionProps) {
  const hasRequirement = category.required > 0;

  return (
    <div className={`${CARD_CLASS} overflow-hidden`}>
      {/* Category Header */}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
            {category.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {category.label}
              </h3>

              {hasRequirement && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    complete
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {complete ? "✓ Complete" : "Required"}
                </span>
              )}

              {!hasRequirement && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Optional
                </span>
              )}
            </div>

            <p className={`mt-1 text-sm ${MUTED_TEXT_CLASS}`}>
              {category.description}
            </p>

            <p className={`mt-1 text-xs font-medium ${MUTED_TEXT_CLASS}`}>
              {hasRequirement
                ? `${Math.min(count, category.required)}/${category.required} ${
                    category.required === 1 ? "photo" : "photos"
                  } required`
                : `${count} ${count === 1 ? "photo" : "photos"}`}
            </p>
          </div>
        </div>

        {/* Add Photos */}

        <button
          type="button"
          onClick={onAddPhotos}
          disabled={uploading || photos.length >= MAX_PHOTOS}
          className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading..."
            : photos.length >= MAX_PHOTOS
              ? "Photo Limit Reached"
              : `📸 Add ${category.label} Photos`}
        </button>
      </div>

      {/* Category Progress */}

      {hasRequirement && (
        <div className="px-5 pb-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                complete ? "bg-green-500" : "bg-brand-blue"
              }`}
              style={{
                width: `${Math.min(
                  (count / category.required) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Photos */}

      {photos.length > 0 && (
        <div className="border-t border-slate-200 p-5 dark:border-slate-700">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable={!savingOrder}
                onDragStart={(event) =>
                  onDragStart(event, photo.id)
                }
                onDragOver={onDragOver}
                onDrop={(event) =>
                  onDrop(event, photo.id)
                }
                className={`overflow-hidden rounded-xl border bg-white transition dark:bg-slate-900 ${
                  draggedPhotoId === photo.id
                    ? "border-brand-blue opacity-50"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {/* Image */}

                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                  <img
                    src={photo.url}
                    alt={`${category.label} photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Drag Handle */}

                  <div className="absolute left-3 top-3 flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-black/70 text-sm text-white shadow">
                    ⠿
                  </div>

                  {/* Cover */}

                  {photo.isCover && (
                    <div className="absolute left-12 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 shadow">
                      ⭐ Cover
                    </div>
                  )}

                  {/* Global Photo Number */}

                  <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                    {photo.sortOrder + 1}
                  </div>
                </div>

                {/* Controls */}

                <div className="p-3">
                  <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                    {photo.fileName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onMoveLeft(photo.id)}
                      disabled={
                        photo.id === firstPhotoId || savingOrder
                      }
                      className={`${INPUT_BUTTON_CLASS} px-2.5 py-1.5 text-sm font-semibold`}
                      title="Move earlier in gallery"
                      aria-label={`Move ${photo.fileName} earlier`}
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={() => onMoveRight(photo.id)}
                      disabled={
                        photo.id === lastPhotoId || savingOrder
                      }
                      className={`${INPUT_BUTTON_CLASS} px-2.5 py-1.5 text-sm font-semibold`}
                      title="Move later in gallery"
                      aria-label={`Move ${photo.fileName} later`}
                    >
                      →
                    </button>

                    {!photo.isCover && (
                      <button
                        type="button"
                        onClick={() => onMakeCover(photo.id)}
                        disabled={savingOrder}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      >
                        ⭐ Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(photo.id)}
                      disabled={
                        deletingId === photo.id || savingOrder
                      }
                      className="ml-auto rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950"
                    >
                      {deletingId === photo.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty Category */}

      {photos.length === 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className={`text-sm ${MUTED_TEXT_CLASS}`}>
            No {category.label.toLowerCase()} photos added yet.
          </p>

          <button
            type="button"
            onClick={onAddPhotos}
            disabled={uploading || photos.length >= MAX_PHOTOS}
            className="mt-3 text-sm font-semibold text-brand-blue transition hover:underline disabled:opacity-50 dark:text-blue-400"
          >
            + Add photos
          </button>
        </div>
      )}
    </div>
  );
}