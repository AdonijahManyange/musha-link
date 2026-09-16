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
// PAGE
// ============================================================

export default function ManagePhotosPage() {
  const params = useParams();

  const listingId = params.id as string;

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const selectedCategoryRef =
    useRef<PhotoCategory | null>(null);

  const [photos, setPhotos] =
    useState<Photo[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [savingOrder, setSavingOrder] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [draggedPhotoId, setDraggedPhotoId] =
    useState<string | null>(null);

  // ============================================================
  // SAFE JSON RESPONSE
  // ============================================================

  async function getJsonResponse(
    response: Response
  ) {
    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType.includes(
        "application/json"
      )
    ) {
      const text =
        await response.text();

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

      const response =
        await fetch(
          `/api/listings/${listingId}/photos`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        await getJsonResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load listing photos."
        );
      }

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
  // GET CATEGORY PHOTO COUNT
  // ============================================================

  function getCategoryCount(
    category: PhotoCategory
  ) {
    return photos.filter(
      (photo) =>
        photo.category === category
    ).length;
  }

  // ============================================================
  // REQUIRED PHOTO COUNT
  // ============================================================

  function getRequiredPhotoCount() {
    return REQUIRED_CATEGORIES.reduce(
      (total, category) =>
        total +
        Math.min(
          getCategoryCount(
            category.key
          ),
          category.required
        ),
      0
    );
  }

  const requiredPhotoCount =
    getRequiredPhotoCount();

  const publishingReady =
    requiredPhotoCount >=
    MIN_PHOTOS_TO_PUBLISH;

  // ============================================================
  // OPEN CATEGORY FILE PICKER
  // ============================================================

  function openFilePicker(
    category: PhotoCategory
  ) {
    if (photos.length >= MAX_PHOTOS) {
      setError(
        `You have reached the maximum of ${MAX_PHOTOS} photos.`
      );

      return;
    }

    selectedCategoryRef.current =
      category;

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
    const files = Array.from(
      event.target.files || []
    );

    const category =
      selectedCategoryRef.current;

    if (
      files.length === 0 ||
      !category
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const remainingSlots =
        MAX_PHOTOS - photos.length;

      if (
        files.length >
        remainingSlots
      ) {
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
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "category",
          category
        );

        const response =
          await fetch(
            `/api/listings/${listingId}/photos`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await getJsonResponse(
            response
          );

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to upload photo."
          );
        }

        if (data.photo) {
          setPhotos(
            (currentPhotos) => [
              ...currentPhotos,
              data.photo,
            ]
          );
        }

        uploadedCount++;
      }

      const categoryLabel =
        ALL_CATEGORIES.find(
          (item) =>
            item.key === category
        )?.label ||
        "category";

      setSuccess(
        `${uploadedCount} ${
          uploadedCount === 1
            ? "photo"
            : "photos"
        } added to ${categoryLabel}.`
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

      selectedCategoryRef.current =
        null;

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    }
  }

  // ============================================================
  // DELETE PHOTO
  // ============================================================

  async function handleDeletePhoto(
    photoId: string
  ) {
    const photo =
      photos.find(
        (item) =>
          item.id === photoId
      );

    if (!photo) {
      return;
    }

    const confirmed =
      window.confirm(
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
      const response =
        await fetch(
          `/api/listings/${listingId}/photos`,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              photoId,
            }),
          }
        );

      const data =
        await getJsonResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete photo."
        );
      }

      setPhotos(
        (currentPhotos) =>
          currentPhotos.filter(
            (item) =>
              item.id !== photoId
          )
      );

      setSuccess(
        "Photo deleted successfully."
      );

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
    if (
      newPhotos.length === 0
    ) {
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

      const response =
        await fetch(
          `/api/listings/${listingId}/photos`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              photoIds,
            }),
          }
        );

      const data =
        await getJsonResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update photo order."
        );
      }

      const updatedPhotos =
        newPhotos.map(
          (photo, index) => ({
            ...photo,
            sortOrder: index,
            isCover:
              index === 0,
          })
        );

      setPhotos(
        updatedPhotos
      );

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
    setDraggedPhotoId(
      photoId
    );

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
      sourcePhotoId ===
        targetPhotoId
    ) {
      return;
    }

    const currentIndex =
      photos.findIndex(
        (photo) =>
          photo.id ===
          sourcePhotoId
      );

    const targetIndex =
      photos.findIndex(
        (photo) =>
          photo.id ===
          targetPhotoId
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
    ] =
      reorderedPhotos.splice(
        currentIndex,
        1
      );

    reorderedPhotos.splice(
      targetIndex,
      0,
      movedPhoto
    );

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover:
            index === 0,
        })
      )
    );

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

    if (
      photoIndex === -1 ||
      photoIndex === 0
    ) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const [
      selectedPhoto,
    ] =
      reorderedPhotos.splice(
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
          isCover:
            index === 0,
        })
      )
    );

    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // MOVE PHOTO LEFT
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
      reorderedPhotos[
        index - 1
      ];

    reorderedPhotos[
      index - 1
    ] = temp;

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover:
            index === 0,
        })
      )
    );

    await savePhotoOrder(
      reorderedPhotos
    );
  }

  // ============================================================
  // MOVE PHOTO RIGHT
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
      index >=
        photos.length - 1
    ) {
      return;
    }

    const reorderedPhotos = [
      ...photos,
    ];

    const temp =
      reorderedPhotos[index];

    reorderedPhotos[index] =
      reorderedPhotos[
        index + 1
      ];

    reorderedPhotos[
      index + 1
    ] = temp;

    setPhotos(
      reorderedPhotos.map(
        (photo, index) => ({
          ...photo,
          sortOrder: index,
          isCover:
            index === 0,
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

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add clear photos of your property by
            category. The first photo is the cover
            photo students will see.
          </p>
        </div>

        {/* Publishing Explanation */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 text-xl">
              💡
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                How publishing works
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                New properties are saved as{" "}
                <strong className="text-slate-900">
                  Drafts
                </strong>
                . Draft listings are private and
                are not visible to students.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                To publish your property, you need
                at least{" "}
                <strong className="text-slate-900">
                  10 photos
                </strong>{" "}
                across the required categories.
                Optional categories can be added
                for additional detail.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                  🔒 Draft = Private
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                  📸 10 required photos
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                  ⭐ Up to 20 photos
                </span>
              </div>
            </div>
          </div>
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

        {/* Overall Progress */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Photo Requirements
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Add the required photos below before
                publishing your listing.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-slate-900">
                {requiredPhotoCount}/
                {MIN_PHOTOS_TO_PUBLISH}
              </p>

              <p className="text-sm text-slate-500">
                Required photos
              </p>
            </div>
          </div>

          {/* Progress bar */}

          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-blue transition-all"
                style={{
                  width: `${Math.min(
                    (requiredPhotoCount /
                      MIN_PHOTOS_TO_PUBLISH) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            {publishingReady ? (
              <>
                <p className="font-semibold text-green-700">
                  ✅ Required photo coverage complete
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Your listing has the required
                  category photos. It can now be
                  published once the other listing
                  requirements are complete.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-900">
                  📸{" "}
                  {MIN_PHOTOS_TO_PUBLISH -
                    requiredPhotoCount}{" "}
                  more required{" "}
                  {MIN_PHOTOS_TO_PUBLISH -
                    requiredPhotoCount ===
                  1
                    ? "photo"
                    : "photos"}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Complete the required categories
                  below to make your listing ready
                  to publish.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Required Categories */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Required Photos
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              These categories are required before
              your property can be published.
            </p>
          </div>

          <div className="space-y-4">
            {REQUIRED_CATEGORIES.map(
              (category) => {
                const count =
                  getCategoryCount(
                    category.key
                  );

                const complete =
                  count >=
                  category.required;

                return (
                  <CategorySection
                    key={category.key}
                    category={category}
                    photos={photos.filter(
                      (photo) =>
                        photo.category ===
                        category.key
                    )}
                    count={count}
                    complete={complete}
                    uploading={uploading}
                    savingOrder={
                      savingOrder
                    }
                    deletingId={
                      deletingId
                    }
                    draggedPhotoId={
                      draggedPhotoId
                    }
                    onAddPhotos={() =>
                      openFilePicker(
                        category.key
                      )
                    }
                    onDelete={
                      handleDeletePhoto
                    }
                    onDragStart={
                      handleDragStart
                    }
                    onDragOver={
                      handleDragOver
                    }
                    onDrop={
                      handleDrop
                    }
                    onMakeCover={
                      handleMakeCover
                    }
                    onMoveLeft={
                      movePhotoLeft
                    }
                    onMoveRight={
                      movePhotoRight
                    }
                  />
                );
              }
            )}
          </div>
        </section>

        {/* Optional Categories */}

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Optional Photos
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              These categories aren't required,
              but they can give students a better
              understanding of the property.
            </p>
          </div>

          <div className="space-y-4">
            {OPTIONAL_CATEGORIES.map(
              (category) => {
                const count =
                  getCategoryCount(
                    category.key
                  );

                return (
                  <CategorySection
                    key={category.key}
                    category={category}
                    photos={photos.filter(
                      (photo) =>
                        photo.category ===
                        category.key
                    )}
                    count={count}
                    complete={false}
                    uploading={uploading}
                    savingOrder={
                      savingOrder
                    }
                    deletingId={
                      deletingId
                    }
                    draggedPhotoId={
                      draggedPhotoId
                    }
                    onAddPhotos={() =>
                      openFilePicker(
                        category.key
                      )
                    }
                    onDelete={
                      handleDeletePhoto
                    }
                    onDragStart={
                      handleDragStart
                    }
                    onDragOver={
                      handleDragOver
                    }
                    onDrop={
                      handleDrop
                    }
                    onMakeCover={
                      handleMakeCover
                    }
                    onMoveLeft={
                      movePhotoLeft
                    }
                    onMoveRight={
                      movePhotoRight
                    }
                  />
                );
              }
            )}
          </div>
        </section>

        {/* Hidden File Input */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={
            handleFileChange
          }
          className="hidden"
        />

        {/* Photo Management Info */}

        {photos.length > 0 && (
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="font-semibold text-slate-900">
              💡 Managing your photos
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Drag photos to rearrange them. The
              first photo is your cover photo and
              will be shown first to students.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              You currently have{" "}
              <strong className="text-slate-900">
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
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
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

type CategorySectionProps = {
  category: CategoryConfig;
  photos: Photo[];
  count: number;
  complete: boolean;
  uploading: boolean;
  savingOrder: boolean;
  deletingId: string | null;
  draggedPhotoId: string | null;
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
  onMakeCover: (
    photoId: string
  ) => void;
  onMoveLeft: (
    photoId: string
  ) => void;
  onMoveRight: (
    photoId: string
  ) => void;
};

function CategorySection({
  category,
  photos,
  count,
  complete,
  uploading,
  savingOrder,
  deletingId,
  draggedPhotoId,
  onAddPhotos,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onMakeCover,
  onMoveLeft,
  onMoveRight,
}: CategorySectionProps) {
  const hasRequirement =
    category.required > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Category Header */}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
            {category.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                {category.label}
              </h3>

              {hasRequirement && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    complete
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {complete
                    ? "✓ Complete"
                    : "Required"}
                </span>
              )}

              {!hasRequirement && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  Optional
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {category.description}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {hasRequirement
                ? `${count}/${category.required} ${
                    category.required === 1
                      ? "photo"
                      : "photos"
                  } required`
                : `${count} ${
                    count === 1
                      ? "photo"
                      : "photos"
                  }`}
            </p>
          </div>
        </div>

        {/* Add Photos */}

        <button
          type="button"
          onClick={onAddPhotos}
          disabled={uploading}
          className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading..."
            : `📸 Add ${
                category.label
              } Photos`}
        </button>
      </div>

      {/* Category Progress */}

      {hasRequirement && (
        <div className="px-5 pb-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                complete
                  ? "bg-green-500"
                  : "bg-brand-blue"
              }`}
              style={{
                width: `${Math.min(
                  (count /
                    category.required) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Photos */}

      {photos.length > 0 && (
        <div className="border-t border-slate-100 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map(
              (
                photo,
                index
              ) => (
                <div
                  key={photo.id}
                  draggable={
                    !savingOrder
                  }
                  onDragStart={(
                    event
                  ) =>
                    onDragStart(
                      event,
                      photo.id
                    )
                  }
                  onDragOver={
                    onDragOver
                  }
                  onDrop={(
                    event
                  ) =>
                    onDrop(
                      event,
                      photo.id
                    )
                  }
                  className={`overflow-hidden rounded-xl border bg-white transition ${
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
                      alt={`${category.label} photo ${
                        index + 1
                      }`}
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

                    {/* Photo Number */}

                    <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                      {photo.sortOrder + 1}
                    </div>
                  </div>

                  {/* Controls */}

                  <div className="p-3">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {photo.fileName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onMoveLeft(
                            photo.id
                          )
                        }
                        disabled={
                          index ===
                            0 ||
                          savingOrder
                        }
                        className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Move left"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onMoveRight(
                            photo.id
                          )
                        }
                        disabled={
                          index ===
                            photos.length -
                              1 ||
                          savingOrder
                        }
                        className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Move right"
                      >
                        →
                      </button>

                      {!photo.isCover && (
                        <button
                          type="button"
                          onClick={() =>
                            onMakeCover(
                              photo.id
                            )
                          }
                          disabled={
                            savingOrder
                          }
                          className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ⭐ Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            photo.id
                          )
                        }
                        disabled={
                          deletingId ===
                          photo.id
                        }
                        className="ml-auto rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      )}

      {/* Empty Category */}

      {photos.length === 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-6 text-center">
          <p className="text-sm text-slate-500">
            No {category.label.toLowerCase()} photos added yet.
          </p>

          <button
            type="button"
            onClick={onAddPhotos}
            disabled={uploading}
            className="mt-3 text-sm font-semibold text-brand-blue transition hover:underline disabled:opacity-50"
          >
            + Add photos
          </button>
        </div>
      )}
    </div>
  );
}