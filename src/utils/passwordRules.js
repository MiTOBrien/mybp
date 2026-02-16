export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/

export const isValidPassword = (password) => PASSWORD_REGEX.test(password)