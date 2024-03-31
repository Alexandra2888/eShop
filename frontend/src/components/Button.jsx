
const Button = ({ className, disabled = false, onClick, children }) => {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
