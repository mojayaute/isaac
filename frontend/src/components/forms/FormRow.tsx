import './FormRow.css';

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

const FormRow = ({ children, className = '' }: FormRowProps) => {
  return <div className={`form-row ${className}`}>{children}</div>;
};

export default FormRow;
