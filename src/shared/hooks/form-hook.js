import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch(action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        
        if(!state.inputs[inputId]) continue;

        if (inputId === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formValidity
      }
    default:
      return state;
  }
}

export const useForm = (initialInputs, initialValidate) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidate
  });


  const handleInputChange = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', id, value, isValid })
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: 'SET_DATA', inputs: inputData, formValidity })
  }, []);

  return [formState, handleInputChange, setFormData];
};