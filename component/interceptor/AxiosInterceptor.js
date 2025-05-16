'use client'
import axios from 'axios';
import React, { useState } from 'react'
import styles from './axiosInterceptor.module.css'
import { Button } from '@mui/material';
import Cookies from "js-cookie";
import { getLocalStorage, removeItemLocalStorage } from '../../helperFunction/localStorage.js';
import {api} from '../../utils.js'
import { useRouter } from 'next/navigation';

const AxiosInterceptor = ({ children }) => {
    const router = useRouter();

    const [error, setError] = useState(false);
    axios.defaults.baseURL = api;
    axios.defaults.timeout = 10000;

    axios.interceptors.request.use(
        (config) => {
            // Add headers or perform other modifications
            const token = getLocalStorage('token')

            if (token) {
                config.headers.Authorization = `Bearer ${token.access.token}`;
            }
            // console.log('Request Interceptor:', config);
            return config;
        },
        (error) => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axios.interceptors.response.use(
        (response) => {
            // console.log('Response Interceptor:', response);
            return response;
        },
        (error) => {
            console.error('Response Error:', error);
            // Handle specific error codes
            const user = getLocalStorage('user');

            if (error.response?.status === 401 && user) {
                setError(true)
                console.error('Unauthorized: Redirecting to login...');
            }

            return Promise.reject(error);
        }
    );

    const handleLogout = async () => {
        setError(false);
        Cookies.remove("loggedIn");
        await removeItemLocalStorage(["user", "token"])
        router.replace("/");
      };


    if (!error) {
        return children;
    } else {
        return (
            <div className={styles.accessDenied}>
                <h1>
                    <code>Access Denied</code>
                </h1>
                <hr />
                <h3>Your session expired. Please Login again</h3>
                <h3>🚫🚫🚫🚫</h3>
                <h6>error code:401 unauthorized</h6>
                <Button variant='contained' onClick={handleLogout} >Log Out</Button>
            </div>
        );
    }
}

export default AxiosInterceptor