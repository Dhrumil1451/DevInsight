const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-100 dark:border-zinc-800"></div>
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center space-y-1.5">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300 animate-pulse">{text}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Please wait while we fetch the data</p>
      </div>
    </div>
  );
};

export default PageLoader;
