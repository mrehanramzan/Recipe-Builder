import React,{useEffect, useState } from 'react'
import "./App.css"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SideNavbar from './components/SideNavbar'
import Recipe from './pages/Recipe'
import Ingredients from './pages/Ingredients'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Protected from './components/Protected'
import Setting from './pages/Setting'
import Page404 from './pages/Page404'

function App() {
  const [user, setUser] = useState({});
  return (
      <BrowserRouter>
        <Routes>
            <Route  path='/' element={< SideNavbar user={user}/>}>
              <Route index element={< SignIn />}/>
              <Route path="recipe" element={ <Protected Component={Recipe} setUser={setUser}/> }/>  
              <Route path='ingredients' element={ <Protected Component={Ingredients}/> } />
              <Route path='settings' element={ <Protected Component={Setting} /> }/>
              <Route path="signup" element={ <SignUp/> }/>
              <Route path='*' element={ <Page404/> }/>
            </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App