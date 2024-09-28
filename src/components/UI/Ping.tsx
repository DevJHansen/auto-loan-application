export const Ping = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-6 h-6 bg-primary rounded-full animate-ping"></div>
        <div className="absolute w-4 h-4 bg-primary rounded-full animate-ping delay-200"></div>
        <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping delay-400"></div>
      </div>
    </div>
  );
};
