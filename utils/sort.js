function sortFromObject(obj, key) {
  let toKey;
  for (let x of obj) {
    if (x.title === key) {
      toKey = x.passwordOrg;
      break;
    }
  }
  return toKey;
}

module.exports = { sortFromObject };
