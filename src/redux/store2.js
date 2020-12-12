import loginReducer from './loginReducer';
import {createStore} from 'redux';


const store2 = createStore(loginReducer);

export default store2; 
