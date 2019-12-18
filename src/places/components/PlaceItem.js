import React, { useContext, useState, Fragment } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId, token } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmDelete, setConfirmDelete] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openConfirmDeleteHandler = () => setConfirmDelete(true);
  const closeConfirmDeleteHandler = () => setConfirmDelete(false);
  const deleteConfirmDeleteHandler = async () => {
    closeConfirmDeleteHandler();
    try {
      await sendRequest(
        `http://localhost:8000/api/places/${props.id}`,
        'DELETE',
        null,
        {
          'Authorization': 'Bearer ' + token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  } 

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={8} />
        </div>
      </Modal>

      <Modal
        show={showConfirmDelete}
        onCancel={closeConfirmDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={<Fragment>
          <Button inverse onClick={closeConfirmDeleteHandler}>CANCEL</Button>
          <Button danger onClick={deleteConfirmDeleteHandler}>DELETE</Button>
        </Fragment>}
      >
        <p>Do you want delete this place?</p>
      </Modal>

      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}      
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {userId === props.creatorId && <Button danger onClick={openConfirmDeleteHandler}>
              DELETE
            </Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
