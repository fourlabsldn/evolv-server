// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
function assert(condition, errorMessage) {
  if (!condition) {
    let completeErrorMessage = '';

    if (assert.caller && assert.caller.name) {
      completeErrorMessage = `${assert.caller.name}: `;
    }

    completeErrorMessage += errorMessage;
    throw new Error(completeErrorMessage);
  }
}

export default assert;
