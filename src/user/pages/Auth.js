import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { 
  VALIDATOR_EMAIL, 
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import './Auth.css';

const Auth = () => {
  const { login } = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, handleInputChange, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formState);
    login();
  }

  return(
    <Card className='authentication'>
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={submitHandler}>
        {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={handleInputChange}
            />
        )}
        <Input 
          element='input' 
          id='email' 
          type='email' 
          label='E-mail'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter valid email'
          onInput={handleInputChange}
        />
        <Input
          element='input' 
          id='password' 
          type='password' 
          label='E-mail'
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText='Please enter valid password, at least 6 characters'
          onInput={handleInputChange}        
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
    </Card>
  );
};

export default Auth;