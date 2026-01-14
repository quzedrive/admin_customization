import React from 'react'

function Loader() {
  return (
    <div className='fixed inset-0 z-[9999] flex justify-center items-center w-full h-screen bg-black/50 backdrop-blur-sm'>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  )
}

export default Loader