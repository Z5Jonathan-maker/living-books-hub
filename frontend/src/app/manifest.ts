import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Living Books Hub",
    short_name: "Living Books",
    description:
      "Discover the best living books for your family. Searchable, curated, and organized by age, subject, and reading level.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#2D5A3D",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
