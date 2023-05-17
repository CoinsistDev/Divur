import React, { useEffect } from "react";
import SideBar from "../layout/SideBar";
import ImplementorSideBar from "../layout/ImplementorSideBar";
import NavBar from "../layout/NavBar";
import DistributionForm from "../../features/Distribution/form/DistributionForm";
import TimedDistributionTable from "../../features/timedDistributions/TimedDistributionsTable";
import { Container, Loader, Sidebar } from "semantic-ui-react";
import { Redirect, Route, Switch, useLocation } from "react-router";
import NotFound from "../../../src/features/errors/NotFound";
import DepartmentList from "../../features/department/DepartmentList";
import ReportsDashboard from "../../features/reports/ReportsDashboard";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../../features/users/LoginForm";
import VerifyForm from "../../features/users/VerifyForm";
import ManageDepartmentDashboard from "../../features/implementors/departments/ManageDepartmentDashboard";
import CreateDepartmentForm from "../../features/implementors/departments/CreateDepartmentForm";
import { history } from "../..";
import ResetPasswordForm from "../../features/implementors/users/ResetPasswordForm";
import { PrivateRoute, ImplementorRoute } from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import BlacklistTable from "../../features/blacklist/BlacklistTable";

export default observer(function App() {
  
  const { commonStore, userStore, departmentStore } = useStore();
  const location = useLocation();
  // console.log('location: ' + location);
  // console.log(location);
  useEffect(() => {
    if (
      location.pathname.split("/")[2] === "login" ||
      location.pathname.split("/")[3] === "resetPassword" ||
      location.pathname.split("/")[2] === "verify"
    ){
      // console.log('1');
      commonStore.setAppLoaded();
    }else {
      userStore
        .getUser()
        .then((user) => {
          if (user !== undefined) {
            // console.log(user);
            // console.log('2');
            if (location.pathname.split("/")[2] === "login") {
              // console.log('3');
              history.push("/wa");
            }
            if (
              user?.lastDepartmentVisited !==
                "00000000-0000-0000-0000-000000000000" &&
              user.departments.filter(
                (d) => d.id === user.lastDepartmentVisited
              ).length !== 0
            ){
              departmentStore
                .loadCurrentDepartment(user!.lastDepartmentVisited)
                .then(() => commonStore.setAppLoaded());
                // console.log('5');
              }else{
                departmentStore
                .loadCurrentDepartment(user!.departments[0].id)
                .then(() => commonStore.setAppLoaded());
                // console.log(user!.departments[0].id);
                // console.log('56');
              }
            
          } else {
           // console.log("b");

            history.push("/wa/login");
            commonStore.setAppLoaded();
          }
        })
        .catch((err) => {
          console.log("error");
        });
    }
  }, [userStore, commonStore, departmentStore, location.pathname]);
  //console.log(commonStore);

  if (!commonStore.appLoaded) {
    return (
      <Container>
        <Loader active content="טוען" />
      </Container>
    );
  }
  
  if (
    userStore.currentUser?.departments.length === 0 &&
    userStore.currentUser.roles.filter(
      (x) => x === "Admin" || x === "Implementor"
    ).length === 0
  )
    return <h1>לא קיימות מחלקות למשתמש</h1>;

  return (
    <>
      <ToastContainer position="bottom-right" />
      <Route
        exact
        path="/wa"
        render={() => (
          <Redirect
            to={
              userStore.currentUser
                ? `/wa/distribution/${userStore.currentUser?.lastDepartmentVisited}`
                : "/wa/login"
            }
          />
        )}
      />
            <Route
        exact
        path="/"
        render={() => (
          <Redirect
            to={
              userStore.currentUser
                ? `/wa/distribution/${userStore.currentUser?.lastDepartmentVisited}`
                : "/wa/login"
            }
          />
        )}
      />
      <Route exact path="/wa/login" component={LoginForm} />
      <Route exact path="/wa/verify/:requestId" component={VerifyForm} />
      <Route
        exact
        path="/wa/account/resetPassword"
        component={ResetPasswordForm}
      />
      <Route
        exact
        path="/wa"
        render={() => (
          <Redirect
            to={
              userStore.currentUser
                ? `/wa/distribution/${userStore.currentUser?.lastDepartmentVisited}`
                : "/wa/login"
            }
          />
        )}
      />

      {/* Implementors Routes */}
      {history.location.pathname.split("/")[2] === "admin" ? (
        <Route
          path={"/(.+)"}
          render={() => (
            <>
              <NavBar />
              <ImplementorSideBar />
              <Sidebar.Pusher>
                <Switch>
                  <ImplementorRoute
                    exact
                    path="/wa/admin/departments"
                    component={ManageDepartmentDashboard}
                  />
                  <ImplementorRoute
                    key={location.key}
                    path={"/wa/admin/departments/create"}
                    component={CreateDepartmentForm}
                  />
                </Switch>
              </Sidebar.Pusher>
            </>
          )}
        />
      ) : (
        history.location.pathname !== "/wa/login" &&
        history.location.pathname.split("/")[2] !== "verify" &&
        history.location.pathname.split("/")[3] !== "resetPassword" && (
          <Route
            path={"/(.+)"}
            render={() => (
              <>
                <NavBar />

                <SideBar />
                <Sidebar.Pusher>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/wa/distribution/:id"
                      component={DistributionForm}
                    />
                    <PrivateRoute
                      exact
                      path="/wa/scheduledTasks/:id"
                      component={TimedDistributionTable}
                    />
                    <PrivateRoute
                      exact
                      path="/wa/departments"
                      component={DepartmentList}
                    />
                    <PrivateRoute
                      exact
                      path="/wa/reports/:id"
                      component={ReportsDashboard}
                    />
                    <PrivateRoute
                      exact
                      path="/wa/blacklist/:id"
                      component={BlacklistTable}
                    />
                    <Route component={NotFound} />
                  </Switch>
                </Sidebar.Pusher>
              </>
            )}
          />
        )
      )}
    </>
  );
});
