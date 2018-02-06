import {AsyncStorage} from 'react-native'
import {createStore, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools'
import {persistStore, persistCombineReducers} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'

import {reducer as dataReducer} from './data/reducer'
import {reducer as servicesReducer} from './services/reducer'
import * as persistActionCreators from './services/persist/actions'

const saveAndLoadSessionFilter = createFilter('services', ['session'], ['session'])

const appReducer = persistCombineReducers({key: 'primary', storage: AsyncStorage, blacklist: ['data'], transforms: [saveAndLoadSessionFilter]},
 {services: servicesReducer, data: dataReducer})

const enhancer = compose(applyMiddleware(thunk), devTools())

const store = createStore(appReducer, enhancer)

export const persist = persistStore(store, null, () => store.dispatch(persistActionCreators.update({isHydrated: true})))

export default store
