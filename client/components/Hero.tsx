import Image from 'next/image';
import LeadingForm from './forms/LeadingForm';
import 'antd/dist/reset.css';

const mainHeroTitle = 'Self Drive Cars in Chennai';
const subHeroTitle = 'Drive on Your Terms';
const heroDescription = 'Rent a car for a few hours or a few days. No driver, no hassle – just \n freedom to drive anywhere, anytime across Chennai and Tamil Nadu.'

export default function Hero() {
  return (
    <section
      id="hero"
      className='relative w-full flex flex-col items-center justify-center lg:h-screen min-h-screen p-4 pt-20 lg:p-16 overflow-hidden'
    >
      {/* Optimized Background Image */}
      <Image
        src="/hero.webp"
        alt="Self Drive Cars in Chennai"
        fill
        className="object-cover -z-10"
        priority
        quality={85}
      />

      {/* Overlay for better text readability if needed, currently reliant on text shadow */}
      {/* <div className="absolute inset-0 bg-black/20 -z-10"></div> */}

      <div className='pt-12 md:pt-28 relative z-10'>
        <h1 className="text-3xl sm:text-3xl md:text-6xl 3xl:text-7xl 4xl:text-[100px] text-white text-center drop-shadow-lg font-adlam-display">
          {mainHeroTitle}
        </h1>
        <h1 className="text-3xl md:text-6xl 3xl:text-6xl 4xl:text-7xl text-white text-center drop-shadow-lg font-adlam-display">
          {subHeroTitle}
        </h1>
      </div>
      <p className="hidden md:block whitespace-normal md:whitespace-pre-line font-inter mt-8 text-2xl text-white text-center relative z-10">
        {heroDescription}
      </p>

      <div className="relative z-10 w-full flex justify-center">
        <LeadingForm />
      </div>
    </section>
  )
}