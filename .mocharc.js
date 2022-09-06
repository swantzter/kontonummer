module.exports = {
  recursive: true,
  slow: 70,
  timeout: 2000,
  forbidOnly: !!process.env.CI,
  forbidPending: !!process.env.CI,
  exit: true,
  extension: ['test.ts']
}
