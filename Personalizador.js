document.addEventListener('DOMContentLoaded', () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. REFERENCIAS GLOBALES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Nicks
  const nickInput = document.getElementById('nickInput');
  const nickPreview = document.getElementById('nickPreview');
  const bbcodeOutput = document.getElementById('bbcodeOutput');
  const btnCopy = document.getElementById('btnCopy');
  const fontGrid = document.getElementById('fontGrid');
  const symbolGrid = document.getElementById('symbolGrid');

  // Colores
  const colorInput = document.getElementById('colorInput');
  const colorPreview = document.getElementById('colorPreview');
  const colorOutput = document.getElementById('colorOutput');
  const btnCopyColor = document.getElementById('btnCopyColor');
  const colorSquares = document.getElementById('colorSquares');
  const addColorBtn = document.getElementById('addColorBtn');
  const effectBtns = document.querySelectorAll('.effect-btn');
  const speedControl = document.getElementById('speedControl');
  const speedControlRuby = document.getElementById('speedControlRuby');
  const animSpeed = document.getElementById('animSpeed');
  const rubySpeed = document.getElementById('rubySpeed');
  const savedGradients = document.getElementById('savedGradients');
  const saveGradientBtn = document.getElementById('saveGradientBtn');
  const glowColorInput = document.getElementById('glowColor');

  // Avatares
  const avatarUpload = document.getElementById('avatarUpload');
  const btnUpload = document.getElementById('btnUpload');
  const canvas = document.getElementById('avatarCanvas');
  const ctx = canvas.getContext('2d');
  const btnDownloadAvatar = document.getElementById('btnDownloadAvatar');
  const shapeBtns = document.querySelectorAll('.shape-btn');
  const filterBrightness = document.getElementById('filterBrightness');
  const filterContrast = document.getElementById('filterContrast');
  const filterSaturate = document.getElementById('filterSaturate');
  const filterGrayscale = document.getElementById('filterGrayscale');
  const posX = document.getElementById('posX');
  const posY = document.getElementById('posY');
  const imgZoom = document.getElementById('imgZoom');

  // Unificada
  const unifiedPreviewBox = document.getElementById('unifiedPreviewBox');
  const rootStyle = document.documentElement.style;

  // Variable global necesaria para evitar errores de inicialización temprana
  let currentEffect = 'namewave';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. LÓGICA DE PESTAÑAS (TABS)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. FUNCIONES DE SINCRONIZACIÓN UNIFICADA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function updateUnifiedText() {
    if (!unifiedPreviewBox) return;
    const finalText = (colorInput ? colorInput.value.trim() : '') || (nickInput ? nickInput.value.trim() : '') || 'Tu nick';
    
    const existingSpan = unifiedPreviewBox.querySelector('.unified-nick-display');
    if (existingSpan) {
      existingSpan.textContent = finalText;
    } else {
      unifiedPreviewBox.innerHTML = `<span class="unified-nick-display">${finalText}</span>`;
    }
    updateUnifiedColors();
  }

  function updateUnifiedColors() {
    if (!unifiedPreviewBox) return;
    const glow = glowColorInput.value;
    const colors = Array.from(document.querySelectorAll('#colorSquares .color-square')).map(sq => sq.value);
    const effect = document.querySelector('.effect-btn.active')?.dataset.effect || 'namegrad';
    const textEl = unifiedPreviewBox.querySelector('.unified-nick-display');

    rootStyle.setProperty('--unified-glow', glow);

    // Limpiar clases de animación primero
    textEl?.classList.remove('wave-anim', 'ruby-anim');

    if (effect === 'namecolor' || effect === 'solid') {
      rootStyle.setProperty('--unified-color', colors[1] || colors[0] || '#ffffff');
    } else if (effect === 'namewave' || effect === 'namegrad') {
      const seamless = [...colors, colors[0]];
      rootStyle.setProperty('--unified-gradient', `linear-gradient(135deg, ${seamless.join(', ')})`);
      rootStyle.setProperty('--unified-color', '#ffffff');
      // CORRECCIÓN: Agregar wave-anim para AMBOS efectos (namewave y namegrad)
      textEl?.classList.add('wave-anim');
    } else if (effect === 'ruby') {
      const c1 = colors[0] || '#FF0000';
      const c2 = colors[1] || '#000000';
      rootStyle.setProperty('--unified-ruby-gradient', `linear-gradient(45deg, ${c1}, ${c2}, ${c1}, ${c2})`);
      rootStyle.setProperty('--unified-color', '#ffffff');
      // CORRECCIÓN: Usar la misma velocidad que en Colores (11 - rubySpeed.value)
      const rubyDuration = 11 - (rubySpeed ? rubySpeed.value : 5);
      rootStyle.setProperty('--unified-ruby-speed', `${rubyDuration}s`);
      textEl?.classList.add('ruby-anim');
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. MÓDULO NICKS (UNICODE + LOCALSTORAGE)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  let currentStyle = localStorage.getItem('savedNickFont') || 'Normal';
  let selectedSymbols = JSON.parse(localStorage.getItem('savedNickSymbols')) || { left: '', right: '' };

  const unicodeStyles = {
    'Normal': Array.from('abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'),
    'Negrita': Array.from('𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧ñ𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍Ñ𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'),
    'Cursiva': Array.from('𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛ñ𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁Ñ𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789'),
    'Gótica': Array.from('𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫ñ𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑Ñ𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'),
    'Doble': Array.from('𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟ñ𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕÑ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'),
    'Monospace': Array.from('𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗ñ𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽Ñ𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),
    'Encerrada': Array.from('ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝñⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃÑⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ0①②③④⑤⑥⑦⑧⑨'),
    'Bold1': Array.from('𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧ñ𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍Ñ𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙0123456789'),
    'Italic': Array.from('𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯ñ𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕Ñ𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789'),
    'Medieval': Array.from('𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓ñ𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹Ñ𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789'),
    'Tetric': Array.from('₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦ñØ₱QⱤ₴₮ɄV₩ӾɎⱫ₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦ÑØ₱QⱤ₴₮ɄV₩ӾɎⱫ0123456789'),
    'Squares': Array.from('🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽ñ🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽Ñ🅾🅿🆀🆁🆂🆃🆄🅅🆆🆇🆈🆉0123456789'),
    'Romantica': Array.from('𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃ñ𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩Ñ𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789'),
    'Bold2': Array.from('𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻ñ𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡Ñ𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭0123456789'),
    'ModernaBold': Array.from('𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣ñ𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉Ñ𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789'),
    'BoldItalic2': Array.from('𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏ñ𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵Ñ𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁0123456789'),
    'RomanticaBold': Array.from('𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷ñ𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝Ñ𝓞𝓟𝓠𝑹𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789'),
    'CurlyFont': Array.from('αႦƈԃҽϝɠԋιʝƙʅɱɳñσρϙɾʂƚυʋɯxყȥΑႦƇƊԐϜƓԊΙĴƘʅⱮƝÑΣΡϘɌϚƬΥƲƜҲƳȤ0123456789'),
    'Gotica': Array.from('𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫ñ𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑Ñ𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'),
    'Cyrillic': Array.from('ДБCDΞFGHIJҜLMИñФPǪЯSΓЦVЩЖУZДБCDΞFGHIJҜLMИÑФPǪЯSΓЦVЩЖУZ0123456789'),
    'GreekAlt': Array.from('αв¢∂єƒgнιנкℓмηñσρqяѕтυνωχуzαв¢∂єƒgнιנкℓмηÑσρqяѕтυνωχуz0123456789'),
    'Russian': Array.from('абcдефгхиjклмнñопqрстувwxйзабcдефгхиjклмнÑопqрстувwxйз0123456789'),
    'Tiny': Array.from('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴñᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴÑᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ0123456789'),
    'SuperScript': Array.from('ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿñᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺÑᴼᴾᵠᴿˢᵀᵁⱽᵂˣʸᶻ0123456789'),
    'Bent': Array.from('ąҍçժҽƒցհìʝҟӀʍղñօքզɾʂէմѵա×ʏƹĄҌÇԺҼƑՑՀÌꞲҞӀʍՂÑՕՔԶɾꟅԷՄѴԱ×ʏƸ0123456789'),
    'Neon': Array.from('ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎñOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎÑOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ0123456789'),
      'Alien': Array.from('ᗩᗷᑢᕲᘿᖴᘜᕼᓰᒚᐸᒪᘻᘉᘉᓍᕵᕴᖇSᖶᑘᐺᘺ᙭ᖻᗱᗩᗷᑢᕲᘿᖴᘜᕼᓰᒚᐸᒪᘻᘉᘉᓍᕵᕴᖇSᖶᑘᐺᘺ᙭ᖻᗱ0123456789'),
    'Mirror': Array.from('ɒdɔbɘᎸǫʜiꞁʞ|ᴎᴎᴎoqpɿꙅƚuvwxʏƹABƆDƎFGHIJK⅃MNNOꝹꝹRꙄTUVWXYZ0123456789'),
    'Ancestral': Array.from('მჩƈძεբցհἶʝƙlოղñօրգɾʂէմνωჯყzᎯᏰᏨᎠᏋᎸᏩᎻᏐᎫᏦᏞᎷᏪᏁᎧᎵᎤᎡᎦᏖᏌᏤᏊᏯᎽᏃ0123456789'),
  };

  const symbolsList = [
    '★', '☆', '✦', '✧', '✪', '✫', '✬', '✭', '✻', '✼', '❇', '❈', '❉', '≛', '⋆',
    '❥', '❤', '♡', '۵', '♥', '❣', 'ღ', 'ლ', '❦', '❧', '☙', 'დ',
    '✿', '❀', '❃', '❁', '❋', '❊', '⚘', '☘', '✾', '✽', '✣', '✤',
    '✞', '✠', '✡', '☯', '☮', '☢', '☣', '☪', '✚', '✜', '✙', '⚜',
    '♔', '♕', '♠', '♣', '♥', '♦', '♢', '♤', '♧',
    '♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎',
    '⚔', '⚡', '☠', '⚓', '⚙', '❖',
    '《', '》', '⇜', '⇝', '◀', '▶',
    '▁', '▂', '▃', '▄', '▅', '▆', '▓'
  ];

  function stylizeText(text, styleName) {
    if (styleName === 'Normal') return text;
    const normalChars = unicodeStyles['Normal'];
    const targetChars = unicodeStyles[styleName];
    let result = '';
    for (let char of text) {
      const index = normalChars.indexOf(char);
      if (index !== -1 && targetChars[index] !== undefined) {
        result += targetChars[index];
      } else {
        result += char; 
      }
    }
    return result;
  }

  Object.keys(unicodeStyles).forEach(style => {
    const div = document.createElement('div');
    div.className = 'font-option' + (style === currentStyle ? ' selected' : '');
    const styledName = stylizeText(style, style);
    div.innerHTML = `
      <div style="font-size: 0.65rem; color: #666; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${style}</div>
      <div style="font-size: 1.05rem; color: #fff; text-align: center; line-height: 1.2; word-break: break-word;">${styledName}</div> 
    `;
    div.onclick = () => {
      document.querySelectorAll('.font-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      currentStyle = style;
      localStorage.setItem('savedNickFont', currentStyle);
      syncNickData();
    };
    fontGrid.appendChild(div);
  });

  symbolsList.forEach(sym => {
    const div = document.createElement('div');
    const isAlreadySelected = selectedSymbols.left.includes(sym) || selectedSymbols.right.includes(sym);
    div.className = 'symbol-option' + (isAlreadySelected ? ' selected' : '');
    div.textContent = sym;
    
    div.onclick = () => {
      if (div.classList.contains('selected')) {
        div.classList.remove('selected');
        selectedSymbols.left = selectedSymbols.left.split(sym).join('');
        selectedSymbols.right = selectedSymbols.right.split(sym).join('');
      } else {
        div.classList.add('selected');
        selectedSymbols.left += sym;
        selectedSymbols.right = sym + selectedSymbols.right;
      }
      localStorage.setItem('savedNickSymbols', JSON.stringify(selectedSymbols));
      syncNickData();
    };
    symbolGrid.appendChild(div);
  });

  function syncNickData() {
    const rawText = nickInput.value.trim() || 'Tu nick';
    const styledText = stylizeText(rawText, currentStyle);
    const decorated = `${selectedSymbols.left}${styledText}${selectedSymbols.right}`;
    
    nickPreview.textContent = decorated;
    bbcodeOutput.textContent = decorated;
    localStorage.setItem('savedNickText', rawText);
    
    colorInput.value = rawText;
    updateColorPreview(); 
    generateXatCode();
    updateUnifiedText(); // <-- Esto ahora sí se ejecutará sin crashear

    console.log("✅ SINCRONIZACIÓN EXITOSA. Texto enviado:", rawText);
  }

  nickInput.addEventListener('input', syncNickData);

  btnCopy.onclick = async () => {
    const text = bbcodeOutput.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btnCopy.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      btnCopy.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
    }
  };

  const savedNickText = localStorage.getItem('savedNickText');
  if (savedNickText) {
    nickInput.value = savedNickText;
  }
  syncNickData();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. MÓDULO COLORES (BLINDADO CONTRA ERRORES)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  function saveColorState() {
    try {
      localStorage.setItem('savedColorEffect', currentEffect);
      localStorage.setItem('savedColorGlow', glowColorInput.value);
      localStorage.setItem('savedEffectColors', JSON.stringify(effectColors));
    } catch (e) { console.warn("Error guardando colores", e); }
  }

  function loadColorState() {
    try {
      const savedEffect = localStorage.getItem('savedColorEffect');
      const savedGlow = localStorage.getItem('savedColorGlow');
      const savedColors = localStorage.getItem('savedEffectColors');

      // Validar que el efecto guardado sea válido, si no, resetear a 'namewave'
      if (savedEffect && defaultPalettes[savedEffect]) {
        currentEffect = savedEffect;
      } else {
        currentEffect = 'namewave';
        localStorage.removeItem('savedColorEffect'); // Limpia dato corrupto
      }

      if (savedGlow) {
        glowColorInput.value = savedGlow;
        const hexSpan = glowColorInput.parentElement.querySelector('.color-hex');
        if (hexSpan) hexSpan.textContent = savedGlow;
      }

      if (savedColors) {
        const parsed = JSON.parse(savedColors);
        for (let key in parsed) {
          // Validar que sea un array real antes de asignarlo
          if (effectColors.hasOwnProperty(key) && Array.isArray(parsed[key])) {
            effectColors[key] = parsed[key];
          }
        }
      }
    } catch (e) {
      console.warn("Datos de color corruptos, reseteando...", e);
      localStorage.removeItem('savedColorEffect');
      localStorage.removeItem('savedColorGlow');
      localStorage.removeItem('savedEffectColors');
      currentEffect = 'namewave';
    }
  }

  let editingGradientId = null;

  const defaultPalettes = {
    namewave: ['#FF0000', '#00FF00', '#0000FF'],
    namegrad: ['#FF0000', '#00FF00', '#0000FF'],
    ruby: ['#FF0000', '#000000'],
    solid: ['#FFFFFF'],
    nameglow: ['#FFFFFF'],
    namecolor: ['#FFFFFF']
  };

  const effectColors = {
    namewave: ['#FF0000', '#00FF00', '#0000FF'],
    namegrad: ['#FF0000', '#00FF00', '#0000FF'],
    ruby: ['#FF0000', '#000000'],
    solid: ['#FFFFFF'],
    nameglow: ['#FFFFFF'],
    namecolor: ['#FFFFFF']
  };

  function getCurrentColors() {
    const squares = colorSquares.querySelectorAll('.color-square');
    return Array.from(squares).map(sq => sq.value.toUpperCase());
  }

  function createColorSquare(color) {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-square-wrapper';
    wrapper.innerHTML = `
      <input type="color" class="color-square" value="${color}" />
      <button class="remove-color-btn" title="Eliminar color">×</button>
    `;
    const square = wrapper.querySelector('.color-square');
    const removeBtn = wrapper.querySelector('.remove-color-btn');
    
    square.addEventListener('input', () => {
      effectColors[currentEffect] = getCurrentColors();
      updateColorPreview();
      generateXatCode();
      updateUnifiedText();
    });
    
    removeBtn.addEventListener('click', () => {
      if (colorSquares.querySelectorAll('.color-square-wrapper').length > 1) {
        wrapper.remove();
        effectColors[currentEffect] = getCurrentColors();
        updateColorPreview();
        generateXatCode();
        updateUnifiedText();
      }
    });
    return wrapper;
  }

  function setBaseColorsForEffect(effect) {
    // BLINDAJE: Si el efecto no tiene colores, usa los por defecto, o blanco como último recurso
    const targetColors = (effectColors[effect] && effectColors[effect].length > 0) 
      ? effectColors[effect] 
      : (defaultPalettes[effect] || ['#FFFFFF']);
    
    const existing = colorSquares.querySelectorAll('.color-square-wrapper');
    existing.forEach(sq => sq.remove());
    
    targetColors.forEach(color => {
      const wrapper = createColorSquare(color);
      colorSquares.insertBefore(wrapper, addColorBtn);
    });
  }

  function updateColorPreview() {
    const text = colorInput.value.trim() || 'Tu nick';
    const colors = getCurrentColors();
    const glow = glowColorInput.value;
    colorPreview.textContent = text;

    if (currentEffect === 'ruby') {
      const c1 = colors[0] || '#FF0000';
      const c2 = colors[1] || '#000000';
      colorPreview.style.background = `linear-gradient(45deg, ${c1}, ${c2}, ${c1}, ${c2})`;
      colorPreview.style.webkitBackgroundClip = 'text';
      colorPreview.style.backgroundClip = 'text';
      colorPreview.style.webkitTextFillColor = 'transparent';
      colorPreview.style.backgroundSize = '300% 300%';
      colorPreview.style.backgroundRepeat = 'repeat';
      colorPreview.style.animation = `blenderMix ${11 - rubySpeed.value}s ease-in-out infinite`;
    } else if (currentEffect === 'namecolor') {
      const textColor = colors[1] || colors[0] || '#FFFFFF';
      colorPreview.style.background = 'none';
      colorPreview.style.webkitTextFillColor = textColor;
      colorPreview.style.color = textColor;
      colorPreview.style.animation = 'none';
    } else if (['solid', 'nameglow'].includes(currentEffect)) {
      const displayColor = colors[0] || '#FFFFFF';
      colorPreview.style.background = 'none';
      colorPreview.style.webkitTextFillColor = displayColor;
      colorPreview.style.color = displayColor;
      colorPreview.style.animation = 'none';
    } else {
      const seamless = [...colors, colors[0] || '#FFFFFF'];
      colorPreview.style.background = `linear-gradient(135deg, ${seamless.join(', ')})`;
      colorPreview.style.webkitBackgroundClip = 'text';
      colorPreview.style.backgroundClip = 'text';
      colorPreview.style.webkitTextFillColor = 'transparent';
      colorPreview.style.backgroundSize = '200% 100%'; 
      colorPreview.style.backgroundRepeat = 'repeat-x';
      if (currentEffect === 'namewave') {
        colorPreview.style.animation = `gradientShift ${11 - animSpeed.value}s linear infinite`;
      } else {
        colorPreview.style.animation = 'none';
      }
    }
    colorPreview.style.filter = `drop-shadow(0 0 8px ${glow})`;
    
    saveColorState();
  }

  glowColorInput.addEventListener('input', () => {
    glowColorInput.parentElement.querySelector('.color-hex').textContent = glowColorInput.value;
    effectColors[currentEffect] = getCurrentColors();
    updateColorPreview();
    generateXatCode();
    updateUnifiedText();
  });

  function generateXatCode() {
    const colors = getCurrentColors().map(c => c.replace('#', ''));
    const glow = glowColorInput.value.replace('#', '').toUpperCase();
    let code = '';

    switch(currentEffect) {
      case 'namewave':
      case 'namegrad':
        code = `(glow#${glow}#grad#${colors.join('#')}#r45)`;
        break;
      case 'ruby':
        code = `(glow#${glow}#jewel#${colors[0] || 'FF0000'}##${colors[1] || '000000'}#r145)`;
        break;
      case 'nameglow':
      case 'solid':
        code = `(glow#${glow}#${colors[0] || 'FFFFFF'})`;
        break;
      case 'namecolor':
        code = `(glow#${glow}#${colors[1] || colors[0] || 'FFFFFF'})`;
        break;
    }
    colorOutput.textContent = code;
  }

  addColorBtn.onclick = () => {
    const wrapper = createColorSquare('#ffffff');
    colorSquares.insertBefore(wrapper, addColorBtn);
    effectColors[currentEffect] = getCurrentColors();
    updateColorPreview();
    generateXatCode();
    updateUnifiedText();
  };

  effectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      effectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      effectColors[currentEffect] = getCurrentColors();
      currentEffect = btn.dataset.effect;
      setBaseColorsForEffect(currentEffect);
      speedControl.classList.toggle('active', currentEffect === 'namewave');
      speedControlRuby.classList.toggle('active', currentEffect === 'ruby');
      updateColorPreview();
      generateXatCode();
      updateUnifiedText();
    });
  });

  colorInput.addEventListener('input', () => {
    updateColorPreview();
    generateXatCode();
    updateUnifiedText();
  });

  animSpeed.addEventListener('input', () => {
    updateColorPreview();
    updateUnifiedText();
  });
  
  rubySpeed.addEventListener('input', () => {
    updateColorPreview();
    updateUnifiedText();
  });

  const allPresets = document.querySelectorAll('.color-preset, .solid-color-btn');
  allPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      allPresets.forEach(p => p.classList.remove('active'));
      preset.classList.add('active');

      const colors = (preset.dataset.colors || '#FFFFFF').split(',');
      let targetEffect = preset.dataset.effect || 'namewave';
      const glow = preset.dataset.glow || '#000000';

      currentEffect = targetEffect;
      effectBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.effect === targetEffect) btn.classList.add('active');
      });

      speedControl.classList.toggle('active', targetEffect === 'namewave');
      speedControlRuby.classList.toggle('active', targetEffect === 'ruby');

      const existingSquares = colorSquares.querySelectorAll('.color-square-wrapper');
      existingSquares.forEach(sq => sq.remove());

      colors.forEach((color) => {
        const cleanColor = color.startsWith('#') ? color : `#${color}`;
        const wrapper = createColorSquare(cleanColor);
        colorSquares.insertBefore(wrapper, addColorBtn);
      });

      glowColorInput.value = glow;
      glowColorInput.parentElement.querySelector('.color-hex').textContent = glow;
      effectColors[targetEffect] = getCurrentColors();
      updateColorPreview();
      generateXatCode();
      updateUnifiedText();
    });
  });

  saveGradientBtn.onclick = () => {
    const colors = getCurrentColors();
    const glow = glowColorInput.value;
    const savedList = JSON.parse(localStorage.getItem('savedGradients') || '[]');

    if (editingGradientId !== null) {
      const index = savedList.findIndex(item => String(item.id) === String(editingGradientId));
      if (index !== -1) {
        savedList[index].colors = colors;
        savedList[index].effect = currentEffect;
        savedList[index].glow = glow;
      }
      editingGradientId = null;
      saveGradientBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
      saveGradientBtn.title = 'Guardar degradado actual';
    } else {
      savedList.push({ id: Date.now(), colors: colors, effect: currentEffect, glow: glow });
    }
    localStorage.setItem('savedGradients', JSON.stringify(savedList));
    renderSavedGradients();
  };

  function renderSavedGradients() {
    const savedList = JSON.parse(localStorage.getItem('savedGradients') || '[]');
    if (savedList.length === 0) {
      savedGradients.innerHTML = '<p class="no-saved">Sin degradados guardados</p>';
      return;
    }
    savedGradients.innerHTML = '';
    
    savedList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'saved-gradient-item';
      const gradient = `linear-gradient(90deg, ${item.colors.join(', ')})`;
      div.innerHTML = `
        <div class="saved-gradient-preview" style="background: ${gradient};" data-id="${item.id}" data-colors='${JSON.stringify(item.colors)}' data-effect="${item.effect}" data-glow="${item.glow || '#000000'}"></div>
        <button class="saved-gradient-edit" data-id="${item.id}" title="Editar degradado"><i class="fa-solid fa-pen"></i></button>
        <button class="saved-gradient-delete" data-id="${item.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      `;
      savedGradients.appendChild(div);
    });
    
    savedGradients.querySelectorAll('.saved-gradient-preview').forEach(preview => {
      preview.addEventListener('click', () => {
        const id = preview.dataset.id;
        const item = savedList.find(i => String(i.id) === String(id));
        if (!item) return;

        effectColors[currentEffect] = getCurrentColors();
        effectColors[item.effect] = item.colors.map(c => c.startsWith('#') ? c : `#${c}`);
        
        effectBtns.forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.effect === item.effect) btn.classList.add('active');
        });
        currentEffect = item.effect;
        setBaseColorsForEffect(currentEffect);
        
        glowColorInput.value = item.glow || '#000000';
        glowColorInput.parentElement.querySelector('.color-hex').textContent = glowColorInput.value;
        speedControl.classList.toggle('active', currentEffect === 'namewave');
        speedControlRuby.classList.toggle('active', currentEffect === 'ruby');
        updateColorPreview();
        generateXatCode();
        updateUnifiedText();
      });
    });

    savedGradients.querySelectorAll('.saved-gradient-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = savedList.find(i => String(i.id) === String(id));
        if (!item) return;

        effectColors[item.effect] = item.colors.map(c => c.startsWith('#') ? c : `#${c}`);
        effectBtns.forEach(b => {
          b.classList.remove('active');
          if (b.dataset.effect === item.effect) b.classList.add('active');
        });
        currentEffect = item.effect;
        setBaseColorsForEffect(currentEffect);
        
        glowColorInput.value = item.glow || '#000000';
        glowColorInput.parentElement.querySelector('.color-hex').textContent = glowColorInput.value;
        speedControl.classList.toggle('active', currentEffect === 'namewave');
        speedControlRuby.classList.toggle('active', currentEffect === 'ruby');
        updateColorPreview();
        generateXatCode();
        updateUnifiedText();

        editingGradientId = id;
        saveGradientBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        saveGradientBtn.title = 'Actualizar degradado guardado';
      });
    });
    
    savedGradients.querySelectorAll('.saved-gradient-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const filtered = savedList.filter(item => String(item.id) !== String(id));
        localStorage.setItem('savedGradients', JSON.stringify(filtered));
        if (String(editingGradientId) === String(id)) {
          editingGradientId = null;
          saveGradientBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
          saveGradientBtn.title = 'Guardar degradado actual';
        }
        renderSavedGradients();
      });
    });
  }

  btnCopyColor.onclick = async () => {
    const text = colorOutput.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btnCopyColor.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btnCopyColor.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      btnCopyColor.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => { btnCopyColor.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INICIALIZACIÓN DEL MÓDULO COLORES (BLINDADA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  loadColorState(); // Carga y limpia datos corruptos si los hay

  effectBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.effect === currentEffect) btn.classList.add('active');
  });

  speedControl.classList.toggle('active', currentEffect === 'namewave');
  speedControlRuby.classList.toggle('active', currentEffect === 'ruby');

  setBaseColorsForEffect(currentEffect);
  updateColorPreview();
  generateXatCode();
  renderSavedGradients();
  updateUnifiedText();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. MÓDULO AVATARES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  let img = new Image();
  let imgLoaded = false;
  let currentShape = 'square';
  let baseCanvasSize = 512;

  btnUpload.onclick = () => avatarUpload.click();

  avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      img = new Image();
      img.onload = () => {
        const isLarge = img.width >= 512 || img.height >= 512;
        baseCanvasSize = isLarge ? 1024 : 512;
        canvas.width = baseCanvasSize;
        canvas.height = baseCanvasSize;
        posX.value = 0;
        posY.value = 0;
        imgZoom.value = 100;
        imgLoaded = true;
        renderAvatar();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentShape = btn.dataset.shape;
      if (imgLoaded) renderAvatar();
    });
  });

  function renderAvatar() {
    if (!imgLoaded) return;
    const size = canvas.width;
    const half = size / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    ctx.filter = `brightness(${filterBrightness.value}%) contrast(${filterContrast.value}%) saturate(${filterSaturate.value}%) grayscale(${filterGrayscale.value}%)`;

    ctx.beginPath();
    if (currentShape === 'square') {
      ctx.rect(0, 0, size, size);
    } else if (currentShape === 'circle') {
      ctx.arc(half, half, half, 0, Math.PI * 2);
    } else if (currentShape === 'heart') {
      ctx.moveTo(half, size * 0.85);
      ctx.bezierCurveTo(half, size * 0.7, 0, size * 0.5, 0, size * 0.25);
      ctx.bezierCurveTo(0, 0, half, 0, half, size * 0.2);
      ctx.bezierCurveTo(half, 0, size, 0, size, size * 0.25);
      ctx.bezierCurveTo(size, size * 0.5, half, size * 0.7, half, size * 0.85);
    } else if (currentShape === 'flower') {
      const cx = half, cy = half, r = size * 0.35;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        ctx.moveTo(px + r * 0.8, py);
        ctx.arc(px, py, r * 0.8, 0, Math.PI * 2);
      }
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    }
    ctx.clip();

    const zoom = imgZoom.value / 100;
    const x = parseInt(posX.value) * (size / 512);
    const y = parseInt(posY.value) * (size / 512);

    const imgAspect = img.width / img.height;
    let drawW = size * zoom;
    let drawH = size * zoom;

    if (imgAspect > 1) {
      drawH = drawW / imgAspect;
    } else {
      drawW = drawH * imgAspect;
    }

    const drawX = half - (drawW / 2) + x;
    const drawY = half - (drawH / 2) + y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  const allSliders = [filterBrightness, filterContrast, filterSaturate, filterGrayscale, posX, posY, imgZoom];
  allSliders.forEach(slider => {
    slider.addEventListener('input', () => {
      if (imgLoaded) renderAvatar();
    });
  });

  btnDownloadAvatar.onclick = () => {
    if (!imgLoaded) return;
    const link = document.createElement('a');
    link.download = 'avatar-personalizado.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. INICIALIZACIÓN FINAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  updateUnifiedText();

});