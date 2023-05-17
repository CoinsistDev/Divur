import React from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import {useStore} from '../stores/store'

interface Props extends RouteProps{
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}
export  function PrivateRoute({component:Component, ...rest}:Props) {
    const {userStore:{isLoggedIn,isUserPermissioned}} = useStore()
    var url = rest.location?.pathname.split('/');
    return (
        <Route
            {...rest}
            render={(props) => (isLoggedIn && (isUserPermissioned(url![url!.length-1]) || url![url!.length-1] === 'departments')) ? <Component {...props}/> : <Redirect to='/wa/login'/>}
        />
    )
}
export  function ImplementorRoute({component:Component, ...rest}:Props) {
    const {userStore:{isLoggedIn,isImplementor}} = useStore()
    return (
        <Route
            {...rest}
            render={(props) => (isLoggedIn && isImplementor) ? <Component {...props}/> : <Redirect to='/'/>}
        />
    )
}
