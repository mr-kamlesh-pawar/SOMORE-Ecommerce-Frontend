export default function HeroBannerSkeleton() {
  return (
    <section className="relative w-full bg-white">
      <div className="w-full h-[30vh] sm:h-[35vh] md:h-[45vh] lg:h-[110vh] bg-gray-200 animate-pulse" />
      <div className="flex justify-center gap-3 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
