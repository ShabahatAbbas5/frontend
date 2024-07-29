import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SprinklerForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicationDate: new Date(),
    serviceAddress: "",
    cost: 250,
  });

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (applicationDate) => {
    setFormData((prevData) => ({
      ...prevData,
      applicationDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardElement = elements.getElement(CardElement);
      setSucceeded(true);
      setProcessing(true);

      Swal.fire({
        title: "Processing Payment",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const responses = await axios.post(
        process.env.REACT_APP_API_URL+"/api/sprinkler",
        {
          amount: Math.round(formData.cost * 100), // Convert to cents
          formData,
        }
      );
      const payload = await stripe.confirmCardPayment(
        responses.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
            },
          },
        }
      );

      if (payload.error) {
        Swal.fire({
          icon: "error",
          title: "Payment failed",
          text: payload.error.message,
        });
        setProcessing(false);
      } else {
        Swal.fire({
          icon: "success",
          title: "Payment succeeded",
          text: "Your payment was successful!",
        });
        // Reset form data and state
        setFormData({
          applicantName: "",
          applicantEmail: "",
          applicationDate: new Date(),
          serviceAddress: "",
          cost: 250,
        });
        setError(null);
        setProcessing(false);
        setSucceeded(false);
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
    if (!stripe || !elements) {
      return;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sprinkler Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="applicantName" className="form-label">
              Applicant Name:
            </label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              className="form-control"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="applicantEmail" className="form-label">
              Applicant Email:
            </label>
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              className="form-control"
              value={formData.applicantEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="applicationDate" className="form-label">
              Application Date:
            </label>
            <DatePicker
              selected={formData.applicationDate}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date"
            />
          </div>
          <div className="col">
            <label htmlFor="serviceAddress" className="form-label">
              Service Address:
            </label>
            <input
              type="text"
              id="serviceAddress"
              name="serviceAddress"
              className="form-control"
              value={formData.serviceAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <CardElement className="form-control" />
          </div>
        </div>
        <div className="row d-flex justify-content-end ">
          <div className="col-md-6">
            <button
              type="submit"
              className="btn btn-success col-md-12"
              disabled={processing || succeeded}
            >
              {processing ? (
                <span>Processing...</span>
              ) : (
                <span>Pay & Submit</span>
              )}
            </button>
          </div>
          <div className="col-md-6">
            <div className="mb-3 text-end">
              <h5>Total amount: ${formData.cost.toFixed(2)}</h5>
            </div>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        {succeeded && (
          <div className="alert alert-success mt-3" role="alert">
            Payment succeeded
          </div>
        )}
      </form>
    </div>
  );
};

export default SprinklerForm;
