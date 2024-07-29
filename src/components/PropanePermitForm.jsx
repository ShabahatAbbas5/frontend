import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PropanePermitForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicationDate: new Date(),
    serviceAddress: "",
    isMailingSame: false,
    mailingAddress: "",
    telephoneNumber: "",
    faxNumber: "",
    propaneSupplier: "",
    propaneSupplierPhoneNumber: "",
    tankSize: "",
    tankLocation: "",
    plotPlan: null,
    cost: 100,
  });

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (applicationDate) => {
    setFormData((prevData) => ({
      ...prevData,
      applicationDate: applicationDate,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, plotPlan: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSucceeded(true);
      const cardElement = elements.getElement(CardElement);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "plotPlan") {
          if (formData.plotPlan) formDataToSend.append(key, formData.plotPlan);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append("amount", Math.round(formData.cost * 100));

      setProcessing(true);

      Swal.fire({
        title: "Processing Payment",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        process.env.REACT_APP_API_URL+"/api/propane",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const payload = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.applicantName,
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
          isMailingSame: false,
          mailingAddress: "",
          telephoneNumber: "",
          faxNumber: "",
          propaneSupplier: "",
          propaneSupplierPhoneNumber: "",
          tankSize: "",
          tankLocation: "",
          plotPlan: null,
          cost: 100,
        });
        setSucceeded(false);
        setError(null);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Propane Permit Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              className="form-control"
              placeholder="Applicant Name"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              className="form-control"
              placeholder="Applicant Email"
              value={formData.applicantEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <DatePicker
              selected={formData.applicationDate}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="yyyy/MM/dd"
              placeholderText="Application Date"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              id="serviceAddress"
              name="serviceAddress"
              className="form-control"
              placeholder="Service Address"
              value={formData.serviceAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3 d-flex justify-content-start">
          <div className="col-md-6 p-1">
            <input
              type="checkbox"
              id="isMailingSame"
              name="isMailingSame"
              className="form-check-input me-3"
              checked={formData.isMailingSame}
              onChange={handleChange}
            />
            <label
              htmlFor="isMailingSame"
              className="form-check-label text-start"
            >
              Is this mailing address the same as the service address?
            </label>
          </div>

          {!formData.isMailingSame && (
            <div className="col-md-6">
              <input
                type="text"
                id="mailingAddress"
                name="mailingAddress"
                className="form-control"
                placeholder="Mailing Address"
                value={formData.mailingAddress}
                onChange={handleChange}
                required={!formData.isMailingSame}
              />
            </div>
          )}
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              id="telephoneNumber"
              name="telephoneNumber"
              className="form-control"
              placeholder="Telephone Number"
              value={formData.telephoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              id="faxNumber"
              name="faxNumber"
              className="form-control"
              placeholder="Fax Number"
              value={formData.faxNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              id="propaneSupplier"
              name="propaneSupplier"
              className="form-control"
              placeholder="Propane Supplier"
              value={formData.propaneSupplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              id="propaneSupplierPhoneNumber"
              name="propaneSupplierPhoneNumber"
              className="form-control"
              placeholder="Propane Supplier Phone Number"
              value={formData.propaneSupplierPhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              id="tankSize"
              name="tankSize"
              className="form-control"
              placeholder="Tank Size"
              value={formData.tankSize}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              id="tankLocation"
              name="tankLocation"
              className="form-control"
              placeholder="Tank Location"
              value={formData.tankLocation}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="file"
            id="plotPlan"
            name="plotPlan"
            className="form-control"
            placeholder="Upload Plot Plan"
            onChange={handleFileChange}
            required
          />
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
}

export default PropanePermitForm;
