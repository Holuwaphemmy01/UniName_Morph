import { Zap } from "lucide-react"
import { LinkIcon, Check } from "lucide-react"
const FeatureSection = () => {
  return (
    <div>
      <section id="features" className="py-24 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
        <div>
          <Zap className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
          <h3 className="text-2xl font-semibold mb-2">One Username</h3>
          <p className="text-slate-400">Your single identity across Web3, ending copy-paste stress.</p>
        </div>
        <div>
          <LinkIcon className="mx-auto mb-4 h-12 w-12 text-purple-400" />
          <h3 className="text-2xl font-semibold mb-2">Multi-Chain Linking</h3>
          <p className="text-slate-400">Attach Ethereum, Solana, Sui and more – all under one Sonic name.</p>
        </div>
        <div>
          <Check className="mx-auto mb-4 h-12 w-12 text-pink-400" />
          <h3 className="text-2xl font-semibold mb-2">Frictionless UX</h3>
          <p className="text-slate-400">Send tokens to names instead of hex strings. Safer, faster, human.</p>
        </div>
      </section>
    </div>
  )
}

export default FeatureSection
