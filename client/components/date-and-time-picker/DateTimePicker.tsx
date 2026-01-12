'use client';

import React, { useId } from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronDown } from 'lucide-react';

interface DateTimePickerProps {
    label: string;
    value?: Dayjs | null;
    onChange?: (date: Dayjs | null, dateString: string | string[]) => void;
    placeholder?: string;
    isForm?: boolean;
    className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Select Date & Time',
    className,
    isForm = false
}) => {
    const inputId = useId();

    return (
        <label
            htmlFor={inputId}
            className={`flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 min-w-[200px] cursor-pointer group ${className}`}
        >
            <span className={`uppercase font-bold ${isForm ? 'text-xs text-gray-800 tracking-wide mb-1.5' : 'text-[10px] text-gray-500 tracking-wider mb-1'}`}>
                {label}
            </span>
            <DatePicker
                id={inputId}
                className="w-full p-0 bg-transparent shadow-none border-none hover:bg-transparent"
                classNames={{ popup: { root: "rounded-xl shadow-lg border-gray-100 font-sans" } }}
                showTime={{ format: 'hh:mm A', minuteStep: 30 }}
                format="DD-MM-YYYY & hh:mm A"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                variant="borderless"
                allowClear={false}
                inputReadOnly
                suffixIcon={<ChevronDown size={16} className={isForm ? "text-gray-400" : "text-blue-500"} />}
                style={{
                    color: isForm ? '#111827' : '#3B82F6', // text-gray-900 vs blue-500
                    fontWeight: 500, // standard font weight for both
                    fontSize: '0.875rem', // text-sm
                    padding: 0
                }}
            />
            {/* We might need a global style override or specific class to force the input text color if 'style' doesn't reach the inner input element in this specific antd version */}
            <style jsx global>{`
                .ant-picker-input > input {
                    color: ${isForm ? '#111827' : '#3B82F6'} !important;
                    font-weight: ${isForm ? '500' : '700'} !important;
                    font-size: 0.875rem !important;
                    cursor: pointer;
                }
                .ant-picker-input > input::placeholder {
                    color: ${isForm ? '#9CA3AF' : '#93C5FD'} !important;
                }
                .ant-picker-suffix {
                    color: ${isForm ? '#9CA3AF' : '#3B82F6'} !important;
                    margin-left: 4px;
                }
            `}</style>
        </label>
    );
};

export default DateTimePicker;
