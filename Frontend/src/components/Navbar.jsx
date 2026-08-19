import React from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className='navbar'>
            <div className='navbar__brand'>SkillSync</div>
            <div className='navbar__right'>
                {user && <span className='navbar__user'>{user.username}</span>}
                <button className='button primary-button navbar__logout' onClick={onLogout}>
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Navbar
