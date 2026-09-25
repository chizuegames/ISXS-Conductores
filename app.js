// La clave es una mecánica del juego, no una medida de seguridad: el contenido
// de una web estática siempre puede consultarse desde el navegador.
const UNLOCK_CODE = '24680';
const HIDDEN_CODE = '13579';
const STORAGE_KEY = 'isxs-conductores-v1';
const HOLD_MS = 650;

const drivers = {
  1: { name: 'Astra Quell', ability: 'Impulso', detail: 'Cuando otro auto queda inmediatamente detrás de Astra, Impulso se activa de inmediato y Astra avanza 1 espacio. El vehículo que acaba de colocarse detrás de ella no puede aprovechar esa posición para hacer rebufo sobre Astra. Así le resulta más difícil seguirla de cerca.', bio: 'Una conductora decidida y competitiva que prefiere mantenerse siempre en movimiento. Busca aprovechar cualquier oportunidad para ganar terreno.' },
  2: { name: 'Keilan Androx', ability: 'Soberbia', detail: 'Al finalizar cada ronda, comprueba la posición de Keilan. Si termina en el último lugar de la carrera, obtiene 1 punto de energía. Su posición durante el resto de la ronda no importa: el beneficio depende de cómo quede al cerrarla.', bio: 'Seguro de sí mismo y despreocupado incluso cuando la carrera se complica. Confía en su capacidad para recuperarse.' },
  3: { name: 'Nova Sabriel', ability: 'Sobrecarga', detail: 'Nova puede descartar una mejora instalada en su auto o sacrificar 1 punto de escudo para recuperar 3 puntos de energía. La mejora o el escudo utilizado se pierde y la energía se obtiene de inmediato.', bio: 'Una corredora audaz que lleva su vehículo y sus recursos al límite. Está dispuesta a hacer sacrificios para seguir compitiendo.' },
  4: { name: 'Kael Morrow', ability: 'Pared de hierro', detail: 'Kael no puede ser rebasado mediante rebufo ni utilizando la acera. Aunque otro conductor cumpla las condiciones habituales de uno de esos métodos, no puede usarlos para adelantar a Kael. Los demás métodos de adelantamiento siguen sus reglas normales.', bio: 'Un conductor experimentado de estilo firme y resistente. Mantiene su posición incluso cuando otros corredores lo presionan.' },
  5: { name: 'Yumi Galatea', ability: 'Deslizarse', detail: 'Yumi puede gastar 2 puntos de energía para adelantar aunque no exista el espacio que normalmente se necesita para completar la maniobra. Paga la energía al utilizar Deslizarse y ejecuta el adelantamiento.', bio: 'Una conductora ágil, técnica y precisa. Encuentra espacios donde otros no los ven.' },
  6: { name: 'Orion Drax', ability: 'Regeneración', detail: 'Orion puede gastar 3 puntos de energía para recuperar 1 punto de escudo de su vehículo. Convierte energía en resistencia para soportar mejor los daños de la carrera.', bio: 'Fuerte, confiado y resistente. Apuesta por aguantar los tramos más duros y mantener su auto en marcha.' },
  7: { name: 'Vero Geniusly', ability: 'Verotruco', detail: 'Vero puede gastar 2 puntos de energía para volverse intangible durante un turno. En ese turno puede adelantar aunque no tenga el espacio normalmente necesario. Si entra en contacto o choca con otro vehículo, no recibe el daño de esa colisión. La intangibilidad termina al finalizar el turno.', bio: 'Ingeniosa e impredecible, disfruta de los trucos poco convencionales y de sorprender a sus rivales.' },
  8: { name: 'Kitsune Tokyon', ability: 'Astucia', detail: 'Cuando Kitsune es detenido por la policía, no recibe el daño habitual de la detención. Si la policía lo alcanza, baja a primera marcha. En ese momento puede gastar 1 punto de energía para quedar en segunda marcha en lugar de primera.', bio: 'Un corredor astuto que sabe salir de situaciones complicadas y conoce bien cómo dificultar el trabajo de la policía.' },
  9: { name: 'Chizue Rinyu', ability: 'Tanatosis', detail: 'Cuando Chizue va a ser detenido, puede gastar 2 puntos de energía y bajar a segunda marcha para evitar la detención. Si está siendo perseguido, también puede bajar a segunda marcha para que la policía abandone esa persecución y continúe tras el auto más cercano.', bio: 'Un piloto carismático y escurridizo. Prefiere despistar a sus perseguidores antes que enfrentarlos directamente.' },
  10: { name: 'Kohei Hayato', ability: 'Dominio', detail: 'Kohei puede usar la habilidad especial de uno de los 2 conductores más cercanos a él. Si la habilidad tiene un costo de energía, paga ese costo más 1 punto adicional. Si es pasiva y normalmente no cuesta energía, paga 1 punto para activarla. Conserva las condiciones y efectos originales de la habilidad copiada. Cuando no esté claro quiénes son los más cercanos por un empate, Kohei puede elegir entre los empatados.', bio: 'Un conductor observador y adaptable que aprende de quienes lo rodean y aprovecha sus estrategias.' },
  11: { name: 'Salem Kihobyk', ability: 'Reflejos', detail: 'Salem puede gastar 1 punto de energía para evitar 1 punto de daño provocado por una colisión. Además, cuando golpea a otro auto, ese vehículo no recibe el punto de daño habitual del choque: en su lugar paga 1 punto de energía.', bio: 'Un corredor de reflejos rápidos que reacciona con soltura en encuentros cercanos y maniobras arriesgadas.' },
  12: { name: 'Yuuky Claw', ability: 'Electrizante', detail: 'Cada vez que Yuuky sale de una zona de recarga, avanza 2 espacios adicionales. También obtiene ese avance si no recorrió por completo la zona antes de salir. Puede cambiar de carril para abandonarla y luego realizar los 2 espacios adicionales.', bio: 'Una corredora enérgica que busca mantener el impulso y aprovecha cada zona de recarga.' },
  13: { name: 'Kumi Vesper', ability: 'Impacto lateral', detail: 'Kumi puede gastar 2 puntos de energía para golpear lateralmente a otro vehículo y ocupar su espacio. El auto golpeado se desplaza hacia un espacio lateral disponible. Si no hay espacio al que empujarlo, ambos vehículos reciben 1 punto de daño en su escudo. Esta habilidad no puede utilizarse si su resultado destruye directamente al vehículo objetivo.', bio: 'Pequeño, inquieto y más agresivo de lo que aparenta. Utiliza su vehículo para abrirse camino.' },
  14: { name: 'Miuna Storm', ability: 'In crescendo', detail: 'Miuna recibe un bono de avance según su marcha actual: +1 en primera o segunda, +2 en tercera o cuarta y +3 en quinta o sexta. El bono correspondiente se aplica mientras conduce en ese rango de marchas.', bio: 'Oficial de policía especializada en persecuciones a alta velocidad. Cuanto más acelera, más difícil resulta escapar de ella.' },
  15: { name: 'Maicy Silver', ability: 'MicroCarga', detail: 'Maicy puede utilizar 2 mejoras de su vehículo en el mismo turno. Para hacerlo gasta 1 punto de energía adicional, además de cualquier costo propio de las mejoras que active.', bio: 'Una conductora técnica que disfruta combinando las modificaciones de su vehículo para hacer varias jugadas en poco tiempo.' },
  16: { name: 'Worgen Odonel', ability: 'Osado', detail: 'Si Worgen recibe daño por pasarse del límite de una curva, avanza inmediatamente 2 casillas adicionales. El daño se aplica normalmente: Osado no lo evita ni lo reduce.', bio: 'Un corredor temerario que se enfrenta a situaciones peligrosas y aprovecha el riesgo para seguir acelerando.' },
  17: { name: 'Mei Natsuki', ability: 'Reparar', detail: 'Mei puede otorgar 2 puntos de energía a otro auto y, a cambio, recuperar 1 punto de escudo del suyo. El auto elegido recibe la energía y Mei repara su propio vehículo.', bio: 'Una conductora cooperativa y hábil con la mecánica. Ayuda a otros pilotos mientras cuida su propio auto.' },
  18: { name: 'Eis Silver', ability: 'SuperCarga', detail: 'Mientras Eis esté en primera o segunda marcha, paga 1 punto de energía menos al activar una habilidad o una modificación de su vehículo. El descuento se aplica cada vez que activa uno de esos efectos en esas marchas.', bio: 'Un conductor experimentado que administra sus recursos con precisión y sabe sacar provecho de su vehículo a bajas velocidades.' }
};

const lockedIds = new Set([7, 8, 9, 10, 11, 12, 18]);
const hiddenIds = [14, 15, 16, 17];
const portrait = document.querySelector('#portrait');
const lock = document.querySelector('#lock');
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
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { unlocked: Array.isArray(saved.unlocked) ? saved.unlocked.filter(id => lockedIds.has(id)) : [], hidden: saved.hidden === true };
  } catch { return { unlocked: [], hidden: false }; }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Sigue funcionando en esta sesión. */ }
}

function sequence() {
  return [0, ...Array.from({ length: 13 }, (_, i) => i + 1), 18, ...(state.hidden ? hiddenIds : [])];
}

function isLocked(id) { return lockedIds.has(id) && !state.unlocked.includes(id); }

function show(id) {
  currentId = id;
  portrait.src = `PJ${id}.png`;
  portrait.alt = id === 0 ? 'Ninguno' : drivers[id].name;
  lock.hidden = !isLocked(id);
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
    [secret ? 'Introduce la clave para revelar a Miuna, Maicy, Worgen y Mei.' : `Introduce la clave numérica para desbloquear a ${drivers[id].name}.`]);

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
