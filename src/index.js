/**
 *
 * ███████╗██╗███╗   ██╗███████╗     ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗███╗   ██╗███████╗
 * ██╔════╝██║████╗  ██║██╔════╝    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║████╗  ██║██╔════╝
 * █████╗  ██║██╔██╗ ██║█████╗      ██║     ██║   ██║██╔████╔██║██████╔╝██║██╔██╗ ██║█████╗
 * ██╔══╝  ██║██║╚██╗██║██╔══╝      ██║     ██║   ██║██║╚██╔╝██║██╔══██╗██║██║╚██╗██║██╔══╝
 * ██║     ██║██║ ╚████║███████╗    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██████╔╝██║██║ ╚████║███████╗
 * ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
 *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 *
 * This function returns a single reducer collection, built from the reducer collections passed
 * in as arguments, and HANDLES DUPLICATE KEYS by creating new combined reducers for those keys.
 *
 * Reducers are typically organized into collections, where each key in the collection matches a
 * branch of the state tree. Sometimes, several such collections may be passed to redux' standard
 * combineReducers() function to build the single reducer function used in constructing the store
 * with createStore().
 *
 * e.g.
 * store = createStore(
 *    combineReducers({
 *        ...reducerCollection1,
 *        ...reducerCollection2,
 *        routing: routerReducer
 *        }), etc
 *
 * If there is a duplicate key in reducerCollection1 and reducerCollection2, then
 * reducerCollection2 will override the function from reducerCollection1.  fineCombine does not
 * replace combineReducers - it is used to preprocess reducer collections before they are
 * passed to combineReducers.
 *
 * There is no change to the individual reducer functions passed in EXCEPT in the case of
 * duplicate keys, a new function is returned under that key which chains together the
 * duplicate reducers.  Such functions are identifiable in the returned reducer collection,
 * because they have the function name fineCombinedReducer. All other functions will have their
 * original name (if they had one).
 *
 * The original use-case for this is combining some autoRedux and some custom reducers. For
 * example, in a "teams" collection, some actions may be very generic (OPEN_CREATE_TEAM_DIALOG)
 * hence created with autoRedux, while others such as the async fetching of reactive team lists
 * may require custom reducers. We still want all the state related to "team" to be in a single
 * branch of the state tree, so we need a fineCombine function that doesn't simply overwrite
 * conflicting branches when the reducers are combined.
 */

export default function fineCombine(...args) {
  const reducerCollections = args;

  // get all duplicate keys
  const duplicates = reducerCollections
    // get all the keys of all the reducer collections
    .reduce((memo, value) => {
      Object.keys(value).forEach(key => memo.push(key));
      return memo;
    }, [])
    // now find the duplicates among them by sorting and looking for matching pairs.
    .sort()
    .reduce((memo, key, index, array) => {
      if (index > 0 && key === array[index - 1]) {

        // if memo does not already contain key, add it
        if (memo.indexOf(key) === -1) memo.push(key);
      }
      return memo;
    }, []);

  // get an array of the relevant reducerCollections for each duplicate
  const relevantCollections = duplicates.reduce((previous, duplicate) => {
    const current = previous;

    reducerCollections.forEach(reducerCollection => {
      if (duplicate in reducerCollection) {
        current[duplicate] = current[duplicate] || [];
        current[duplicate].push(reducerCollection);
      }
    });
    return current;
  }, {});

  // build the combined reducer functions for each duplicate
  const combinedReducers = duplicates.reduce((previous, duplicateKey) => {
    const current = previous;

    current[duplicateKey] = function fineCombinedReducer(state, action) {
      let newState = state;

      relevantCollections[duplicateKey].forEach(relevantCollection => {
        newState = relevantCollection[duplicateKey](newState, action);
      });
      return newState;
    };

    return current;
  }, {});

  // push it onto reducerCollections (so it will override relevant keys in the next step)
  reducerCollections.push(combinedReducers);

  // build the combined return object
  return reducerCollections.reduce((memo, value) => Object.assign(memo, value), {});
}
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// =================================================================================================