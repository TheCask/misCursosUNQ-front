
export function setInnerPropValue(baseObj, subPropString, value) {
    const subProps = subPropString.split(".");
    const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
    let propRef = baseObj
    subProps.forEach(subprop => {
      propRef = propRef[subprop];
    });
    propRef[lastPropName] = value;
}

// Retorna un entero aleatorio entre min (incluido) y max (excluido)
// ¡Usando Math.round() te dará una distribución no-uniforme!
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function onShowAlert(message, timeout, caller) {
  caller.setState({ showAlert: true, alertMessage: message }, () => {
    window.setTimeout( () => {
      caller.setState({ showAlert:false, alertMessage: '' })
    }, timeout)
  });
}