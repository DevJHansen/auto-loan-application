interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className = '' }: LoadingSpinnerProps) => (
  <div
    className={`w-5 h-5 border-4 border-white border-t-transparent border-solid rounded-full animate-spin ${className}`}
  />
);
