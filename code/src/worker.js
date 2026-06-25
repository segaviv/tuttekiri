
import createModule from './kirigami_cpp.js';

let module = null;

async function init() {
  module = await createModule();
  postMessage({ type: 'initialized' });
}

init();

onmessage = async (e) => {
  const { id, method, args } = e.data;

  if (!module) {
    postMessage({ id, error: 'Module not initialized' });
    return;
  }

  try {
    if (typeof module[method] === 'function') {
      const result = module[method](...args);
      postMessage({ id, result });
    } else {
      throw new Error(`Method ${method} not found`);
    }
  } catch (error) {
    postMessage({ id, error: error.toString() });
  }
};
