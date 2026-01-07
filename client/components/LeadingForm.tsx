'use client';

// import '@/styles/flatpickr-custom.css';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import type { UserForm } from '@/types/user';
import sendUser from '@/utils/sendUser';
import PopupUser from './PopupUser';
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import toast from "react-hot-toast";

export default function HeroSearchForm() {
  const [formData, setFormData] = useState<Partial<UserForm>>({
    location: '',
    tripStart: null,
    tripEnd: null,
    name: '',
    phone: '',
  });

  // const [showSuccess, setShowSuccess] = useState(false);
  const TripStartRef = useRef<any>(null);
  const TripEndRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  // const onClose = () => {
  //   setShowSuccess(false);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes("trip") ? new Date(value) : value
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.location && !formData.name && !formData.phone) {
  //     toast.error("Please fill out all required fields");
  //     return;
  //   }
  //   if (!formData.name) {
  //     toast.error("Name is required");
  //     return;
  //   }
  //   if (!formData.phone) {
  //     toast.error("Phone number is required");
  //     return;
  //   }
  //   if (!formData.location) {
  //     toast.error("Location is required");
  //     return;
  //   }
  //   if (!formData.tripStart || !formData.tripEnd) {
  //     toast.error("Trip start and end dates are required");
  //     return;
  //   }

  //   formData.message = "test";
  //   setIsLoading(true)
  //   const result = await sendUser(formData);
  //   console.log(formData.tripStart, formData.tripEnd)
  //   if (result.success) {
  //     toast.success("Thank You! Your Response. We will get back to you shortly.", { duration: 5000, className: "lg:min-w-[500px]" });
  //     setFormData({
  //       location: '',
  //       tripStart: new Date(),
  //       tripEnd: new Date(),
  //       name: '',
  //       phone: '',
  //     });
  //     setIsLoading(false)
  //     // setShowSuccess(true);
  //   } else {
  //     console.error('Submission failed:', result.error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPopup(true);
  };
  // if (showSuccess) {
  //   return (
  //     <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex p-4 md:p-6 flex-col gap-3 items-center justify-center">
  //       <div className="w-full flex flex-col md:flex-row max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white rounded-[20px] overflow-hidden shadow-2xl mx-auto ">

  //         {/* Left Side */}
  //         <div
  //           className="relative showBg w-full md:w-1/2 bg-[#0c0c27] lg:border-[16px] lg:rounded-l-4xl text-white p-4 md:p-10 flex md:flex-col justify-between"
  //           style={{ backgroundImage: "url('/car.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
  //         >
  //           <button
  //             onClick={onClose}
  //             className="md:hidden absolute top-4 right-4 text-2xl font-bold text-white hover:text-gray-900"
  //           >
  //             ×
  //           </button>
  //           <div className='py-2 xl:py-6 3xl:py-8 4xl:py-10'>
  //             <h2 className="text-3xl xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold leading-tight mb-6">
  //               Book Your <br /> Self-Drive <br /> Car Now
  //             </h2>
  //             <p className="hidden md:block text-base xl:text-lg 3xl:text-xl tracking-wide text-gray-300 mr-24">
  //               Looking for affordable self driving cars in Chennai? Our self drive rental cars in Chennai are perfect for every trip – be it a weekend getaway or daily commute. Whether you're searching for a self drive car hire in Chennai, own driving car rental, or even a flexible alternative. We’ve got you covered.
  //             </p>
  //           </div>
  //         </div>

  //         {/* Right Side */}
  //         <div className="w-full h-full md:w-1/2 py-6 px-4 sm:px-8 md:p-10 relative overflow-y-auto flex items-center">
  //           <button
  //             onClick={onClose}
  //             className="hidden md:block absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-900"
  //           >
  //             ×
  //           </button>
  //           <section className="w-full flex flex-col items-center justify-center py-12">
  //             <Image src="/tick.gif" alt="Success" width={100} height={100} unoptimized />
  //             <h2 className="text-2xl md:text-4xl font-bold text-center mt-4">
  //               Thank You! Your Response
  //             </h2>
  //             <p className="text-center mt-2">We will get back to you shortly.</p>
  //           </section>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  useEffect(() => {
    if (TripStartRef?.current?.input) {
      TripStartRef.current.input.placeholder = "Select start date";
    }
    if (TripEndRef?.current?.input) {
      TripEndRef.current.input.placeholder = "Select end date";
    }
  }, []);
  console.log(formData);

  // Helper function to get minimum end date (1 hour after start date)
  const getMinEndDate = () => {
    if (formData.tripStart) {
      const minEndDate = new Date(formData.tripStart);
      minEndDate.setHours(minEndDate.getHours() + 1);
      return minEndDate;
    }
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  };

  // const isMobile = window.innerWidth < 1024;

  const formatForInputForValue = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 -> 12
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${hours}:${minutes} ${ampm}`;

  };
  function getLocalDateTimeString(date: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }


  return (
    <section className='w-[80vw] md:w-full xl:w-full 2xl:w-[95%] 4xl:w-[80%]'>
      <form onSubmit={handleSubmit} noValidate className="relative mt-10 w-full xl:mx-auto xl:px-4 font-inter">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-full p-3 lg:p-4 py-10 xl:py-3 2xl:py-6 flex flex-col md:flex-row md:flex-nowrap items-stretch md:items-center gap-6 xl:gap-8 4xl:gap-6 md:divide-x divide-gray-300 shadow-lg min-w-0 ">

          {/* Name */}
          <div className="min-w-[140px] 4xl:min-w-[200px] gap-1 px-2 2xl:px-4 4xl:px-6 flex flex-col flex-1">
            <label htmlFor='name' className="text-neutral-700 4xl:text-lg">Name</label>
            <input
              id='name'
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="bg-transparent outline-none text-sm 4xl:text-base border-b border-neutral-300 md:border-none w-full py-2 md:py-0"
            />
          </div>

          {/* Phone */}
          <div className="min-w-[140px] 4xl:min-w-[200px] gap-1 px-2 2xl:px-4 4xl:px-6 flex flex-col flex-1">
            <label htmlFor='phoneNumber' className="text-neutral-700 4xl:text-lg">Phone Number</label>
            <input
              id='phoneNumber'
              type="tel"
              name="phone"
              placeholder="Enter your number"
              value={formData.phone}
              onChange={handleChange}
              className="bg-transparent outline-none text-sm 4xl:text-base border-b border-neutral-300 md:border-none w-full py-2 md:py-0"
            />
          </div>

          {/* Trip Start */}
          <div className="flex min-w-[200px] 4xl:min-w-[250px] px-2 2xl:px-4 4xl:px-6 flex-col flex-1">
            <label htmlFor='tripStartMob' className="text-neutral-700 4xl:text-lg">
              Trip Starts
            </label>

            {/* Large screen DatePicker */}
            <div className="hidden lg:block -ml-2">
              <DatePicker
                showTime={{ format: "h:mm A", use12Hours: true, minuteStep: 5 }}
                format="MMMM D, YYYY h:mm A"
                value={formData.tripStart ? dayjs(formData.tripStart) : null}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                disabledTime={(current) => {
                  if (current && current.isSame(dayjs(), 'day')) {
                    const now = dayjs();
                    return {
                      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
                      disabledMinutes: (selectedHour) => {
                        if (selectedHour === now.hour()) {
                          return Array.from({ length: now.minute() }, (_, i) => i);
                        }
                        return [];
                      },
                    };
                  }
                  return {};
                }}
                onChange={(value) => {
                  if (value) {
                    const newStartDate = value.toDate();
                    setFormData({
                      ...formData,
                      tripStart: newStartDate,
                      // Reset end date if it's before the new minimum
                      tripEnd: formData.tripEnd && formData.tripEnd <= new Date(newStartDate.getTime() + 60 * 60 * 1000)
                        ? null
                        : formData.tripEnd
                    });
                  }
                }}
                inputReadOnly={true}
                className="!w-full !max-w-[220px] !border-none !shadow-none !bg-transparent text-base 2xl:text-lg"
              />
            </div>

            {/* Mobile Flatpickr */}

            <div className="relative lg:hidden">
              {/* {!formData.tripStart} */}
              {/* {!formData.tripStart ? (
                  <> */}

              <label htmlFor='tripStartMob' className="absolute z-50 -left-0 top-2 border-b border-neutral-300 pb-2 w-full">
                {/* {formData?.tripStart?.toLocaleString()} */}
                {formData.tripStart ? <span>{formatForInputForValue(formData.tripStart)}</span> : <span className='text-gray-400' >Select date and time</span>}

              </label>
              <input
                id='tripStartMob'
                type="datetime-local"
                className="w-full border-b border-neutral-200 bg-transparent text-base md:py-2 absolute opacity-0 pointer-events-auto"
                value={formData.tripStart ? getLocalDateTimeString(formData.tripStart) : undefined}
                min={getLocalDateTimeString(new Date())}
                onChange={(e) => {
                  const value = e.target.value;
                  const newStartDate = value ? new Date(value) : null;
                  setFormData({
                    ...formData,
                    tripStart: newStartDate,
                    tripEnd:
                      formData.tripEnd &&
                        newStartDate &&
                        formData.tripEnd <= new Date(newStartDate.getTime() + 60 * 60 * 1000)
                        ? null
                        : formData.tripEnd,
                  });
                }}

              />
            </div>

          </div>

          {/* Trip End */}
          <div className="flex min-w-[200px] 4xl:min-w-[250px] px-2 2xl:px-4 4xl:px-6 flex-col flex-1 mt-8 md:mt-0">
            <label htmlFor='tripEndMob' className="text-neutral-700 4xl:text-lg">
              Trip Ends
            </label>

            {/* Large screen DatePicker */}
            <div className="hidden lg:block -ml-2">
              <DatePicker
                showTime={{ format: "h:mm A", use12Hours: true, minuteStep: 1 }}
                format="MMMM D, YYYY h:mm A"
                value={formData.tripEnd ? dayjs(formData.tripEnd) : null}
                disabledDate={(current) => {
                  const minEndDate = getMinEndDate();
                  return current && current < dayjs(minEndDate).startOf('day');
                }}
                disabledTime={(current) => {
                  const minEndDate = getMinEndDate();
                  if (current && current.isSame(dayjs(minEndDate), 'day')) {
                    return {
                      disabledHours: () => Array.from({ length: minEndDate.getHours() }, (_, i) => i),
                      disabledMinutes: (selectedHour) => {
                        if (selectedHour === minEndDate.getHours()) {
                          return Array.from({ length: minEndDate.getMinutes() }, (_, i) => i);
                        }
                        return [];
                      },
                    };
                  }
                  return {};
                }}
                onChange={(value) => {
                  if (value) setFormData({ ...formData, tripEnd: value.toDate() });
                }}
                inputReadOnly={true}
                className="!w-full !max-w-[220px] !border-none !shadow-none !bg-transparent text-base 2xl:text-lg"
              />
            </div>

            {/* Mobile Flatpickr */}
            {/* Mobile datetime-local for Trip End */}
            <div className="relative lg:hidden">
              <label htmlFor='tripEndMob' className="absolute z-50 -left-0 top-2 border-b border-neutral-300 w-full pb-2">
                {formData.tripEnd
                  ? <span>{formatForInputForValue(formData.tripEnd)}</span>
                  : <span className='text-gray-400'>Select date and time</span>}
              </label>

              <input
                id='tripEndMob'
                type="datetime-local"
                className="w-full border-b border-neutral-200 bg-transparent text-base md:py-2 absolute opacity-0 pointer-events-auto"
                value={formData.tripEnd ? getLocalDateTimeString(formData.tripEnd) : undefined}
                min={formData.tripStart
                  ? getLocalDateTimeString(new Date(new Date(formData.tripStart).getTime() + 60 * 60 * 1000))
                  : getLocalDateTimeString(new Date())
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const newEndDate = value ? new Date(value) : null;
                  setFormData({
                    ...formData,
                    tripEnd: newEndDate
                  });
                }}
              />
            </div>

          </div>

          {/* Location & Submit */}
          <div className="min-w-[150px] 4xl:min-w-[250px] flex flex-col md:flex-row gap-2 justify-between items-center px-2 2xl:px-4 4xl:px-6 md:border-r-0 mt-5 md:mt-0">
            <div className="min-w-0 flex flex-col flex-grow w-full gap-1">
              <label htmlFor='location' className="text-neutral-700 4xl:text-lg">Location</label>
              <input
                name="location"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleChange}
                className="bg-transparent outline-none text-sm 4xl:text-base border-b border-neutral-300 md:border-none w-full py-2 md:py-0"
              />
            </div>

            {/* Desktop Submit */}
            <button
              type="submit"
              className="cursor-pointer shrink-0 hidden md:flex w-16 h-16 4xl:w-20 4xl:h-20 rounded-full bg-blue-600 text-white items-center justify-center hover:bg-blue-700 transition ml-4 4xl:ml-6 self-center"
            >
              {!isLoading ? <Image
                src={"/icons/arrow-right.svg"}
                alt="Search Icon"
                width={24}
                height={24}
                className='w-8 h-auto 4xl:w-10'
              /> :
                <svg className='animate-spin' width="34" height="34" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M95 0C76.2108 0 57.8435 5.57165 42.2208 16.0104C26.5981 26.4491 14.4218 41.2861 7.23143 58.6451C0.0411009 76.0041 -1.84022 95.1054 1.82538 113.534C5.49098 131.962 14.5388 148.889 27.8248 162.175C41.1108 175.461 58.0382 184.509 76.4664 188.175C94.8946 191.84 113.996 189.959 131.355 182.769C148.714 175.578 163.551 163.402 173.99 147.779C184.428 132.156 190 113.789 190 95C190 82.5244 187.543 70.171 182.769 58.6451C177.994 47.1191 170.997 36.6464 162.175 27.8249C153.354 19.0033 142.881 12.0056 131.355 7.23144C119.829 2.45725 107.476 0 95 0ZM95 19C109.993 19.0062 124.65 23.4473 137.126 31.7642C149.601 40.0811 159.337 51.9022 165.11 65.74C142.194 59.9232 118.642 56.9872 95 57C71.284 57.0033 47.6636 60.0037 24.7 65.93C30.4556 52.0268 40.2089 40.1451 52.724 31.7904C65.239 23.4358 79.9525 18.9843 95 19ZM19 101.365L29.545 100.13C35.3781 99.4462 41.2898 100.005 46.8915 101.769C52.4932 103.534 57.6579 106.464 62.046 110.368C66.4341 114.271 69.9461 119.059 72.3511 124.418C74.7562 129.776 75.9997 135.582 76 141.455V168.53C60.7001 164.641 46.9909 156.084 36.7763 144.048C26.5617 132.012 20.3486 117.094 19 101.365ZM114 168.53V141.455C114.005 135.609 115.242 129.829 117.629 124.493C120.017 119.157 123.503 114.384 127.859 110.485C132.215 106.586 137.344 103.649 142.911 101.864C148.478 100.08 154.359 99.4893 160.17 100.13L170.715 101.365C169.385 117.057 163.214 131.947 153.054 143.979C142.894 156.011 129.247 164.59 114 168.53Z" fill="white" />
                </svg>

              }
            </button>
          </div>

          {/* Mobile Submit */}
          <button
            type="submit"
            className="w-full h-12 md:hidden bg-[#F16A10] !text-white font-medium rounded-lg mt-4"
          >
            BOOK
          </button>
        </div>
      </form>
      {showPopup && <PopupUser onClose={() => setShowPopup(!showPopup)} leadData={formData} setLeadData={setFormData} />}
    </section>
  );
}