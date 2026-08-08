import { describe, expect, it } from "vitest";
import {
  canEditQuotePhoto,
  normalizeInstagramHandle,
  validateMediaFile,
} from "./WeddingEditor";

function media(type: string, size: number) {
  return { type, size } as Pick<File, "type" | "size">;
}

describe("WeddingEditor helpers", () => {
  it("enables quote photos for every redesigned theme that renders them", () => {
    expect(canEditQuotePhoto(1)).toBe(false);
    expect([2, 3, 4, 5, 6].every(canEditQuotePhoto)).toBe(true);
  });

  it("normalizes Instagram handles and profile URLs", () => {
    expect(normalizeInstagramHandle("nurita.undangan")).toBe(
      "@nurita.undangan",
    );
    expect(normalizeInstagramHandle("@nurita.undangan")).toBe(
      "@nurita.undangan",
    );
    expect(
      normalizeInstagramHandle(
        "https://www.instagram.com/nurita.undangan/?hl=id",
      ),
    ).toBe("@nurita.undangan");
    expect(normalizeInstagramHandle("   ")).toBe("");
  });

  it("validates media types and size limits before upload", () => {
    expect(
      validateMediaFile(media("image/jpeg", 10 * 1024 * 1024), false),
    ).toBeNull();
    expect(
      validateMediaFile(media("image/jpeg", 10 * 1024 * 1024 + 1), false),
    ).toContain("10 MB");
    expect(
      validateMediaFile(media("video/mp4", 20 * 1024 * 1024), true),
    ).toBeNull();
    expect(validateMediaFile(media("video/mp4", 1), false)).toContain("JPEG");
    expect(validateMediaFile(media("application/pdf", 100), true)).toContain(
      "MP4",
    );
  });
});
