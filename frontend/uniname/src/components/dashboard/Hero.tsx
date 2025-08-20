import {motion} from 'framer-motion'
import { useState } from 'react';
import {List, Coins} from 'lucide-react'

const Hero = () => {

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

 


  return (
    <div className='text-white bg-slate-950'>
      <section className="flex-1 py-16 px-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Welcome, {username}
        </motion.h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {wallets.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg hover:shadow-indigo-500/10 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{w.chain}</h3>
                <Coins className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-slate-400 text-sm mb-2 font-mono">{w.address}</p>
              <p className="text-2xl font-bold text-white">{w.balance}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <List className="h-6 w-6 text-pink-400" /> Recent Transactions
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-md">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Chain</th>
                </tr>
              </thead>
              <tbody className="bg-slate-950 divide-y divide-slate-800">
                {transactions.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-slate-900/70 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{t.to}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{t.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{t.chain}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Hero
