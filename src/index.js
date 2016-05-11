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
