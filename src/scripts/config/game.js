export const DESKTOP_SPEED = 180
export const SPEED_ADJUSTER = 3
export const BG_SPEED = 1.2
export const FONT_STYLE = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '24px',
  fill: '#fff',
}
export const ASSETS = process.env.NODE_ENV === 'production' ? {
    sky: 'https://drive.google.com/file/d/1ysol0CH4IrWrpGv3_TzSF-QQUaZRruq8/view?usp=sharing',
    ship: 'https://drive.google.com/file/d/1qYDhaS9fwSEki0tBmlBjyhS98yMsTdwC/view?usp=sharing',
    bullet: 'https://drive.google.com/file/d/13zwfe0k67wPXJVHkNNbQ3D6NbswjMo7g/view?usp=sharing',
    button: 'https://drive.google.com/file/d/1lF3mz7PyqFcTFIQrM9SoMfrKzTKUaK8G/view?usp=sharing'
} : {
    sky: './src/assets/img/bg.png',
    ship: './src/assets/img/ship.png',
    bullet: './src/assets/img/bullet.png',
    button: './src/assets/img/button.png'
}
