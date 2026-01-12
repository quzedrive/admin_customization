import Image from 'next/image';
import React from 'react'

interface Specification {
    icon: string;
    text: string;
}

interface SpecificationsProps {
    specifications: Specification[];
    isLoading?: boolean;
}

function Specifications({ specifications, isLoading = false }: SpecificationsProps) {

    console.log(specifications);


    return (
        <div className='bg-black w-full text-white'>
            <div className='max-w-7xl mx-auto w-full flex flex-col justify-start items-center gap-12 pt-16 pb-24 px-4'>

                <div className='flex flex-col justify-start items-center gap-4 w-full'>
                    <span className='text-md font-medium '>WHAT THIS CAR OFFERS</span>
                    <h3 className='text-xl md:text-3xl lg:text-5xl font-medium '>Specifications & Key Features</h3>
                    <p className='text-sm md:text-base font-medium text-center max-w-3xl'>Explore the car’s essential specifications and comfort features — from transmission and fuel type to safety and convenience — designed for a smooth self-drive experience</p>
                </div>

                <div className='flex flex-wrap gap-10 w-full items-center justify-center  gap-8'>
                    {specifications?.map((spec, index) => (
                        <div
                            key={index}
                            className='h-28 w-28 border border-[#373636] rounded-md overflow-hidden flex flex-col items-center justify-center  hover:translate-y-[-5px] transition-all duration-300 ease-in-out'
                        >
                            <div className='h-8 w-8'>
                                <Image
                                    src={spec.icon}
                                    alt={spec.text}
                                    width={50}
                                    height={50}
                                    className='h-full w-full object-cover'
                                />
                            </div>
                            <span className='text-xs font-medium mt-2 text-center'>{spec.text}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Specifications