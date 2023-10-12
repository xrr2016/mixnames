const mixnames = (...args: Array<any>): string => {
  const classes: Array<string> = []

  for (const arg of args) {
    if (!arg) continue;
    const argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const res = mixnames(...arg)

        if (res) {
          classes.push(res)
        }
      }
    } else if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        classes.push(arg.toString());
        continue;
      }

      Object.entries(arg).forEach((entry) => {
        const [key, value] = entry
        if (value) {
          classes.push(key)
        }
      })
    }
  }

  return classes.join(' ')
}

export default mixnames

