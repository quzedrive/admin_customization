import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function Cta() {
    return (
        <div className='w-full '>
            <div className='max-w-7xl mx-auto w-full flex justify-center items-center gap-4 py-12 px-4'>

                <div className='relative w-full h-[400px] z-20'>

                    <div className='absolute inset-0 z-10 rounded-lg overflow-hidden border border-black/10'>

                        <Image
                            src={'/banner-2.webp'}
                            alt='banner-2'
                            fill
                        />

                    </div>

                    <div className='relative w-[50%] z-40 h-full flex flex-col justify-center items-start px-10'>
                        <h4 className='text-2xl font-bold mb-3'>Planning a longer trip?</h4>
                        <p className='mb-5'>
                            7-day bookings are handled directly with the car owner
                            to ensure availability and smooth coordination
                        </p>
                        <button className='px-5 py-3 bg-black text-white rounded-full flex items-center gap-2 hover:gap-3 cursor-pointer hover:scale-105 transition-all duration-300'>
                            On Request <ArrowRight />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Cta