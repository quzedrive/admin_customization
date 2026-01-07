'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { HostForm } from '@/types/host';
import sendHost from '@/utils/sendHost'
import SuccesMsg from '../app/thank-you/page'

export default function ContactModal({ onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState<HostForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
    carsCount: 0,
    message: ""
  });
  const [errors, setErrors] = useState<Partial<HostForm>>({});
  const [mathProblem, setMathProblem] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const result = await sendHost(formData);

      if (result.success) {
        setFormData({
          name: "",
          phone: "",
          email: "",
          location: "",
          carsCount: 0,
          message: ""
        });
        setSecurityAnswer('');
        setLoading(false);
        onClose(); // Close the modal first
        router.push('/thank-you'); // Add type parameter
      } else {
        console.error('Submission failed:', result.error);
        setLoading(false);
      }
    }
  };

  const validate = () => {
    const newErrors: Partial<HostForm> = {};
    if (!formData.name) newErrors.name = "Oops! What should we call you?";
    if (!formData.phone) newErrors.phone = "Can’t reach you without your number!";
    if (!formData.email) newErrors.email = "missing our professional way for communication";
    if (!formData.location) newErrors.location = "Oops! Where we need to pick you up";
    if (!formData.carsCount) newErrors.message = "Oops! When we are going to start the journey";
    if (!formData.message) newErrors.message = "Oops! When we are ending the journey";
    if (parseInt(securityAnswer) !== mathProblem?.answer) newErrors.securityAnswer = 'Just a quick check – what’s the sum?';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathProblem({ a, b, answer: a + b });
  }, [errors]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex p-6 flex-col gap-3 items-start md:items-center justify-center">
      <div className="w-full flex flex-col md:flex-row max-w-6xl bg-white rounded-[20px] overflow-hidden shadow-2xl">

        {/* Left Side */}
        <div
          className="relative showBg w-full md:w-1/2 bg-[#0c0c27] text-white border-[16px] p-4 md:p-10 flex md:flex-col justify-between bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]"
          style={{ backgroundImage: "url('/car.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* mobile */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 !text-2xl font-bold text-white hover:text-gray-900"
          >
            <svg className=' hover:scale-105 transition-transform duration-300' width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#ffffff" />
            </svg>
          </button>
          <div className='py-2 xl:py-6 3xl:py-8 4xl:py-10'>
            <h2 className="text-3xl xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold leading-tight mb-6">
              Become a <br />Host with <br /> Quzeedrive
            </h2>
            <p className="hidden md:block text-base xl:text-lg 3xl:text-xl tracking-wide text-gray-300 mr-24">
              Turn your parked car into a passive income machine. start earning every time someone books your vehicle
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src='/icons/award.svg'
              alt='award'
              width={200}
              height={200}
              className='h-auto pr-2 w-26 xl:w-24 3xl:w-36 4xl:w-48'
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full h-full md:w-1/2 py-2 px-6 xl:p-6 md:p-10 relative overflow-y-auto">
          <button
            onClick={onClose}
            className="hidden md:block cursor-pointer absolute top-4 right-4 !text-3xl font-bold text-gray-600 hover:!text-red-600"
          >
            <svg className=' hover:scale-105 transition-transform duration-300' width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#292D32" />
            </svg>
          </button>
            <form onSubmit={handleSubmit} className="space-y-5 2xl:space-y-10 xl:pt-6 3xl:pt-12 text-black">
              <div className="">
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.name && <span className="text-red-300 text-sm">{errors.name}</span>}
              </div>

              <div className="">
                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.phone && <span className="text-red-300 text-sm">{errors.phone}</span>}
              </div>

              <div className="">
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.email && <span className="text-red-300 text-sm">{errors.email}</span>}
              </div>

              <div className="">
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.location && <span className="text-red-300 text-sm">{errors.location}</span>}
              </div>

              <div className="">
                <input
                  name="carsCount"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Cars count (numbers only eg: 1 ,2 ,3)"
                  value={formData.carsCount === 0 ? "" : formData.carsCount}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.carsCount && <span className="text-red-300 text-sm">{errors.carsCount}</span>}
              </div>

              <div className="">
                <input
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none"
                />
                {errors.message && <span className="text-red-300 text-sm">{errors.message}</span>}
              </div>

              <div className="">
                <div className="flex items-center gap-4 space-x-2">
                  <label className="text-sm font-bold flex">{mathProblem?.a} + {mathProblem?.b} ?</label>
                  <input
                    name="securityAnswer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className=" border px-4 w-[100px] border-gray-300 py-3 focus:outline-none"
                  />
                </div>
                {errors.securityAnswer && <span className="text-red-300 text-sm">{errors.securityAnswer}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-fit flex items-center gap-2 px-6 py-4 xl:px-10 rounded-full font-semibold transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r cursor-pointer from-blue-500 to-blue-700 !text-white hover:from-blue-600'} `}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Joining...
                  </>
                ) : (
                  'JOIN NOW'
                )}
              </button>
            </form>

        </div>
      </div>
      {/* image model
      <div className='flex justify-between h-36 rounded-2xl w-full md:hidden' style={{ backgroundImage: "url('/car.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className='text-white text-3xl p-4'>Become a <br/>Host with <br/> Quzeedrive</h1>
        <Image
          src='/icons/award.svg'
          alt='award'
          width={200}
          height={200}
          className='h-auto pr-2 w-26 xl:w-24 3xl:w-36 4xl:w-48'
        /> 
      </div> */}
    </div>
  );
}