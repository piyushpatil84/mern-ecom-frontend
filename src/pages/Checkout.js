import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../features/cart/cartSlice';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import InputField from '../component/input';
import { selectLoggedInUser, updateUserAsync } from '../features/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { addOrderAsync, selectCurrentOrder } from '../features/order/orderSlice';

function Checkout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMode, setPaymentMode] = useState("cash")
  const currentOrder = useSelector(selectCurrentOrder)

  const items = useSelector(selectItems);
  const totalAmount = items.reduce((amount, item) => item.price * item.quantity + amount, 0)
  const totalItems = items.reduce((count, item) => item.quantity + count, 0)

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ ...item, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id))
  }

  const handleAddress = (e) => {
    const index = e.target.value
    setSelectedAddress(user.addresses[index])
  }

  const handlePayment = (e) => {
    setPaymentMode(e.target.value)
  }

  const handleOrder = () => {
    const order = {
      items, totalAmount, totalItems, user, paymentMode, selectedAddress,
      status: 'pending'
    }
    dispatch(addOrderAsync(order))
  }

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      country: '',
      streetAddress: '',
      city: '',
      state: '',
      pinCode: '',
      phone: ''
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      country: Yup.string().required('Required'),
      streetAddress: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      pinCode: Yup.string().required('Required'),
      phone: Yup.string().required('Required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const userObj = {
        ...user,
        addresses: [...user?.addresses, values]
      }
      try {
        const resultAction = await dispatch(
          updateUserAsync(userObj)
        )
        const user = unwrapResult(resultAction);
        if (user) {
          toast.success(`Address updated successfully!`);
          resetForm();
        }
      } catch (err) {
        toast.error('Failed to update address');
      }
    },
  });

  return (
    <>
      {!items.length && <Navigate to='/' replace={true} />}
      {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true} />}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form className="bg-white px-5 py-12 mt-12" noValidate onSubmit={formik.handleSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <InputField
                        label="Full name"
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fullName && formik.errors.fullName}
                        required={true}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <InputField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                        required={true}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                        Country
                      </label>
                      <div className="mt-2">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          value={formik.values.country}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${formik.touched.country && formik.errors.country ? 'border-rose-500' : 'border-gray-200'}`}
                        >
                          <option value="">Select country</option>
                          <option value="Mexico">India</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                        </select>
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-red-500 text-xs italic">{formik.errors.country}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-full">
                      <InputField
                        label="Street Address"
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        value={formik.values['streetAddress']}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched['streetAddress'] && formik.errors['streetAddress']}
                        required={true}
                      />
                    </div>

                    <div className="sm:col-span-3 sm:col-start-1">
                      <InputField
                        label="City"
                        id="city"
                        name="city"
                        type="text"
                        value={formik.values['city']}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched['city'] && formik.errors['city']}
                        required={true}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <InputField
                        label="State"
                        id="state"
                        name="state"
                        type="text"
                        value={formik.values['state']}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched['state'] && formik.errors['state']}
                        required={true}
                      />
                    </div>

                    <div className="sm:col-span-3 sm:col-start-1">
                      <InputField
                        label=" ZIP / Postal code"
                        id="pinCode"
                        name="pinCode"
                        type="text"
                        value={formik.values['pinCode']}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched['pinCode'] && formik.errors['pinCode']}
                        required={true}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <InputField
                        label="Phone"
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formik.values['phone']}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched['phone'] && formik.errors['phone']}
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={formik.handleReset}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Address
                  </button>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Addresses
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Choose from Existing addresses
                  </p>
                  <ul role="list">
                    {user?.addresses && user?.addresses.map((address, index) => (
                      <li
                        key={index}
                        className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                      >
                        <div className="flex gap-x-4">
                          <input
                            value={index}
                            onChange={(e) => handleAddress(e)}
                            name="address"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {address.fullName}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.streetAddress}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900">
                            Phone: {address.phone}
                          </p>
                          <p className="text-sm leading-6 text-gray-500">
                            {address.city}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 space-y-10">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-gray-900">
                        Payment Methods
                      </legend>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Choose One
                      </p>
                      <div className="mt-6 space-y-6">
                        <div className="flex items-center gap-x-3">
                          <input
                            id="cash"
                            name="payments"
                            type="radio"
                            value="cash"
                            onChange={handlePayment}
                            checked={paymentMode === "cash"}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="cash"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Cash
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <input
                            id="card"
                            name="payments"
                            type="radio"
                            value="card"
                            onChange={handlePayment}
                            checked={paymentMode === "card"}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="card"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Card Payment
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="mx-auto mt-12 bg-white max-w-7xl px-2 sm:px-2 lg:px-2">
              <div className="border-t border-gray-200 px-4 py-6 sm:px-4">
                <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                  Cart
                </h1>
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {items?.map((item) => (
                      <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href={item.href}>{item.title}</a>
                              </h3>
                              <p className="ml-4">${item.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.brand}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="text-gray-500">
                              <label
                                htmlFor="quantity"
                                className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                              >
                                Qty
                              </label>
                              <select onChange={(e) => handleQuantity(e, item)} value={item.quantity}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                            </div>

                            <div className="flex">
                              <button
                                onClick={e => handleRemove(e, item.id)}
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t my-2 border-gray-200 px-4 py-6 sm:px-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>$ {totalAmount}</p>
                </div>
                <div className="flex my-2 justify-between text-base font-medium text-gray-900">
                  <p>Total Items in Cart</p>
                  <p>{totalItems} items</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <div
                    onClick={handleOrder}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                  >
                    Order Now
                  </div>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <Link to="/">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
