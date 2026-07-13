import Image from "next/image";
import { Alert, Spinner } from "@/components/ui";

export function ImageUploadStep({
  onFileSelect,
  uploading,
  error,
  previewUrl,
}: {
  onFileSelect: (file: File) => void;
  uploading: boolean;
  error: string | null;
  previewUrl: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground" htmlFor="inspiration-image">
        2. Upload an inspiration image (optional)
      </label>
      <p className="text-sm text-muted">
        Add a photo of the item, a monogram style, or anything that
        captures the look you want.
      </p>
      <div className="flex items-center gap-4">
        <label
          htmlFor="inspiration-image"
          className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted-bg"
        >
          {uploading && <Spinner className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Choose Image"}
        </label>
        <input
          id="inspiration-image"
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        {previewUrl && (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
            <Image
              src={previewUrl}
              alt="Inspiration preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
