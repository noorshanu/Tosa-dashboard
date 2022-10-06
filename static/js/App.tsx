import HomePage from 'Pages/HomePage';
import { useEffect } from 'react';
import { usePollsQuery } from 'redux/api';

const App = () => {
  usePollsQuery();

  useEffect(() => {
    console.log(process.env.REACT_APP_ENV);
  }, []);

  return (
    <>
      <HomePage />
    </>
  );
};

export default App;
