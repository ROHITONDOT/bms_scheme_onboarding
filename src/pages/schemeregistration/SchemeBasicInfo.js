import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SchemeBasicInfo () {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [schemeFeatures, setSchemeFeatures] = useState([""]); // Dynamic Feature Fields

  // Handle Form Submit
  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Send data to your Spring Boot API (use fetch/axios)
  };

  // Add new feature field
  const addFeatureField = () => setSchemeFeatures([...schemeFeatures, ""]);

  // Remove feature field
  const removeFeatureField = (index) => {
    const updatedFeatures = [...schemeFeatures];
    updatedFeatures.splice(index, 1);
    setSchemeFeatures(updatedFeatures);
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* Basic Information */}
        <h2 className="mb-3">Basic Information</h2>
        <div className="row">
          <div className="col-md-4">
            <label>Scheme Name:</label>
            <input
              type="text"
              className="form-control"
              {...register("scheme_name", {
                required: "Scheme Name is required",
                pattern: {
                  value: /^[a-zA-Z0-9\s]+$/,
                  message: "Invalid characters in Scheme Name",
                },
              })}
              placeholder="Scheme Name"
            />
            {errors.scheme_name && (
              <div className="text-danger">{errors.scheme_name.message}</div>
            )}
          </div>

          <div className="col-md-4">
            <label>Component Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Component Name"
              {...register("component_name", {
                pattern: {
                  value: /^[a-zA-Z0-9\s]+$/,
                  message: "Invalid characters in Component Name",
                },
              })}
            />
          </div>

          <div className="col-md-4">
            <label>Scheme Code:</label>
            <input
              type="text"
              className={`form-control ${
                errors.scheme_code ? "is-invalid" : ""
              }`}
              placeholder="Scheme Code"
              {...register("scheme_code", {
                required: "Scheme Code is required",
                maxLength: {
                  value: 5,
                  message: "Max length is 5 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s]+$/,
                  message: "Invalid characters in Scheme Code",
                },
              })}
            />
            {errors.scheme_code && (
              <div className="text-danger">{errors.scheme_code.message}</div>
            )}
          </div>
        </div>

        {/* Scheme Type & Launch Date */}
        <div className="row mt-3">
          <div className="col-md-6">
            <label>Scheme Type:</label>
            <select
              className="form-select"
              {...register("scheme_type", {
                required: "Scheme Type is required",
              })}
            >
              <option value="">Select Scheme Type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
            </select>
            {errors.scheme_type && (
              <div className="text-danger">{errors.scheme_type.message}</div>
            )}
          </div>

          <div className="col-md-6">
            <label>Launch Date:</label>
            <input
              type="date"
              className="form-control"
              {...register("launch_date", {
                required: "Launch Date is required",
              })}
            />
            {errors.launch_date && (
              <div className="text-danger">{errors.launch_date.message}</div>
            )}
          </div>
        </div>

        {/* Scheme Benefit Type */}
        <div className="row mt-3">
          <div className="col-md-4">
            <label>Scheme Benefit Type:</label>
            <select
              className="form-select"
              {...register("scheme_benefit", {
                required: "Benefit Type is required",
              })}
            >
              <option value="">-Please Select-</option>
              <option value="1">Cash</option>
              <option value="2">Kind</option>
              <option value="5">Cash and Kind</option>
            </select>
            {errors.scheme_benefit && (
              <div className="text-danger">{errors.scheme_benefit.message}</div>
            )}
          </div>

          <div className="col-md-4">
            <label>Attendance Dependent Scheme:</label>
            <div>
              <input type="radio" {...register("user_attendance")} value="1" />
              Yes
              <input
                type="radio"
                {...register("user_attendance")}
                value="2"
                className="ms-3"
              />{" "}
              No
            </div>
          </div>
        </div>

        {/* Dynamic Scheme Features */}
        <div className="row mt-3">
          <div className="col-md-12">
            <label>Scheme Features:</label>
            {schemeFeatures.map((feature, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...schemeFeatures];
                    newFeatures[index] = e.target.value;
                    setSchemeFeatures(newFeatures);
                  }}
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeFeatureField(index)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success"
              onClick={addFeatureField}
            >
              +
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="row mt-3">
          <div className="col-md-6">
            <label>Scheme Sanction Letter:</label>
            <input
              type="file"
              className="form-control"
              {...register("sanction_letter", {
                required: "File is required",
                validate: (file) =>
                  file?.length > 0 &&
                  /^[a-zA-Z0-9.\-_ ]+$/.test(file[0]?.name) ||
                  "Invalid file name",
              })}
            />
            {errors.sanction_letter && (
              <div className="text-danger">
                {errors.sanction_letter.message}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="row mt-4">
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary">
              Save & Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

