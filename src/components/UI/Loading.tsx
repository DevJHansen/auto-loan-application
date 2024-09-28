export const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 bg-primary rounded-full animate-ping"></div>
        <div className="absolute w-12 h-12 bg-primary rounded-full animate-ping delay-200"></div>
        <div className="absolute w-8 h-8 bg-primary rounded-full animate-ping delay-400"></div>
      </div>
    </div>
  );
};
