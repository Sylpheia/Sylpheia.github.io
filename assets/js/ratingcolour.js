// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return [h, s, l];
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  if(s === 0){
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p)*6*t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p)*(2/3 - t)*6;
      return p;
    };
    const q = l < 0.5 ? l*(1 + s) : l + s - l*s;
    const p = 2*l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [ Math.round(r*255), Math.round(g*255), Math.round(b*255) ];
}

function rgbToHex(rgb) {
  return '#' + rgb.map(x => x.toString(16).padStart(2,'0')).join('');
}

function interpolateHsl(hsl1, hsl2, factor) {
  // interpolate hue circularly
  let h1 = hsl1[0], h2 = hsl2[0];
  let dh = h2 - h1;
  if (dh > 0.5) dh -= 1;
  else if (dh < -0.5) dh += 1;
  let h = (h1 + factor * dh) % 1;
  if (h < 0) h += 1;
  // interpolate saturation and lightness linearly
  let s = hsl1[1] + factor * (hsl2[1] - hsl1[1]);
  let l = hsl1[2] + factor * (hsl2[2] - hsl1[2]);
  return [h, s, l];
}

function valueToColor(value) {
  // Define stops in RGB
  const darkBlue = [0, 0, 102];    // #000066
  const yellow = [255, 255, 0];    // #ffff00
  const magenta = [255, 0, 255];   // #ff00ff

  // Convert stops to HSL
  const hslDarkBlue = rgbToHsl(...darkBlue);
  const hslYellow = rgbToHsl(...yellow);
  const hslMagenta = rgbToHsl(...magenta);

  if (value <= 5) {
    const factor = value / 5;
    const hsl = interpolateHsl(hslDarkBlue, hslYellow, factor);
    return rgbToHex(hslToRgb(...hsl));
  } else if (value <= 10) {
    const factor = (value - 5) / 5;
    const hsl = interpolateHsl(hslYellow, hslMagenta, factor);
    return rgbToHex(hslToRgb(...hsl));
  } else {
    return rgbToHex(magenta);
  }
}

// Usage example:
const elems = document.getElementsByClassName('number');
for (let i = 0; i < elems.length; i++) {
  const value = parseFloat(elems[i].textContent);
  elems[i].style.color = valueToColor(value);
}

