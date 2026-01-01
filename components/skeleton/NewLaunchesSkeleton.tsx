export default function NewLaunchesSkeleton() {
  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1600px] mx-auto px-3 md:px-6">
        {/* TITLE SKELETON */}
        <div className="h-8 w-56 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              {/* IMAGE */}
              <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse" />

              {/* TITLE */}
              <div className="h-4 bg-gray-200 rounded mt-4 mx-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded mt-2 mx-8 animate-pulse" />

              {/* PRICE */}
              <div className="h-4 w-20 bg-gray-200 rounded mt-3 mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-10">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}
