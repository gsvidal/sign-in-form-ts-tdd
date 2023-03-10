import { ChangeEvent, FormEvent, useState } from 'react';
import validator from 'validator';
import './Form.style.scss';

type InputType = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ShowErrorMessageType = {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

const Form = () => {
  const [input, setInput] = useState<InputType>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showErrorMessage, setShowErrorMessage] = useState<ShowErrorMessageType>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const emailValidation = (email: string) => {
    return validator.isEmail(email);
  };

  const handleSubmit: (event: FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();

    const isValidEmail: boolean = emailValidation(input.email);

    const isValidPassword: boolean = input.password.length >= 5;

    const isValidConfirmPassword: boolean = input.password === input.confirmPassword;

    if (!isValidEmail) {
      setShowErrorMessage({
        email: true,
        password: false,
        confirmPassword: false,
      });
    } else if (!isValidPassword) {
      setShowErrorMessage({
        email: false,
        password: true,
        confirmPassword: false,
      });
    } else if (!isValidConfirmPassword) {
      setShowErrorMessage({
        email: false,
        password: false,
        confirmPassword: true,
      });
    } else {
      setShowErrorMessage({
        email: false,
        password: false,
        confirmPassword: false,
      });
      setShowSuccessMessage(true);
    }
  };

  const handleChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  return (
    <form action="" onSubmit={handleSubmit} className={`form ${showSuccessMessage ? 'success' : ''}`}>
      {showSuccessMessage ? (
        <p>You signed in successfully!</p>
      ) : (
        <>
          <div className="input-container">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-control"
              value={input.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={input.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              className="form-control"
              value={input.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {showErrorMessage.email && <p className="error-message">The email you input is invalid</p>}
          {showErrorMessage.password && (
            <p className="error-message">The password you entered should contain 5 or more characters</p>
          )}
          {showErrorMessage.confirmPassword && <p className="error-message">The passwords don't match. Try again.</p>}
          <button type="submit" className="button">
            Submit
          </button>
        </>
      )}
    </form>
  );
};

export default Form;
