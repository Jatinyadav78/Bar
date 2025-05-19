// import React from 'react';
// import Nav from './navbar/navbar.js'
// import Styles from './layout.module.css'

// const Layout = ({children, formName}) => {
//   return (
//     <div className={Styles.layoutContainer}>
//         <header className={Styles.navbar}>
//             <Nav formName={formName}/>
//         </header>
//         <main className={Styles.main}>{children}</main>
//         <footer className={Styles.footer}>

//         </footer>
//     </div>    
//   )
// }

// export default Layout


"use client";
import React, { useState, useEffect } from 'react';
import Nav from './navbar/navbar.js'
import Sidebar from '../Sidebar/sidebar/Sidebar.js';
import Styles from './layout.module.css'
const Layout = ({children, formName}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={Styles.layoutContainer}>
      <Sidebar onToggle={(expanded) => setIsSidebarExpanded(expanded)} />
      <div className={`${Styles.mainContent} ${isSidebarExpanded ? Styles.expanded : ''}`}>
        <header className={Styles.navbar}>
          <Nav formName={formName}/>
        </header>
        <main className={Styles.main}>{children}</main>
        <footer className={Styles.footer}>
        </footer>
      </div>
    </div>    
  )
}

export default Layout;

//