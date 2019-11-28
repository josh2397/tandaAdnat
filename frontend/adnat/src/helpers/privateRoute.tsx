import React, { Component, FunctionComponent } from 'react';
import { Route, RouteProps, Redirect, RouteComponentProps } from 'react-router-dom';

interface Props {
    component: React.FunctionComponent<RouteComponentProps>;
    path: string;
    authenticated: boolean;
}


const PrivateRoute = ({ component: FunctionComponent, authenticated, ...rest }: Props) => {
    return (
        
        <Route
            {...rest}
            render={(props) => (
                authenticated ? (
                    <FunctionComponent {...props}/>
                ) : (
                    <Redirect to='/login'/>
                )
            )}
        />
    );
};

export default PrivateRoute;