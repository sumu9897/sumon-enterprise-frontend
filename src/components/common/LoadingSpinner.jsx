const LoadingSpinner = ({ size = 'medium', text = '', fullPage = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div
      className={`flex flex-col justify-center items-center p-8 ${fullPage ? 'min-h-[60vh]' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={`spinner ${sizeClasses[size]}`} aria-hidden="true" />
      {text ? <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p> : null}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingSpinner;
