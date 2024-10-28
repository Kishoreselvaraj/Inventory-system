import React from 'react'
import './Navbar.scss';
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <div className='navbar'>
        <div className="sidebar">
            <nav>
                <ul>
                    <li><Link to={''}>Overview</Link></li>
                    <li><Link to={''}>Add product</Link></li>
                    <li><Link to={''}>Users</Link></li>
                </ul>
            </nav>
        </div>
    </div>
  )
}

export default Navbar