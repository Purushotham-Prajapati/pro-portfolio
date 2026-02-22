import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import ResearchPage from './pages/ResearchPage'
import AwardsPage from './pages/AwardsPage'
import TeachingPage from './pages/TeachingPage'
import ContactPage from './pages/ContactPage'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/journey" element={<JourneyPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/awards" element={<AwardsPage />} />
                <Route path="/teaching" element={<TeachingPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </BrowserRouter>
    )
}
