/* global XMLHttpRequest */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  NavigatorIOS
} from 'react-native';
import { Provider } from 'react-redux';

import store from './store';
import * as session from './services/session';
import * as routeHistoryActions from './services/routeHistory/actions';
import Splash from './scenes/Splash';
import Main from './scenes/Main';
import Login from './scenes/Main/scenes/Login';
import Register from './scenes/Main/scenes/Register';
import Users from './scenes/Main/scenes/Users';

// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
  GLOBAL.originalXMLHttpRequest :
  GLOBAL.XMLHttpRequest;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
});

const routeStack = [
  { title: 'Main', component: Main },
  { title: 'Login', component: Login },
  { title: 'Register', component: Register },
  { title: 'Users', component: Users },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialRoute: null,
    };
  }

  componentDidMount() {
    // Waits for the redux store to be populated with the previously saved state,
    // then it will try to auto-login the user.
    const unsubscribe = store.subscribe(() => {
      if (store.getState().services.persist.isHydrated) {
        unsubscribe();
        this.autoLogin();
      }
    });
  }

  autoLogin() {
    session.refreshToken().then(() => {
      this.setState({ initialRoute: routeStack[3] });
    }).catch(() => {
      this.setState({ initialRoute: routeStack[0] });
    });
  }

  renderContent() {
    if (!this.state.initialRoute) {
      return <Splash />;
    }else

    {return (
          <Login />
        );}
  }

  render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          {this.renderContent()}
        </Provider>
      </View>
    );
  }
}

export default App;
