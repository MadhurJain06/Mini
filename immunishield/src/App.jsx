import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UploadScreen from './screens/UploadScreen'
import ProcessingScreen from './screens/ProcessingScreen'
import ResultsScreen from './screens/ResultScreen'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Routes>
            <Route path="/" element={<UploadScreen />} />
            <Route path="/processing" element={<ProcessingScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}