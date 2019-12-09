import React, { useReducer, useEffect } from "react";

import { validate } from '../../utils/validators';
import "./Input.css";

const inputReducer = (state, action) => {
  switch(action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.payload,
        isValid: validate(action.payload, action.validators)
      }
    case 'TOUCH':
      return {
        ...state,
        isTouched: true
      }
    default:
     return state
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '', 
    isValid: props.initialIsValid || false,
    isTouched: false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const handleChange = (e) => (
    dispatch({ 
      type: 'CHANGE', 
      payload: e.target.value,
      validators: props.validators
    })
  );

  const handleBlur = (e) => (
    dispatch({ type: 'TOUCH' })
  );

  const element = props.element === "input" ? (
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={handleChange}
        onBlur={handleBlur} />
    ) : (
      <textarea 
        id={props.id} 
        rows={props.rows || 3} 
        value={inputState.value} 
        onChange={handleChange}
        onBlur={handleBlur} />
    );

  return (
    <div className={
      `form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`
    }>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p> }
    </div>
  );
};

export default Input;
