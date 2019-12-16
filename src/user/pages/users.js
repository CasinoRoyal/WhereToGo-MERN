import React, { useEffect, useState, Fragment } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async function() {
      try {
        const data = await sendRequest('http://localhost:8000/api/users');
        setUsers(data);
      } catch(err) {}      
    })();
  }, [sendRequest]);

  return(
    <Fragment>
      <ErrorModal error={error} onCancel={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  );
};

export default Users;
