import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useJobPolling from '../hooks/useJobPolling'
import useStore from '../store/useStore'

const PHASES = ['Upload', 'Configure', 'Processing', 'Results']

const PIPELINE = [
    { label: 'Face detection & masking', detail: 'Identity regions isolated via MediaPipe' },
    { label: 'Golden timestep analysis', detail: 'Optimal diffusion vulnerability window found' },
    { label: 'Adversarial noise synthesis', detail: 'Latent space optimization via PGD' },
    { label: 'EOT robustness hardening', detail: 'Compression & resize stress-testing' },
    { label: 'Adaptive semantic calibration', detail: 'Edit-permission weights applied via CLIP' },
    { label: 'Red team validation', detail: 'ControlNet and FaceSwap bypass attempts' },
    { label: 'DRS scoring & report', detail: 'Final resistance score computed' },
]

export default function ProcessingScreen() {
    const navigate = useNavigate()
    const { jobId, phase, phaseLabel, progress } = useStore()

    useJobPolling(() => navigate('/results'))

    useEffect(() => {
        if (!jobId) navigate('/')
    }, [jobId])

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <StepBar current={2} steps={PHASES} />
            <div className="p-8 space-y-4">
                <p className="text-sm text-gray-500">Running 7-phase immunization framework…</p>

                <div className="space-y-2">
                    {PIPELINE.map((p, i) => {
                        const done = i < phase
                        const active = i === phase
                        return (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors
                ${done ? 'border-green-200 bg-green-50' :
                                    active ? 'border-violet-200 bg-violet-50' :
                                        'border-gray-100 bg-white'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                  ${done ? 'bg-green-200 text-green-800' :
                                        active ? 'bg-violet-200 text-violet-800' :
                                            'bg-gray-100 text-gray-400'}`}>
                                    {done ? '✓' : i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium
                    ${done ? 'text-green-800' : active ? 'text-violet-800' : 'text-gray-400'}`}>
                                        {p.label}
                                    </p>
                                    <p className={`text-xs truncate
                    ${done ? 'text-green-600' : active ? 'text-violet-500' : 'text-gray-300'}`}>
                                        {active && phaseLabel ? phaseLabel : p.detail}
                                    </p>
                                </div>
                                {active && (
                                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse flex-shrink-0" />
                                )}
                                {done && (
                                    <span className="text-xs text-green-600 flex-shrink-0">Done</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="space-y-1.5 pt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Phase {phase + 1} of {PIPELINE.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
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