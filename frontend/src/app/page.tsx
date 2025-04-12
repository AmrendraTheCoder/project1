import React from 'react'
import { Button } from '@/components/ui/button'
import HeroSection from '@/components/base/HeroSection';

function App() {
  return (
    <div>
      {/* min-h-screen bg-slate-300 flex flex-col items-center justify-center */}
      {/* <h1 className="text-red-500">This is the FrontEnd App</h1>
      <Button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Hello
      </Button> */}
      <HeroSection/>
    </div>
  );
}

export default App