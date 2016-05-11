# <img src='./logo/logo2.png' width = "200">

For use with [Redux](https://github.com/reactjs/redux).  

Allows different reducers for the same state branch to exist in more than one reducer collection.  
It takes multiple reducer collections as arguments, and returns a merged collection which is a 
simple aggregation EXCEPT that where a key is present in two or more of the arguments, 
the reducer functions for that key are combined.

The returned collection then becomes an argument of the standard Redux combineReducers() function.  
If combineReducers() is used without fineCombine, duplicate reducers in the different collections
simply overwrite one another.

The original target use-case is where some reducers are auto generated (e.g. to reduce boilerplate) 
while others relating to the same branch of the state tree need to be hand coded (e.g. complex async operations).

### Installation

To install and save to dependencies in package.json:

``` bash
npm install --save redux
```

## Usage

Typical usage:

```js
var fineCombine = require('fine-combine');

// assume that reducerCollection1 and reducerCollection2 have one or more keys in common
var fineCombinedReducers = fineCombine (reducerCollection1, reducerCollection2)

store = createStore(
  combineReducers({
    ...fineCombinedReducers,
    routing: routerReducer
  })
)    
```

## How it works

Reducers are typically organized into collections, where each key in the collection matches a
branch of the state tree. Sometimes, several such collections may be passed to redux' standard
combineReducers() function to build the single reducer function used in constructing the store
with createStore().

e.g.
store = createStore(
   combineReducers({
       ...reducerCollection1,
       ...reducerCollection2,
       routing: routerReducer
       }), etc

If there is a duplicate key in reducerCollection1 and reducerCollection2, then
reducerCollection2 will override the function from reducerCollection1.  fineCombine does not
replace combineReducers - it is used to preprocess reducer collections before they are
passed to combineReducers.

There is no change to the individual reducer functions passed in EXCEPT in the case of
duplicate keys, a new function is returned under that key which chains together the
duplicate reducers.  Such functions are identifiable in the returned reducer collection,
because they have the function name fineCombinedReducer. All other functions will have their
original name (if they had one).

The original use-case for this is combining some auto generated and some custom reducers. For
example, in a "teams" collection, some actions may be very generic (popping up an edit team form)
hence auto generated, while others such as the async fetching of reactive team lists
may require custom reducers. We still want all the state related to "team" to be in a single
branch of the state tree, so we need a fineCombine function that doesn't simply overwrite
conflicting branches when the reducers are combined.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

Copyright (c) 2016, Philip Carden. (MIT License)

See LICENSE for more info.





 */