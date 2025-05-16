// "use client";
// import React, { useState } from "react";
// import Styles from "./navbar.module.css";
// import Button from '@mui/material/Button';
// import ClockCounter from "./clockCounter";
// import Cookies from "js-cookie";
// import { useRouter, usePathname } from "next/navigation";
// import { removeItemLocalStorage } from "../../../helperFunction/localStorage";
// // Import MUI components
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import Avatar from '@mui/material/Avatar';

// const Nav = ({formName}) => {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   // Profile menu state
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   // Get user data from localStorage
//   const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) || {} : {};

//   const routesWithoutLogout = ['/home',`/status\/\\d+`];
//   const shouldShowLogout = !routesWithoutLogout.some((pattern) => new RegExp(pattern).test(pathname));

//   // Profile menu handlers
//   const handleProfileClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const logout = async () => {
//     handleClose();
//     Cookies.remove("loggedIn");
//     await removeItemLocalStorage(["user", "token"])
//     router.replace("/");
//   };

//   // Get first letter of user's name for avatar
//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : 'U';
//   };

//   return (
//     <nav className={Styles.navBody}>
//       <div className={Styles.formName} onClick={() => shouldShowLogout && router.push('/dashboard')}>
//         {formName? formName: process.env.NEXT_PUBLIC_COMPANY}
//       </div>
//       <div className={`${Styles.clock} d-flex justify-content-between `} style={{marginRight:'24px',marginBottom:'5px'}}>
//         <ClockCounter />
//         {/* Profile Icon and Menu */}
//         {shouldShowLogout && (
//           <div style={{ marginLeft: '-20px' }}>
//             {/* Custom styled profile icon */}
//             <IconButton
//               onClick={handleProfileClick}
//               size="large"
//               aria-controls={open ? 'profile-menu' : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? 'true' : undefined}
//               sx={{ 
//                 padding: 0,
//                 '&:hover': { backgroundColor: 'transparent' }
//               }}
//             >
//               <Avatar 
//                 sx={{ 
//                   bgcolor: '#F1F3F4',
//                   width: 40,
//                   height: 40,
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   background: 'linear-gradient(135deg, #00C6FB 0%, #005BEA 100%)',
//                   color: '#FFFFFF'
//                 }}
//               >
//                 {getInitial(user.name)}
//               </Avatar>
//             </IconButton>
//             {/* Profile dropdown menu */}
//             <Menu
//               id="profile-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               MenuListProps={{
//                 'aria-labelledby': 'profile-button',
//               }}
//               Paperprops={{
//                 sx: {
//                   mt: 1.5,
//                   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//                   borderRadius: '8px',
//                   minWidth: '200px'
//                 }
//               }}
//               transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//               anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//             >
//               {/* User Profile Information */}
//               <MenuItem onClick={handleClose} disabled sx={{ opacity: 1 }}>
//                 <div>
//                   <Typography 
//                     variant="subtitle1" 
//                     sx={{ 
//                       fontWeight: 600,
//                       color: '#1967D2',
//                       fontSize: '14px'
//                     }}
//                   >
//                     {user.name || 'User'}
//                   </Typography>
//                   <Typography 
//                     variant="body2" 
//                     sx={{ 
//                       color: '#5F6368',
//                       fontSize: '12px'
//                     }}
//                   >
//                     {user.email || 'No email available'}
//                   </Typography>
//                 </div>
//               </MenuItem>
//               <Divider sx={{ my: 1 }} />
//               {/* Logout Option */}
//               <MenuItem 
//                 onClick={logout}
//                 sx={{
//                   '&:hover': {
//                     backgroundColor: '#F8F9FA'
//                   }
//                 }}
//               >
//                 <Typography 
//                   sx={{ 
//                     color: '#D93025',
//                     fontSize: '14px',
//                     fontWeight: 500
//                   }}
//                 >
//                   Logout
//                 </Typography>
//               </MenuItem>
//             </Menu>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Nav;

// "use client";
// import React, { useState } from "react";
// import Styles from "./navbar.module.css";
// import Button from '@mui/material/Button';
// import ClockCounter from "./clockCounter";
// import Cookies from "js-cookie";
// import { useRouter, usePathname } from "next/navigation";
// import { removeItemLocalStorage } from "../../../helperFunction/localStorage";
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import Avatar from '@mui/material/Avatar';

// const Nav = ({formName}) => {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   // Profile menu state management
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   // Get user data from localStorage with fallback empty object
//   const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) || {} : {};

//   // Define routes that should not show logout option
//   const routesWithoutLogout = ['/home',`/status\/\\d+`];
//   const shouldShowLogout = !routesWithoutLogout.some((pattern) => new RegExp(pattern).test(pathname));

//   // Handle profile menu click
//   const handleProfileClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   // Handle menu close
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle logout action
//   const logout = async () => {
//     handleClose();
//     Cookies.remove("loggedIn");
//     await removeItemLocalStorage(["user", "token"])
//     router.replace("/");
//   };

//   // Get first letter of user's name for avatar
//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : 'U';
//   };

//   return (
//     <nav className={Styles.navBody}>
//       <div className={Styles.formName} onClick={() => shouldShowLogout && router.push('/dashboard')}>
//         {formName? formName: process.env.NEXT_PUBLIC_COMPANY}
//       </div>
//       <div className={`${Styles.clock} d-flex justify-content-between `} style={{marginRight:'24px',marginBottom:'5px'}}>
//         <ClockCounter />
//         {/* Profile Icon and Menu */}
//         {shouldShowLogout && (
//           <div style={{ marginLeft: '-20px' }}>
//             {/* Enhanced Avatar with gradient background */}
//             <IconButton
//               onClick={handleProfileClick}
//               size="small" 
//               sx={{
//                 padding: 0,
//                 '&:hover': { backgroundColor: 'transparent' },
//                 marginLeft: '10px' // Add spacing from clock
//               }}
//             >
//               <Avatar 
//                 sx={{
//                   width: 35,
//                   height: 35,
//                   fontSize: '16px',
//                   fontWeight: '500',
//                   background: 'linear-gradient(135deg, #0073FF 0%, #00C6FB 100%)', // Professional gradient
//                   color: '#FFFFFF',
//                   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Subtle shadow
//                 }}
//               >
//                 {getInitial(user.name)}
//               </Avatar>
//             </IconButton>

//             {/* Profile Dropdown Menu */}
//             <Menu
//               id="profile-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               MenuListProps={{
//                 'aria-labelledby': 'profile-button',
//               }}
//               PaperProps={{
//                 sx: {
//                   mt: 1.5,
//                   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//                   borderRadius: '8px',
//                   minWidth: '200px'
//                 }
//               }}
//               transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//               anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//             >
//               {/* User Profile Information */}
//               <MenuItem onClick={handleClose} disabled sx={{ opacity: 1 }}>
//                 <div>
//                   <Typography 
//                     variant="subtitle1" 
//                     sx={{ 
//                       fontWeight: 600,
//                       color: '#0073FF',
//                       fontSize: '14px'
//                     }}
//                   >
//                     {user.name || 'User'}
//                   </Typography>
//                   <Typography 
//                     variant="body2" 
//                     sx={{ 
//                       color: '#5F6368',
//                       fontSize: '12px'
//                     }}
//                   >
//                     {user.email || 'No email available'}
//                   </Typography>
//                 </div>
//               </MenuItem>
//               <Divider sx={{ my: 1 }} />
//               {/* Logout Option */}
//               <MenuItem 
//                 onClick={logout}
//                 sx={{
//                   '&:hover': {
//                     backgroundColor: '#F8F9FA'
//                   }
//                 }}
//               >
//                 <Typography 
//                   sx={{ 
//                     color: '#D93025',
//                     fontSize: '14px',
//                     fontWeight: 500
//                   }}
//                 >
//                   Logout
//                 </Typography>
//               </MenuItem>
//             </Menu>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Nav;




"use client";
import React, { useEffect, useState } from "react";
import Styles from "./navbar.module.css";
import Button from '@mui/material/Button';
import ClockCounter from "./clockCounter";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { getLocalStorage, removeItemLocalStorage } from "../../../helperFunction/localStorage";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';

const Nav = ({ formName }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Profile menu state management
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const open = Boolean(anchorEl);

  // Define routes that should not show logout option
  const routesWithoutLogout = ['/home', `/status\/\\d+`];
  const shouldShowLogout = !routesWithoutLogout.some((pattern) => new RegExp(pattern).test(pathname));

  // Handle profile menu click
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout action
  const logout = async () => {
    handleClose();
    Cookies.remove("loggedIn");
    await removeItemLocalStorage(["user", "token"])
    router.replace("/");
  };

  // Get first letter of user's name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const user = getLocalStorage('user');
    setUser(user);
  }, [])

  return (
    <nav className={Styles.navBody}>
      <div className={Styles.formName} onClick={() => shouldShowLogout && router.push('/dashboard')}>
        {formName ? formName : process.env.NEXT_PUBLIC_COMPANY}
      </div>
      <div className={`${Styles.clock} d-flex justify-content-between `} style={{ marginRight: '24px', marginBottom: '5px' }}>
        <ClockCounter />
        {/* Profile Icon and Menu */}
        {shouldShowLogout && (
          <div style={{ marginLeft: '-20px' }}>
            {/* Enhanced Avatar with gradient background */}
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{
                padding: 0,    
                '&:hover': { backgroundColor: 'transparent' },
                marginLeft: '10px' // Add spacing from clock
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  fontSize: '16px',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #0073FF 0%, #00C6FB 100%)', // Professional gradient
                  color: '#FFFFFF',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Subtle shadow
                }}
              >
                {getInitial(user?.name)}
              </Avatar>
            </IconButton>
                         
            {/* Profile Dropdown Menu */}
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  minWidth: '200px'
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* User Profile Information */}
              <MenuItem onClick={handleClose} disabled sx={{ opacity: 1 }}>
                <div>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#0073FF',
                      fontSize: '14px'
                    }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#5F6368',
                      fontSize: '12px'
                    }}
                  >
                    {user?.email || 'No email available'}
                  </Typography>
                </div>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              {/* Logout Option */}
              <MenuItem
                onClick={logout}
                sx={{
                  '&:hover': {
                    backgroundColor: '#F8F9FA'
                  }
                }}
              >
                <Typography
                  sx={{
                    color: '#D93025',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
