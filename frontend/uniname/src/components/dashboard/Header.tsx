import { Zap, UserCircle, Wallet, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import Button from '@mui/material/Button';

const Header = () => {

    const [connected, setConnected] = useState(false);
    const [username] = useState("femi.sonic");

  const handleConnectWallet = () => {
    setConnected(true);
  };



  return (
    <div className="">
       <nav className="sticky top-0 z-20 bg-slate-950 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">Uniname</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <UserCircle className="h-8 w-8 text-indigo-400" />
              <span className="hidden md:inline text-sm font-medium">{username}</span>
            </div>

            <Button
              onClick={handleConnectWallet}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm"
            >
              <Wallet className="mr-2 h-4 w-4" /> {connected ? "Wallet Connected" : "Connect Wallet"}
            </Button>

            <Button   className="text-slate-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
            <Button   className="text-slate-400 hover:text-red-400">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
