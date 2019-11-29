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
                    // console.log("Redirecting to login from private route due to unauthentication");
                    <Redirect to='/login'/>
                )
            )}
        />
    );
};

export default PrivateRoute;