const darkModeFrag = `
#define SHADER_NAME DARK_MODE_SHADER

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform float isDarkMode;

vec3 exposure(vec3 color, float amount) {
    return color * amount;
}

vec3 saturation(vec3 color, float amount) {
    vec3 gray = vec3(dot(color, vec3(0.2126, 0.7152, 0.0722)));
    return mix(color, gray, 1.0 - amount);
}

vec3 contrast(vec3 color, float amount) {
    return mix(vec3(0.5), color, amount);
}

vec3 gamma(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}

void main() {
  vec4 texColor = texture2D(uMainSampler, outTexCoord);
  
  if (isDarkMode == 0.0) {
    gl_FragColor = texColor;
    return;
  }

  // set to 0.5 for debugging
  bool isRightHalf = outTexCoord.x >= 0.0;

  // Apply darkening and moonlight tint effect only to the right half
  if (isRightHalf) {
    // basic corrections
    vec3 nightColor = gamma(texColor.rgb, 0.7);
    nightColor = saturation(nightColor, 0.45);
    nightColor = exposure(nightColor, 2.5);
    nightColor = contrast(nightColor, 1.5);

    // apply a bluish tint for moonlight effect
    vec3 moonlightTint = vec3(0.25, 0.25, 0.6);
    nightColor *= moonlightTint;

    // brightness-based tinting
    float brightness = dot(nightColor, vec3(0.2126, 0.7152, 0.0722));
    vec3 yellowTint = vec3(1.0, 1.0, 0.2);
    vec3 blueTint = vec3(0.2, 0.2, 1.0);
    float tintStrength = 0.15;
    vec3 finalTint = mix(blueTint, yellowTint, brightness);
    nightColor = mix(nightColor, finalTint, tintStrength);

    // ensure color values are within valid range
    nightColor = clamp(nightColor, 0.0, 1.0);

    // output the final color with original alpha
    gl_FragColor = vec4(nightColor, texColor.a);
  } else {
    // output the original color for the left half
    gl_FragColor = texColor;
  }
}
`;

export class DarkModePipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  isDarkMode = false;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: darkModeFrag,
    });
  }

  onPreRender(): void {
    this.set1f("isDarkMode", this.isDarkMode ? 1.0 : 0.0);
  }
}
