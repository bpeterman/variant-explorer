import { CssBaseline } from '@mui/material'
import VariantList from './pages/variant-list/VariantList'
import './App.css'

export default function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <VariantList />
      </div>
    </>
  )
}
