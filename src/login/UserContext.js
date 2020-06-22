import React from 'react';

const userContext = React.createContext({
    globalUser: {},
    appUser: {},
}); // Create a context object
// Export it so it can be used by other Components
export { userContext };