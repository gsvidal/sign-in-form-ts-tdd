import { ChangeEvent, FormEvent, useState } from 'react';
import './App.scss';
import validator from 'validator';

type InputType = {
  email: string;
  password: string;
  confirmPassword: string;
};

type showErrorMessageType = {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

function App() {
  const [input, setInput] = useState<InputType>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showErrorMessage, setShowErrorMessage] = useState<showErrorMessageType>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const emailValidation = (email: string) => {
    return validator.isEmail(email);
  };

  const handleSubmit: (event: FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    setShowErrorMessage({
      ...showErrorMessage,
      email: !emailValidation(input.email),
    });

    if (emailValidation(input.email)) {
      if (input.password.length < 5) {
        setShowErrorMessage({
          ...showErrorMessage,
          password: true,
        });
      } else {
        setShowErrorMessage({
          ...showErrorMessage,
          password: false,
        });
      }
    }
  };

  const handleChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={input.email}
          onChange={handleChange}
        />
      </div>
      <div>
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
      <div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirm-password" />
      </div>
      {showErrorMessage.email && <p>The email you input is invalid</p>}
      {showErrorMessage.password && <p>The password you entered should contain 5 or more characters</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
