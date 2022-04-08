import React from "react";

import {Button, Group,Slider } from '@mantine/core';
const Modal = ({isAuthenticated,createCollection , setOpened1}) => {
  const marks = [
    { value: 20, label: '20%' },
    { value: 50, label: '50%' },
    { value: 80, label: '80%' },
  ];
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form className="space-y-6" action="#">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Sign in to our platform
        </h3>
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        <div className="flex items-start">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              />
            </div>
            <div className="text-sm ml-3">
              <label className="font-medium text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
          </div>
          <a
            href="#"
            className="text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500"
          >
            Lost Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={
            (e)=>{
              e.preventDefault();
              createCollection();
              setOpened1(false);
            }
          }
        >
          CREATE BAND
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered?{" "}
          <a
            href="#"
            className="text-blue-700 hover:underline dark:text-blue-500"
          >
            Create account
          </a>
        </div>
        <Slider
      defaultValue={40}
      marks={marks}
      labelTransition="fade"
      size={2}
      styles={(theme) => ({
        track: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.blue[1],
        },
        mark: {
          width: 6,
          height: 6,
          borderRadius: 6,
          transform: 'translateX(-3px) translateY(-2px)',
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.blue[1],
        },
        markFilled: {
          borderColor: theme.colors.blue[6],
        },
        markLabel: { fontSize: theme.fontSizes.xs, marginBottom: 5, marginTop: 0 },
        thumb: {
          height: 16,
          width: 16,
          backgroundColor: theme.white,
          borderWidth: 1,
          boxShadow: theme.shadows.sm,
        },
      })}
    />
      </form>
    </div>
  );
};

export default Modal;
