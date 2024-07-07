import React from 'react';

const InputField = ({ label, id, name, type = 'text', value, onChange, onBlur, error,
    required }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${error ? 'border-rose-500' : 'border-gray-200'}`}
                />
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
            </div>
        </div>
    );
};

export default InputField;
