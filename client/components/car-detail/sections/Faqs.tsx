'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqsData = [
    {
        question: "What happens if I return the car late?",
        answer: "Additional time is charged at ₹133 per hour, calculated only for the extra time used"
    },
    {
        question: "What should I do in case of a breakdown or emergency?",
        answer: "In case of a breakdown or emergency, please contact our 24/7 roadside assistance support immediately. We will arrange for help or a replacement vehicle as needed."
    },
    {
        question: "Why does a 7-day booking require a call?",
        answer: "Longer bookings for 7 days or more often come with special rates and terms. A quick call helps us ensure vehicle availability and tailor the best package for your extended trip."
    },
    {
        question: "Is this car suitable for long drives?",
        answer: "Yes, this car is regularly serviced and maintained to ensure optimal performance and comfort for long-distance travel."
    }
];

function Faqs() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className='bg-[#F5F5F5] w-full text-black'>
            <div className='max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start gap-12 py-16 px-4 sm:px-6 lg:px-8'>

                {/* Left Side: Title & Subtitle */}
                <div className='flex flex-col gap-4 lg:w-1/3 lg:sticky lg:top-24'>
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-medium leading-tight'>
                        Frequently<br />
                        Asked<br />
                        Question
                    </h2>
                    <p className='text-base md:text-lg text-gray-600 font-medium mt-2'>
                        Clear answers before you hit the road
                    </p>
                </div>

                {/* Right Side: Accordion */}
                <div className='flex flex-col gap-4 w-full lg:w-3/5'>
                    {faqsData.map((faq, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md'
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className='w-full flex justify-between items-center p-6 text-left focus:outline-none cursor-pointer'
                            >
                                <span className='text-lg font-medium text-gray-900 pr-8'>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className='flex-shrink-0 text-gray-500' size={20} />
                                ) : (
                                    <ChevronDown className='flex-shrink-0 text-gray-500' size={20} />
                                )}
                            </button>

                            <div
                                className={`
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                                `}
                            >
                                <div className='p-6 pt-0 text-gray-600 leading-relaxed'>
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Faqs;