export const generateOtp = (digits = 6) => {
  const handleDigits = 10 ** digits

  return Math.floor(Math.random() * handleDigits)
    .toString()
    .padStart(digits, '0')
}
