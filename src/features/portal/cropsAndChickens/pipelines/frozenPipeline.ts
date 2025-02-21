const fragShader = `
#define SHADER_NAME GRAYSCALE

precision mediump float;

uniform sampler2D uMainSampler[%count%];

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

const float EPSILON = 1e-10;

vec3 hueToRgb(in float hue)
{
    vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
    return clamp(rgb, 0., 1.);
}

vec3 rgbToHcv(in vec3 rgb)
{
    vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1., 2. / 3.) : vec4(rgb.gb, 0., -1. / 3.);
    vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
    float c = q.x - min(q.w, q.y);
    float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
    return vec3(h, c, q.x);
}

vec3 hslToRgb(in vec3 hsl)
{
    vec3 rgb = hueToRgb(hsl.x);
    float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
    return (rgb - 0.5) * c + hsl.z;
}

vec3 rgbToHsl(in vec3 rgb)
{
    vec3 hcv = rgbToHcv(rgb);
    float z = hcv.z - hcv.y * 0.5;
    float s = hcv.y / (1. - abs(z * 2. - 1.) + EPSILON);
    return vec3(hcv.x, s, z);
}

vec3 applyHue(vec3 grayscale, float desiredHue) {
    // convert grayscale to HSL
    vec3 hsl = rgbToHsl(grayscale);
    
    // Set the desired hue
    hsl.x = 0.6;

    // Set the desired saturation
    hsl.y = 0.6;

    // convert back to RGB
    return hslToRgb(hsl);
}

void main()
{
    vec4 texture;

    %forloop%

    // reduce contrast
    vec3 lowContrastTexture = mix(vec3(0.9), texture.rgb, 0.7);

    // convert back to RGB
    vec3 resultColor = applyHue(lowContrastTexture, 0.55);

    // apply changes only to opaque pixels
    if (texture.a < 1.0)
    {
        gl_FragColor = vec4(vec3(0.0), texture.a);
    }
    else
    {
        gl_FragColor = vec4(resultColor, texture.a);
    }
}
`;

export class FrozenPipeline extends Phaser.Renderer.WebGL.Pipelines
  .MultiPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }
}
