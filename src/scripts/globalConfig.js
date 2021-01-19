export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight
export const SPEED_ADJUSTER = 3
export const BG_SPEED = 1.2

export const FONT_STYLE = { fontSize: '24px', fill: '#fff' }

export const relativeMeasure = (percentage, measure) => (measure / 100) * percentage

export const relativeWidth = percentage  => relativeMeasure(percentage, WIDTH)
export const relativeHeight = percentage  => relativeMeasure(percentage, HEIGHT)

export const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
