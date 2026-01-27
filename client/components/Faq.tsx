'use client'

import React, { useState } from "react";
import { useWhatsApp } from '@/app/context/WhatsappContext';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";

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
  isContact?: boolean;
}

function FAQAccordion({ question, answer, isOpen, onClick, isContact }: faqProp) {
  return (
    <div
      onClick={onClick}
      className={`
        group border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isOpen ? "border-primary bg-blue-50/30 shadow-md" : "border-gray-200 bg-white hover:border-primary/50 hover:shadow-md"}
      `}
    >
      <div className="flex justify-between items-center px-6 pt-6 pb-4">
        <h4 className={`text-base 3xl:text-xl font-medium transition-colors duration-300 leading-snug ${isOpen ? "text-primary" : "text-gray-800 group-hover:text-primary"}`}>
          {question}
        </h4>
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 flex-shrink-0 ml-4
          ${isOpen ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"}
        `}>
          {isContact ? (
            <MessageCircle size={18} />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? -180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && !isContact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100/50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
        {/* Special handling for contact card to show content if needed, or just act as button */}
        {isContact && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100/50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const { toggle, isOpen } = useWhatsApp();
  const [openState, setOpenState] = useState<{ column: 'left' | 'right'; index: number } | null>({ column: 'left', index: 0 });

  const handleToggle = (column: 'left' | 'right', index: number): void => {
    setOpenState((prev) => (prev?.column === column && prev?.index === index ? null : { column, index }));
  };

  return (
    <section id='faq' className="w-full p-6 py-16 ">
      <div className="w-full lg:max-w-5/6 4xl:max-w-4/5 mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h5 className="text-primary text-base 3xl:text-lg 4xl:text-xl font-medium tracking-wide uppercase">???</h5>
          <h3 className="text-3xl xl:text-4xl 3xl:text-5xl font-bold text-gray-900">Frequently Asked Questions</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto pt-2">
            Got questions? We’ve got answers. Here’s everything you need to know about our self-drive car rental service in Chennai.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-4">
            {faqs.left.map((item, i) => (
              <FAQAccordion
                key={i}
                {...item}
                isOpen={openState?.column === 'left' && openState?.index === i}
                onClick={() => handleToggle("left", i)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 space-y-4">
            {faqs.right.map((item, i) => (
              <FAQAccordion
                key={i}
                {...item}
                isOpen={openState?.column === 'right' && openState?.index === i}
                onClick={() => handleToggle("right", i)}
              />
            ))}

            <FAQAccordion
              question="Still have questions? Contact us on WhatsApp or call us directly for instant support."
              answer="Click to chat with us on WhatsApp for immediate assistance."
              onClick={toggle}
              isOpen={isOpen} // This seems to track the whatsapp modal state
              isContact={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
