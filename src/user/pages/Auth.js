import React, { useState, useContext, Fragment } from 'react';

import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { 
  VALIDATOR_EMAIL, 
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import './Auth.css';

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();


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
          name: undefined,
          image: undefined
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
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signin`, 
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { 'Content-Type': 'application/json' }
        )

        login(res.user._id, res.token);
      } catch(err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`, 
          'POST',
          formData
        )
        login(res.user._id, res.token);
      } catch(err) {
        console.log(err);
      }
    }
  }

  return(
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLoginMode && 
            <ImageUpload 
              center 
              id="image" 
              onInput={handleInputChange} 
              errorText="Please provide an image." 
            />}
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
            label='Password'
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
    </Fragment>
  );
};

export default Auth;