const urlParams = new URLSearchParams(window.location.search)

export const DEBUG = process.env.NODE_ENV === 'production' && !urlParams.get('debug') ? false : true
export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight

export let IS_TOUCH = false
window.addEventListener('touchstart', () => (IS_TOUCH = true))

export const relativeMeasure = (percentage, measure) => (measure / 100) * percentage
export const relativeWidth = (percentage) => relativeMeasure(percentage, WIDTH)
export const relativeHeight = (percentage) => relativeMeasure(percentage, HEIGHT)
export const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
