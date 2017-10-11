import { UIConstants, UIEvents } from '@deskproapps/deskproapps-sdk-core';

let faLoaded = false;

/**
 * Include the Font Awesome stylesheet
 */
function loadFontAwesome() {
  if (!faLoaded) {
    const link = document.createElement('link');
    link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('media', 'all');
    document.getElementsByTagName('head')[0].appendChild(link);
    faLoaded = true;
  }
}

/**
 * Returns an html element used as the apps toolbar
 *
 * @method
 * @param {App} app
 * @param {string} title The app title
 * @param {string} icon Path to the app icon
 * @returns {HTMLElement}
 */
export function createToolbar(app, title, icon) {
  loadFontAwesome();

  const toolbar = document.createElement('div');
  toolbar.setAttribute('id', 'deskpro-toolbar');
  toolbar.setAttribute('class', 'dp-column-drawer dp-column-drawer--with-controls');
  toolbar.innerHTML = `
    <h1 class="dp-heading">
      <div style="position: relative; margin-top: 6px; margin-right: 6px;">
        <div style="position: absolute; top: -13px; right: -10px">
          <div
            id="deskpro-toolbar__badge"
            style="display: none;"
            class="dp-badge dp-badge--danger dp-bg--danger dp-circle-badge"
          >0</div>
        </div>
        <img src="${icon}" style="width: 16px; height: 16px; border: 0;" />
      </div>
      ${title}
      <i
        id="deskpro-toolbar__collapse"
        class="fa fa-caret-up dp-icon dp-icon--s dp-column-drawer__arrow"
      ></i>
      <span class="dp-heading__controls">
        <i
          id="deskpro-toolbar__refresh"
          class="fa fa-refresh dp-icon dp-icon--s"
        ></i>
      </span>
     </h1>
  `;

  const badge = toolbar.querySelector('#deskpro-toolbar__badge');
  app.on(UIEvents.EVENT_BADGE_VISIBILITYCHANGED, () => {
    badge.style.display = app.ui.badge === UIConstants.VISIBILITY_VISIBLE ? 'inline-flex' : 'none';
  });
  app.on(UIEvents.EVENT_BADGE_COUNTCHANGED, () => {
    badge.innerText = String(app.ui.badgeCount);
  });

  const collapse = toolbar.querySelector('#deskpro-toolbar__collapse');
  collapse.addEventListener('click', () => {
    if (app.ui.isExpanded()) {
      app.ui.collapse();
      collapse.classList.remove('fa-caret-up');
      collapse.classList.add('fa-caret-down');
    } else {
      app.ui.expand();
      collapse.classList.add('fa-caret-up');
      collapse.classList.remove('fa-caret-down');
    }
  });

  const refresh = toolbar.querySelector('#deskpro-toolbar__refresh');
  refresh.addEventListener('click', app.refresh);

  return toolbar;
}
