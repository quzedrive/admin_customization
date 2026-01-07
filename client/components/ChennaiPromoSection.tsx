'use client'
import Image from 'next/image';
import { useState } from 'react';
import PopupUser from './PopupUser'


export default function ChennaiPromoSection() {
  const [showPopup,setShowPopup] = useState(false)

  return (
      <div className="w-full flex flex-col md:flex-row items-center justify-center py-16 gap-8 2xl:gap-16 3xl:gap-20 4xl:gap-24 px-6 2xl:px-16">
        {/* Image */}
        <div className='w-fit flex justify-end'>
          <Image
            src="/chennai.jpg" // Place this image in your public/images/
            alt="Chennai Iconic Spot"
            width={640}
            height={600}
            className="w-[70vh] h-auto object-cover rounded-3xl"
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="w-full text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-[68px] font-bold xl:leading-[68px] 3xl:leading-[84px] text-neutral-600 mb-4">
            Drive Through Chennai<br className="hidden md:inline" /> on Your Own Terms
          </h2>
          <p className=" 2xl:pr-16 3xl:pr-20 4xl:pr-32 text-gray-600 text-lg 3xl:text-xl 4xl:text-[26px] mb-6 xl:leading-[38px] 4xl:leading-[48px]">
           Experience Chennai your way with flexible self-drive car rentals. From Marina Beach to T. Nagar or Mylapore, travel freely and comfortably—on your own time, without a driver.
          </p>

          <button
            onClick={() => setShowPopup(!showPopup)}
            className="relative overflow-hidden cursor-pointer inline-block text-lg md:text-2xl font-semibold !text-white bg-black border border-black px-7 py-4 rounded-full
              transition-all duration-300 z-10 group min-w-[220px]"
          >
            {/* Car SVG animation - bottom left, moves to center on hover */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-20 h-6
              transition-all duration-500
              group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:opacity-100
              opacity-0 
              z-10 pointer-events-none flex items-end">
              <svg viewBox="0 0 800 229" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M152.734 88.3231C114.128 88.3231 82.8776 119.573 82.8776 158.18C82.8776 196.787 114.128 228.037 152.734 228.037C191.341 228.037 222.591 196.787 222.591 158.18C222.591 119.573 191.341 88.3231 152.734 88.3231ZM285.351 32.5289C289.193 40.7971 292.253 50.0419 294.596 60.0679C299.935 76.7997 292.057 80.3153 273.828 73.4794C260.417 65.4716 247.005 57.3987 233.594 49.3908C226.758 44.5731 223.503 39.8205 224.609 35.133C226.823 25.8882 244.661 21.0705 259.31 18.2059C277.93 14.495 276.628 13.7138 285.351 32.5289ZM644.661 125.693C626.758 125.693 612.174 140.211 612.174 158.18C612.174 176.084 626.693 190.667 644.661 190.667C662.565 190.667 677.148 176.149 677.148 158.18C677.148 140.211 662.63 125.693 644.661 125.693ZM152.734 125.693C134.831 125.693 120.247 140.211 120.247 158.18C120.247 176.084 134.766 190.667 152.734 190.667C170.638 190.667 185.221 176.149 185.221 158.18C185.221 140.211 170.703 125.693 152.734 125.693ZM499.609 81.357C481.575 62.021 460.742 49.4559 436.654 37.3466C383.919 10.7841 351.628 14.0393 295.638 14.0393L314.453 62.8674C322.331 73.2841 331.25 80.6408 344.792 81.357H499.609ZM644.661 88.3231C606.055 88.3231 574.805 119.573 574.805 158.18C574.805 196.787 606.055 228.037 644.661 228.037C683.268 228.037 714.518 196.787 714.518 158.18C714.518 119.573 683.268 88.3231 644.661 88.3231ZM534.245 67.0341C511.328 52.7763 486.393 40.0158 458.789 29.1434C374.74 -3.99457 310.482 -9.91905 222.331 16.7737C195.768 26.8648 169.206 36.9559 142.643 43.2059C116.406 49.4559 2.79946 55.4455 -2.36225e-05 74.521L28.0599 108.05C17.8385 116.904 9.50517 127.776 6.44527 144.768C7.29163 155.25 10.1562 164.039 15.1041 171.071C23.5026 183.115 48.112 195.55 61.3932 188.453C65.625 186.175 68.0338 181.617 67.9687 173.87C67.5781 18.271 255.404 35.9794 241.276 192.229H569.01C508.333 35.719 767.187 35.133 721.224 186.826C737.37 204.274 775.456 177.972 800 122.047C793.294 115.406 785.937 109.091 777.734 103.232C778.125 102.906 777.344 104.469 778.711 102.125C780.078 99.7815 775.391 89.9507 765.755 84.2867C715.234 54.6643 593.424 55.4455 534.245 67.0341Z" fill="#fff"/>
              </svg>
            </span>

            {/* BOOK NOW text slides right and fades out on hover */}
            <span className="relative z-10 flex items-center justify-center w-full transition-all duration-500 group-hover:translate-x-32 group-hover:opacity-0">
              BOOK NOW
            </span>
          </button>
        </div>
        {showPopup && <PopupUser onClose={()=>setShowPopup(!showPopup)}/>}
      </div>
  );
}