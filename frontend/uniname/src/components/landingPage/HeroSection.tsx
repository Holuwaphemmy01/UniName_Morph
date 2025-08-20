import { useState } from 'react';
import {motion} from 'framer-motion';
import { Button } from '@mui/material';
import { Wallet } from 'lucide-react';


const HeroSection = () => {
      const [connected, setConnected] = useState(false);    
      const handleConnectWallet = () => {
        setConnected(true);
      };
    
  return (
    <div>
        <section className="relative text-center py-28 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold mb-6"
        >
          Uniname Web3 Identity Reinvented
        </motion.h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Register once, link wallets across chains, and transact with human-readable usernames – no more 0x addresses.
        </p>
        <Button
          onClick={handleConnectWallet}
          className="mt-8 px-8 py-3 bg-white text-indigo-700 hover:bg-gray-200 rounded-full text-lg shadow-lg"
        >
          <Wallet className="mr-2 h-5 w-5" /> {connected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
      </section>
      
    </div>
  )
}

export default HeroSection
