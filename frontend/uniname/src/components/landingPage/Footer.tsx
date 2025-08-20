import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-slate-950 text-white py-8">
            <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm">© 2023 Uniname. All rights reserved.</p>
                </div>
                <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-white">Terms of Service</a>
                </div>
            </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer
