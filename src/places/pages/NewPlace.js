import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const NewPlace = () => {
  const [formState, handleInputChange] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    }, 
    false
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
  };

  return(
    <form className="place-form" onSubmit={handleSubmit}>
      <Input
        id="title" 
        element='input'
        type='text' 
        label='Title' 
        errorText='Title is required' 
        validators={[VALIDATOR_REQUIRE()]}
        onInput={handleInputChange} />
      <Input
        id="description" 
        element='textarea'
        type='text' 
        label='Description' 
        errorText='Description is required' 
        validators={[VALIDATOR_REQUIRE()]}
        onInput={handleInputChange} />
      <Input
        id="address" 
        element='input'
        type='text' 
        label='Address' 
        errorText='Address is required' 
        validators={[VALIDATOR_REQUIRE()]}
        onInput={handleInputChange} />        
      <Button type='submit' disabled={!formState.isValid}>
        Add Place
      </Button>
    </form>
  );
};

export default NewPlace;