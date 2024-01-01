import React from 'react'
import  { Outlet, NavLink } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';

import FoodBankIcon from '@mui/icons-material/FoodBank';
import SettingsIcon from '@mui/icons-material/Settings';
import CookieIcon from '@mui/icons-material/Cookie';
function SideNavbar({user}) {
  
  return (
    <div className='flex custom-container'>
      <div className='bg-blue-900 custom-border'>
        <h2 className='font-bold text-2xl text-white py-8 px-4'>RECIPE BUILDER</h2>
        <nav className='nav-bar'>
          <NavLink to="/"><LoginIcon/>Login</NavLink>
          <NavLink to='/recipe'><FoodBankIcon/>Recipe</NavLink>
          <NavLink to="/ingredients"><CookieIcon/>Ingredients</NavLink>
          <NavLink to="/settings"><SettingsIcon/>Settings</NavLink>
        </nav>
      </div>
      <div className='w-full'> 
        <Outlet/>
      </div>
    </div>
  )
}

export default SideNavbar