'use client'

import { useState, useRef, useLayoutEffect } from 'react';
import { UsersTable } from './UsersTable';
import { HostsTable } from './HostsTable';
import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState('users');
  const containerRef = useRef(null);
  const buttonRefs = useRef(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const storeData = [
    { id: 'users', text: 'Users', btn: 'bg-[#b78b5c]', textClass: 'text-white' },
    { id: 'hosts', text: 'Hosts', btn: 'bg-[#b78b5c]', textClass: 'text-white' },
  ];

  useLayoutEffect(() => {
    const currentBtn = buttonRefs.current.get(selectedTab);
    const container = containerRef.current;
    if (currentBtn && container) {
      const btnRect = currentBtn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left + 'px',
        width: btnRect.width + 'px',
      });
    }
  }, [selectedTab]);

  return (
    <section className="w-full min-h-screen pt-36 flex flex-col gap-6 justify-start items-center px-4 py-8 overflow-x-auto">
      <div className='w-full flex flex-col gap-4 items-center'>
        <h1 className="text-xl lg:text-3xl font-semibold">Form Submissions</h1>
        <div
          ref={containerRef}
          className="relative flex mb-6 rounded-full overflow-hidden bg-[#ececec] w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[250px] 2xl:w-[280px] 3xl:w-[300px] 4xl:w-[320px] mx-auto"
          style={{ minWidth: 0, overflowX: 'auto' }} // ensures scroll on mobile
        >
          {/* Moving indicator */}
          <div
            className={`absolute top-0 bottom-0 bg-[#b78b5c] rounded-full transition-all duration-300 ease-in-out z-0`}
            style={indicatorStyle}
          ></div>
          {storeData.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedTab(store.id)}
              ref={el => buttonRefs.current.set(store.id, el)}
              className={`
                flex-1 min-w-[100px] cursor-pointer
                px-4 py-2
                text-xs sm:text-sm md:text-base
                rounded-full font-bold uppercase tracking-wide relative z-10
                transition-colors duration-300 ease-in-out
                ${selectedTab === store.id ? 'text-white' : 'text-gray-600'}
              `}
            >
              {store.text}
            </button>
          ))}
        </div>

      </div>
      {selectedTab === 'users' ? <UsersTable /> : <HostsTable />}
    </section>
  );
}