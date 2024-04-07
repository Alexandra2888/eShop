const Input = ({ type, name, value, onChange, className }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default Input;