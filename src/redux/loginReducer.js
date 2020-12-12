
export default function loginReducer (state=[], action) { // we want our initial state to not return undefined as redux will call at start, so we pass empty array
    switch (action.type) {

        case 'LOGGED IN':
          return [{
                logged: action.payload.logged
        }];
        

        default:
          return state
        }
}