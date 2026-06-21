const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeMap[size]}
          rounded-full
          border-brand-200 dark:border-brand-800
          border-t-brand-500
          animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
