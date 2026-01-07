import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-20 py-16 relative">
      {/* Scroll to Top */}
      <div className=" absolute -top-6 left-1/2 transform -translate-x-1/2 border-black border-6 rounded-full">
        <a
          href="#"
          className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl">&#x25B2;</span>
        </a>
      </div>

      {/* Footer Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Logo + About */}
        <div className='max-w-120 col-span-2 py-4 md:px-16'>
          <Image
            src="/logo (2).png"
            alt="Quzeedrive Logo"
            width={120}
            height={40}
            className="mb-4"
          />
          <p className="text-sm text-gray-400 leading-relaxed text-wrap">
            Whether you’re booking hatchbacks for city drives, sedans for comfort, or SUVs for road trips, our fleet offers the best self drive car hire in Chennai. Enjoy hassle-free driving with full control — no driver, no delays.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#">Home</a></li>
            <li><a href="#">Book a Car</a></li>
            <li><a href="#host">Become a Host</a></li>
            <li><a href="#tariffs">Pricing</a></li>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
 
        {/* Company Info  */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href='tel:+9363763309'>📞 +91 93637 63309 - Host</a></li>
            <li><a href='tel:+9344784676'>📞 +91 93447 84676 - Customer</a></li>
            <li className='space-y-1'>
              <div><a href='mailto:customersupport@quzeedrive.com' className='break-all'>📧 customersupport@quzeedrive.com</a></div>
            </li>
            <li>
              <div><a href="mailto:support@quzeedrive.in" className='break-all'>📧 support@quzeedrive.in</a></div>
            </li>
            <li>📍 Quzeedrive Pvt. Ltd., Chennai, India</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
