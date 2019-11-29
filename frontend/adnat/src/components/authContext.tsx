import React, { useState, useMemo, useCallback } from 'react';
import { IUserDetails } from '../models/users';

interface ContextProps {
    updateAuthentication: (authenticationValue: boolean) => void;
    authenticated: boolean;
    updateUserDetails: ({}: IUserDetails) => void;
    userDetails: IUserDetails;
}

const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
export const defaultUserDetails = {id: -1, name: "", organisationId: -1, organisationName: ""}
export default AuthContext;