import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css'

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }
];


const UpdatePlace = () => {
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

  const placeId = useParams().placeId;
  const editPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  useEffect(() => {
    if(editPlace) {
      setFormData(
        {
          title: {
            value: editPlace.title,
            isValid: true
          },
          description: {
            value: editPlace.description,
            isValid: true
          }
        },
        true
      );
    }
  }, [setFormData, editPlace])

  if (!editPlace) {
    return <div className="center">
      <h2>Place not found</h2>
    </div>
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
  };

  return(
    <form className='place-form' onSubmit={handleSubmit}>
      <Input
        id="title" 
        element='input'
        type='text' 
        label='Title' 
        errorText='Title is required' 
        validators={[VALIDATOR_REQUIRE()]}
        onInput={handleInputChange}
        initialValue={formState.inputs.title.value}
        initialIsValid={formState.inputs.title.isValid} />
      <Input
        id="description" 
        element='textarea'
        type='text' 
        label='Description' 
        errorText='Description is required' 
        validators={[VALIDATOR_REQUIRE()]}
        onInput={handleInputChange}
        initialValue={formState.inputs.description.value}
        initialIsValid={formState.inputs.description.isValid} />
      <Button disabled={formState.isValid}>Edit Place</Button>
    </form>
  );
};

export default UpdatePlace;