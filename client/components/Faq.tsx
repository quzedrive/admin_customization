'use client'

import React, { useEffect, useState } from "react";
import { useWhatsApp } from '@/app/context/WhatsappContext';

const faqs = {
  left: [
    {
      question: "How do I book a self-drive car in Chennai?",
      answer: 'Click the "Book Now" button, fill out your trip details, and our team will confirm availability within minutes. You can also call or WhatsApp us for instant booking support.',
    },
    {
      question: "What documents are required to rent a car?",
      answer: "You’ll need a valid driving license (Indian or International), Aadhaar or Passport for ID proof, and a refundable security deposit.",
    },
    {
      question: "Is fuel included in the rental price?",
      answer: 'No, fuel is not included. Each self-drive car is provided with sufficient fuel to start your journey. Please return the car with the same fuel level to avoid additional charges.'
    },
    {
      question: "Where can I pick up or drop the car?",
      answer: 'We offer pickup and drop services across Chennai including Chennai Airport, OMR, Velachery, T Nagar, and Anna Nagar. Home delivery is also available.',
    },
    {
      question: "Can I take the car outside Chennai?",
      answer: "Yes, absolutely. You can drive anywhere within Tamil Nadu or to other states with prior permission. Just inform us during booking.",
    },
    {
      question: "What happens if the car breaks down?",
      answer: "All our cars are fully serviced and insured. In case of breakdown, we offer 24/7 roadside assistance or immediate replacement.",
    }, 
    {
      question: "Are your cars insured?",
      answer: "Yes, every vehicle comes with comprehensive insurance and road tax paid.",
    },
  ],
  right: [
    {
      question: "What types of cars do you offer?",
      answer: "We provide hatchbacks, sedans, SUVs, and MUVs for self drive — suitable for city rides, long road trips, or family travel.",
    },
    {
      question: "Do I need to pay any deposit?",
      answer: "Yes, a fully refundable security deposit is required. The amount varies depending on the vehicle category.",
    }, 
    {
      question: "Can I modify or cancel my booking?",
      answer: "Yes, you can modify or cancel your booking with advance notice. Terms apply based on how close the request is to your trip start time.",
    },
    {
      question: "Is there any age restriction to rent a car?",
      answer: "You must be at least 21 years old and hold a valid driving license with a minimum 1 year of driving experience.",
    }
  ],
};

interface faqProp {
  question: string;
  answer: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}
{/*template*/ }
function FAQAccordion({ question, answer, isOpen, onClick }: faqProp) {

  return (
    <div className="flex flex-col justify-between border-b border-gray-400 ">
      <div className='flex justify-between items-center'>
        <button
          onClick={onClick}
          className={`cursor-pointer w-full text-left py-4 text-base 3xl:text-xl font-medium
                      ${isOpen ? "text-blue-700" : "text-gray-800"}
                    `}
        > {question}
        </button>
        <button onClick={onClick}>{isOpen ? "-" : "+"}</button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out 
                ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
               text-gray-700`}
      >
        <div className="py-4">{answer}</div>
      </div>

    </div>
  );
}

export default function FAQSection() {

  const { toggle , isOpen} = useWhatsApp()
  const [openIndex, setOpenIndex] = useState({ left: null, right: null });
  const handleToggle = (column: string, index: number): void => {
    setOpenIndex((prev) => ({
      ...prev,
      [column]: prev[column] === index ? null : index,
    }));
  };

  return (
    <section id='faq' className="w-full p-6 py-16">
      <div className="w-full lg:max-w-5/6 4xl:max-w-4/5 mx-auto">
        <div className="text-center mb-10">
          <h5 className="text-red-600 text-base 3xl:text-lg 4xl:text-xl">???</h5>
          <h3 className="text-[1.75rem] xl:text-4xl 3xl:text-5xl 4xl:text-6xl font-semibold">Frequently Asked Questions (FAQs)</h3>
          <h6 className="text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl text-gray-700 mt-2">
            Got questions? We’ve got answers. Here’s everything you need to know about our self-drive car rental service in Chennai.
          </h6>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/*left*/}
          <div className="w-full md:w-1/2 space-y-4">
            {faqs.left.map((item, i) => (
              <FAQAccordion
                key={i}
                {...item}
                isOpen={openIndex.left === i}
                onClick={() => handleToggle("left", i)}
              />
            ))}
          </div>
          {/*right*/}
          <div className="w-full md:w-1/2 space-y-4">
            {faqs.right.map((item, i) => (
              <FAQAccordion
                key={i}
                {...item}
                isOpen={openIndex.right === i}
                onClick={() => handleToggle("right", i)}
              />
            ))}
            <FAQAccordion
              question= "Still have questions? Contact us on WhatsApp or call us directly for instant support."
              answer="Chat on WhatsApp"
              onClick={toggle}
              isOpen={isOpen}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
