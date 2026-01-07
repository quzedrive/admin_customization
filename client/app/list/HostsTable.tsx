'use client'

import { useState, useEffect } from 'react';
import getHost from '@/utils/getHost';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function HostsTable() {
  const [data, setData] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    (async () => {
      const result = await getHost();
      if (result.success) {
        // console.log('Fetched data:', result.data);
        setData(result.data);
      } else {
        console.error('Error:', result.error);
      }
    })();
  }, []);

  return (
    <div className="max-w-screen overflow-x-auto">
      <table className="table-auto border-collapse border border-black shadow-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Phone</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
            <th className="border border-gray-400 px-4 py-2">Requested Date</th>
            <th className="border border-gray-400 px-4 py-2">Location</th>
            <th className="border border-gray-400 px-4 py-2">Cars Count</th>
            <th className="border border-gray-400 px-4 py-2 max-w-[300px]">Message</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 capitalize">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
              <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">
                {new Date(user.createdAt).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
   

                })}
              </td>

              <td className="border border-gray-300 px-4 py-2 capitalize">{user.location}</td>
              <td className="border border-gray-300 px-4 py-2">{user.carsCount}</td>
              <td className="border border-gray-300 px-4 py-2 min-w-sm max-w-lg break-words capitalize">
                {user.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}