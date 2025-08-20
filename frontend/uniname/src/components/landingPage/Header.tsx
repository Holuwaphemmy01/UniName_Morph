import { useState } from 'react'
import { Zap, Wallet } from 'lucide-react';
// If you are using Material UI, use:
import Button from '@mui/material/Button';

// Or if you have a local Button component, use:
// import { Button } from '../../ui/Button';

const Header = () => {

  const [connected, setConnected] = useState(false);

  const handleConnectWallet = () => {
    setConnected(true);
  };
    
  return (
    
    
        <nav className='sticky 0, top-0 z-20 bg-slate-950 backdrop-blur border-b border-slate-800'>
          <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Zap className="h-6 w-6 text-indigo-400" />
              <span className='text-white text-xl font-bold'>UniName</span>
            </div>
            <div className="hidden md:flex gap-8 text-slate-300 text-sm font-medium">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#docs" className="hover:text-white transition">Docs</a>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
           <Button
            onClick={handleConnectWallet}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm"
          >
            <Wallet className="mr-2 h-4 w-4" /> {connected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
          </div>
            
      </nav>
  

      
    
  )
}

export default Header
