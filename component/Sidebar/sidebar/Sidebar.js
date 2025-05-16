"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './Sidebar.module.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
// import IncidentIcon from '../../../public/icons/incident.png';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      title: 'Work Permit Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      title: 'FIR Dashboard',
      icon: <LocalFireDepartmentIcon />,
      path: '/fir-dashboard',
    },
    {
      title: 'Safety Audit Dashboard',
      icon: <HealthAndSafetyIcon />,
      path: '/safety-dashboard',
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${Styles.sidebar} ${isCollapsed ? Styles.collapsed : ''}`}>
      <div className={Styles.toggleButton}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </div>

      <div className={Styles.menuItems}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={Styles.menuItem}
            onClick={() => router.push(item.path)}
          >
            <div className={Styles.icon}>{item.icon}</div>
            {!isCollapsed && <span className={Styles.title}>{item.title}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;



//i want to make the FIR dashboard button in the sidebar working , add the functionality to the button so that when clicked, it redirects to the FIR dashboard page.Which contains the same interface as the work permit dashboard page the request button becomes Report button . make a separate frontend for the FIR dashboard page and add the functionality to the button so that when clicked, it redirects to the FIR dashboard page. The FIR dashboard page should contain the same interface as the work permit dashboard page, but the request button should become a Report button.