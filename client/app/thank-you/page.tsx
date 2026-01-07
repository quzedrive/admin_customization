'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ThanksPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-200 flex items-center justify-center p-4 sm:px-6 lg:px-8">
      {/* Main Content */}
      <div className="text-center z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="mb-6 sm:mb-8">
          <Image
            src="/tick.gif"
            alt="Success"
            width={80}
            height={80}
            unoptimized
            className="mx-auto mb-4 sm:mb-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
          Thank You! Your Message
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
          is in Good Hands.
        </h2>

        {/* Description */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-2 px-2 sm:px-0">
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We have received your enquiry and will get back to you shortly.
          </p>
          <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
            <p className="mb-2">
              Need something urgent? call us at{' '}
              <a href="tel:+9943777047" className="text-blue-600 hover:underline font-medium">
                +91 99437 77047
              </a>
            </p>
            <p>
              or drop a line at:
            </p>
            <div className="mt-2 space-y-1">
              <div>
                <a 
                  href='mailto:customersupport@quzeedrive.com' 
                  className='text-blue-600 hover:underline font-medium break-all text-sm sm:text-base'
                >
                  customersupport@quzeedrive.com
                </a>
              </div>
              <div>
                <a 
                  href="mailto:support@quzeedrive.in" 
                  className='text-blue-600 hover:underline font-medium break-all text-sm sm:text-base'
                >
                  support@quzeedrive.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={handleGoHome}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 !text-white rounded-lg transition-colors font-medium text-base sm:text-lg shadow-lg"
        >
          BACK TO HOME
        </button>

        {/* Countdown */}
        <div className="mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500">
            Redirecting to home page in <span className="font-bold text-blue-600">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  )
}