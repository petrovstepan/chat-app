const rules = {
  user: {
    id: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    photo: {
      required: true,
      type: String,
    },
  },
  notification: {
    text: {
      required: true,
      type: String,
    },
    friend: {
      required: true,
      type: Object,
      rules: {
        name: {
          required: true,
          type: String,
        },
        photo: {
          required: true,
          type: String,
        },
      },
    },
    chatId: {
      required: false,
      type: String,
    },
  },
}

const isObject = obj => obj instanceof Object && !(obj instanceof Array)

const checkRules = (obj, rules) => {
  let valid = true
  const keys = Object.keys(rules)
  const values = Object.keys(obj)

  keys.forEach(k => {
    if (rules[k].required) {
      valid = valid && values.includes(k)
    }
    if (!values.includes(k)) return

    const v = obj[k]
    const type = rules[k].type

    if (type === Object) {
      valid = valid && isObject(v) && checkRules(v, rules[k].rules) // рекурсивно проверяем объект
    } else {
      valid = valid && type(v) === v
    }
  })

  return valid
}

const ofObject = rules => (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  const kIsString = String(key) === key // возможно для этого надо создать правило и вынести, но пока оставлю
  const obj = propValue[key]
  const isObj = isObject(obj)

  if (!(kIsString && isObj && checkRules(obj, rules))) {
    return new Error(
      'Invalid prop `' +
        propFullName +
        '` supplied to' +
        ' `' +
        componentName +
        '`. Validation failed.'
    )
  }
}

export const userType = ofObject(rules.user)
export const notificationType = ofObject(rules.notification)
