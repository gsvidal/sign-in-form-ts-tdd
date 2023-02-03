import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

beforeEach(() => {
  render(<Form />);
});

type typeIntoFormObj = {
  inputEmail?: string;
  inputPassword?: string;
  inputConfirmPassword?: string;
};

const typeIntoForm = ({ inputEmail, inputPassword, inputConfirmPassword }: typeIntoFormObj) => {
  const emailInputElement: HTMLInputElement = screen.getByRole('textbox', {
    name: /email address/i,
  });
  const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
  const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);

  if (inputEmail) {
    userEvent.type(emailInputElement, inputEmail);
  }
  if (inputPassword) {
    userEvent.type(passwordInputElement, inputPassword);
  }
  if (inputConfirmPassword) {
    userEvent.type(confirmPasswordInputElement, inputConfirmPassword);
  }
  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const clickSubmitButton = () => {
  const submitButtonElement: HTMLButtonElement = screen.getByRole('button', {
    name: /submit/i,
  });
  userEvent.click(submitButtonElement);
};

type ErrorMessageCheckingType = {
  queryByText?: string;
  getByText?: string;
};

const errorMessageChecking = ({ queryByText, getByText }: ErrorMessageCheckingType) => {
  type ErrorMessageType = HTMLParagraphElement | null;

  switch (queryByText) {
    case 'email':
      const queryEmailErrorMessageElement: ErrorMessageType = screen.queryByText(/the email you input is invalid/i);
      return queryEmailErrorMessageElement;
    case 'password':
      const queryPasswordErrorMessageElement: ErrorMessageType = screen.queryByText(
        /the password you entered should contain 5 or more characters/i
      );
      return queryPasswordErrorMessageElement;
    case 'confirm-password':
      const queryConfirmPasswordErrorMessageElement: ErrorMessageType = screen.queryByText(
        /the passwords don't match. try again./i
      );
      return queryConfirmPasswordErrorMessageElement;
  }
  switch (getByText) {
    case 'email':
      const getEmailErrorMessageElement: HTMLParagraphElement = screen.getByText(/the email you input is invalid/i);
      return getEmailErrorMessageElement;
    case 'password':
      const getPasswordErrorMessageElement: HTMLParagraphElement = screen.getByText(
        /the password you entered should contain 5 or more characters/i
      );
      return getPasswordErrorMessageElement;
    case 'confirm-password':
      const getConfirmPasswordErrorMessageElement: HTMLParagraphElement = screen.getByText(
        /the passwords don't match. try again./i
      );
      return getConfirmPasswordErrorMessageElement;
  }
};
describe('Form', () => {
  test('inputs should be initially empty', () => {
    const emailInputElement: HTMLInputElement = screen.getByRole('textbox');
    const passwordInputElement: HTMLInputElement = screen.getByLabelText(/^password$/i);
    const confirmPasswordInputElement: HTMLInputElement = screen.getByLabelText(/confirm password/i);

    expect(emailInputElement.value).toBe('');
    expect(passwordInputElement.value).toBe('');
    expect(confirmPasswordInputElement.value).toBe('');
  });

  describe('Type handling', () => {
    test('should be able to type an email', () => {
      const inputEmail = 'wiu@gmail.com';
      const { emailInputElement } = typeIntoForm({ inputEmail });
      expect(emailInputElement.value).toBe(inputEmail);
    });

    test('should be able to type a password', () => {
      const inputPassword = 'wiu666';
      const { passwordInputElement } = typeIntoForm({ inputPassword });
      expect(passwordInputElement.value).toBe(inputPassword);
    });

    test('should be able to type a confirm password', () => {
      const inputConfirmPassword = 'wiu666';
      const { confirmPasswordInputElement } = typeIntoForm({ inputConfirmPassword });
      expect(confirmPasswordInputElement.value).toBe(inputConfirmPassword);
    });
  });

  describe('Error Handling', () => {
    //Email tests
    test('should show email error message on invalid email', () => {
      const queryEmailErrorMessageElement = errorMessageChecking({ queryByText: 'email' });
      expect(queryEmailErrorMessageElement).not.toBeInTheDocument();
      const inputEmail = 'wiugmail.com';
      typeIntoForm({ inputEmail });

      clickSubmitButton();
      const getEmailErrorMessageElement = errorMessageChecking({ getByText: 'email' });
      expect(getEmailErrorMessageElement).toBeInTheDocument();
    });

    test('should not show email error message on valid email', () => {
      const queryEmailErrorMessageElement = errorMessageChecking({ queryByText: 'email' });
      expect(queryEmailErrorMessageElement).not.toBeInTheDocument();

      const inputEmail = 'wiu@gmail.com';
      typeIntoForm({ inputEmail });
      clickSubmitButton();

      const queryEmailErrorMessageElementAfterSubmit = errorMessageChecking({ queryByText: 'email' });
      expect(queryEmailErrorMessageElementAfterSubmit).not.toBeInTheDocument();
    });

    test('should not show email error message on valid email after initially input an invalid email (with its respective email error message)', () => {
      const inputEmail = 'wiugmail.com';
      typeIntoForm({ inputEmail });
      clickSubmitButton();

      const getEmailErrorMessageElementAfterSubmit = errorMessageChecking({ getByText: 'email' });
      expect(getEmailErrorMessageElementAfterSubmit).toBeInTheDocument();

      const inputEmailAgain = 'wiu@gmail.com';
      typeIntoForm({ inputEmail: inputEmailAgain });
      clickSubmitButton();

      const queryEmailErrorMessageElementAfterSecondSubmit = errorMessageChecking({ queryByText: 'email' });
      expect(queryEmailErrorMessageElementAfterSecondSubmit).not.toBeInTheDocument();
    });

    //Password tests

    test('if email valid, should show password error message when password contains less than 5 characters', () => {
      const passwordErrorMessageElement = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessageElement).not.toBeInTheDocument();

      const { emailInputElement, passwordInputElement } = typeIntoForm({
        inputEmail: 'wiu@gmail.com',
        inputPassword: 'wiu6',
      });

      clickSubmitButton();

      const passwordErrorMessageElementAfterSubmit = errorMessageChecking({ getByText: 'password' });
      expect(passwordErrorMessageElementAfterSubmit).toBeInTheDocument();
    });

    test('if email valid, should not show password error message when password contains more or equal than 5 characters', () => {
      const passwordErrorMessage = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessage).not.toBeInTheDocument();

      typeIntoForm({
        inputEmail: 'wiu@gmail.com',
        inputPassword: 'wiu666',
      });

      clickSubmitButton();

      const passwordErrorMessageAfterSubmit = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessageAfterSubmit).not.toBeInTheDocument();
    });

    test('should not show password error when email is invalid, even if password is valid (more or equal than 5 characters) only should show email error message', () => {
      const passwordErrorMessage = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessage).not.toBeInTheDocument();

      typeIntoForm({
        inputEmail: 'wiugmail.com',
        inputPassword: 'wiu666',
      });

      clickSubmitButton();

      const passwordErrorMessageAfterSubmit = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessageAfterSubmit).not.toBeInTheDocument();
    });

    //Confirm password tests

    test('should show confirm password error message when email and password are valid, but password confirmation is not equal to password', () => {
      const confirmPasswordErrorMessage = errorMessageChecking({ queryByText: 'confirm-password' });
      expect(confirmPasswordErrorMessage).not.toBeInTheDocument();

      typeIntoForm({
        inputEmail: 'wiu@gmail.com',
        inputPassword: 'wiu666',
        inputConfirmPassword: 'wiu777',
      });

      clickSubmitButton();

      const confirmPasswordErrorMessageAfterSubmit = errorMessageChecking({ getByText: 'confirm-password' });
      expect(confirmPasswordErrorMessageAfterSubmit).toBeInTheDocument();
    });

    test('should show password error message when email is valid and password and confirmation password are equal, but they are less than 5 characters ', () => {
      const passwordErrorMessage = errorMessageChecking({ queryByText: 'password' });
      expect(passwordErrorMessage).not.toBeInTheDocument();

      typeIntoForm({
        inputEmail: 'wiu@gmail.com',
        inputPassword: 'wiu6',
        inputConfirmPassword: 'wiu6',
      });

      clickSubmitButton();

      const passwordErrorMessageAfterSubmit = errorMessageChecking({ getByText: 'password' });
      expect(passwordErrorMessageAfterSubmit).toBeInTheDocument();
    });
  });
  describe('Happy path', () => {
    test('show success message when three inputs are valid and form submitted', () => {
      const successMessageElement: HTMLParagraphElement | null = screen.queryByText(/You signed in successfully!/i);
      expect(successMessageElement).not.toBeInTheDocument();

      typeIntoForm({
        inputEmail: 'wiu@gmail.com',
        inputPassword: 'wiu66',
        inputConfirmPassword: 'wiu66',
      });

      clickSubmitButton();

      const successMessageElementAfterSubmit: HTMLParagraphElement = screen.getByText(/You signed in successfully!/i);
      expect(successMessageElementAfterSubmit).toBeInTheDocument();
    });
  });
});
