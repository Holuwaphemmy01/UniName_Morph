import { Zap, UserCircle, Wallet, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import Button from '@mui/material/Button';

const Header = () => {

    const [connected, setConnected] = useState(false);
  const [username] = useState("femi.sonic");
  const [wallets] = useState([
    { chain: "Ethereum", address: "0x1234...abcd", balance: "1.25 ETH" },
    { chain: "Solana", address: "So1aNaWal1etKey...", balance: "120 SOL" },
    { chain: "Sui", address: "SuiWal1etKey...", balance: "560 SUI" },
  ]);
  const [transactions] = useState([
    { id: 1, to: "david.sonic", amount: "25", chain: "Ethereum" },
    { id: 2, to: "mariam.sonic", amount: "10", chain: "Solana" },
    { id: 3, to: "john.sonic", amount: "50", chain: "Sui" },
  ]);

  const handleConnectWallet = () => {
    setConnected(true);
  };



  return (
    <div>
       <nav className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold">SonicX</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Section */}
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
