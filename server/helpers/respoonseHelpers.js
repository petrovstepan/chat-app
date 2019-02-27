const getErrorResponse = (errorText = 'Неизвестная ошибка') => ({
  status: 'FAIL',
  data: {
    text: errorText,
  },
})

const getSuccessResponse = (data = {}) => ({
  status: 'OK',
  data: data,
})

module.exports = {
  getErrorResponse,
  getSuccessResponse,
}
