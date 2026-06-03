import React, { useState } from 'react';
import * as yup from 'yup';

const signupSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .trim()
    .email('Invalid email')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Email must include a valid domain extension (e.g. .com, .in)'
    )
    .required('Email is required'),
  password: yup
    .string()
    .trim()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  // remember: yup.boolean(),
});

const Signup = () => {
  const [errors, setErrors] = useState({});

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
      // remember: formData.get('remember') === 'on',
    };

    try {
      await signupSchema.validate(data, { abortEarly: false });

      if (Object.keys(errors).length === 0) {
        alert('Singup Data Validated!');
      }

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
    }

    if (Object.keys(errors).length === 0) {
      alert('Signup Form submitted successfully!');
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

  return (
    <div
      className="flex items-center justify-center min-h-[70vh]"
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
              className="w-100 p-2 rounded border border-gray-300"
              onChange={handleChange}
            />
            {errors.firstName && (
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
              className="w-100 p-2 rounded border border-gray-300"
              onChange={handleChange}
            />
            {errors.lastName && (
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
              className="w-100 p-2 rounded border border-gray-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              className="w-100 p-2 rounded border border-gray-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="w-100 p-2 rounded border border-gray-300"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Remember Me */}
          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <input type="checkbox" name="remember" id="remember" />
            <label htmlFor="remember" style={{ marginLeft: 8 }}>
              Remember me
            </label>
          </div> */}

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 text-white rounded-lg bg-blue-500 hover:bg-blue-800 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;