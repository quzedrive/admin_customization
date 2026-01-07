'use client'
import Image from 'next/image';
import { useState } from 'react'
import PopupUser from './PopupUser'

const carCategories = [
  {
    title: 'Hatchbacks',
    description: ' Compact, fuel-efficient cars perfect for navigating Chennai’s busy streets. Ideal for short rides and daily commuting.',
    image: '/cars/alto.webp',
  },
  {
    title: 'Sedans',
    description: ' Smooth, spacious, and comfortable — great for family trips, business travel, and weekend getaways.',
    image: '/cars/skoda.webp',
  },
  {
    title: 'SUVs',
    description: ' Perfect for long drives, off-road adventures, and those who crave control with comfort.',
    image: '/cars/kia.webp',
  },
  {
    title: 'Luxury Cars',
    description: 'Experience premium comfort and top-tier features — drive in ultimate style.',
    image: '/cars/audi.webp',
  },
  {
    title: 'MUVs',
    description: 'Ideal for big families, group outings, and road trips with ample luggage room and seating capacity.',
    image: '/cars/ev.webp',
  },
]

export default function Category() {

  const [showPopup, setShowPopup] = useState(false)

  return (
    <section id='about' className="bg-white text-neutral-800 px-6 md:py-8 md:px-26">
      {/* Heading Section */}
      <div className="text-center md:max-w-5/6 md:mx-auto my-4 md:my-8 font-manrope">
        <p className="text-xl tracking-wide font-medium uppercase">About Us</p>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4 text-neutral-primary">Your Trusted Self Drive Car Rental in Chennai</h1>
        <p className="text-lg text-gray-neutral/500">
          At Quzeedrive, we make travel flexible and stress-free with reliable self-drive cars in Chennai. Whether it’s a short city ride or a weekend getaway across Tamil Nadu, our well-maintained fleet is ready for your journey. Enjoy the freedom to drive without a driver, with simple pick-up and drop-off options citywide — all designed for your comfort, privacy, and convenience.
        </p>
      </div>
      {/* Car Grid Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {carCategories.map((category, index) => (
          <div
            key={index}
            className={`h-90 group relative rounded-2xl text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow
    ${index === 0 ? 'row-span-2 h-90 lg:h-190' : ''}`}
          >
            {/* Background image with scale on hover */}
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-500 lg:group-hover:scale-105"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
              }}
            />
            <div className="relative h-full flex flex-col justify-between p-4 xl:p-8 3xl:p-10 bg-transparent z-10">
              <div>
                <Image
                  src='/analytics.svg'
                  alt='||'
                  width={35}
                  height={35}
                />
                <h2 className="text-xl 2xl:text-2xl 4xl:text-3xl font-semibold mb-2">{category.title}</h2>
                <p className="text-sm 2xl:text-base 4xl:text-lg text-gray-300">{category.description}</p>
              </div>
              <button onClick={() => setShowPopup(!showPopup)} className='cursor-pointer'>
                <Image
                  src='/icons/arrow-diaganal.svg'
                  alt='->'
                  width={35}
                  height={35}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center md:max-w-5/6 md:mx-auto mt-2 md:mt-4 font-manrope">
        <p className="text-lg text-gray-neutral/500">
          Whether you're a tourist, a working professional, or someone who prefers flexibility over owning a car, our self-drive car rentals in Chennai are designed to put you in control of your journey.
        </p>
        <h1 className="text-xl font-bold mt-2 text-neutral-primary">Drive how you want, where you want — with no ownership and no hidden fees.</h1>
      </div>
      {showPopup && <PopupUser onClose={() => setShowPopup(!showPopup)} />}
    </section>
  );
}