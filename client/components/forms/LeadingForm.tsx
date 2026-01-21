'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import type { UserForm, UserFormError } from '@/types/user';
import PopupUser from '../PopupUser';
import dayjs, { Dayjs } from 'dayjs';
import toast from "react-hot-toast";
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import DateTimePicker from '../date-and-time-picker/DateTimePicker';
import { ArrowDown, ChevronDown, Loader, Search } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store/store';
import { setSearchFormData } from '@/redux/slices/searchSlice';
import Link from 'next/link';

export default function HeroSearchForm() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.search.formData);

  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');

  // Fetch Cars
  const { useGetPublicCarsInfinite } = useCarQueries();
  const {
    data: carsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetPublicCarsInfinite();

  const cars = carsData?.pages.flatMap((page: any) => page.cars || page) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setSearchFormData({ [name]: value }));
  };

  const handleDateChange = (field: 'tripStart' | 'tripEnd', date: Dayjs | null) => {
    const dateObj = date ? date.toDate() : null;
    // Store as ISO string for Redux serialization
    const dateStr = dateObj ? dateObj.toISOString() : null;

    if (field === 'tripStart' && dateObj) {
      dispatch(setSearchFormData({ tripStart: dateStr }));

      if (formData.tripEnd) {
        const currentEnd = new Date(formData.tripEnd);
        const minEnd = new Date(dateObj.getTime() + 60 * 60 * 1000);
        if (currentEnd < minEnd) {
          dispatch(setSearchFormData({ tripEnd: null }));
        }
      }
    } else {
      dispatch(setSearchFormData({ [field]: dateStr }));
    }
  };

  const handleCarSelect = (car: any) => {
    dispatch(setSearchFormData({
      carId: car._id,
      carName: car.name,
      carSlug: car.slug
    }));
    setErrors(prev => ({ ...prev, car: undefined }));
    setIsDropdownOpen(false);
  };

  // ... (rest of code)

  {/* Submit Button */ }
  <div className="pl-4 pr-2 py-2 flex items-center justify-center lg:justify-end">
    <Link
      href={formData.carSlug ? `/${formData.carSlug}` : '#'}
      onClick={(e) => {
        if (!formData.carSlug) {
          e.preventDefault();
          toast.error("Please select a car first");
        }
      }}
      // disabled handling needs to be done via styles or preventing default as Link doesn't have disabled prop same as button
      className={`flex items-center justify-center cursor-pointer w-12 h-12 rounded-full bg-[#BFA06A] text-white hover:bg-[#a88b58] transition-all shadow-md hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      aria-disabled={isLoading}
    >
      {!isLoading ? (
        <Search className='text-white' />
      ) : (
        <Loader className='text-white animate-spin' />
      )}
    </Link>
  </div>

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [errors, setErrors] = useState<Partial<UserFormError>>({});

  // ... (rest of code)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<UserFormError> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.tripStart) newErrors.tripStart = "Start date is required";
    if (!formData.tripEnd) newErrors.tripEnd = "End date is required";
    if (!formData.carId) newErrors.car = "Please select a car";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowPopup(true);
  };

  return (
    <section className='w-full max-w-[1400px] mx-auto'>
      <form onSubmit={handleSubmit} noValidate className="relative mt-8 w-full font-inter">
        <div className="bg-white rounded-[20px] shadow-xl px-4 py-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

          {/* Name */}
          <div className="flex flex-col gap-1.5 px-4 py-2 flex-1 min-w-[160px]">
            <label htmlFor='name' className="text-xs font-bold text-gray-800 uppercase tracking-wide">Name</label>
            <input
              id='name'
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5 px-4 py-2 flex-1 min-w-[160px]">
            <label htmlFor='phoneNumber' className="text-xs font-bold text-gray-800 uppercase tracking-wide">Phone Number</label>
            <input
              id='phoneNumber'
              type="tel"
              name="phone"
              placeholder="Enter Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Trip Start */}
          <div className="flex-1 px-2">
            <DateTimePicker
              label="Trip Starts"
              placeholder="Select date"
              value={formData.tripStart ? dayjs(formData.tripStart) : null}
              onChange={(date) => handleDateChange('tripStart', date)}
              className="border-none bg-transparent px-2 shadow-none min-w-0"
              isForm={true}
            />
          </div>

          {/* Trip End */}
          <div className="flex-1 px-2">
            <DateTimePicker
              label="Trip Ends"
              placeholder="Select date"
              value={formData.tripEnd ? dayjs(formData.tripEnd) : null}
              onChange={(date) => handleDateChange('tripEnd', date)}
              className="border-none bg-transparent px-2 shadow-none min-w-0"
              isForm={true}
            />
          </div>


          {/* Car Type Dropdown */}
          <div className="relative flex-1 px-4 py-2 min-w-[200px]" ref={dropdownRef}>
            <div
              className="flex flex-col gap-1.5 cursor-pointer"
              onClick={() => {
                if (!isDropdownOpen && dropdownRef.current) {
                  const rect = dropdownRef.current.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceRequired = 200; // approx height for dropdown
                  setDropdownPosition(spaceBelow < spaceRequired ? 'top' : 'bottom');
                }
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold uppercase tracking-wide cursor-pointer ${errors.car ? 'text-red-500' : 'text-gray-800'}`}>Select Car</label>
                {errors.car && <span className="text-[10px] text-red-500 font-medium">{errors.car}</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${errors.car ? 'text-red-500' : (formData.carName ? 'text-gray-900' : 'text-gray-400')}`}>
                  {formData.carName || "Select car"}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {isDropdownOpen && (
              <div
                className={`absolute left-0 right-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-1 ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
              >
                <div
                  className="overflow-y-auto no-scrollbar"
                  style={{ maxHeight: '15rem' }}
                  onScroll={(e) => {
                    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                    if (scrollHeight - scrollTop <= clientHeight + 50) {
                      if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }
                  }}
                >
                  {cars.length > 0 ? (
                    <>
                      {cars.map((car: any) => (
                        <div
                          key={car._id}
                          className="px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleCarSelect(car)}
                        >
                          <p className="text-sm font-semibold text-gray-800">{car.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{car.type} • {car.transmission}</p>
                        </div>
                      ))}
                      {isFetchingNextPage && (
                        <div className="py-2 flex justify-center">
                          <Loader className="animate-spin text-gray-500" size={16} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No cars available</div>
                  )}
                </div>

                {/* Visual Cue for More Content - Fixed at bottom of container */}
                {cars.length > 3 && (
                  <div className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm w-[90%] flex justify-center py-1 rounded-b-lg pointer-events-none'>
                    <ChevronDown size={14} className="text-gray-400 animate-bounce" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pl-4 pr-2 py-2 flex items-center justify-center lg:justify-end">
            <Link
              href={formData.carSlug ? `/${formData.carSlug}` : '#'}
              onClick={(e) => {
                if (!formData.carSlug) {
                  e.preventDefault();
                  setErrors(prev => ({ ...prev, car: "Please select a car" }));
                }
              }}
              aria-disabled={isLoading}
              className={`flex items-center justify-center cursor-pointer w-12 h-12 rounded-full primary-btn text-white hover:bg-[#a88b58] transition-all shadow-md hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {!isLoading ? (
                <Search className='text-white' />
              ) : (
                <Loader className='text-white animate-spin' />
              )}
            </Link>
          </div>
        </div>
      </form>
    </section >
  );
}