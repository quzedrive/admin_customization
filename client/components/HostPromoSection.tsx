'use client'
import { useState } from 'react';
import PopupHost from './PopupHost'

export default function HostPromoSection() {
  const [showPopup, setShowPopup] = useState(false)
  return (
    <section id='host' className='w-full flex px-6 md:px-24 justify-center items-center'>
      <div
        className="w-full rounded-3xl"
        style={{ backgroundImage: 'url(/banner.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Content Overlay */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 text-white">
          <div className="md:w-1/2 hidden md:block" /> {/* empty left for spacing or optional content */}

          <div className="md:w-1/2 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Become a Host with <br className="hidden md:block" />
              Quzeedrive
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Turn your parked car into a passive income machine. Join our self-drive platform and
              start earning every time someone books your vehicle — flexible, secure, and hassle-free.
            </p>

            {/* Bullet Features */}
            <ul className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white font-medium">
              <li className="flex items-center gap-2">
                ✅ No commitment.
              </li>
              <li className="flex items-center gap-2">
                ✅ You set the price.
              </li>
              <li className="flex items-center gap-2">
                ✅ We handle the rest.
              </li>
            </ul>

            <button
              onClick={() => setShowPopup(!showPopup)}
              className="relative !overflow-hidden inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border border-white font-semibold rounded-full  cursor-pointer
    transition-colors duration-300 group hover:border-black"
            >
              {/* Black fill animation */}
              <span className="absolute inset-0 left-0 top-0 w-full h-full bg-black z-0 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
              <span className="relative z-10 flex items-center">
                JOIN NOW
                <span className="ml-2">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      {showPopup && <PopupHost onClose={() => setShowPopup(!showPopup)} />}
    </section>
  );
}
