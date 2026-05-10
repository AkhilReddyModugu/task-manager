import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { MessageChannel } from 'worker_threads'

// react-router-dom v7 and antd Select require these browser APIs in jsdom
Object.assign(global, { TextEncoder, TextDecoder, MessageChannel })

// antd uses ResizeObserver internally
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// antd responsive utilities use matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// antd scrolls elements into view
window.scrollTo = jest.fn()
Element.prototype.scrollIntoView = jest.fn()

// Suppress known act() warnings that are false positives
const originalError = console.error.bind(console)
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    if (msg.includes('inside a test was not wrapped in act')) return
    if (msg.includes('Warning: An update to')) return
    originalError(...args)
  }
})
afterAll(() => {
  console.error = originalError
})
