function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
