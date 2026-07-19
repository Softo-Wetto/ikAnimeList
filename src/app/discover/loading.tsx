export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="skeleton h-4 w-40 rounded-full" />
      <div className="skeleton mt-3 h-12 w-72 rounded-2xl" />
      <div className="skeleton mt-8 h-14 rounded-3xl" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }, (_, index) => (
          <div key={index}>
            <div className="skeleton aspect-[2/3] rounded-[1.4rem]" />
            <div className="skeleton mt-3 h-3.5 w-11/12 rounded-full" />
            <div className="skeleton mt-2 h-3 w-2/3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
