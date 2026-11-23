(() => {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.galaxy-stage');
  const canvas = document.querySelector('#galaxy-canvas');
  const fallback = document.querySelector('#galaxy-canvas-fallback');
  const viewButton = document.querySelector('#galaxy-view');
  const root = document.documentElement;
  const dialog = document.querySelector('#project-dialog');
  if (!hero || !stage || !canvas || !fallback || !viewButton) return;

  const vertex = `
    attribute vec4 aOrbit;
    attribute vec4 aColor;
    attribute vec2 aStyle;
    uniform float uTime, uAspect, uPitch, uYaw, uRoll, uPixel, uFocal, uPointLimit;
    varying mediump vec3 vColor;
    varying mediump float vAlpha, vKind, vSize;

    vec2 rotate(vec2 v, float a) {
      float c = cos(a), s = sin(a);
      return vec2(c*v.x-s*v.y, s*v.x+c*v.y);
    }

    void main() {
      float r = aOrbit.x;
      float kind = aStyle.x;
      float armRotation = uTime*.122 + sin(uTime*.31 + r*1.7)*.09;
      float satelliteRotation = uTime*aStyle.y;
      float angle = aOrbit.y + mix(armRotation, satelliteRotation, step(1.5, kind));
      vec3 p = vec3(cos(angle)*r, aOrbit.z, sin(angle)*r);
      p.xz = rotate(p.xz, uYaw);
      p.yz = rotate(p.yz, uPitch);
      p.xy = rotate(p.xy, uRoll);

      float depth = 6.4 - p.z;
      float perspective = 6.4 / depth;
      gl_Position = vec4(p.x*uFocal/uAspect, p.y*uFocal, 0.0, depth);
      float glitter = 0.91 + 0.09*sin(uTime*1.3 + aStyle.y*13.0 + r*8.0);
      gl_PointSize = clamp(aOrbit.w*uPixel*perspective, 1.0, uPointLimit);
      vSize = aOrbit.w;
      vColor = aColor.rgb;
      vKind = kind;
      vAlpha = aColor.a*glitter*smoothstep(.35,.82,perspective);
    }
  `;

  const fragment = `
    precision mediump float;
    varying mediump vec3 vColor;
    varying mediump float vAlpha, vKind, vSize;

    void main() {
      vec2 p = 2.0*gl_PointCoord-1.0;
      float d = dot(p,p);
      if (d > 1.0) discard;
      float edge = 1.0-smoothstep(.46,1.0,d);
      float halo = exp(-d*4.8);
      float nucleus = exp(-d*24.0);
      float ray = (exp(-abs(p.x)*34.0-abs(p.y)*4.5)
                 + exp(-abs(p.y)*34.0-abs(p.x)*4.5))*.30;
      float star = .59*halo + .41*nucleus;
      float flare = smoothstep(4.0,8.5,vSize)*(nucleus*.28+ray);
      float light = mix(star+flare, halo*.86, step(.5,vKind)*(1.0-step(1.5,vKind)));
      vec3 tint = mix(vColor, vec3(1.0,.98,.98), nucleus*step(4.0,vSize)*.23);
      gl_FragColor = vec4(tint, vAlpha*light*edge);
    }
  `;

  const palettes = [
    [1.00,.85,.67], [1.00,.49,.49], [.83,.42,.98], [.42,.52,1.00], [.22,.75,1.00],
  ];
  const views = [
    { pitch: .79, yaw: -.18, roll: -.42 },
    { pitch: 1.36, yaw: .49, roll: -.22 },
    { pitch: .38, yaw: -.56, roll: -.25 },
  ];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let graphics, frame = 0, lastTick = null, time = 0, inView = true;
  let rectWidth = 1, rectHeight = 1, pixelRatio = 1;
  let view = 0;
  let drag;
  const aim = { ...views[0] };
  const camera = { ...aim };

  function particles(compact, fallbackMode = false) {
    let state = 18617;
    const random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
    const scatter = () => (random() + random() + random() + random() - 2) * 1.61;
    const data = [];
    const fullCircle = Math.PI * 2;
    const colorAt = (radius, variation) => {
      const palette = clamp(radius * 1.37 + variation, 0, palettes.length - 1);
      const index = Math.floor(palette);
      const next = palettes[Math.min(index + 1, palettes.length - 1)];
      return palettes[index].map((v, i) => v + (next[i] - v) * (palette - index));
    };
    const add = (r, angle, height, size, color, alpha, kind, rate = random()) => {
      data.push(r, angle, height, size, ...color, alpha, kind, rate);
    };
    const spiral = (r, arm) => 2.00 * Math.log(r + .31) + Math.PI * arm + .19 * Math.sin(r * 2.1);
    const armParticle = (gas, i) => {
      const arm = i % 2;
      const radius = .15 + 3.2 * Math.pow(random(), gas ? 1.14 : .85);
      const knot = .45 + .55*Math.abs(Math.sin(radius*9.6 + arm*.96));
      const lane = (i % 9 === 0 ? .51 : 0) - .18;
      const angle = spiral(radius, arm) + scatter() * (.16+.10*knot) / (.53 + radius*.44) + lane;
      const height = scatter() * (.033 + radius * .038);
      const visibleTail = .35 + .65 * (1 - Math.pow(radius / 3.45, 2));
      const size = gas ? 17 + 78 * Math.pow(random(), 2.2) : .75 + 2.3 * Math.pow(random(), 3.8);
      const lum = gas ? (.014 + random()*.043) * knot : (.23+random()*.49);
      add(radius, angle, height, size, colorAt(radius, scatter()*.38 + (gas ? -.11 : 0)), lum * visibleTail, gas ? 1 : 0);
    };

    // Broad nebula sprites establish the two spiral arms and luminous bulge.
    const counts = fallbackMode ? [1450, 240, 6500, 1200] : compact ? [2300, 440, 17500, 3500] : [4400, 680, 38000, 6900];
    for (let i = 0; i < counts[0]; i++) armParticle(true, i);
    for (let i = 0; i < counts[1]; i++) {
      const radius = 1.0 * Math.pow(random(), 1.5);
      add(radius, fullCircle * random(), scatter()*.23*(1-radius), 20 + 84*random(),
        colorAt(radius*.45, random()*.26), (.031+.065*random()) * (1-radius*.68), 1);
    }
    // Small points keep the arms detailed as the camera changes angle.
    for (let i = 0; i < counts[2]; i++) armParticle(false, i);
    for (let i = 0; i < counts[3]; i++) {
      const radius = 3.55 * Math.pow(random(), .75);
      add(radius, fullCircle*random(), scatter()*(.09 + .055*radius), .74+random()*.85,
        colorAt(radius, scatter()*.65), .04+random()*.27*(1-radius/3.55), 0);
    }
    for (let i = 0; i < 165; i++) {
      const radius = .4 + 3.18*random();
      add(radius, spiral(radius, i % 2) + scatter()*.37, scatter()*.24, 4.5+random()*6.5,
        colorAt(radius, scatter()*.63), .34+random()*.45, 0);
    }
    // Orbit tracers sit in world space, so their ellipses foreshorten with the disc.
    const orbitColors = [[.51,.81,1.0],[.84,.60,1.0],[.99,.66,.69]];
    for (let orbit = 0; orbit < orbitColors.length; orbit++) {
      const radius = 2.26 + orbit*.399;
      const rate = [ .42, -.31, .23 ][orbit];
      const height = [ .25, -.36, .18 ][orbit];
      const phase = fullCircle * orbit / 3 + .6;
      for (let i = 0; i < 270; i++) {
        add(radius, i*fullCircle/270, height, 1.05, orbitColors[orbit], .25, 2, rate);
      }
      for (let i = 28; i >= 0; i--) {
        add(radius, phase - Math.sign(rate)*i*.012, height, i === 0 ? 10 : 3.1-i*.071,
          orbitColors[orbit], .85*(1-i/30), 2, rate);
      }
    }
    return new Float32Array(data);
  }

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(error);
    }
    return shader;
  }

  function openGraphics() {
    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power',
    });
    if (!gl) return;
    const program = gl.createProgram();
    const shaders = [compile(gl, gl.VERTEX_SHADER, vertex), compile(gl, gl.FRAGMENT_SHADER, fragment)];
    for (const shader of shaders) gl.attachShader(program, shader);
    gl.linkProgram(program);
    for (const shader of shaders) gl.deleteShader(shader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));

    const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    const points = particles(compact);
    const buffer = gl.createBuffer();
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    for (const [name, size, offset] of [['aOrbit',4,0], ['aColor',4,4], ['aStyle',2,8]]) {
      const position = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, size, gl.FLOAT, false, 40, offset*4);
    }
    const uniforms = {};
    for (const name of ['uTime','uAspect','uPitch','uYaw','uRoll','uPixel','uFocal','uPointLimit']) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.uniform1f(uniforms.uPointLimit, Math.min(170, gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1]));
    return { gl, uniforms, count: points.length / 10, compact, canvas };
  }

  function openCanvas() {
    const context = fallback.getContext('2d', { alpha: true });
    if (!context) return;
    const sprites = new Map();
    const values = particles(true, true);
    const points = [];
    for (let i = 0; i < values.length; i += 10) {
      const [r, angle, height, size, red, green, blue, alpha, kind, rate] = values.subarray(i, i+10);
      const levels = [red, green, blue].map(channel => Math.round(channel*9));
      const rgb = levels.map(channel => Math.round(channel*255/9)).join(',');
      let sprite;
      if (kind === 1 || size > 2.3) {
        if (!sprites.has(rgb)) {
          const texture = document.createElement('canvas');
          texture.width = texture.height = 42;
          const painter = texture.getContext('2d');
          const gradient = painter.createRadialGradient(21,21,0,21,21,21);
          gradient.addColorStop(0, 'rgba('+rgb+',1)');
          gradient.addColorStop(.31, 'rgba('+rgb+',.56)');
          gradient.addColorStop(.67, 'rgba('+rgb+',.14)');
          gradient.addColorStop(1, 'rgba('+rgb+',0)');
          painter.fillStyle = gradient;
          painter.fillRect(0,0,42,42);
          sprites.set(rgb, texture);
        }
        sprite = sprites.get(rgb);
      }
      points.push({ r, angle, height, size, rgb: 'rgb('+rgb+')', alpha, kind, rate, sprite });
    }
    return { context, points, compact: true, canvas: fallback };
  }

  function paintCanvas(pitch, roll) {
    const { context, points } = graphics;
    const halfWidth = rectWidth/2, halfHeight = rectHeight/2;
    const scale = Math.min(2.64, 2.48 * rectWidth / rectHeight)*halfHeight;
    const unit = rectHeight/675;
    const cp=Math.cos(pitch), sp=Math.sin(pitch), cr=Math.cos(roll), sr=Math.sin(roll);
    context.clearRect(0,0,rectWidth,rectHeight);
    context.globalCompositeOperation = 'lighter';
    for (const p of points) {
      const spin = p.kind === 2 ? time*p.rate : time*.122 + Math.sin(time*.31+p.r*1.7)*.09;
      const theta = p.angle + spin + camera.yaw;
      const x = Math.cos(theta)*p.r;
      const z = Math.sin(theta)*p.r;
      const y = cp*p.height - sp*z;
      const depth = 6.4 - sp*p.height - cp*z;
      const dx = (cr*x-sr*y)*scale/depth+halfWidth;
      const dy = halfHeight-(sr*x+cr*y)*scale/depth;
      const size = Math.max(1, p.size*unit*6.4/depth*(p.kind===1 ? 1.44 : 1));
      const radius = size*.5;
      if (dx+radius<0 || dx-radius>rectWidth || dy+radius<0 || dy-radius>rectHeight) continue;
      context.globalAlpha = Math.min(1, p.alpha * (p.kind === 1 ? 1.74 : .84));
      if (p.sprite) {
        context.drawImage(p.sprite, dx-radius, dy-radius, size, size);
      } else {
        context.fillStyle = p.rgb;
        context.fillRect(dx-radius, dy-radius, size, size);
      }
    }
    context.globalAlpha = 1;
  }

  function paint(moving) {
    if (!graphics) return;
    const pitch = camera.pitch + (moving ? .084*Math.sin(time*.37) : 0);
    const roll = camera.roll + (moving ? .043*Math.sin(time*.29) : 0);
    if (graphics.context) {
      paintCanvas(pitch, roll);
      return;
    }
    const { gl, uniforms, count } = graphics;
    const float = (name, value) => gl.uniform1f(uniforms[name], value);
    float('uTime', time);
    float('uAspect', rectWidth / rectHeight);
    float('uPitch', pitch);
    float('uYaw', camera.yaw);
    float('uRoll', roll);
    float('uPixel', pixelRatio * rectHeight / 675);
    float('uFocal', Math.min(2.66, 2.48 * rectWidth / rectHeight));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, count);
  }

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    rectWidth = Math.max(1, width);
    rectHeight = Math.max(1, height);
    if (!graphics) return;
    const cap = graphics.compact ? 960000 : 1450000;
    pixelRatio = Math.min(window.devicePixelRatio || 1, graphics.compact ? 1.24 : 1.55, Math.sqrt(cap / (rectWidth*rectHeight)));
    const surface = graphics.canvas;
    surface.width = Math.round(rectWidth*pixelRatio);
    surface.height = Math.round(rectHeight*pixelRatio);
    if (graphics.gl) graphics.gl.viewport(0, 0, surface.width, surface.height);
    else graphics.context.setTransform(surface.width/rectWidth,0,0,surface.height/rectHeight,0,0);
  }

  function canAnimate() {
    return graphics && inView && !document.hidden && !dialog?.open && root.dataset.motion === 'running';
  }

  function tick(now) {
    frame = 0;
    if (!canAnimate()) return;
    const interval = graphics.context ? 39 : graphics.compact ? 31 : 23;
    const span = lastTick === null ? interval : now-lastTick;
    if (span >= interval) {
      lastTick = now;
      const dt = Math.min(span/1000, .07);
      time += dt;
      const ease = 1 - Math.exp(-dt*5.5);
      for (const key of Object.keys(aim)) camera[key] += (aim[key]-camera[key])*ease;
      paint(true);
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (!canAnimate()) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTick = null;
    } else if (!frame) {
      frame = requestAnimationFrame(tick);
    }
  }

  function updateView() {
    if (!canAnimate()) {
      Object.assign(camera, aim);
      paint(false);
    }
    sync();
  }

  function changeView() {
    view = (view+1)%views.length;
    Object.assign(aim, views[view]);
    const labels = ['wide view', 'face-on view', 'low-angle view'];
    viewButton.setAttribute('aria-label', 'Change view, ' + labels[view]);
    updateView();
  }

  function begin(useFallback = false) {
    try {
      graphics = useFallback ? null : openGraphics();
    } catch {
      graphics = null;
    }
    if (!graphics) graphics = openCanvas();
    if (!graphics) {
      hero.classList.remove('has-galaxy');
      viewButton.hidden = true;
      sync();
      return;
    }
    stage.dataset.renderer = graphics.gl ? 'webgl' : 'canvas';
    resize();
    paint(false);
    hero.classList.add('has-galaxy');
    viewButton.hidden = false;
    sync();
  }

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    begin(true);
  });
  canvas.addEventListener('webglcontextrestored', () => begin());
  viewButton.addEventListener('click', changeView);
  stage.addEventListener('pointerdown', event => {
    if (event.target !== graphics?.canvas || event.button !== 0 || !event.isPrimary) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, pitch: aim.pitch, yaw: aim.yaw };
    event.target.setPointerCapture(event.pointerId);
    stage.classList.add('is-orbiting');
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    aim.yaw = drag.yaw + (event.clientX-drag.x)*.009;
    aim.pitch = clamp(drag.pitch + (event.clientY-drag.y)*.0068, .16, 1.45);
    updateView();
  });
  stage.addEventListener('lostpointercapture', () => {
    drag = null;
    stage.classList.remove('is-orbiting');
  });
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  if (dialog) new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(hero);
  new ResizeObserver(() => {
    resize();
    paint(canAnimate());
  }).observe(stage);
  begin();
})();
