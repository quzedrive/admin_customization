'use client'
import Image from 'next/image';
import { useState } from 'react';
import Popup from './PopupUser';

const cars = [
    {
        name: "Hynundai Verna",
        image: "/cars/verna.webp",
        pricePerHour: 133,
        transmission: "manual",
        fuelType: "petrol",
        seatCapacity: 5,
        stars: 3,
        reviews:102
    }, {
        name: "Maruti Suzuki Swift Dzire",
        image: "/cars/dzire.webp",
        pricePerHour: 124,
        transmission: "Automatic",
        fuelType: "petrol",
        seatCapacity: 5,
        stars: 4,
        reviews:16
    }, {
        name: "Maruti Suzuki Baleno",
        image: "/cars/balleno.webp",
        pricePerHour: 156,
        transmission: "Automatic",
        fuelType: "petrol",
        seatCapacity: 5,
        stars: 5,
        reviews:35
    }, {
        name: "Hyundai i10",
        image: "/cars/i10.webp",
        pricePerHour: 130,
        transmission: "Automatic",
        fuelType: "petrol",
        seatCapacity: 4,
        stars: 3,
        reviews:23
    }, {
        name: "Maruti Suzuki ciaz",
        image: "/cars/ciaz.webp",
        pricePerHour: 247,
        transmission: "Automatic",
        fuelType: "petrol",
        seatCapacity: 5,
        stars: 5,
        reviews:98
    }, {
        name: "Honda brv",
        image: "/cars/brv.webp",
        pricePerHour: 254,
        transmission: "Automatic",
        fuelType: "petrol",
        seatCapacity: 7,
        stars: 5,
        reviews:45
    }
]

export default function Collection() {

    const [showPopup, setShowPopup] = useState(false)

    return (
        <section id='tariffs' className="w-full flex flex-col justify-center items-center py-12 gap-8">
            <h2 className="w-full px-4 text-3xl  font-bold text-center">Tariffs for our Fleets</h2>
            <div className="w-5/6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cars.map((car, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg group overflow-hidden">
                        <Image
                            src={car.image}
                            alt={car.name}
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover rounded-md mb-2 transition-transform duration-300 lg:group-hover:scale-105"
                        />
                        <div className="min-h-48 p-4 flex flex-col justify-between items-start gap-2">
                            <div className='w-full flex justify-between items-center'>
                                <h2 className="text-2xl xl:text-3xl 3xl:text-4xl font-semibold">₹{car.pricePerHour}/hr</h2>  
                            </div>
                            <div className="w-full flex flex-col items-start">
                                <h3 className="font-semi-bold text-gray-900 text-base xl:text-lg 3xl:text-xl">{car.name}</h3>
                                <div className="text-lg capitalize text-gray-400 flex justify-start gap-2">
                                    <p>{car.transmission}</p> <p>.</p>
                                    <p>{car.fuelType}</p> <p>.</p>
                                    <p>{car.seatCapacity} Seater</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPopup(!showPopup)}
                                className="relative overflow-hidden cursor-pointer w-fit h-12 px-3.5 py-2 my-2 rounded-md font-bold text-xl
                                  outline-[1.25px] outline-offset-[-1.25px] outline-black inline-flex justify-center items-center
                                  text-black bg-transparent border border-black
                                  transition-colors duration-300
                                  before:content-[''] before:absolute before:inset-0 before:bg-black before:scale-x-0 before:origin-left
                                  before:transition-transform before:duration-300 hover:before:scale-x-100
                                  hover:!text-white z-10"
                            >
                                <span className="relative z-10">Book Now</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && <Popup onClose={() => setShowPopup(!showPopup)} />}
        </section>
    )
}
