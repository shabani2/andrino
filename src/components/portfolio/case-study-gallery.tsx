import Image from "next/image";

export function CaseStudyGallery({ images }: { images: string[] }) {
  if (!images.length) return null;
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {images.map((src, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          alt={`Vue de la réalisation ${index + 1}`}
          width={1200}
          height={800}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full rounded-lg"
        />
      ))}
    </div>
  );
}
