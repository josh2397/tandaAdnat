import React, { useState, useMemo, useCallback } from 'react';

type ContextProps = {
    updateAuthentication: (authenticationValue: boolean) => void;
    authenticated: boolean;
}

const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;