export default function DiscoverLoading() {
  return <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8"><div className="h-12 w-72 rounded-2xl bg-white/7" /><div className="mt-8 h-20 rounded-3xl bg-white/5" /><div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 12 }, (_, index) => <div className="aspect-[2/3] rounded-3xl bg-white/6" key={index} />)}</div></div>;
}
