'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { UserForm, UserFormError } from '@/types/user';
import { useOrderMutations } from '@/lib/hooks/mutations/useOrderMutations';
// import SuccesMsg from '../app/thank-you/page'; // Commented out to avoid build errors if path is wrong, logic handled inline

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

export default function PopupUser({ onClose, leadData, setLeadData }: ContactModalProps) {
  const router = useRouter();
  const { useCreateOrder } = useOrderMutations();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState<UserForm>({
    name: leadData?.name || '',
    phone: leadData?.phone || '',
    email: '',
    tripStart: leadData?.tripStart || '',
    tripEnd: leadData?.tripEnd || '',
    location: leadData?.location || '',
    message: leadData?.message || '',
    carName: leadData?.carName || '',
    carSlug: leadData?.carSlug || '',
    selectedPackage: leadData?.selectedPackage || 'Base Package'
  });
  const [errors, setErrors] = useState<Partial<UserFormError>>({});
  const [mathProblem, setMathProblem] = useState<{ a: number, b: number, answer: number } | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState<string>('');

  const TripStartRef = useRef<any>(null);
  const TripEndRef = useRef<any>(null);

  const loading = createOrderMutation.isPending;

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
      createOrderMutation.mutate(formData, {
        onSuccess: () => {
          setFormData((prev) => ({
            ...prev,
            location: '',
            email: '',
            name: '',
            phone: '',
            message: '',
          }));
          if (setLeadData) {
            setLeadData({
              location: '',
              name: '',
              phone: '',
              email: '', // Clear email as well
              message: '', // Clear message as well
              // Don't clear dates or car
            });
          }
          setSecurityAnswer('');
          router.push('/thank-you');
        },
        onError: (error) => {
          console.error('Submission failed:', error);
        }
      });
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
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };



  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex px-2 md:p-1 flex-col gap-3 items-center justify-center"
    >
      <div className="w-full flex flex-col md:flex-row max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl bg-white rounded-[20px] overflow-hidden shadow-2xl mx-auto ">
        {/* Left Side */}
        <div
          className="hidden md:flex relative showBg w-full md:w-1/2 bg-[#0c0c27] lg:border-[16px] lg:rounded-4xl text-white p-4 md:p-8  md:flex-col justify-between"
          style={{ backgroundImage: "url('/pop-up-bg-1.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white capitalize">
              Every good drive begins <span className=''>with a plan</span>
            </h2>
            <p className="hidden md:block text-base xl:text-lg 3xl:text-xl tracking-wide text-white mr-24">
              Share a few details we’ll take care of the rest. The road is waiting
            </p>
          </div>
        </div>

        {/* Right Side */}

        <div className="w-full h-[90%] md:w-1/2 relative flex flex-col h-[90vh] md:h-auto">

          {/* Mobile Header - Fixed Top */}
          <div className="md:hidden flex-none px-4 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
            <span className="font-bold text-lg">Book Your Ride</span>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#292D32" />
              </svg>
            </button>
          </div>

          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden md:block absolute top-4 right-4 !text-3xl font-bold text-gray-600 hover:!text-red-600 cursor-pointer z-10"
          >
            <svg className=' hover:scale-105 transition-transform duration-300' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#292D32" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:p-6 md:max-h-[90vh] overflow-x-hidden">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 pb-24 md:pb-0 text-black">

              {/* Row 1: Name & Phone */}
              <div className="flex flex-col xl:flex-row gap-4 mt-1 md:mt-3">
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
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Trip Start */}
                <div className='flex-1 w-full'>
                  <div className="w-full lg:border-b border-gray-300 relative">
                    {/* Mobile: Flatpickr */}
                    <div className="w-full lg:hidden relative py-2 border-b border-gray-300">
                      <label htmlFor='tripStartMobPopup' className="textarea-md block w-full text-gray-900">
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
                        disabled
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                        disabled
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
                  {errors.tripStart && <span className="text-red-300 text-sm hidden md:block mt-1">{errors.tripStart}</span>}
                  {/* Mobile Error */}
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
                <div className='flex-1 w-full'>
                  <div className="w-full lg:border-b border-gray-300 relative">
                    {/* Mobile: datetime-local input styled like Trip Start */}
                    <div className="w-full lg:hidden relative py-2 border-b border-gray-300">
                      <label htmlFor='tripEndMobPopup' className="textarea-md block w-full text-gray-900">
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
                          : <span className='text-gray-400'>Select trip end date and time</span>
                        }
                      </label>
                      <input
                        id='tripEndMobPopup'
                        type="datetime-local"
                        disabled
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                        disabled
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
                  {errors.tripEnd && <span className="text-red-300 text-sm hidden md:block mt-1">{errors.tripEnd}</span>}
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
                        <span className="text-red-400 text-xs pt-1 block md:hidden">
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

              {/* Row 7: Submit (Desktop) */}
              <div className="hidden md:flex w-full justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full !text-white cursor-pointer flex justify-center items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all uppercase tracking-wider text-sm
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black !text-white hover:bg-gray-800'}
                `}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span className='!text-white'>Booking...</span>
                    </>
                  ) : (
                    <>
                      <span className='!text-white'>Let's Go</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Row 7: Submit (Mobile Fixed Bottom) */}
          <div className="md:hidden absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20">
            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading}
              className={`w-full text-white cursor-pointer flex justify-center items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all uppercase tracking-wider text-sm
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}
                `}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Booking...
                </>
              ) : (
                <>
                  Let's Go
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}