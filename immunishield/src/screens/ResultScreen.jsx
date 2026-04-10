import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const PHASES = ['Upload', 'Configure', 'Processing', 'Results']

const ATTACK_COLORS = (pct) =>
    pct >= 75 ? 'bg-green-400' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'

export default function ResultsScreen() {
    const navigate = useNavigate()
    const { result, reset } = useStore()

    useEffect(() => {
        if (!result) navigate('/')
    }, [result])

    if (!result) return null

    const { drs, psnr, attacks_blocked, total_attacks,
        processing_time, attack_results, protected_url } = result

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <StepBar current={3} steps={PHASES} />
            <div className="p-8 space-y-6">

                <div className="flex items-center gap-5 bg-gray-50 rounded-xl p-5">
                    <div className="w-20 h-20 rounded-full border-4 border-violet-500 bg-violet-50
            flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-medium text-violet-700 leading-none">
                            {drs.toFixed(2)}
                        </span>
                        <span className="text-xs text-violet-500">DRS</span>
                    </div>
                    <div>
                        <h2 className="text-base font-medium text-gray-800">
                            {drs >= 0.75 ? 'Strong protection achieved' :
                                drs >= 0.5 ? 'Moderate protection achieved' : 'Weak protection — retry with higher strength'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Your image resists {Math.round(drs * 100)}% of known deepfake generation methods.
                        </p>
                        <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full
              ${drs >= 0.75 ? 'bg-green-100 text-green-700' :
                                drs >= 0.5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {drs >= 0.75 ? 'Above target threshold' :
                                drs >= 0.5 ? 'Near target threshold' : 'Below target threshold'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        ['Visual fidelity (PSNR)', `${psnr.toFixed(1)} dB`, 'Near-imperceptible noise'],
                        ['Attacks blocked', `${attacks_blocked} / ${total_attacks}`, 'Red team simulation'],
                        ['Processing time', `${processing_time}s`, 'Total pipeline duration'],
                    ].map(([label, val, sub]) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-1">{label}</p>
                            <p className="text-xl font-medium text-gray-800">{val}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>

                {attack_results?.length > 0 && (
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Red team results
                        </div>
                        {attack_results.map(({ name, resistance }) => (
                            <div key={name} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                                <span className="text-sm text-gray-700 flex-1">{name}</span>
                                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${ATTACK_COLORS(resistance)}`}
                                        style={{ width: `${resistance}%` }} />
                                </div>
                                <span className={`text-xs font-medium w-8 text-right
                  ${resistance >= 75 ? 'text-green-600' :
                                        resistance >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                    {resistance}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 pt-1">
                    <button
                        onClick={() => { reset(); navigate('/') }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600
              hover:bg-gray-50 transition-colors"
                    >
                        Protect another
                    </button>
                    {protected_url && (
                        <a href={protected_url} download
                            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium
                text-center hover:bg-violet-700 transition-colors">
                            Download protected image
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

function StepBar({ current, steps }) {
    return (
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <span className="ml-1">ImmuniShield</span>
            </div>
            <div className="flex items-center gap-1">
                {steps.map((s, i) => (
                    <span key={s} className="flex items-center gap-1">
                        <span className={`text-xs px-2.5 py-1 rounded-full
              ${i === current ? 'bg-violet-100 text-violet-700 font-medium' :
                                i < current ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                            {i < current ? `${s} ✓` : s}
                        </span>
                        {i < steps.length - 1 && <span className="text-gray-300 text-xs">›</span>}
                    </span>
                ))}
            </div>
        </div>
    )
}