import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('inputs should be initially empty', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox');
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);

  expect(emailInputElement.value).toBe('');
  expect(passwordInputElement.value).toBe('');
  expect(confirmPasswordInputElement.value).toBe('');
});

test('should be able to type an email', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const inputEmail = 'wiu@gmail.com';
  userEvent.type(emailInputElement, inputEmail);
  expect(emailInputElement.value).toBe(inputEmail);
});

test('should be able to type a password', () => {
  render(<App />);
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const inputPassword = 'wiu666';
  userEvent.type(passwordInputElement, inputPassword);
  expect(passwordInputElement.value).toBe(inputPassword);
});

test('should be able to type a password', () => {
  render(<App />);
  const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);
  const inputPassword = 'wiu666';
  userEvent.type(confirmPasswordInputElement, inputPassword);
  expect(confirmPasswordInputElement.value).toBe(inputPassword);
});

test('should show email error message on invalid email', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });
  type emailErrorMessageType = HTMLParagraphElement | null;
  const emailErrorMessage: emailErrorMessageType = screen.queryByText(/the email you input is invalid/i);

  expect(emailErrorMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiugmail.com');
  userEvent.click(submitButtonElement);
  const emailErrorMessageAgain: HTMLParagraphElement = screen.getByText(/the email you input is invalid/i);
  expect(emailErrorMessageAgain).toBeInTheDocument();
});

test('should not show email error message on valid email', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type emailErrorMessageType = HTMLParagraphElement | null;

  const emailErrorMessage: emailErrorMessageType = screen.queryByText(/the email you input is invalid/i);

  expect(emailErrorMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiu@gmail.com');
  userEvent.click(submitButtonElement);

  const emailErrorMessageAgain: emailErrorMessageType = screen.queryByText(/the email you input is invalid/i);
  expect(emailErrorMessageAgain).not.toBeInTheDocument();
});

test('if email valid, should show password error message when password contains less than 5 characters', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type PasswordErrorMessageType = HTMLParagraphElement | null;

  const passwordErrorMessage: PasswordErrorMessageType = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  expect(passwordErrorMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiu@gmail.com');
  const inputPassword = 'wiu6';
  userEvent.type(passwordInputElement, inputPassword);

  userEvent.click(submitButtonElement);

  const passwordErrorMessageAgain: HTMLParagraphElement = screen.getByText(
    /the password you entered should contain 5 or more characters/i
  );
  expect(passwordErrorMessageAgain).toBeInTheDocument();
});

test('if email valid, should not show password error message when password contains more or equal than 5 characters', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type PasswordErrorMessageType = HTMLParagraphElement | null;

  const passwordErrorMessage: PasswordErrorMessageType = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  expect(passwordErrorMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiu@gmail.com');
  const inputPassword = 'wiu66';
  userEvent.type(passwordInputElement, inputPassword);

  userEvent.click(submitButtonElement);

  const passwordErrorMessageAgain: PasswordErrorMessageType = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );
  expect(passwordErrorMessageAgain).not.toBeInTheDocument();
});

test('should not show password error when email is invalid, even if password is valid (more or equal than 5 characters) only should show email error message', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type PasswordErrorMessageType = HTMLParagraphElement | null;

  const passwordErrorMessage: PasswordErrorMessageType = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  expect(passwordErrorMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiugmail.com'); //invalid email
  const inputPassword = 'wiu66'; //valid password
  userEvent.type(passwordInputElement, inputPassword);

  userEvent.click(submitButtonElement);

  const emailErrorMessageAfterSubmit: HTMLParagraphElement = screen.getByText(/the email you input is invalid/i);
  expect(emailErrorMessageAfterSubmit).toBeInTheDocument();

  const passwordErrorMessageAfterSubmit: PasswordErrorMessageType = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );
  expect(passwordErrorMessageAfterSubmit).not.toBeInTheDocument();
});

//Confirm password tests

test('should show confirm password error message when email and password are valid, but password confirmation is not equal to password', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type ConfirmPasswordErrorMessageType = HTMLParagraphElement | null;

  const confirmPasswordErrorMessageElement: ConfirmPasswordErrorMessageType = screen.queryByText(
    /the passwords don't match. try again./i
  );

  expect(confirmPasswordErrorMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiu@gmail.com');

  const inputPassword = 'wiu66';
  userEvent.type(passwordInputElement, inputPassword);

  const inputConfirmPassword = 'wiu77';
  userEvent.type(confirmPasswordInputElement, inputConfirmPassword);
  userEvent.click(submitButtonElement);

  const confirmPasswordErrorMessageAfterSubmitElement: HTMLParagraphElement = screen.getByText(
    /the passwords don't match. try again./i
  );
  expect(confirmPasswordErrorMessageAfterSubmitElement).toBeInTheDocument();
});

test('should show password error message when email is valid and password and confirmation password are equal, but they are less than 5 characters ', () => {
  render(<App />);
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });

  type ConfirmPasswordErrorMessageType = HTMLParagraphElement | null;

  const confirmPasswordErrorMessageElement: ConfirmPasswordErrorMessageType = screen.queryByText(
    /the passwords don't match. try again./i
  );

  expect(confirmPasswordErrorMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'wiu@gmail.com');

  const inputPasswordAndConfirmPassword = 'wiu6';
  userEvent.type(passwordInputElement, inputPasswordAndConfirmPassword);

  userEvent.type(confirmPasswordInputElement, inputPasswordAndConfirmPassword);
  userEvent.click(submitButtonElement);

  const passwordErrorMessageAfterSubmitElement: HTMLParagraphElement = screen.getByText(
    /the password you entered should contain 5 or more characters/i
  );
  expect(passwordErrorMessageAfterSubmitElement).toBeInTheDocument();
});
