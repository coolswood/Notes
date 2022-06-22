import { Container } from './components/Container/Container';
import { CustomDragLayer } from './components/CustomDragLayer/CustomDragLayer';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import { ApiRequest } from 'src/helper';

export const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const authUser = () => {
    const result = prompt('Fill your name');

    return ApiRequest('auth', { user: result }, 'PUT');
  };

  useEffect(() => {
    const user = cookie.get('user');

    if (user === undefined) {
      authUser().then(() => {
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Container />
        <CustomDragLayer />
      </div>
    </DndProvider>
  );
};
