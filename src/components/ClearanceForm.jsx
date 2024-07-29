import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ClearanceForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    date: new Date(),
    time: new Date(),
    lotNumber: "",
    permitNumber: "",
    fullName: "",
    address: "",
    generalContractor: "",
    fireProtectionOfficer: "",
    reasonForInspection: "",
    stage: "",
    buildingType: "Residential",
    areaCovered: "",
    inspectionType: "",
    resultOfInspection: "",
    workMustBeCompletedIn: "",
    typeOfClearance: "",
    temporaryClearance: "",
    comments: "",
    inspector: "",
    cost: 0,
    email: "",
  });

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "buildingType" || name === "areaCovered") {
        calculateCost(updatedData);
      }

      return updatedData;
    });
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevData) => ({
      ...prevData,
      time,
    }));
  };

  const calculateCost = (updatedData) => {
    const area = parseInt(updatedData.areaCovered, 10) || 0;
    let cost = 0;
    if (updatedData.buildingType === "Residential") {
      if (area <= 4800) cost = 715.93;
      else if (area <= 7700) cost = 1864.4;
      else if (area >= 7701) cost = 2893.55;
    } else if (updatedData.buildingType === "Commercial") {
      cost = area * 0.3;
    }
    setFormData((prevData) => ({
      ...prevData,
      cost,
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
        process.env.REACT_APP_API_URL+"/api/clearance",
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
        setError(null);
        setProcessing(false);
        setFormData({
          date: new Date(),
          time: new Date(),
          lotNumber: "",
          permitNumber: "",
          fullName: "",
          address: "",
          generalContractor: "",
          fireProtectionOfficer: "",
          reasonForInspection: "",
          stage: "",
          buildingType: "Residential",
          areaCovered: "",
          inspectionType: "",
          resultOfInspection: "",
          workMustBeCompletedIn: "",
          typeOfClearance: "",
          temporaryClearance: "",
          comments: "",
          inspector: "",
          cost: 0,
          email: "",
        });
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
      <h2>Clearance Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="row mb-3">
          <div className="col">
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="yyyy/MM/dd"
              placeholderText="Select a date"
              required
            />
          </div>
          <div className="col">
            <DatePicker
              selected={formData.time}
              onChange={handleTimeChange}
              className="form-control"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select a time"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="lotNumber"
              placeholder="Lot #"
              value={formData.lotNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="permitNumber"
              placeholder="Permit #"
              value={formData.permitNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* Continue with other form fields in a similar pattern */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="generalContractor"
              placeholder="General Contractor"
              value={formData.generalContractor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="fireProtectionOfficer"
              placeholder="Fire Protection Officer"
              value={formData.fireProtectionOfficer}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="reasonForInspection"
              placeholder="Reason For Inspection"
              value={formData.reasonForInspection}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="stage"
              placeholder="Stage"
              value={formData.stage}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <select
              className="form-control"
              name="buildingType"
              value={formData.buildingType}
              onChange={handleChange}
              required
            >
              <option value="SelectBuildingType">Select Building Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              name="areaCovered"
              placeholder="Area Covered (sq ft)"
              value={formData.areaCovered}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "areaCovered",
                    value: e.target.value,
                  },
                })
              }
              onKeyUp={(e) =>
                calculateCost({ ...formData, areaCovered: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="inspectionType"
              placeholder="Inspection Type"
              value={formData.inspectionType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="resultOfInspection"
              placeholder="Result of Inspection"
              value={formData.resultOfInspection}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="workMustBeCompletedIn"
              placeholder="Work Must Be Completed In"
              value={formData.workMustBeCompletedIn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="typeOfClearance"
              placeholder="Type of Clearance"
              value={formData.typeOfClearance}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="number"
              className="form-control"
              name="temporaryClearance"
              placeholder="Temporary Clearance (days)"
              value={formData.temporaryClearance}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="comments"
              placeholder="Comments"
              value={formData.comments}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
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

export default ClearanceForm;
