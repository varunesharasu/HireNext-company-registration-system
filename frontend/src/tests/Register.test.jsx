import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { configureStore } from "@reduxjs/toolkit"
import Register from "../pages/Register"
import authSlice from "../store/slices/authSlice"
import theme from "../styles/theme"

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...initialState.auth,
      },
    },
  })
}

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState)
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </BrowserRouter>
    </Provider>,
  )
}

describe("Register Component", () => {
  it("renders registration form correctly", () => {
    renderWithProviders(<Register />)

    expect(screen.getByText("Create Account")).toBeInTheDocument()
    expect(screen.getByText("Personal Information")).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  })

  it("navigates through registration steps", async () => {
    renderWithProviders(<Register />)

    // Fill first step
    const fullNameInput = screen.getByLabelText(/full name/i)
    fireEvent.change(fullNameInput, { target: { value: "Test User" } })

    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText("Contact Details")).toBeInTheDocument()
    })
  })

  it("shows validation errors for required fields", async () => {
    renderWithProviders(<Register />)

    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument()
    })
  })
})
