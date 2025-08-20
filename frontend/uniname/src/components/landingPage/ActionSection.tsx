// import React from 'react'

// const ActionSection = () => {
//   return (
//     <div>
//       <section id="action" className="py-24 px-6 max-w-5xl mx-auto text-center">
//         <h2 className="text-3xl font-bold mb-6">Take Action</h2>
//         <p className="text-slate-400 mb-12">Join the SonicX revolution and secure your digital identity.</p>
//         <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg">
//           Get Started
//         </button>
//       </section>
//     </div>
//   )
// }

// export default ActionSection



import React from 'react'
import { Button } from '@mui/material';
const ActionSection = () => {
  return (
    <div>
      <section className="py-20 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to simplify Web3?</h2>
        <p className="max-w-xl mx-auto mb-6 text-slate-400">
          Join the SonicX ecosystem and experience the future of identity and transactions on the fastest, builder-friendly blockchain.
        </p>
        <Button
          //onClick={handleConnectWallet}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg shadow-md"
        >
          Get Started
        </Button>
      </section>

    </div>
  )
}


export default ActionSection;