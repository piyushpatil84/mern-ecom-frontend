import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import InputField from '../../../component/input';
import { createUserAsync } from '../authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is Required'),
      password: Yup.string().required('Password is Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const finalVal = {
        ...values,
        addresses:[]
      } 
      try {
        const resultAction = await dispatch(createUserAsync(finalVal));
        const user = unwrapResult(resultAction);
        toast.success(`User ${user.email} created successfully!`);
        resetForm();
        navigate('/');
      } catch (err) {
        toast.error('Failed to create user');
      }
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a New Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form noValidate className="space-y-6" onSubmit={formik.handleSubmit}>
            <InputField
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              required={true}
            />
            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
              required={true}
            />
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              required={true}
            />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a Member?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
