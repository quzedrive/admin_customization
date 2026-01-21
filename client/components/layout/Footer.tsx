import Image from 'next/image';
import Link from 'next/link';

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
  description?: string;
  location?: Location;
  contact?: Contact;
}

export default function Footer({ logoLight, isLoading, description, location, contact }: FooterProps) {

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Our Fleet", href: "/our-fleet" },
    { name: "Track", href: "/track" },
    { name:'Privacy Policy', href:'/privacy-policy' },
    { name:'Terms of Service', href:'/terms-of-service' },
    { name:'Payment Policy', href:'/payment-policy' },
  ]

  return (
    <footer className="bg-black text-white px-4 md:px-20 py-16 relative">
      {/* Scroll to Top */}
      <div className="hidden md:block absolute -top-6 left-1/2 transform -translate-x-1/2 border-black border-6 rounded-full">
        <a
          href="#"
          className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl">&#x25B2;</span>
        </a>
      </div>

      {/* Footer Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Logo + About */}
        <div className='max-w-120 col-span-1 sm:col-span-2 md:col-span-2 pb-4 md:px-16'>
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
          {isLoading ? (
            <div className='w-full mt-10 min-h-20 bg-white/20 animate-pulse rounded-lg' />
          ) : (
            <p className="text-sm text-gray-400 leading-relaxed text-wrap">
              {description}
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div className='col-span-1 sm:col-span-1 md:col-span-1 pt-0 md:pt-4 flex flex-col gap-2'>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300 mt-4">
            {quickLinks.map((link, index) => (
              <li key={index} >
                <Link className='hover:text-primary transition-colors' href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
 
        {/* Company Info  */}
        <div className='col-span-1 sm:col-span-1 md:col-span-1 pt-0 md:pt-4 flex flex-col gap-2'>
          <h4 className="font-semibold">Company</h4>
          {isLoading ? (
            <ul className='space-y-2 text-sm text-gray-300'>
              <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
              <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
              <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
              <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
              <li className='w-full h-6 bg-white/20 animate-pulse rounded-lg' />
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link className='hover:text-primary transition-colors' href={`tel:+91${contact?.hostContact}`}>📞 +91 {contact?.hostContact} - Host</Link></li>
              <li><Link className='hover:text-primary transition-colors' href={`tel:+91${contact?.customerContact}`}>📞 +91 {contact?.customerContact} - Customer</Link></li>
              <li className='space-y-1'>
                <div><Link href={`mailto:${contact?.contactEmail}`} className='break-all hover:text-primary transition-colors'>📧 {contact?.contactEmail}</Link></div>
              </li>
              <li>
                <div><Link href={`mailto:${contact?.supportEmail}`} className='break-all hover:text-primary transition-colors'>📧 {contact?.supportEmail}</Link></div>
              </li>
              <li><Link className='hover:text-primary transition-colors' href={location?.link} target='_blank' rel='noopener noreferrer'>📍 {location?.address}</Link></li>
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
