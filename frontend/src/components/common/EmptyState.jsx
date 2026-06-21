const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="card flex flex-col items-center justify-center py-16 gap-3 text-center animate-fade-in">
      <div className="text-5xl mb-2">{icon}</div>
      <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 text-lg">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
