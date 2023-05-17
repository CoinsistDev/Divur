import { makeAutoObservable, runInAction } from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { TwoFactor } from '../models/twoFactor';
import { store } from './store';

export default class UserStore {
    currentUser: User | null = null;
    isLoading: boolean = false;
    loadingDepartments: boolean = false;
    twoFactor: TwoFactor | undefined = undefined;
    refreshTokenTimeout: any;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.currentUser;
    }

    get isImplementor() {
        return this.currentUser!.roles.filter(r => 'Implementor').length > 0
    }

    isUserPermissioned = (departmentId: string) => {
        return this.currentUser!.departments.filter(d => d.id === departmentId).length > 0;
    }

    login = async (values: UserFormValues) => {
        try {
            this.isLoading = true;
            var twoFactorCode = await agent.AppUser.login2fa(values);
            runInAction(() => {
                if (twoFactorCode) {
                    this.twoFactor = {
                        email: twoFactorCode.email,
                        requestId: twoFactorCode.requestId
                    } as TwoFactor
                    history.push(`/wa/verify/${twoFactorCode.requestId}?email=${twoFactorCode.email}`);
                }
            })
            this.isLoading = false;

        }
        catch (err) {
            this.isLoading = false;
            throw err;
        }
    }
    resendOTP = async (email: string,requestId: string) => {
        try {
            this.isLoading = true;
            var twoFactorCode = await agent.AppUser.resendOTP(email, requestId);
            console.log(twoFactorCode);
            runInAction(() => {
                if (twoFactorCode) {
                    this.twoFactor = {
                        email: twoFactorCode.email,
                        requestId: twoFactorCode.requestId
                    } as TwoFactor
                    // this.currentUser = user;
                    history.push(`/wa/verify/${twoFactorCode.requestId}?email=${twoFactorCode.email}`);
                }
                // history.push(`distribution/${user.lastDepartmentVisited}`);
            })
            this.isLoading = false;

        }
        catch (err) {
            this.isLoading = false;
            throw err;
        }
    }
    register = async (values: UserFormValues, departmentId: string) => {
        try {
            this.isLoading = true;
            await agent.AppUser.register(values, departmentId);
            runInAction(() => {
                this.isLoading = false;
            })

        }
        catch (err) {

            runInAction(() => {
                this.isLoading = false;
            })
            throw err;
        }
    }
    resetPassword = async (token: string, email: string, password: string) => {
        try {
            this.isLoading = true;
            await agent.AppUser.resetPassword(token, email, password);
            history.push(`/wa/login`);

            this.isLoading = false;

        }
        catch (err) {
            this.isLoading = false;
            throw err;
        }
    }
    sendResetPasswordMail = async (email: string) => {
        try {
            this.isLoading = true;
            await agent.AppUser.sendResetPasswordMail(email);
            runInAction(() => {
                this.isLoading = false;

            })
        }
        catch (err) {
            runInAction(() => {
                this.isLoading = false;

            })
            throw err;
        }
    }
    verifyLogin = async (code: string, requestId: string) => {

        try {
            this.isLoading = true;
            this.twoFactor!.code = code;
            this.twoFactor!.requestId = requestId;
            var user = await agent.AppUser.verify2fa(this.twoFactor!);
            this.startRefreshTokenTimer(user);
            runInAction(() => {
                if (user) {
                    this.currentUser = user;
                }
                history.push(`/wa/distribution/${user.lastDepartmentVisited}`);
            })
            this.isLoading = false;

        }
        catch (err) {
            this.isLoading = false;
            throw err;
        }
    }
    logout = async () => {
        try {
            agent.AppUser.logout().then(() => {
                store.departmentStore.currentDepartment = undefined;
                store.departmentStore.departmentRegistry.clear();
                this.currentUser = null; history.push('/wa/login')
            });
        } catch (err) {
            console.log(err);
        }
    }
    getUser = async () => {
        try {
            var user = await agent.AppUser.currentUser();
            runInAction(() => {
                if (user) {
                    this.currentUser = user;
                }
            })
            this.startRefreshTokenTimer(user);

            return user;

        } catch (err) {

            runInAction(() => console.log(err));
        }
    }

    loadUserDepartments = async () => {

        this.loadingDepartments = true;
        try {
            var departments = await agent.AppUser.getDepartments();
            runInAction(() => {
                if (this.currentUser)
                    this.currentUser.departments = departments;
                this.loadingDepartments = false;
                // console.log(this.currentUser.departments)
            })
        }
        catch (err) {
            runInAction(() => {
                this.loadingDepartments = false;
            })
        }
    }
    loadCurrentUser = async () => {
        this.isLoading = true;
        try {
            var user = await agent.AppUser.currentUser();
            runInAction(() => {
                this.currentUser = user;
                this.isLoading = false;
                // console.log(this.currentUser.departments)
            })
        }
        catch (err) {
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    updateLastDepartment = async (id: string) => {
        this.isLoading = true;
        try {
            await agent.AppUser.updateLastDepartment(id);
            runInAction(() => {
                if (this.currentUser)
                    this.currentUser.lastDepartmentVisited = id;
            })
        }
        catch (err) {
            runInAction(() => {
                console.log(err)
            })
        }
    }
    toggleImplementor = async (email: string, departmentId: string) => {
        this.isLoading = true;
        try {
            await agent.AppUser.toggleImplementor(email);
            runInAction(() => {
                this.isLoading = false;
                var department = store.departmentStore.departmentRegistry.get(departmentId);
                if (department) {
                    var user = department?.users.filter(x => x.email === email);
                    if (user[0].roles.filter(x => x === "Implementor"))
                        user[0].roles = user[0].roles.filter(x => x !== "Implementor");
                    else
                        user[0].roles = [...user[0].roles, "Implementor"]


                }
                this.isLoading = false;
            })
        } catch (err) {
            console.log(err);
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimeout();
        try {
            const user = await agent.AppUser.refreshToken();
            runInAction(() => this.currentUser = user)
            this.startRefreshTokenTimer(user);

        } catch (err) {
            console.log(err);
        }
    }

    private startRefreshTokenTimer(user: User) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (30 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimeout() {
        clearTimeout(this.refreshTokenTimeout);
    }


}