export const sendTransaction = jest.fn();
export const Query = jest.fn().mockImplementation(() => ({
  execute: jest.fn()
})); 