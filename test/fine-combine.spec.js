import { should } from 'chai';
should()

import fineCombine from '../lib/fineCombine.js';

describe('fineCombine()', function () {

  const initialState = {
    counter: 10,
  }

  // rc = reducer collection.
  // in the first three, key 2 is a duplicated, and does different things in each case.

  const rc1 = {
    key1: (state, action) => state,
    key2: (state, action) => ({ counter: state.counter + 1 }),
  }

  const rc2 = {
    key2: (state, action) => ({ counter: state.counter + 2 }),
    key3: (state, action) => state,
  }

  const rc3 = {
    key2: (state, action) => ({ counter: state.counter + 3 }),
    key4: (state, action) => ({ counter: state.counter + 4 }),
  }

  const rc4 = {
    key5: (state, action) => state,
    key6: (state, action) => state,
  }

  it('should return an empty object if no arguments supplied', function () {
    fineCombine().should.be.empty;
  })

  it('should return its argument unchanged if only one argument', function () {
    fineCombine(rc1).should.eql(rc1)
  })

  it('should return a simple merged object if no duplicates', function () {
    const expected = Object.assign({}, rc1, rc4)
    fineCombine(rc1, rc4).should.eql(expected)
  })

  it('should return an object without duplicate keys, if arguments have duplicates', function () {
    Object.keys(fineCombine(rc1, rc2, rc3)).length.should.equal(4)
    Object.keys(fineCombine(rc1, rc2, rc3)).should.eql(['key1', 'key2', 'key3', 'key4'])
  })

  it('should run duplicate reducers sequentially for 2,3 or several arguments', function () {
    fineCombine(rc1, rc2).key2(initialState).counter.should.equal(13)
    fineCombine(rc1, rc2, rc3).key2(initialState).counter.should.equal(16)
    fineCombine(rc1, rc1, rc1, rc1, rc1, rc1, rc1, rc1).key2(initialState).counter.should.equal(18)
  })

  it('should not alter functions that are not duplicates', function () {
    fineCombine(rc1, rc2, rc3).key1.should.equal(rc1.key1);
    fineCombine(rc1, rc2, rc3).key4(initialState).should.deep.equal({ counter: 14 });
  })

})
