<% if (gsap && customEase) { %>
import { CustomEase } from '../plugins/CustomEase';

<% } %>
// Layout variables 📐
export const gutter = 20;
export const lineHeight = 25;

// Color varaibles 🎨
export const colors = {
    black: '#000',
    white: '#fff',
};

// Animation variables 🦄
export const easing = {
    easeIn: CustomEase.create(
        'custom',
        'M0,0,C0,0,0,0,1,1'
    ),
    easeOut: CustomEase.create(
        'custom',
        'M0,0,C0,0,0,0,1,1'
    ),
    easeInOut: CustomEase.create(
        'custom',
        'M0,0,C0,0,0,0,1,1'
    ),
};

export default { colors, easing, gutter, lineHeight };
