// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as firebase from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, Auth, User, signInWithCredential, connectAuthEmulator } from "firebase/auth";
import { connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import * as firedatabase from "firebase/database";
import { signInAnonymously } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, Firestore } from "firebase/firestore";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/storage";
import { getStorage, ref, getDownloadURL, FirebaseStorage } from "firebase/storage";
import "firebase/database";
import "firebase/firestore";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWO_he76_Auz3VQvXhTPMWW_jamjjeBUU",
    authDomain: "playwatch-dev-test.firebaseapp.com",
    projectId: "playwatch-dev-test",
    storageBucket: "playwatch-dev-test.appspot.com",
    messagingSenderId: "669642880526",
    appId: "1:669642880526:web:46b7380fdbab2e997bee5f",
    measurementId: "G-K1RRJTDYQY"
};
export function initApp() {
    // initializeApp(firebaseConfig);
}


export default function useAuth() {
    const [isAuthSetup, setAuthSetup] = React.useState(false);
    const [signedIn, setSignedIn] = React.useState(false);

    function signIn() {
    }
    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        // initApp();
        setupFirebase();
        setAuthSetup(true);
    }, []);

    return { isAuthSetup, signedIn, signIn };
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export function debounce(func: any, wait: any, immediate?: any) {
    var timeout: any;
    return (a?: any, b?: any, c?: any) => {
        let args: any[] = [a, b, c];
        var later: any = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        var callNow: any = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Initialize Firebase

export function setupFirebase() {
    GoogleSignin.configure({
        webClientId:'669642880526-6pc3f03liasukvrnjfl24cu6th96e9d1.apps.googleusercontent.com'
    });
    app = firebase.initializeApp(firebaseConfig);
    auth = getAuth();
    db = getFirestore(app);
    database = firedatabase.getDatabase(app);
    storage = getStorage(app);
    let projectConfig = {
        masterEmail: "mephisto8335@gmail.com",
        agents:
            '{"Profile":{"dateOfBirth":"09/07/1981","gender":"Male","isCreator":false,"isKid":false,"isPlayer":true,"profileImage":null,"name":"","language":"","player":null,"profileStatus":null},"Player":{ "invited": false, "contactEmail":"mephisto8335@gmail.com","employeeNumber":1,"firstName":"Andrew","lastName":"Porter","middleName":"Jordan","phoneNumber":"+17633133783","profile":null,"address":null,"roles":[]}}',
        localEmulator: false,
        autoSave: false,
        localCode: "\\playwatch-code"
    };
    if (projectConfig.localEmulator) {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
        connectStorageEmulator(storage, "localhost", 9199);
        const functions = getFunctions(app);
        connectFunctionsEmulator(functions, "localhost", 5001);
    }
    authStateListener();
}
let app: firebase.FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let database: firedatabase.Database | undefined;
let storage: FirebaseStorage | undefined;

export function getApp() {
    return app;
}

export function getReqs(): { db: Firestore | undefined; app: firebase.FirebaseApp | undefined; auth: Auth | undefined } {
    return { db, app, auth }; //
}
export const PROVIDERS = {
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
    ANONYMOUS: "ANONYMOUS"
};
export function listenTo(path: any, callback: any) {
    try {
        if (database) {
            firedatabase.onValue(firedatabase.ref(database, path), (snapshot) => {
                callback(snapshot.val());
            });
        } else {
            throw "database not defined";
        }
    } catch (e) {
        console.error(e);
    }
}
export function postTo(path: any, data: any) {
    if (!database) {
        throw "no database";
    }
    try {
        setUndefinedPropertyToNull(data);
        if (database) {
            return firedatabase.update(firedatabase.ref(database), { [path]: data });
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}
export function ResolveUrl(uri: string) {
    let projectConfig = {
        masterEmail: "mephisto8335@gmail.com",
        agents:
            '{"Profile":{"dateOfBirth":"09/07/1981","gender":"Male","isCreator":false,"isKid":false,"isPlayer":true,"profileImage":null,"name":"","language":"","player":null,"profileStatus":null},"Player":{ "invited": false, "contactEmail":"mephisto8335@gmail.com","employeeNumber":1,"firstName":"Andrew","lastName":"Porter","middleName":"Jordan","phoneNumber":"+17633133783","profile":null,"address":null,"roles":[]}}',
        localEmulator: true,
        autoSave: false,
        localCode: "\\playwatch-code"
    };
    if (projectConfig.localEmulator) {
        return `http://localhost:5001/${firebaseConfig.projectId}/us-central1/app/api/${uri}`;
    } else if (location.host.indexOf("localhost") === -1) {
        return `https://playwatch-dev-test.web.app/api/${uri}`;
    }
    return uri;
}

export function ResolvePath(uri: string) {
    return uri;
}
function setUndefinedPropertyToNull(data: any) {
    Object.keys(data).forEach((i) => {
        if (data[i] === undefined) {
            data[i] = null;
        }
    });
}
export async function signOut() {
    if (!auth) {
        throw "no auth";
    }
    return auth
        .signOut()
        .then((e: any) => {
            console.log(e);
        })
        .catch((error: any) => {
            return error;
        });
}
let _lastState: any;
let _authStateChangedHandler: any;
export function setAuthStateChangedHandler(func: any) {
    _authStateChangedHandler = func;
    let temp = _lastState;
    _lastState = null;
    return temp;
}
let _authContextHandler: any = null;
export function setAuthStateContexHandler(func: any) {
    _authContextHandler = func;
}

export function setupCreateUpdateClocks(temp: any) {
    temp.created = convertServerTime(temp.created);
    if (temp.updated) temp.updated = convertServerTime(temp.updated);
}
function convertServerTime(obj: any) {
    return {
        seconds: obj.seconds,
        nanoseconds: obj.nanoseconds
    };
}
let state: { refreshToken: string, establish: any } = {
    refreshToken: '',
    establish: ''
};
const update_claims_context: any = {
    func: null
};

export async function UpdateClaims() {
    if (update_claims_context?.func) {
        await update_claims_context.func(true);
    }
}
function authStateListener() {
    if (!auth) {
        throw "no auth";
    }
    // [START auth_state_listener]
    auth.onAuthStateChanged(async (user) => {
        console.log(user);
        _lastState = user;
        if (user) {
            async function establishTokens(forceRefresh: boolean = false) {
                if (user) {
                    let token = await user.getIdToken(forceRefresh);
                    let claims = await user
                        .getIdTokenResult()
                        .then(async (idTokenResult: any) => {
                            // Confirm the user is an Admin.
                            if (!idTokenResult.claims?.user && auth?.currentUser) {
                                token = await auth.currentUser.getIdToken(true);
                                return await user.getIdTokenResult().then(async (idTokenResult: any) => {
                                    return idTokenResult.claims;
                                });
                            }
                            return idTokenResult.claims;
                        })
                        .catch((error: any) => {
                            console.log(error);
                        });
                    state.refreshToken = user.refreshToken;
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    var uid = user.uid;
                    if (_authStateChangedHandler) {
                        _authStateChangedHandler({
                            signedIn: true,
                            user,
                            claims,
                            token
                        });
                    }
                }
            }
            update_claims_context.func = establishTokens;
            await establishTokens();
            if (state.establish) {
                clearInterval(state.establish);
            }
            state.establish = setInterval(establishTokens, 10 * 60 * 1000);
            // ...
        } else {
            // User is signed out
            // ...
            if (_authStateChangedHandler) {
                _authStateChangedHandler({
                    signedIn: false,
                    user
                });
            }
        }
        if (_authContextHandler) {
            _authContextHandler(user);
        }
    });
    // [END auth_state_listener]
}
let url_cache: any = {};
let url_fetching: any = {};
export function GetCachedUrls(uri: any) {
    if (url_cache[uri]) {
        return url_cache[uri];
    }
    return false;
}
let url_resolved_handler: any = {};
export function SetupUrlResolutionHandler(handler: any, id: any) {
    url_resolved_handler[id] = debounce(handler, 1000);
}
export function RemoveUrlResolutionHandler(id: any) {
    delete url_resolved_handler[id];
}
export async function ResolveStorageUrl(uri: any) {
    if (!uri) {
        return false;
    }
    if (!storage) {
        throw "no storage";
    }
    let url = `gs://playwatch-dev-test.appspot.com/${uri}`;
    if (url_cache[uri]) {
        return url_cache[uri];
    }
    if (url_fetching[uri]) {
        return false;
    }
    url_fetching[uri] = true;
    return await getDownloadURL(ref(storage, uri))
        .then((url) => {
            url_fetching[uri] = false;
            url_cache[uri] = url;
            if (url_resolved_handler) {
                Object.values(url_resolved_handler).map((v: any) => v());
            }
            return url;
        })
        .catch((error) => {
            // Handle any errors
            url_fetching[uri] = false;
            console.log(error);
            return false;
        });
}

export async function signinWith(providerId: any) {
    let provider;
    switch (providerId) {
        case PROVIDERS.GOOGLE:
            provider = new GoogleAuthProvider();
            break;
        case PROVIDERS.FACEBOOK:
            provider = new FacebookAuthProvider();
            break;
        case PROVIDERS.ANONYMOUS:
            if (auth) {
                return signInAnonymously(auth)
                    .then((result) => {
                        // Signed in..
                        return result;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            break;
        default:
            throw "not supported provider : " + providerId;
    }
    if (auth && provider) {
        return signInWithPopup(auth, provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                console.log(result);
                return result;
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                console.log(`errorCode: ${errorCode}`)
                var errorMessage = error.message;
                console.log(`errorMessage: ${errorMessage}`)
                // The email of the user's account used.
                var email = error.email;
                console.log(`email: ${email}`)
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(error);
            });
    } else {
        throw "missing auth or provider";
    }
}
