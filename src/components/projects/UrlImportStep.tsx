import { Button, Input, Alert } from "@/components/ui";

export function UrlImportStep({
  url,
  onUrlChange,
  onExtract,
  extracting,
  error,
  extracted,
}: {
  url: string;
  onUrlChange: (value: string) => void;
  onExtract: () => void;
  extracting: boolean;
  error: string | null;
  extracted: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground" htmlFor="source-url">
        1. Paste a product link (optional)
      </label>
      <p className="text-sm text-muted">
        Found a towel, robe, or linen set you love? Paste the link and
        we&rsquo;ll pull in the details automatically.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            id="source-url"
            type="url"
            placeholder="https://example.com/product"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          loading={extracting}
          disabled={!url}
          onClick={onExtract}
        >
          {extracting ? "Extracting..." : "Extract Details"}
        </Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {extracted && !error && (
        <Alert variant="success">
          We pulled in the product details below — feel free to edit
          anything before saving.
        </Alert>
      )}
    </div>
  );
}
