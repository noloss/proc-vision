import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DEFAULT_SELECTED } from './data'
import CategorySelect from './views/CategorySelect'
import Upload from './views/Upload'
import Review from './views/Review'
import Status from './views/Status'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState(DEFAULT_SELECTED)
  const [uploadedCategories, setUploadedCategories] = useState([])

  return (
    <AppContext.Provider value={{
      selectedCategories,
      setSelectedCategories,
      uploadedCategories,
      setUploadedCategories,
    }}>
      <BrowserRouter basename="/proc-vision">
        <Routes>
          <Route path="/" element={<CategorySelect />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/review" element={<Review />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}
