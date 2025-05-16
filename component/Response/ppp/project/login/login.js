"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import { setLocalStorage } from "../../helperFunction/localStorage";
import { toast } from "react-toastify";
import { getTimeOfDay } from "../../helperFunction/dateTimeFormat";

const Login = ({ router, returnUrl }) => {
  // form validation rulesz
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ username, password }) {
    const reqBody = { email: username, password: password };
    return axios
      .post(`v1/auth/login`, reqBody)
      .then((result) => {
        setLocalStorage("user", result?.data?.user);
        setLocalStorage("token", result?.data?.tokens);
        Cookies.set("loggedIn", true);
        // get return url from query parameters
        const returnToUrl = returnUrl ? returnUrl : "/dashboard";
        // Determine the time of the day     
        router.replace(returnToUrl);
        const currentTime =  getTimeOfDay(new Date())
        toast(`${currentTime}, ${result?.data?.user?.name} !`, { delay: 500 });
      })
      .catch((error) => {
        setError("apiError", {
          message: error?.response?.data?.message || error.message,
        });
      });
  }

  return (
    <div className="container-fluid logimg">
      <div className="row">
        <div
          className="col-md-6"
          style={{ height: "100vh", background: "#2997FD" }}
        >
          {/* Place the image here */}
          <h3>Work Permit</h3>
          <img
            src="login.svg"
            alt="Logo"
            className="img-fluid"
            style={{ height: "80%", width: "100%" }}
          />
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-8 m-auto">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-primary">Log In</h2>
                <div className="mb-3">
                  <input
                    type="text"
                    // className="form-control"
                    placeholder="Username"
                    // value={username}
                    {...register("username")}
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    // onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    // className="form-control"
                    placeholder="Password"
                    // value={password}
                    {...register("password")}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    // onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                  {/* Add an icon for toggling password visibility */}
                  <i className="bi bi-eye-slash"></i>
                </div>
                <div className="text-end text-decoration-underline">
                  {/* forget password feature is not availabel */}
                  {/* <p>Forgot password?</p> */} 
                </div>
                <button
                  disabled={formState.isSubmitting}
                  className="btn btn-outline-primary form-control bg-primary text-light"
                  type="submit"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Login
                </button>
                {errors.apiError && (
                  <div className="alert alert-danger mt-3 mb-0">
                    {errors.apiError?.message}
                  </div>
                )}
                {/* Display error message */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
