import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("menu");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, handleLogout } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar-menu-mobile') && !event.target.closest('.hamburger')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when window width exceeds mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="QuickBite" className='logo'/></Link>
      
      <ul className='navbar-menu'>
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>Mobile App</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact Us</a>
      </ul>
      
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" className="search-icon" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /></Link> 
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        
        {!token ? (
          <button onClick={()=>setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="Profile" />
            <ul className='nav-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="Orders" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
            </ul>
          </div>
        )}
        
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className={mobileMenuOpen ? 'line line-1 active' : 'line line-1'}></span>
          <span className={mobileMenuOpen ? 'line line-2 active' : 'line line-2'}></span>
          <span className={mobileMenuOpen ? 'line line-3 active' : 'line line-3'}></span>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={mobileMenuOpen ? 'navbar-menu-mobile active' : 'navbar-menu-mobile'}>
        <Link to='/' onClick={()=>{setMenu("home"); setMobileMenuOpen(false)}} className={menu==="home"?"active":""}>Home</Link>
        <a href='#explore-menu' onClick={()=>{setMenu("menu"); setMobileMenuOpen(false)}} className={menu==="menu"?"active":""}>Menu</a>
        <a href='#app-download' onClick={()=>{setMenu("mobile-app"); setMobileMenuOpen(false)}} className={menu==="mobile-app"?"active":""}>Mobile App</a>
        <a href='#footer' onClick={()=>{setMenu("contact-us"); setMobileMenuOpen(false)}} className={menu==="contact-us"?"active":""}>Contact Us</a>
        <div className="mobile-auth">
          {!token ? (
            <button onClick={()=>{setShowLogin(true); setMobileMenuOpen(false)}}>Sign In</button>
          ) : (
            <>
              <div className="mobile-profile-item" onClick={()=>{navigate('/myorders'); setMobileMenuOpen(false)}}>
                <img src={assets.bag_icon} alt="Orders" /><p>My Orders</p>
              </div>
              <div className="mobile-profile-item" onClick={()=>{logout(); setMobileMenuOpen(false)}}>
                <img src={assets.logout_icon} alt="Logout" /><p>Logout</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
