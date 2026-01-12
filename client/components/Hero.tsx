import LeadingForm from './forms/LeadingForm';
import 'antd/dist/reset.css';

const mainHeroTitle = 'Self Drive Cars in Chennai';
const subHeroTitle = 'Drive on Your Terms';
const heroDescription = 'Rent a car for a few hours or a few days. No driver, no hassle – just \n freedom to drive anywhere, anytime across Chennai and Tamil Nadu.'
export default function Hero() {
  return (
    <section
      id="hero"
      className='realtive w-full flex flex-col items-center justify-start xl:justify-center lg:h-screen p-4 pt-20 lg:p-16'
      style={{ backgroundImage: "url('/hero.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className='pt-12 md:pt-28'>
        <h1 className="text-3xl sm:text-3xl md:text-6xl 3xl:text-7xl 4xl:text-[100px] text-white text-center drop-shadow-lg font-adlam-display">
          Self Drive Cars in Chennai
        </h1>
        <h1 className="text-3xl md:text-6xl 3xl:text-6xl 4xl:text-7xl text-white text-center drop-shadow-lg font-adlam-display">
          {subHeroTitle}
        </h1>
      </div>
      <p className="hidden md:block whitespace-normal md:whitespace-pre-line font-inter mt-8 text-2xl text-white text-center">
        {heroDescription}
      </p>
      <LeadingForm />
    </section>
  )
}