import React, { useEffect, useState, useContext, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css'

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();  
  const [formState, handleInputChange, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    (async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    })();

  }, [sendRequest, placeId, setFormData]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };
  return(
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (    
        <form className='place-form' onSubmit={handleSubmit}>
          <Input
            id="title" 
            element='input'
            type='text' 
            label='Title' 
            errorText='Title is required' 
            validators={[VALIDATOR_REQUIRE()]}
            onInput={handleInputChange}
            initialValue={loadedPlace.title}
            initialIsValid={true} />
          <Input
            id="description" 
            element='textarea'
            type='text' 
            label='Description' 
            errorText='Description is required' 
            validators={[VALIDATOR_REQUIRE()]}
            onInput={handleInputChange}
            initialValue={loadedPlace.description}
            initialIsValid={true} />
          <Button disabled={!formState.isValid}>Edit Place</Button>
        </form>
        )}
    </Fragment>
  );
};

export default UpdatePlace;