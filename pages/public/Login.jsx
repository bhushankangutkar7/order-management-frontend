import React, { useState } from 'react';
import * as yup from 'yup';
import { login } from '../../app/actions/AuthActions.js';
import { useRouter } from 'next/navigation';

// 1. Define the validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Invalid email')
    .required('Email is required')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Email must include a valid domain extension (e.g. .com, .in)'
    ),
  password: yup
    .string()
    .trim()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  // remember: yup.boolean(),
});

const Login = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const formData = new FormData(e.target);

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      // remember: formData.get('remember') === 'on',
    };

    try {
      await loginSchema.validate(data, { abortEarly: false });
    
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(() => validationErrors);
        return;
      }
    }

    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      router.refresh();
      router.push("/menu");
      alert('Login Successful!');
      return;
    }

    alert('Login failed. Please check your credentials.');
    
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({...prev,[name]: ''}));
    try {
      await loginSchema.validateAt(name, { [name]: value });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(prev => ({...prev, [name]: err.message}));
        return;
      }
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
  
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  
    try {
      await loginSchema.validateAt(name, {
        [name]: value,
      });
  
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors((prev) => ({
          ...prev,
          [name]: err.message,
        }));
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-[450px] p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center mb-6 font-bold text-2xl">Login</h2>

        <form onSubmit={handleSubmit} noValidate> {/* noValidate disables browser default validation */}
          
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              className={`w-full p-2 rounded border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* 5. Display error message inline */}
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              className={`w-full p-2 rounded border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* Display error message inline */}
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me
          // <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          //   <input type="checkbox" name="remember" id="remember" />
          //   <label htmlFor="remember" style={{ marginLeft: 8 }}>
          //     Remember me
          //   </label>
          // </div> */}

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 text-white rounded-lg bg-blue-500 hover:bg-blue-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;