// import Image from 'next/image';
// import Link from 'next/link';

import loadConfig from "next/dist/server/config";
import Image from "next/image";
import Link from "next/link";

// interface Location {
//   address: string;
//   link: string;
// }

// interface Contact {
//   contactEmail: string;
//   supportEmail: string;
//   hostContact: string;
//   customerContact: string;
// }

// interface FooterProps {
//   logoLight?: string;
//   isLoading?: boolean;
//   description?: string;
//   location?: Location;
//   contact?: Contact;
// }

// export default function Footer({ logoLight, isLoading, description, location, contact }: FooterProps) {

//   const quickLinks = [
//     { name: "Home", href: "/" },
//     { name: "About Us", href: "/about-us" },
//     { name: "Our Fleet", href: "/our-fleet" },
//     { name: "Track", href: "/track" },
//     { name:'Privacy Policy', href:'/privacy-policy' },
//     { name:'Terms of Service', href:'/terms-of-service' },
//     { name:'Payment Policy', href:'/payment-policy' },
//   ]

//   return (
//     <footer className="bg-black text-white px-4 md:px-20 py-16 relative">
//       {/* Scroll to Top */}
//       <div className="hidden md:block absolute -top-6 left-1/2 transform -translate-x-1/2 border-black border-6 rounded-full">
//         <a
//           href="#"
//           className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
//         >
//           <span className="text-2xl">&#x25B2;</span>
//         </a>
//       </div>

//       {/* Footer Content Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         {/* Logo + About */}
//         <div className='max-w-120 col-span-1 sm:col-span-2 md:col-span-2 pb-4 md:px-16'>
//           <Link href="/">
//             {isLoading ? (
//               <div className='w-16 h-16 3xl:w-[100px] 3xl:h-[100px] bg-white/20 animate-pulse rounded-lg' />
//             ) : (
//               logoLight ? (
//                 <Image
//                   src={logoLight}
//                   alt="QuzeeDrive"
//                   width={120}
//                   height={40}
//                   className="mb-4"
//                 />
//               ) : null
//             )}
//           </Link>
//           {isLoading ? (
//             <div className='w-full mt-10 min-h-20 bg-white/20 animate-pulse rounded-lg' />
//           ) : (
//             <p className="text-sm text-gray-400 leading-relaxed text-wrap">
//               {description}
//             </p>
//           )}
//         </div>

//         {/* Quick Links */}
//         <div className='col-span-1 sm:col-span-1 md:col-span-1 pt-0 md:pt-4 flex flex-col gap-2'>
//           <h4 className="font-semibold">Quick Links</h4>
//           <ul className="space-y-2 text-sm text-gray-300 mt-4">
//             {quickLinks.map((link, index) => (
//               <li key={index} >
//                 <Link className='hover:text-primary transition-colors' href={link.href}>{link.name}</Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Company Info  */}
//         <div className='col-span-1 sm:col-span-1 md:col-span-1 pt-0 md:pt-4 flex flex-col gap-2'>
//           <h4 className="font-semibold">Company</h4>
//           {isLoading ? (
//             <ul className='space-y-2 text-sm text-gray-300'>
//               <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
//               <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
//               <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
//               <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
//               <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
//             </ul>
//           ) : (
//             <ul className="space-y-2 text-sm text-gray-300">
//               <li><Link className='hover:text-primary transition-colors' href={`tel:+91${contact?.hostContact}`}>📞 +91 {contact?.hostContact} - Host</Link></li>
//               <li><Link className='hover:text-primary transition-colors' href={`tel:+91${contact?.customerContact}`}>📞 +91 {contact?.customerContact} - Customer</Link></li>
//               <li className='space-y-1'>
//                 <div><Link href={`mailto:${contact?.contactEmail}`} className='break-all hover:text-primary transition-colors'>📧 {contact?.contactEmail}</Link></div>
//               </li>
//               <li>
//                 <div><Link href={`mailto:${contact?.supportEmail}`} className='break-all hover:text-primary transition-colors'>📧 {contact?.supportEmail}</Link></div>
//               </li>
//               <li><Link className='hover:text-primary transition-colors' href={location?.link} target='_blank' rel='noopener noreferrer'>📍 {location?.address}</Link></li>
//             </ul>
//           )}
//         </div>
//       </div>
//     </footer>
//   );
// }





interface Location {
  address: string;
  link: string;
}

interface Contact {
  contactEmail: string;
  supportEmail: string;
  hostContact: string;
  customerContact: string;
}

interface FooterProps {
  logoLight?: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
  location?: Location;
  contact?: Contact;
}

export default function Footer({ logoLight, isLoading, title, description, location, contact }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Our Fleet", href: "/our-fleet" },
    { name: "Track", href: "/track" },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Payment Policy', href: '/payment-policy' },
  ];

  return (
    <footer className=" ">
      <div className="w-full mx-auto ">

        <div>


          <div className="bg-black text-white py-10 px-2">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-gray-600 px-2">
              {/* Logo + Description */}
              <div className="flex flex-col items-start col-span-2 lg:col-span-2 w-full">
                <div className="text-gray-900 flex items-center">
                  <Link href="/">
                    {isLoading ? (
                      <div className='w-16 h-16 3xl:w-[100px] 3xl:h-[100px] bg-white/20 animate-pulse rounded-lg' />
                    ) : (
                      logoLight ? (
                        <Image
                          src={logoLight}
                          alt="QuzeeDrive"
                          width={120}
                          height={40}
                          className="mb-4"
                        />
                      ) : null
                    )}
                  </Link>
                </div>
                {isLoading ? (
                  <div className='w-full mt-10 max-w-sm min-h-20 bg-white/20 animate-pulse rounded-lg' />
                ) : (
                  <p className="text-sm max-w-sm text-gray-400 leading-relaxed text-wrap">
                    {description}
                  </p>
                )}
              </div>

              {/* Company Links */}
              <div className="flex flex-col items-start  col-span-2 sm:col-span-2 lg:col-span-1 gap-3 w-full">
                <h4 className="text-sm font-bold text-white uppercase">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-300 ">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link className='hover:text-primary transition-colors' href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corporate Mobility Solutions */}
              <div className="flex flex-col items-start  col-span-2 sm:col-span-2 lg:col-span-1 gap-3 w-full">
                <h4 className="text-sm font-bold text-white uppercase">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-300 ">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link className='hover:text-primary transition-colors' href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Events And Custom Travels */}
              <div className="flex flex-col items-start  col-span-2 sm:col-span-2 lg:col-span-1 gap-3 w-full">
                <h4 className="text-sm font-bold text-white uppercase">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-300 ">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link className='hover:text-primary transition-colors' href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>


            </div>
          </div>

        </div>



        {/* Bottom Bar */}
        <div className="bg-[#1d1d1d] text-white flex justify-center items-center px-2">

          {/* desktop */}
          <div className="hidden max-w-7xl mx-auto w-full md:text-sm text-gray-500 pt-8 pb-4 px-4 md:flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
            <p className="order-1 lg:order-none text-center lg:text-left w-full lg:w-auto">
              © {currentYear} {title || "Loading"}. All Rights Reserved.
            </p>
            <div>
              <p>
                Designed & Developed By <a href="https://www.codeneptune.com/" target="_blank" className="text-blue-500 hover:text-blue-700 transition-colors duration-300">Code Neptune Technologies</a>
              </p>
            </div>
          </div>

          {/* mobile */}
          <div className="text-xs max-w-7xl mx-auto w-full sm:text-sm md:hidden text-gray-500 pt-8 pb-4 px-4 flex lg:flex-row justify-between flex-col-reverse items-center gap-2 lg:gap-0">
            <div>
              <p className="text-[11px] text-center">
                Designed & Developed By <a href="https://www.codeneptune.com/" target="_blank" className="text-blue-500 hover:text-blue-700 transition-colors duration-300">Code Neptune Technologies</a>
              </p>
            </div>
            <p className="order-1 lg:order-none text-center lg:text-left w-full lg:w-auto">
              © {currentYear} {title || "Loading"}. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
