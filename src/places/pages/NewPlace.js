import React, { useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      },
      image: {
        value: null,
        isValid: false
      }
    }, 
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(
        'http://localhost:8000/api/places',
        'POST',
        formData,
        {
          'Authorization': 'Bearer ' + auth.token 
        }
      )
    } catch(err){
      console.log(err)
    }

    history.push('/');
  };

  return(
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={handleSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload
          id="image"
          onInput={handleInputChange}
          errorText="Please provide an image."
        />              
        <Button type='submit' disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;