// La clave es una mecánica del juego, no una medida de seguridad: el contenido
// de una web estática siempre puede consultarse desde el navegador.
const UNLOCK_CODE = '24680';
const HIDDEN_CODE = '13579';
const STORAGE_KEY = 'isxs-conductores-v3';
const PREVIOUS_STORAGE_KEY = 'isxs-conductores-v2';
const LEGACY_STORAGE_KEY = 'isxs-conductores-v1';
const HOLD_MS = 650;

const profiles = {
  1: { name: 'Astra Quell', ability: 'Impulso', detail: 'Cuando otro auto queda inmediatamente detrás de Astra, Impulso se activa de inmediato y Astra avanza 1 espacio. El vehículo que acaba de colocarse detrás de ella no puede aprovechar esa posición para hacer rebufo sobre Astra. Así le resulta más difícil seguirla de cerca.', bio: 'Astra es decidida y competitiva. Le incomoda quedarse atrapada detrás de otros vehículos y busca mantener el ritmo de la carrera. Cuando alguien intenta seguirla de cerca, responde acelerando y defendiendo el espacio que ha ganado.' },
  2: { name: 'Keilan Androx', ability: 'Soberbia', detail: 'Al finalizar cada ronda, comprueba la posición de Keilan. Si termina en el último lugar de la carrera, obtiene 1 punto de energía. Su posición durante el resto de la ronda no importa: el beneficio depende de cómo quede al cerrarla.', bio: 'Keilan mantiene la confianza incluso cuando la carrera va en su contra. Su actitud despreocupada puede hacer pensar que no le importa perder terreno, pero observa la pista y espera el momento para recuperarse.' },
  3: { name: 'Nova Sabriel', ability: 'Sobrecarga', detail: 'Nova puede descartar una mejora instalada en su auto o sacrificar 1 punto de escudo para recuperar 3 puntos de energía. La mejora o el escudo utilizado se pierde y la energía se obtiene de inmediato.', bio: 'Nova conduce con audacia y suele llevar su vehículo al límite. No se aferra a sus recursos: si necesita energía para seguir en carrera, está dispuesta a sacrificar una mejora o parte de su protección.' },
  4: { name: 'Kael Morrow', ability: 'Pared de hierro', detail: 'Kael no puede ser rebasado mediante rebufo ni utilizando la acera. Aunque otro conductor cumpla las condiciones habituales de uno de esos métodos, no puede usarlos para adelantar a Kael. Los demás métodos de adelantamiento siguen sus reglas normales.', bio: 'Kael tiene un estilo de conducción firme y paciente. Prefiere asegurar cada posición antes que lanzarse a maniobras innecesarias. En pista es un rival difícil de desplazar, incluso cuando los demás intentan presionarlo desde atrás.' },
  5: { name: 'Yumi Galatea', ability: 'Deslizarse', detail: 'Yumi puede gastar 2 puntos de energía para adelantar aunque no exista el espacio que normalmente se necesita para completar la maniobra. Paga la energía al utilizar Deslizarse y ejecuta el adelantamiento.', bio: 'Yumi destaca por su precisión al volante. Lee los movimientos de los demás vehículos y encuentra aberturas que otros conductores pasarían por alto. Su agilidad le permite abrirse camino en los momentos más congestionados.' },
  6: { name: 'Orion Drax', ability: 'Regeneración', detail: 'Orion puede gastar 3 puntos de energía para recuperar 1 punto de escudo de su vehículo. Convierte energía en resistencia para soportar mejor los daños de la carrera.', bio: 'Orion confía en su resistencia y en la capacidad de su auto para seguir funcionando. Puede soportar una carrera difícil sin perder la calma; su prioridad es llegar hasta el final, incluso después de recibir varios golpes.' },
  7: { name: 'Vero Geniusly', ability: 'Verotruco', detail: 'Vero puede gastar 2 puntos de energía para volverse intangible durante un turno. En ese turno puede adelantar aunque no tenga el espacio normalmente necesario. Si entra en contacto o choca con otro vehículo, no recibe el daño de esa colisión. La intangibilidad termina al finalizar el turno.', bio: 'Vero disfruta sorprender a los demás con maniobras poco convencionales. Es ingeniosa, impredecible y rara vez toma el camino más evidente. Su manera de conducir hace que sus rivales nunca sepan por dónde aparecerá.' },
  8: { name: 'Kitsune Tokyon', ability: 'Astucia', detail: 'Cuando Kitsune es detenido por la policía, no recibe el daño habitual de la detención. Si la policía lo alcanza, baja a primera marcha. En ese momento puede gastar 1 punto de energía para quedar en segunda marcha en lugar de primera.', bio: 'Kitsune conoce bien las persecuciones y mantiene la cabeza fría cuando aparece la policía. Le gusta conducir cerca del límite, pero siempre intenta dejarse una salida. Su astucia le permite reducir las consecuencias de una detención.' },
  9: { name: 'Chizue Rinyu', ability: 'Tanatosis', detail: 'Cuando Chizue va a ser detenido, puede gastar 2 puntos de energía y bajar a segunda marcha para evitar la detención. Si está siendo perseguido, también puede bajar a segunda marcha para que la policía abandone esa persecución y continúe tras el auto más cercano.', bio: 'Chizue es carismático y escurridizo. Cuando una persecución se acerca demasiado, prefiere despistar a sus rivales antes que enfrentarlos de frente. Sabe cuándo bajar el ritmo para desaparecer del foco de atención.' },
  10: { name: 'Kohei Hayato', ability: 'Dominio', detail: 'Kohei puede usar la habilidad especial de uno de los 2 conductores más cercanos a él. Si la habilidad tiene un costo de energía, paga ese costo más 1 punto adicional. Si es pasiva y normalmente no cuesta energía, paga 1 punto para activarla. Conserva las condiciones y efectos originales de la habilidad copiada. Cuando no esté claro quiénes son los más cercanos por un empate, Kohei puede elegir entre los empatados.', bio: 'Kohei presta atención a los conductores que tiene cerca. Aprende rápido de sus decisiones y adapta su forma de correr a cada situación. Su mayor ventaja es convertir lo que observa en una estrategia propia.' },
  11: { name: 'Salem Kihobyk', ability: 'Reflejos', detail: 'Salem puede gastar 1 punto de energía para evitar 1 punto de daño provocado por una colisión. Además, cuando golpea a otro auto, ese vehículo no recibe el punto de daño habitual del choque: en su lugar paga 1 punto de energía.', bio: 'Salem reacciona con rapidez cuando la pista se estrecha y los autos se acercan demasiado. No rehúye las maniobras arriesgadas, pues confía en sus reflejos para salir de los choques y encuentros inesperados.' },
  12: { name: 'Yuuky Claw', ability: 'Electrizante', detail: 'Cada vez que Yuuky sale de una zona de recarga, avanza 2 espacios adicionales. También obtiene ese avance si no recorrió por completo la zona antes de salir. Puede cambiar de carril para abandonarla y luego realizar los 2 espacios adicionales.', bio: 'Yuuky transmite energía tanto fuera como dentro de la pista. Siempre busca la manera de mantener el impulso de su auto. Para ella, una zona de recarga es también una oportunidad para salir con más velocidad.' },
  13: { name: 'Kumi Vesper', ability: 'Impacto lateral', detail: 'Kumi puede gastar 2 puntos de energía para golpear lateralmente a otro vehículo y ocupar su espacio. El auto golpeado se desplaza hacia un espacio lateral disponible. Si no hay espacio al que empujarlo, ambos vehículos reciben 1 punto de daño en su escudo. Esta habilidad no puede utilizarse si su resultado destruye directamente al vehículo objetivo.', bio: 'Kumi es pequeño, inquieto y mucho más agresivo de lo que parece. No espera a que los demás le cedan el paso: usa su vehículo para abrirse espacio y alterar la trayectoria de sus rivales.' },
  14: { name: 'Miuna Storm', ability: 'In crescendo', detail: 'Miuna recibe un bono de avance según su marcha actual: +1 en primera o segunda, +2 en tercera o cuarta y +3 en quinta o sexta. El bono correspondiente se aplica mientras conduce en ese rango de marchas.', bio: 'Miuna es una oficial de policía especializada en persecuciones a alta velocidad. Mantiene el control cuando aumenta la presión y sabe aprovechar cada cambio de marcha. Cuanto más acelera, más difícil resulta escapar de ella.' },
  15: { name: 'Maicy Silver', ability: 'MicroCarga', detail: 'Maicy puede utilizar 2 mejoras de su vehículo en el mismo turno. Para hacerlo gasta 1 punto de energía adicional, además de cualquier costo propio de las mejoras que active.', bio: 'Maicy entiende bien las modificaciones de su vehículo y disfruta experimentar con ellas. Planea cómo combinar sus recursos para lograr más en cada turno. Su estilo exige atención, energía y buen momento para actuar.' },
  16: { name: 'Worgen Odonel', ability: 'Osado', detail: 'Si Worgen recibe daño por pasarse del límite de una curva, avanza inmediatamente 2 casillas adicionales. El daño se aplica normalmente: Osado no lo evita ni lo reduce.', bio: 'Worgen tiene una forma de correr temeraria y disfruta poniendo a prueba sus límites. Incluso cuando una curva le cuesta parte de su escudo, busca convertir ese riesgo en más avance. Frenar rara vez es su primera opción.' },
  17: { name: 'Mei Natsuki', ability: 'Reparar', detail: 'Mei puede otorgar 2 puntos de energía a otro auto y, a cambio, recuperar 1 punto de escudo del suyo. El auto elegido recibe la energía y Mei repara su propio vehículo.', bio: 'Mei sabe de mecánica y valora la cooperación durante la carrera. Puede compartir energía con otro conductor mientras atiende las reparaciones de su propio auto. Su manera de competir deja espacio para ayudar sin descuidarse.' },
  18: { name: 'Eis Silver', ability: 'SuperCarga', detail: 'Mientras Eis esté en primera o segunda marcha, paga 1 punto de energía menos al activar una habilidad o una modificación de su vehículo. El descuento se aplica cada vez que activa uno de esos efectos en esas marchas.', bio: 'Eis administra con cuidado los recursos de su vehículo. Prefiere preparar una buena jugada antes de acelerar sin rumbo. Incluso en marchas bajas sabe aprovechar sus habilidades y modificaciones para mantener una ventaja.' }
};

// La ficha de cada conductor se asocia al nombre impreso en su archivo PJ.
const drivers = {
  ...profiles,
  10: profiles[11], // Salem
  11: profiles[12], // Yuuky
  12: profiles[13], // Kumi
  13: profiles[14], // Miuna
  14: profiles[15], // Maicy
  15: profiles[16], // Worgen
  16: profiles[17], // Mei
  17: profiles[10]  // Kohei
};

const colors = {
  1: '#ef8732', 2: '#32c6bf', 3: '#ed4bb0', 4: '#777f3d', 5: '#70ccef', 6: '#f2cd44',
  7: '#8b61d4', 8: '#d94849', 9: '#38cbdc', 10: '#a3d946', 11: '#eab447', 12: '#17191e',
  13: '#f0f3f5', 14: '#852b4a', 15: '#a0448f', 16: '#3aa99b', 17: '#e7653c', 18: '#315abd'
};
const lockedIds = new Set([7, 8, 9, 10, 11, 17, 18]);
const hiddenIds = [14, 15, 16];
const portrait = document.querySelector('#portrait');
const lock = document.querySelector('#lock');
const introHint = document.querySelector('#intro-hint');
const character = document.querySelector('#character');
const panel = document.querySelector('#panel');
const title = document.querySelector('#panel-title');
const eyebrow = document.querySelector('#panel-eyebrow');
const body = document.querySelector('#panel-body');
const actions = document.querySelector('#panel-actions');
const announcement = document.querySelector('#announcement');
let state = loadState();
let currentId = 0;
let holdTimer;
let held = false;
let pointerStart;

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const previous = localStorage.getItem(PREVIOUS_STORAGE_KEY);
    const saved = JSON.parse(current || previous || localStorage.getItem(LEGACY_STORAGE_KEY) || '{}');
    const oldToNew = { 10: 17, 11: 10, 12: 11 };
    const unlocked = Array.isArray(saved.unlocked) ? saved.unlocked.map(id => current ? id : (oldToNew[id] || id)).filter(id => lockedIds.has(id)) : [];
    return { unlocked: [...new Set(unlocked)], hidden: (current !== null || previous !== null) && saved.hidden === true };
  } catch { return { unlocked: [], hidden: false }; }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Sigue funcionando en esta sesión. */ }
}

function sequence() {
  return [0, ...Array.from({ length: 6 }, (_, i) => i + 1), 13,
    ...Array.from({ length: 6 }, (_, i) => i + 7), 17, 18,
    ...(state.hidden ? hiddenIds : [])];
}

function isLocked(id) { return lockedIds.has(id) && !state.unlocked.includes(id); }

function show(id) {
  currentId = id;
  portrait.src = `PJ${id}.png`;
  portrait.alt = id === 0 ? 'Ninguno' : drivers[id].name;
  lock.hidden = !isLocked(id);
  introHint.hidden = id !== 0;
  character.setAttribute('aria-label', id === 0
    ? 'Ninguno. Mantén pulsado para introducir la clave de personajes ocultos.'
    : isLocked(id)
      ? `${drivers[id].name}, bloqueado. Toca para saber cómo desbloquearlo.`
      : `${drivers[id].name}. Toca para ver su habilidad o mantén pulsado para conocer al conductor.`);
  announcement.textContent = id === 0 ? 'Ninguno' : `${drivers[id].name}${isLocked(id) ? ', bloqueado' : ''}`;
  // Carga la siguiente imagen sin alterar la pantalla actual.
  const list = sequence();
  const image = new Image();
  image.src = `PJ${list[(list.indexOf(id) + 1) % list.length]}.png`;
}

function move(direction) {
  const list = sequence();
  show(list[(list.indexOf(currentId) + direction + list.length) % list.length]);
}

function button(label, callback, primary = false) {
  const item = document.createElement('button');
  item.type = 'button';
  item.textContent = label;
  if (primary) item.className = 'primary';
  item.addEventListener('click', callback);
  actions.append(item);
}

function openPanel(label, heading, paragraphs) {
  panel.classList.remove('ability-panel', 'bio-panel', 'dark-bio');
  panel.style.removeProperty('--accent-rgb');
  panel.style.removeProperty('--ink');
  eyebrow.textContent = label;
  title.textContent = heading;
  body.replaceChildren();
  actions.replaceChildren();
  for (const text of paragraphs) {
    const p = document.createElement('p');
    p.textContent = text;
    body.append(p);
  }
  if (!panel.open) panel.showModal();
}

function info(type) {
  if (currentId === 0) return;
  if (isLocked(currentId)) { lockedPanel(); return; }
  const driver = drivers[currentId];
  openPanel(type === 'ability' ? `Habilidad especial · ${driver.name}` : 'Conductor',
    type === 'ability' ? driver.ability : driver.name,
    [type === 'ability' ? driver.detail : driver.bio]);
  const hex = colors[currentId];
  const rgb = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  panel.style.setProperty('--accent-rgb', rgb.join(', '));
  panel.style.setProperty('--ink', brightness > 150 ? '#141923' : '#ffffff');
  panel.classList.add(type === 'ability' ? 'ability-panel' : 'bio-panel');
  if (type === 'bio' && currentId === 12) panel.classList.add('dark-bio');
  button('Volver', () => panel.close(), true);
}

function lockedPanel() {
  const id = currentId;
  openPanel('Conductor bloqueado', drivers[id].name, ['Este conductor necesita una clave para desbloquearse.']);
  button('Cómo desbloquear', () => codePanel('driver', id), true);
  button('Volver', () => panel.close());
}

function codePanel(type, id) {
  const secret = type === 'hidden';
  openPanel(secret ? 'Acceso oculto' : 'Desbloquear conductor',
    secret ? 'Conductores ocultos' : drivers[id].name,
    [secret ? 'Introduce la clave para revelar a Maicy, Worgen y Mei.' : `Introduce la clave numérica para desbloquear a ${drivers[id].name}.`]);

  const label = document.createElement('label');
  label.className = 'code-label';
  label.htmlFor = 'code';
  label.textContent = 'Clave numérica';
  const input = document.createElement('input');
  input.id = 'code';
  input.className = 'code-input';
  input.type = 'password';
  input.inputMode = 'numeric';
  input.autocomplete = 'off';
  input.pattern = '[0-9]*';
  input.maxLength = 5;
  const error = document.createElement('p');
  error.className = 'error';
  error.setAttribute('role', 'alert');
  error.hidden = true;
  body.append(label, input, error);

  function submit() {
    if (input.value !== (secret ? HIDDEN_CODE : UNLOCK_CODE)) {
      error.textContent = 'Clave incorrecta. Inténtalo de nuevo.';
      error.hidden = false;
      input.select();
      return;
    }
    if (secret) { state.hidden = true; show(14); }
    else { state.unlocked = [...new Set([...state.unlocked, id])]; show(id); }
    saveState();
    panel.close();
  }
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); submit(); }
  });
  button(secret ? 'Revelar' : 'Desbloquear', submit, true);
  button('Volver', () => secret ? panel.close() : lockedPanel());
  input.focus();
}

function longPress() {
  if (currentId === 0) codePanel('hidden');
  else info('bio');
}

document.querySelector('#previous').addEventListener('click', () => move(-1));
document.querySelector('#next').addEventListener('click', () => move(1));
document.querySelector('#close').addEventListener('click', () => panel.close());
panel.addEventListener('click', event => { if (event.target === panel) panel.close(); });

character.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  clearTimeout(holdTimer);
  held = false;
  pointerStart = { x: event.clientX, y: event.clientY };
  holdTimer = setTimeout(() => { held = true; longPress(); }, HOLD_MS);
});
character.addEventListener('pointermove', event => {
  if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 14) clearTimeout(holdTimer);
});
for (const eventName of ['pointerup', 'pointercancel', 'pointerleave']) {
  character.addEventListener(eventName, () => { clearTimeout(holdTimer); pointerStart = null; });
}
character.addEventListener('click', event => {
  if (held) { event.preventDefault(); held = false; return; }
  if (event.detail === 0 && currentId === 0) { codePanel('hidden'); return; } // teclado
  info('ability');
});
character.addEventListener('contextmenu', event => event.preventDefault());
show(0);
