// app/actions/AuthActions.js
'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function login({
  email,
  password
}) {
  try {
    const cookieStore = await cookies();

    const res = await axios.post(`${process.env.BACKEND_NODE_URL}/api/v1/auth/login`, {
      email,
      password
    })
    
    if(!res.data.success) {
      return {
        success: false,
        message: res.message,
      };
    }
    
    const token =res.data.token;

    cookieStore.set(
      'session_token',
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      }
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Internal server error',
    };
  }
}

export async function register(data) {
  const {  
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  } = data;
  
  try {
    const cookieStore = await cookies();

    if(password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    const res = await axios.post(
      `${process.env.BACKEND_NODE_URL}/api/v1/auth/register`,
      data
    );

    if(!res.success){
      return {
        success: false,
        message: res.messsage,
      };
    }

    cookieStore.set(
      'session_token',
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      }
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Internal server error',
    };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    return {
      success: true
    };
  } catch (error) {
    return error;
  }
}