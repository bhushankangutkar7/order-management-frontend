// page/public/Signup.jsx
import React, { useState } from 'react';
import * as yup from 'yup';
import { register } from '../../app/actions/AuthActions.js';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";


const signupSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required('First name is required') // Keep Duplicate for UX
    .min(3, 'First name must be at least 3 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .trim()
    .required('Last name is required') // Keep Duplicate for UX
    .min(3, 'Last name must be at least 3 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .trim()
    .required('Email is required') // Keep Duplicate for UX
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Email must include a valid domain extension (e.g. .com, .in)'
    )
    .required('Email is required'),
  password: yup
    .string()
    .trim()
    .required('Password is required') // Keep Duplicate for UX
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .trim()
    .required('Confirm password is required') // Keep Duplicate for UX
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    try {
      await signupSchema.validate(data, { abortEarly: false });
      
    } catch (errs) {
      if (errs instanceof yup.ValidationError) {
        const validationErrors = {};
        errs.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
    }
    
    const result = await register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (result.success) {
      router.refresh();
      router.push("/menu");
    }
    
  };

  const handleChange = async(e) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: ''}));

    try {
      await signupSchema.validateAt(name, { [name]: value });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({...prev, [name]: error.message}));
        return;
      }
    }
  };

  const handleBlur = async(e) => {
    const { name, value } = e.target;

    setTouched(prev => ({...prev, [name]: true}));

    try {
      await signupSchema.validateAt(name, { [name]: value });
    } catch (error) {
      if ( error instanceof yup.ValidationError) {
        setErrors(prev => ({...prev, [name]: error.message}));
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfPasswordVisibility = () => {
    setShowConfPassword((prev) => !prev);
  };

  return (
    <div
      className="flex items-center justify-center min-w-[300px] mt-10"
    >
      <div
        className="w-[450px] p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-center mb-6 font-bold text-2xl">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="Enter first name"
              className={`w-full p-2 rounded border ${errors.firstName ? `border-red-500`: `border-gray-300`}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {(touched.firstName || errors.firstName) && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Enter last name"
              className={`w-full p-2 rounded border ${errors.lastName ? `border-red-500`: `border-gray-300`}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {(touched.lastName || errors.lastName) && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              className={`w-full p-2 rounded border ${errors.email ? `border-red-500`: `border-gray-300`}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {(touched.email || errors.email) && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? `text` : `password`}
                placeholder="Enter password"
                className={`w-full p-2 rounded border ${errors.password ? `border-red-500`: `border-gray-300`}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 items-center pr-3 text-gray-400 hover:text-gray-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {(touched.password || errors.password) && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfPassword ? "text":"password"}
                placeholder="Confirm password"
                className={`w-full p-2 rounded border ${errors.confirmPassword ? `border-red-500`: 'border-gray-300'}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={toggleConfPasswordVisibility}
                className="absolute inset-y-0 right-0 items-center pr-3 text-gray-400 hover:text-gray-900"
                aria-label={showConfPassword ? "Hide password" : "Show password"}
              >
                {showConfPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {(touched.confirmPassword || errors.confirmPassword) && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 text-white rounded-lg bg-blue-500 hover:bg-blue-800 transition-colors"
          >
            Sign Up
          </button>
          <div className="mt-2 ms-1">
            <p>Already have an Account? <Link href="login" className="text-blue-700">Click Here</Link></p>
          </div>          
        </form>
      </div>
    </div>
  );
};

export default Signup;