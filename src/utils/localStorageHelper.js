class Str {
  static s = localStorage
  static get = prop => {
    if (Str.s.getItem(prop)) {
      return JSON.parse(localStorage.getItem(prop))
    } else {
      return null
    }
  }

  static set = (prop, obj) => Str.s.setItem(prop, JSON.stringify(obj))
  static remove = prop => Str.s.removeItem(prop)
}

export default Str
