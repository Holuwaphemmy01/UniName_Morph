import { useState } from 'react';
import { Zap, Wallet, Menu } from 'lucide-react';
import Button from '@mui/material/Button';


const Header = () => {

  const [connected, setConnected] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnectWallet = () => {
    setConnected(true);
  };

  const handleMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };
    
  return (
    // <div className='min-h-screen  flex flex-col'>
      <nav className="sticky top-0 z-20 bg-slate-950 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between ">
          {/* Mobile Hamburger - now before logo */}
          <div className="md:hidden flex items-center mr-2">
            <button onClick={handleMenuToggle} aria-label="Open menu">
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 ">
            <Zap className="h-6 w-6 text-indigo-400" />
            <span className="text-white text-xl font-bold">UniName</span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-slate-300 text-sm font-medium">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#docs" className="hover:text-white transition">Docs</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <Button
            onClick={handleConnectWallet}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm ml-2"
          >
            <Wallet className="mr-2 h-4 w-4" /> {connected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        </div>
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col gap-4 text-slate-300 text-sm font-medium">
            <a href="#features" className="hover:text-white transition" onClick={handleMenuToggle}>Features</a>
            <a href="#docs" className="hover:text-white transition" onClick={handleMenuToggle}>Docs</a>
            <a href="#about" className="hover:text-white transition" onClick={handleMenuToggle}>About</a>
            <a href="#contact" className="hover:text-white transition" onClick={handleMenuToggle}>Contact</a>
          </div>
        )}
      </nav>
    // </div>
      
  

      
    
  )
}

export default Header
