import React, { useEffect, useState, Fragment } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async function() {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/users');

        if (!res.ok) {
          throw new Error(res.message)
        }
        const data = await res.json();
        setUsers(data);
      } catch(err) {

      }
      
      setIsLoading(false);
    })();
  }, []);

  const errorHandler = () => (setError(null));

  return(
    <Fragment>
      <ErrorModal error={error} onCancel={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  );
};

export default Users;
