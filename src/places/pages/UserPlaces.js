import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    (async function() {
      try{
        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(res.places);

      } catch(err) {
        console.dir(err)
      }
    })();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (deletePlaceId) => {
    setLoadedPlaces((prevState) => prevState.filter(
      (place) => place._id !== deletePlaceId)
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && 
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />}
    </Fragment>
  );
};

export default UserPlaces;
