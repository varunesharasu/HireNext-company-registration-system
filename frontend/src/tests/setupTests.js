"use client"

import React from "react"
import jest from "jest"
import "@testing-library/jest-dom"

// Mock react-phone-input-2
jest.mock("react-phone-input-2", () => {
  return function PhoneInput({ onChange, value, ...props }) {
    return <input {...props} value={value} onChange={(e) => onChange(e.target.value)} data-testid="phone-input" />
  }
})

// Mock react-datepicker
jest.mock("react-datepicker", () => {
  return function DatePicker({ onChange, selected, customInput, ...props }) {
    return customInput ? (
      React.cloneElement(customInput, {
        ...props,
        value: selected ? selected.toISOString().split("T")[0] : "",
        onChange: (e) => onChange(new Date(e.target.value)),
      })
    ) : (
      <input
        {...props}
        type="date"
        value={selected ? selected.toISOString().split("T")[0] : ""}
        onChange={(e) => onChange(new Date(e.target.value))}
        data-testid="date-picker"
      />
    )
  }
})

// Mock Firebase
jest.mock("../config/firebase", () => ({
  auth: {},
  default: {},
}))
