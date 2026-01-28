'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../redux/slices/filterSlice';
// import PopupUser from './PopupUser' // Removed as requested

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
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryTitle: string) => {
    // Convert plural to singular if needed (simple heuristic as before)
    const type = categoryTitle.endsWith('s') ? categoryTitle.slice(0, -1) : categoryTitle;

    dispatch(resetFilters()); // Clear other filters first
    dispatch(setFilters({ types: [type] }));
    router.push('/our-fleet');
  };

  return (
    <section id='about' className="bg-white text-neutral-800 px-6 md:py-8 md:px-26">
      {/* Heading Section */}
      <div className="text-center md:max-w-5/6 md:mx-auto my-4 md:my-8 font-manrope">
        <p className="text-lg tracking-wide font-medium uppercase text-primary">About Us</p>
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
            className={`group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1
    ${index === 0 ? 'row-span-2 min-h-[400px] lg:min-h-full' : 'min-h-[300px]'}`}
          >
            {/* Background image with subtle zoom on hover */}
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10">

              {/* Top Section: Icon & Title */}
              <div className="transform transition-transform duration-500 lg:group-hover:translate-y-0 lg:translate-y-2">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  <Image
                    src='/analytics.svg'
                    alt='Icon'
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-90"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight font-manrope">
                  {category.title}
                </h2>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed opacity-100 lg:opacity-0 transform lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {category.description}
                </p>
              </div>

              {/* Bottom Section: Action Button */}
              <div className="self-end mt-4">
                <button
                  onClick={() => handleCategoryClick(category.title)}
                  className='group/btn cursor-pointer relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:bg-white hover:text-black hover:w-32 hover:justify-between hover:px-4 overflow-hidden'
                >
                  <span className="hidden group-hover/btn:block text-sm font-semibold whitespace-nowrap mr-2">Explore</span>
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src='/icons/arrow-diaganal.svg'
                      alt='->'
                      fill
                      className="object-contain brightness-0 invert group-hover/btn:brightness-0 group-hover/btn:invert-0 transition-all duration-300"
                    />
                  </div>
                </button>
              </div>
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
    </section>
  );
}