const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizes[size]} rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-5 h-5">
        <path
          d="M50 20 L50 80 M20 50 L80 50"
          stroke="white"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Logo;