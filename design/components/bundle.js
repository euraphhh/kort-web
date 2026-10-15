/* @ds-bundle: {"format":4,"namespace":"Kort","components":[{"name":"Logo"},{"name":"Button"},{"name":"StatusBadge"},{"name":"Counter"},{"name":"AppointmentRow"},{"name":"TextField"}]} */
(function () {
  var h = window.React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  /* Hand-drawn stroke icons, 16px, 1.8px stroke, round caps. */
  var ICONS = {
    plus: [h('path', { key: 1, d: 'M8 3v10M3 8h10' })],
    check: [h('path', { key: 1, d: 'M3.5 8.5l3 3L12.5 5' })],
    clock: [h('circle', { key: 1, cx: 8, cy: 8, r: 6 }), h('path', { key: 2, d: 'M8 5.2V8l2 1.3' })],
    x: [h('path', { key: 1, d: 'M4.5 4.5l7 7M11.5 4.5l-7 7' })],
    dot: [h('circle', { key: 1, cx: 8, cy: 8, r: 2.6, fill: 'currentColor', stroke: 'none' })],
    ban: [h('circle', { key: 1, cx: 8, cy: 8, r: 6 }), h('path', { key: 2, d: 'M3.8 12.2l8.4-8.4' })],
    trash: [h('path', { key: 1, d: 'M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5' })]
  };
  function Icon(props) {
    var shapes = ICONS[props.name];
    if (!shapes) return null;
    return h('svg', {
      className: 'kort-icon', viewBox: '0 0 16 16', 'aria-hidden': 'true',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round'
    }, shapes);
  }

  /* Logo: the kort wordmark (o as speech bubble, r joined to t) or the icon (the wordmark's "ko", enlarged and cropped by the square). */
  var logoSeq = 0;
  var BUBBLE = [
    h('path', { key: 'b1', d: 'M78.2 91.8A28 28 0 1 1 90 98.8' }),
    h('path', { key: 'b2', d: 'M78.2 91.8L76 106L90 98.8', strokeLinejoin: 'round' })
  ];
  var WORD = [
    h('path', { key: 'k1', d: 'M16 14V100' }),
    h('path', { key: 'k2', d: 'M16 78L50 46' }),
    h('path', { key: 'k3', d: 'M30 65L52 100' })
  ].concat(BUBBLE, [
    h('path', { key: 'rt', d: 'M150 100V72Q150 44 176 44H214' }),
    h('path', { key: 't', d: 'M196 16V82Q196 100 214 100' })
  ]);
  function Logo(props) {
    var variant = props.variant || 'wordmark';
    var idRef = window.React.useRef(null);
    if (!idRef.current) idRef.current = 'kort-logo-clip-' + (++logoSeq);
    if (variant === 'icon') {
      var s = props.size || 48;
      return h('svg', { className: cx('kort-logo', props.className), viewBox: '0 0 120 120', width: s, height: s, role: 'img', 'aria-label': 'kort' },
        h('defs', null, h('clipPath', { id: idRef.current }, h('rect', { width: 120, height: 120, rx: 28 }))),
        h('rect', { className: 'kort-logo__bg', width: 120, height: 120, rx: 28 }),
        h('g', { clipPath: 'url(#' + idRef.current + ')' },
          h('g', { className: 'kort-logo__mark', transform: 'translate(22 4)', fill: 'none', strokeWidth: 20, strokeLinecap: 'round', strokeLinejoin: 'round' }, WORD.slice(0, 5))));
    }
    var w = props.size || 120;
    return h('svg', { className: cx('kort-logo', props.className), viewBox: '0 0 230 120', width: w, height: Math.round(w * 120 / 230), role: 'img', 'aria-label': 'kort', style: props.color ? { color: props.color } : undefined },
      h('g', { fill: 'none', stroke: 'currentColor', strokeWidth: 14, strokeLinecap: 'round' }, WORD));
  }

  function Button(props) {
    var variant = props.variant || 'primary';
    var Tag = props.href ? 'a' : 'button';
    var rest = { className: cx('kort-btn', 'kort-btn--' + variant, props.block && 'kort-btn--block', props.className), onClick: props.onClick, disabled: props.disabled, 'aria-label': props['aria-label'] };
    if (Tag === 'a') rest.href = props.href; else rest.type = props.type || 'button';
    return h(Tag, rest, props.icon ? h(Icon, { name: props.icon }) : null, props.children);
  }

  var STATUS = {
    scheduled: { label: 'Agendado', icon: 'dot' },
    confirmed: { label: 'Confirmado', icon: 'check' },
    unconfirmed: { label: 'Não confirmado', icon: 'clock' },
    noshow: { label: 'Faltou', icon: 'x' },
    cancelled: { label: 'Cancelado', icon: 'ban' }
  };
  function StatusBadge(props) {
    var key = STATUS[props.status] ? props.status : 'scheduled';
    var s = STATUS[key];
    return h('span', { className: cx('kort-badge', 'kort-badge--' + key, props.className) }, h(Icon, { name: s.icon }), props.label || s.label);
  }

  function Counter(props) {
    return h('span', { className: cx('kort-counter', props.className) },
      h('span', { className: 'kort-counter__n' }, String(props.count)), props.label);
  }

  function AppointmentRow(props) {
    var status = props.status || 'scheduled';
    return h('div', { className: cx('kort-row', status === 'cancelled' && 'kort-row--cancelled', props.className), onClick: props.onClick },
      h('span', { className: 'kort-row__time' }, props.time),
      h('div', { style: { minWidth: 0 } },
        h('p', { className: 'kort-row__service' }, props.service),
        h('p', { className: 'kort-row__client' }, props.professional ? props.client + ' · com ' + props.professional : props.client)),
      h(StatusBadge, { status: status }));
  }

  var fieldSeq = 0;
  function TextField(props) {
    var idRef = window.React.useRef(null);
    if (!idRef.current) idRef.current = props.id || 'kort-field-' + (++fieldSeq);
    var id = idRef.current;
    var hint = props.error || props.hint;
    return h('div', { className: cx('kort-field', props.error && 'kort-field--error', props.className) },
      h('label', { className: 'kort-field__label', htmlFor: id }, props.label),
      h('input', {
        id: id, className: 'kort-field__input', type: props.type || 'text', inputMode: props.inputMode,
        placeholder: props.placeholder, value: props.value, defaultValue: props.defaultValue, onChange: props.onChange,
        'aria-invalid': props.error ? 'true' : undefined, 'aria-describedby': hint ? id + '-hint' : undefined
      }),
      hint ? h('span', { className: 'kort-field__hint', id: id + '-hint' }, hint) : null);
  }

  window.Kort = { Logo: Logo, Button: Button, StatusBadge: StatusBadge, Counter: Counter, AppointmentRow: AppointmentRow, TextField: TextField, Icon: Icon };
})();
