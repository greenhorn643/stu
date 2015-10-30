import {getFullPath, unwire, flush} from 'unwire/dist/unwire';
import caller from 'unwire/dist/caller';
import sinon from 'sinon';

export function mockModule (module) {
  if (typeof module === 'function') {
    return sinon.stub();
  } else {
    return sinon.stub(module);
  }
}

export function cleanup (modules, context) {
  modules.forEach(module => flush(module, context));
}

export default function stu (fn) {
  const context = caller();

  const mocked = [];
  const required = [];

  const mock = function (module) {
    mocked.push(module);
    return unwire(module, context, mockModule);
  }

  const test = function (module) {
    required.push(module);
    const fullPath = getFullPath(module, context);
    return require(fullPath);
  }

  var result = fn(mock, test);

  // remove all required modules from cache
  cleanup(required, context);

  return cleanup.bind(null, mocked, context);
}
