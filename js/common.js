// Spoločný header a footer pre všetky stránky + inicializácia IDSK komponentov
import { initAll } from '../idsk/frontend.min.js';

const LOGO_SVG =
  '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" focusable="false">' +
  '<path d="M4 7c4-2.4 8.6-2.4 12 0v22c-3.4-2.4-8-2.4-12 0V7z" fill="#d5281b"/>' +
  '<path d="M30 7c-4-2.4-8.6-2.4-12 0v22c3.4-2.4 8-2.4 12 0V7z" fill="#1d70b8"/>' +
  '<path d="M17 6.2v23.2" stroke="#0b0c0c" stroke-width="1.4"/>' +
  '</svg>';

const HEADER_HTML =
'<div class="govuk-header__wrapper">' +
'  <header class="govuk-header idsk-shadow-head" data-module="govuk-header">' +
'    <div class="govuk-header__container">' +
'      <div class="idsk-secondary-navigation govuk-width-container">' +
'        <div class="idsk-secondary-navigation__header">' +
'          <div class="idsk-secondary-navigation__heading">' +
'            <div class="idsk-secondary-navigation__heading-title">' +
'              <span class="idsk-secondary-navigation__heading-mobile">SK</span>' +
'              <span class="idsk-secondary-navigation__heading-desktop">Oficiálna stránka</span>' +
'              <button class="govuk-button govuk-button--texted--inverse idsk-secondary-navigation__heading-button" aria-expanded="false" aria-label="Oficiálna stránka verejnej správy">' +
'                <span class="idsk-secondary-navigation__heading-mobile">e-Gov</span>' +
'                <span class="idsk-secondary-navigation__heading-desktop"><b>verejnej správy SR</b></span>' +
'                <span class="material-icons" aria-hidden="true">arrow_drop_down</span>' +
'              </button>' +
'            </div>' +
'            <div class="idsk-secondary-navigation__body hidden">' +
'              <div class="idsk-secondary-navigation__text">' +
'                <div>' +
'                  <h3 class="govuk-body-s"><b>Doména gov.sk je oficiálna</b></h3>' +
'                  <p class="govuk-body-s">Toto je oficiálna webová stránka orgánu verejnej moci Slovenskej republiky. Oficiálne stránky využívajú najmä doménu gov.sk. <a class="govuk-link--inverse" href="https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci" target="_blank" rel="noreferrer">Odkazy na jednotlivé webové sídla orgánov verejnej moci nájdete na tomto odkaze.</a></p>' +
'                </div>' +
'                <div>' +
'                  <h3 class="govuk-body-s"><b>Táto stránka je zabezpečená</b></h3>' +
'                  <p class="govuk-body-s max-width77-desktop">Buďte pozorní a vždy sa uistite, že zdieľate informácie iba cez zabezpečenú webovú stránku verejnej správy SR. Zabezpečená stránka vždy začína https:// pred názvom domény webového sídla.</p>' +
'                </div>' +
'              </div>' +
'            </div>' +
'          </div>' +
'          <div class="idsk-dropdown__wrapper idsk-secondary-navigation__dropdown">' +
'            <button class="govuk-button govuk-button--texted--inverse idsk-secondary-navigation__heading-button idsk-dropdown" aria-label="Rozbaliť jazykové menu" aria-haspopup="listbox">' +
'              <span>Slovenčina</span>' +
'              <span class="material-icons" aria-hidden="true">arrow_drop_down</span>' +
'            </button>' +
'            <ul class="idsk-dropdown__options idsk-shadow-medium">' +
'              <li class="idsk-dropdown__option"><a href="#" lang="sk">slovenčina</a></li>' +
'              <li class="idsk-dropdown__option"><a href="#" lang="en">english</a></li>' +
'            </ul>' +
'          </div>' +
'        </div>' +
'      </div>' +
'    </div>' +
'    <div class="govuk-predheader govuk-width-container">' +
'      <div class="govuk-header__logo">' +
'        <a href="index.html" class="govuk-header__link govuk-header__link--homepage app-logo" title="Odkaz na titulnú stránku">' +
           LOGO_SVG +
'          <span class="app-logo__text">Katalógy</span>' +
'        </a>' +
'      </div>' +
'      <div class="govuk-header__btns-search">' +
'        <div class="idsk-searchbar__wrapper" role="search">' +
'          <input class="govuk-input" type="search" id="app-header-search" placeholder="Hľadať v katalógu" title="Zadajte hľadaný výraz" name="search">' +
'          <button class="govuk-button govuk-button__basic" aria-label="Hľadať"><span class="material-icons" aria-hidden="true">search</span></button>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </header>' +
'</div>';

const FOOTER_HTML =
'<footer class="govuk-footer app-footer">' +
'  <div class="govuk-width-container">' +
'    <p class="govuk-body-s app-footer__cookies">Na tomto webovom sídle sa využívajú iba nevyhnutné/technické cookies.</p>' +
'    <ul class="app-footer__links">' +
'      <li><a class="govuk-footer__link" href="#">Informácie o spracovaní súborov cookies</a></li>' +
'      <li><a class="govuk-footer__link" href="#">Kontakt na prevádzkovateľa</a></li>' +
'      <li><a class="govuk-footer__link" href="https://idsk.gov.sk/" target="_blank" rel="noreferrer">IDSK</a></li>' +
'      <li><a class="govuk-footer__link" href="#">Mapa stránok</a></li>' +
'      <li><a class="govuk-footer__link" href="#">Vyhlásenie o prístupnosti</a></li>' +
'    </ul>' +
'    <div class="govuk-footer__meta">' +
'      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">' +
'        <span class="govuk-footer__licence-description">' +
'          Prevádzkovateľom služby je Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky.' +
'          <br>Vytvorené v súlade s Jednotným dizajnovým manuálom IDSK.' +
'        </span>' +
'      </div>' +
'      <div class="govuk-footer__meta-item">' +
'        <span class="app-footer__ministry">Ministerstvo školstva,<br>výskumu, vývoja a mládeže<br>Slovenskej republiky</span>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</footer>';

document.addEventListener('DOMContentLoaded', function () {
  const headerSlot = document.getElementById('app-header');
  const footerSlot = document.getElementById('app-footer');
  if (headerSlot) headerSlot.innerHTML = HEADER_HTML;
  if (footerSlot) footerSlot.innerHTML = FOOTER_HTML;
  initAll();
});
