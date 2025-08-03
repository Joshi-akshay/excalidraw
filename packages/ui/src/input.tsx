interface InputProps {
    placeholder: string;
    reference?: any;
    value?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    className?: string;
}

export function Input({placeholder, reference, value, onChange, readOnly = false, className = ""}: InputProps) {
    return (
        <div className="w-full">
            <input 
                ref={reference} 
                type="text" 
                placeholder={placeholder} 
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={readOnly}
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700/50 shadow-md transition-all duration-200 focus:outline-none focus:border-gray-500 focus:shadow-lg hover:border-gray-500 placeholder-gray-400 text-white ${className}`}
            />
        </div>
    )
}