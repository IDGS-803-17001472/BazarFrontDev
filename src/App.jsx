import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import viteLogo from '/vite.svg'
import './App.css'
import   Home  from './components/Home';
import   ItemDetail  from './components/ItemDetail';
import   SalesList  from './components/SalesList';

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/item/:id" element={<ItemDetail />} />
    <Route path="/sales" element={<SalesList />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App
