import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../api/api'
import useStore from '../store/useStore'

const PHASES = ['Upload', 'Configure', 'Processing', 'Results']

export default function UploadScreen() {
    const navigate = useNavigate()
    const { config, setConfig, setJobId, reset } = useStore()
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const inputRef = useRef()

    const handleFile = (f) => {
        if (!f || !f.type.startsWith('image/')) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
        setError(null)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleSubmit = async () => {
        if (!file) { setError('Please select an image first.'); return }
        setLoading(true)
        reset()
        try {
            const { data } = await uploadImage(file, config)
            setJobId(data.job_id)
            navigate('/processing')
        } catch (err) {
            setError('Upload failed. Is the backend running?')
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <StepBar current={0} steps={PHASES} />
            <div className="p-8 space-y-6">

                <div
                    onClick={() => inputRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
            ${dragging ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'}`}
                >
                    <input ref={inputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])} />
                    {preview ? (
                        <img src={preview} alt="preview"
                            className="mx-auto max-h-48 rounded-lg object-contain" />
                    ) : (
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-violet-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 9l-4-4-4 4M12 5v11" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700">Drop your photo here</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 20 MB</p>
                        </div>
                    )}
                </div>

                {file && (
                    <p className="text-xs text-center text-gray-400">
                        {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Edit permissions</p>
                        {[
                            ['allowBackground', 'Background change'],
                            ['allowColorGrade', 'Color grading'],
                            ['allowFaceSwap', 'Face swap'],
                        ].map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{label}</span>
                                <button
                                    onClick={() => setConfig({ [key]: !config[key] })}
                                    className={`w-9 h-5 rounded-full transition-colors relative
                    ${config[key] ? 'bg-violet-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                    ${config[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Protection strength</p>
                        <p className="text-xs text-gray-400">Balance security vs image quality</p>
                        <input
                            type="range" min="0.3" max="1.0" step="0.01"
                            value={config.strength}
                            onChange={(e) => setConfig({ strength: parseFloat(e.target.value) })}
                            className="w-full accent-violet-600"
                        />
                        <p className="text-xs text-violet-600 text-center font-medium">
                            DRS target: {config.strength.toFixed(2)}
                        </p>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-medium
            hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Uploading…' : 'Protect image →'}
                </button>
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