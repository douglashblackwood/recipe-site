/* "Cooked this" feedback for recipe pages.
   Reads the recipe name + ingredient list from the page DOM, pre-fills a small
   form, and POSTs JSON to the household feedback endpoint (Apps Script -> a
   private sheet). text/plain body avoids a CORS preflight; the response is
   opaque (no-cors) so submission is optimistic. The token is a spam guard,
   not a secret. No data is stored on this site. */
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-8XP_sdijbn3JG071F_ebCCh7NFSdXZ2ujYhpWRJWGI-1WH-1AzB5nC7SsSCsFSVo8Q/exec';
  var TOKEN = 'bk-d8edbb0c-55ee';

  var wrap = document.querySelector('.wrap') || document.body;
  var h1 = document.querySelector('h1');
  var recipeName = h1 ? h1.textContent.trim() : document.title;
  var recipeId = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');

  function ingredientLines() {
    return Array.prototype.map.call(
      document.querySelectorAll('.ing li'),
      function (li) { return li.textContent.trim().replace(/\s+/g, ' '); }
    ).join('\n');
  }

  var box = document.createElement('section');
  box.id = 'fbbox';
  box.innerHTML =
    '<style>' +
    '#fbbox{margin:2.5rem 0 0;padding:1.2rem 1.3rem;border:1px dashed var(--rule,#c9bfae);border-radius:12px}' +
    '#fbbox h2{margin:0 0 .4rem;font-size:1.05rem}' +
    '#fbbox p.hint{margin:0 0 .8rem;font-size:.85rem;opacity:.75}' +
    '#fbbox label{display:block;font-size:.85rem;font-weight:600;margin:.7rem 0 .2rem}' +
    '#fbbox input,#fbbox select,#fbbox textarea{width:100%;box-sizing:border-box;padding:.45rem .55rem;border:1px solid var(--rule,#c9bfae);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:.9rem}' +
    '#fbbox textarea{min-height:7.5rem}' +
    '#fbbox .row{display:flex;gap:.8rem}#fbbox .row>div{flex:1}' +
    '#fbbox button{margin-top:.9rem;padding:.55rem 1.1rem;border:none;border-radius:999px;background:#b5471f;color:#fff;font:inherit;font-weight:600;cursor:pointer;width:auto}' +
    '#fbbox button[disabled]{opacity:.5;cursor:default}' +
    '#fbform{display:none}#fbbox.open #fbform{display:block}#fbbox.open #fbopen{display:none}' +
    '#fbdone{display:none;font-weight:600;margin-top:.6rem}' +
    '</style>' +
    '<h2>Cooked this?</h2>' +
    '<p class="hint">Thirty seconds of feedback keeps the recipe honest: real quantities, real timings.</p>' +
    '<button id="fbopen" type="button">I cooked this</button>' +
    '<div id="fbform">' +
    '<div class="row"><div><label for="fbdate">When</label><input type="date" id="fbdate"></div>' +
    '<div><label for="fbmins">Active minutes (roughly)</label><input type="number" id="fbmins" min="1" max="600" placeholder="e.g. 35"></div></div>' +
    '<label for="fbfollowed">Quantities as written?</label>' +
    '<select id="fbfollowed"><option value="yes">Yes, as written</option><option value="no">No, I changed some (edit below)</option></select>' +
    '<label for="fbcorr">Ingredients (edit any line you changed, delete lines you skipped)</label>' +
    '<textarea id="fbcorr"></textarea>' +
    '<div class="row"><div><label for="fbrating">Verdict (1-5)</label><select id="fbrating"><option value=""></option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div>' +
    '<div><label for="fbnotes">Notes</label><input type="text" id="fbnotes"></div></div>' +
    '<button id="fbsend" type="button">Send</button>' +
    '<p id="fbdone">Saved. It feeds back into the recipe automatically.</p>' +
    '</div>';
  wrap.appendChild(box);

  document.getElementById('fbdate').value = new Date().toISOString().slice(0, 10);

  document.getElementById('fbopen').addEventListener('click', function () {
    box.classList.add('open');
    var corr = document.getElementById('fbcorr');
    if (!corr.value) corr.value = ingredientLines();
  });

  document.getElementById('fbsend').addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;
    var payload = {
      token: TOKEN,
      recipe_id: recipeId,
      recipe_name: recipeName,
      date_cooked: document.getElementById('fbdate').value,
      followed_as_written: document.getElementById('fbfollowed').value,
      corrections: document.getElementById('fbfollowed').value === 'no'
        ? document.getElementById('fbcorr').value : '',
      active_minutes: document.getElementById('fbmins').value,
      rating: document.getElementById('fbrating').value,
      notes: document.getElementById('fbnotes').value,
      source: 'recipe-site'
    };
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
      .catch(function () {})
      .finally(function () {
        document.getElementById('fbform').style.display = 'none';
        document.getElementById('fbdone').style.display = 'block';
      });
  });
})();
