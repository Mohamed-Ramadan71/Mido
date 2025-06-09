export const Card = ({ children }) => <div className="bg-white shadow rounded">{children}</div>;
export const CardContent = ({ children, className }) => <div className={className}>{children}</div>;
export const Input = (props) => <input className="border p-2 rounded w-full" {...props} />;
export const Button = ({ children, ...props }) => <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" {...props}>{children}</button>;
export const Textarea = (props) => <textarea className="border p-2 rounded w-full" {...props} />;
export const Label = ({ children }) => <label className="block text-sm mb-1">{children}</label>;