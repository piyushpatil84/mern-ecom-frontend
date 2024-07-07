import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../component/input';
import { checkUserAsync, selectError, selectLoggedInUser } from '../authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const error = useSelector(selectError)
  const user = useSelector(selectLoggedInUser)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is Required'),
      password: Yup.string().required('Password is Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const resultAction = await dispatch(checkUserAsync(values));
        const user = unwrapResult(resultAction);
        if (user) {
          resetForm();
          navigate('/');
        }
      } catch (err) {
        toast.error('Failed to login');
      }
    },
  });

  return (
    <>
      {user && <Navigate to='/' replace={true}></Navigate>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" noValidate onSubmit={formik.handleSubmit}>
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

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an Account
            </Link>
          </p>
        </div>
      </div >
    </>
  );
}
