import Image from "next/image";
const images = [
  [
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=85",
    "Retail textures",
  ],
  [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
    "Editorial style",
  ],
  [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    "Everyday wardrobe",
  ],
  [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85",
    "Material study",
  ],
  [
    "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=85",
    "City rhythm",
  ],
  [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
    "New silhouettes",
  ],
];
export const metadata = { title: "Gallery" };
export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="page-intro">
        <p className="eyebrow">Visual journal</p>
        <h1>Products, people, and places that inspire our edit.</h1>
        <p>
          A living moodboard of texture, movement, color, and modern everyday
          life.
        </p>
      </div>
      <div className="mt-14 grid auto-rows-[280px] gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map(([src, alt], index) => (
          <figure
            key={src}
            className={`gallery-tile group relative overflow-hidden rounded-[2rem] ${index === 0 || index === 4 ? "md:row-span-2" : ""}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition duration-1000 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-5 bottom-5 translate-y-3 rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
