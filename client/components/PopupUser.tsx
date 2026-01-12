'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { UserForm, UserFormError } from '@/types/user';
import sendUser from '@/utils/sendUser';
import SuccesMsg from '../app/thank-you/page';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';

import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

type ContactModalProps = {
  onClose: () => void;
  leadData?: Partial<UserForm>;
  setLeadData?: (data: Partial<UserForm>) => void;
};

export default function ContactModal({ onClose, leadData, setLeadData }: ContactModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserForm>({
    name: leadData?.name || '',
    phone: leadData?.phone || '',
    email: '',
    tripStart: leadData?.tripStart || '',
    tripEnd: leadData?.tripEnd || '',
    location: leadData?.location || '',
    message: leadData?.message || '',
    carName: leadData?.carName || '',
    selectedPackage: leadData?.selectedPackage || ''
  });
  const [errors, setErrors] = useState<Partial<UserFormError>>({});
  const [mathProblem, setMathProblem] = useState<{ a: number, b: number, answer: number } | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false); // Add this line
  const TripStartRef = useRef<any>(null);
  const TripEndRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if valid
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (name === "name" && value) delete newErrors.name;
      if (name === "phone") {
        if (value && value.length === 10) delete newErrors.phone;
      }
      if (name === "email" && value) delete newErrors.email;
      if (name === "location" && value) delete newErrors.location;
      if (name === "message" && value) delete newErrors.message;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const result = await sendUser(formData);

      if (result.success) {
        setFormData({
          location: '',
          tripStart: new Date(),
          tripEnd: new Date(),
          email: '',
          name: '',
          phone: '',
          message: '',
          carName: '',
          selectedPackage: ''
        });
        if (setLeadData) {
          setLeadData({
            location: '',
            tripStart: new Date(),
            tripEnd: new Date(),
            name: '',
            phone: '',
            carName: '',
            selectedPackage: ''
          });
        }
        setSecurityAnswer('');
        setLoading(false);
        onClose(); // Close the modal first
        router.push('/thank-you'); // Add type parameter
      } else {
        console.error('Submission failed:', result.error);
        setLoading(false); // Add this to handle error case
      }
    }
  };

  const validate = () => {
    const newErrors: Partial<UserFormError> = {};
    if (!formData.location) newErrors.location = "Oops! Where we need to pick you up";
    if (!formData.tripStart) newErrors.tripStart = "Oops! When we are going to start the journey";
    if (!formData.tripEnd) newErrors.tripEnd = "Oops! When we are ending the journey";
    if (!formData.name) newErrors.name = "Oops! What should we call you?";
    if (!formData.phone) newErrors.phone = "Can’t reach you without your number!";
    if (formData.phone.length !== 10) newErrors.phone = "Oops! Phone number should be 10 digits";

    if (parseInt(securityAnswer) !== mathProblem?.answer) newErrors.securityAnswer = 'Just a quick check – what’s the sum?';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function formatDisplay(rawDate: Date | string) {
    if (!rawDate) return '';
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
    if (isNaN(date.getTime())) return '';
    const day = date.toLocaleString("en-US", { weekday: "short" }); // Mon
    const dayNum = date.getDate().toString().padStart(2, "0"); // 28
    const month = date.toLocaleString("en-US", { month: "short" }); // Jul
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // 11:43 AM

    return `${day} , ${dayNum} ${month}  ${time}`;
  }

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathProblem({ a, b, answer: a + b });
  }, [errors]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex p-1 flex-col gap-3 items-center justify-center"
    >
      <div className="w-full flex flex-col md:flex-row max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl bg-white rounded-[20px] overflow-hidden shadow-2xl mx-auto ">

        {/* Left Side */}
        <div
          className="hidden md:flex relative showBg w-full md:w-1/2 bg-[#0c0c27] lg:border-[16px] lg:rounded-l-4xl text-white p-4 md:p-8  md:flex-col justify-between"
          style={{ backgroundImage: "url('/car.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* mobile */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 !text-2xl font-bold text-white hover:text-gray-900"
          >
            <svg className=' hover:scale-105 transition-transform duration-300' width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#fff" />
            </svg>

          </button>
          <div className='py-2 md:py-4'>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-black capitalize">
              Every good drive begins <span className='text-[#F16A10]'>with a plan</span>
            </h2>
            <p className="hidden md:block text-base xl:text-lg 3xl:text-xl tracking-wide text-gray-900 mr-24">
              Share a few details we’ll take care of the rest. The road is waiting
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full h-full md:w-1/2 py-4 px-4 sm:px-6 md:p-6 relative overflow-y-auto max-h-[90vh] flex items-center">
          <button
            onClick={onClose}
            className=" absolute top-4 right-4 !text-3xl font-bold text-gray-600  hover:!text-red-600 cursor-pointer"
          >

            <svg className=' hover:scale-105 transition-transform duration-300' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#292D32" />
            </svg>


          </button>

          <form onSubmit={handleSubmit} className="flex w-full mx-5 lg:mx-0 flex-col space-y-6 xl:pt-4 text-black">

            {/* Row 1: Name & Phone */}
            <div className="flex flex-col xl:flex-row gap-4 mt-3">
              <div className="w-full">
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.name && <span className="text-red-300 text-sm block mt-1">{errors.name}</span>}
              </div>
              <div className="w-full">
                <input
                  type='tel'
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.phone && <span className="text-red-300 text-sm block mt-1">{errors.phone}</span>}
              </div>
            </div>

            {/* Row 2: Email */}
            <div>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none"
              />
              {errors.email && <span className="text-red-300 text-sm">{errors.email}</span>}
            </div>

            {/* Row 3: Location & Car */}
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="w-full">
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.location && <span className="text-red-300 text-sm">{errors.location}</span>}
              </div>
              <div className="w-full">
                <input
                  name="carName"
                  placeholder="Selected Car"
                  value={formData.carName || ''}
                  readOnly
                  className="w-full border-b border-gray-300 py-2 focus:outline-none bg-transparent text-gray-900 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 3.5: Selected Package */}
            <div>
              <input
                name="selectedPackage"
                placeholder="Selected Package"
                value={formData.selectedPackage || ''}
                readOnly
                className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none bg-transparent text-gray-900 cursor-not-allowed"
              />
            </div>

            {/* Row 4: Trip Start & End */}
            <div className="flex flex-col w-full xl:flex-row gap-3 mt-1 md:mt-0 lg:gap-6">
              {/* Trip Start */}
              {/* Mobile: Flatpickr */}
              <div className='w-full' >
                <div className="w-full lg:border-b border-gray-300 mb-8 md:mb-0">
                  <div className="w-full lg:hidden relative">
                    <label htmlFor='tripStartMobPopup' className="absolute left-0 top-2 border-b border-neutral-300 pb-2 md:pb-0 w-full">
                      {formData.tripStart
                        ? (() => {
                          const pad = (n: number) => String(n).padStart(2, '0');
                          let date = new Date(formData.tripStart);
                          let hours = date.getHours();
                          const minutes = pad(date.getMinutes());
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12 || 12;
                          return (
                            <span>
                              {pad(date.getDate())}-{pad(date.getMonth() + 1)}-{date.getFullYear()} {hours}:{minutes} {ampm}
                            </span>
                          );
                        })()
                        : <span className='text-gray-400'>Select trip start date and time</span>
                      }
                    </label>
                    <input
                      id='tripStartMobPopup'
                      type="datetime-local"
                      className="w-full text-base py-2 absolute opacity-0 pointer-events-auto"
                      value={formData.tripStart
                        ? (() => {
                          const pad = (n: number) => String(n).padStart(2, '0');
                          let date = new Date(formData.tripStart);
                          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
                        })()
                        : ''}
                      min={(() => {
                        const pad = (n: number) => String(n).padStart(2, '0');
                        let date = new Date();
                        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
                      })()}
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
                  {/* Desktop: DatePicker */}
                  <div className="hidden lg:block">
                    <DatePicker
                      placeholder="Trip Start"
                      showTime={{
                        format: "h:mm A",
                        use12Hours: true,
                        minuteStep: 1,
                      }}
                      format="MMMM D, YYYY h:mm A"
                      value={formData.tripStart ? dayjs(formData.tripStart) : null}
                      onChange={(value) => {
                        if (value) setFormData({ ...formData, tripStart: value.toDate() });
                      }}
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
                      className="w-full !border-none !shadow-none !bg-transparent focus:!border-none focus:!shadow-none"
                      inputReadOnly={true}
                    />
                  </div>
                </div>
                {errors.tripStart && <span className="text-red-300 text-sm hidden md:block">{errors.tripStart}</span>}
                {/* After your <input type="datetime-local" ... /> for Trip Start */}
                {formData.tripStart && new Date(formData.tripStart) < new Date() && (
                  <span className="text-red-400 text-xs pt-1 block md:hidden">
                    Date and time must be greater than or equal to {(() => {
                      const now = new Date();
                      const pad = (n: number) => String(n).padStart(2, '0');
                      let hours = now.getHours();
                      const minutes = pad(now.getMinutes());
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      hours = hours % 12 || 12;
                      return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${hours}:${minutes} ${ampm}`;
                    })()}
                  </span>
                )}
              </div>
              {/* Trip End */}
              <div className='w-full' >
                <div className="w-full lg:border-b border-gray-300">
                  {/* Mobile: datetime-local input styled like Trip Start */}
                  <div className="flex flex-col lg:hidden relative">
                    <label htmlFor='tripEndMobPopup' className="absolute left-0 top-2 border-b border-neutral-300 w-full pb-2 md:pb-0">
                      {formData.tripEnd
                        ? (() => {
                          const pad = (n: number) => String(n).padStart(2, '0');
                          let date = new Date(formData.tripEnd);
                          let hours = date.getHours();
                          const minutes = pad(date.getMinutes());
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12 || 12;
                          return (
                            <span>
                              {pad(date.getDate())}-{pad(date.getMonth() + 1)}-{date.getFullYear()} {hours}:{minutes} {ampm}
                            </span>
                          );
                        })()
                        : <span className='text-gray-400 pb-2 md:pb-0'>Select trip end date and time</span>
                      }
                    </label>
                    <input
                      id='tripEndMobPopup'
                      type="datetime-local"
                      className="w-full border-b border-neutral-300 bg-transparent text-base py-1  absolute opacity-0 pointer-events-auto"
                      value={formData.tripEnd
                        ? (() => {
                          const pad = (n: number) => String(n).padStart(2, '0');
                          let date = new Date(formData.tripEnd);
                          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
                        })()
                        : ''}
                      min={(() => {
                        const pad = (n: number) => String(n).padStart(2, '0');
                        let minDate = formData.tripStart
                          ? new Date(new Date(formData.tripStart).getTime() + 60 * 60 * 1000)
                          : new Date();
                        return `${minDate.getFullYear()}-${pad(minDate.getMonth() + 1)}-${pad(minDate.getDate())}T${pad(minDate.getHours())}:${pad(minDate.getMinutes())}`;
                      })()}
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
                  {/* Desktop: DatePicker */}
                  <div className="hidden lg:block">
                    <DatePicker
                      placeholder="Trip end"
                      showTime={{
                        format: "h:mm A",
                        use12Hours: true,
                        minuteStep: 1,
                      }}
                      format="MMMM D, YYYY h:mm A"
                      value={formData.tripEnd ? dayjs(formData.tripEnd) : null}
                      onChange={(value) => {
                        if (value) setFormData({ ...formData, tripEnd: value.toDate() });
                      }}
                      disabledDate={(current) => {
                        if (formData.tripStart) {
                          // Allow same day but not earlier days
                          return current && current < dayjs(formData.tripStart).startOf('day');
                        }
                        return current && current < dayjs().startOf('day');
                      }}
                      disabledTime={(current) => {
                        if (current && formData.tripStart) {
                          const startDate = dayjs(formData.tripStart);
                          const minEndTime = startDate.add(1, 'hour');

                          if (current.isSame(startDate, 'day')) {
                            return {
                              disabledHours: () => Array.from({ length: minEndTime.hour() }, (_, i) => i),
                              disabledMinutes: (selectedHour) => {
                                if (selectedHour === minEndTime.hour()) {
                                  return Array.from({ length: minEndTime.minute() }, (_, i) => i);
                                }
                                return [];
                              },
                            };
                          }
                        }
                        return {};
                      }}
                      className="w-full !border-none !shadow-none !bg-transparent focus:!border-none focus:!shadow-none"
                      inputReadOnly={true}
                    />
                  </div>
                </div>
                {errors.tripEnd && <span className="text-red-300 text-sm hidden md:block">{errors.tripEnd}</span>}
                {formData.tripEnd && (() => {
                  const pad = (n: number) => String(n).padStart(2, '0');
                  let minDate = formData.tripStart
                    ? new Date(new Date(formData.tripStart).getTime() + 60 * 60 * 1000)
                    : new Date();
                  let endDate = new Date(formData.tripEnd);
                  if (endDate < minDate) {
                    let hours = minDate.getHours();
                    const minutes = pad(minDate.getMinutes());
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    return (
                      <span className="text-red-400 text-xs pt-9 -mb-10 block md:hidden">
                        Date and time must be greater than or equal to {`${pad(minDate.getDate())}-${pad(minDate.getMonth() + 1)}-${minDate.getFullYear()} ${hours}:${minutes} ${ampm}`}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Row 5: Message */}
            <div className='mt-8 md:mt-0' >
              <input
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full text-sm border-b border-gray-300 py-2 focus:outline-none"
              />
              {errors.message && <span className="text-red-300 text-sm">{errors.message}</span>}
            </div>

            {/* Row 6: Math problem & Security */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold flex">{mathProblem?.a} + {mathProblem?.b} ?</label>
              <input
                name="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="border px-4 w-[100px] border-gray-300 py-3 focus:outline-none"
              />
            </div>
            {errors.securityAnswer && <span className="text-red-300 text-sm">{errors.securityAnswer}</span>}

            {/* Row 7: Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-fit flex items-center gap-2 px-6 py-3 xl:px-8 rounded-full font-semibold transition-all
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r cursor-pointer from-blue-500 to-blue-700 !text-white hover:from-blue-600'}
              `}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Booking...
                </>
              ) : (
                'BOOK NOW'
              )}
            </button>
          </form>

        </div>
      </div >
    </div >
  );
}