// Spoločný header a footer pre všetky stránky + inicializácia IDSK komponentov
import { initAll } from '../idsk/frontend.min.js';

function buildHeader() {
  return '<div class="govuk-header__wrapper">' +
  '  <header class="govuk-header idsk-shadow-head" data-module="govuk-header">' +
  '    <div class="govuk-header__container">' +
  '      <div class="idsk-secondary-navigation govuk-width-container">' +
  '        <div class="idsk-secondary-navigation__header">' +
  '          <span class="app-topbar__text">' + t('Oficiálna stránka verejnej správy SR') + '</span>' +
  '          <div class="idsk-dropdown__wrapper idsk-secondary-navigation__dropdown">' +
  '            <button class="govuk-button govuk-button--texted--inverse idsk-secondary-navigation__heading-button idsk-dropdown" aria-label="' + t('Rozbaliť jazykové menu') + '" aria-haspopup="listbox">' +
  '              <span>' + t('Slovenčina') + '</span>' +
  '              <span class="material-icons" aria-hidden="true">arrow_drop_down</span>' +
  '            </button>' +
  '            <ul class="idsk-dropdown__options idsk-shadow-medium">' +
  '              <li class="idsk-dropdown__option"><a href="#" lang="sk" data-lang="sk">slovenčina</a></li>' +
  '              <li class="idsk-dropdown__option"><a href="#" lang="en" data-lang="en">english</a></li>' +
  '            </ul>' +
  '          </div>' +
  '        </div>' +
  '      </div>' +
  '    </div>' +
  '    <div class="govuk-predheader govuk-width-container">' +
  '      <div class="govuk-header__logo">' +
  '        <a href="." class="govuk-header__link govuk-header__link--homepage app-logo" title="' + t('Odkaz na titulnú stránku') + '">' +
  '          <img class="app-logo__img" src="img/logo-mssr.svg" alt="' + t('Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky') + '">' +
  '        </a>' +
  '      </div>' +
  '      <div class="govuk-header__btns-search">' +
  '        <div class="idsk-searchbar__wrapper" role="search">' +
  '          <input class="govuk-input" type="search" id="app-header-search" placeholder="' + t('Hľadať v katalógu') + '" aria-label="' + t('Hľadať v katalógu') + '" title="' + t('Zadajte hľadaný výraz') + '" name="search">' +
  '          <button class="govuk-button govuk-button__basic" aria-label="' + t('Hľadať') + '"><span class="material-icons" aria-hidden="true">search</span></button>' +
  '        </div>' +
  '      </div>' +
  '    </div>' +
  '  </header>' +
  '</div>';
}

function buildFooter() {
  return '<footer class="govuk-footer app-footer">' +
  '  <div class="govuk-width-container">' +
  '    <p class="govuk-body-s app-footer__cookies">' + t('Na tomto webovom sídle sa využívajú iba nevyhnutné/technické cookies.') + '</p>' +
  '    <ul class="app-footer__links">' +
  '      <li><a class="govuk-footer__link" href="#">' + t('Informácie o spracovaní súborov cookies') + '</a></li>' +
  '      <li><a class="govuk-footer__link" href="#">' + t('Kontakt na prevádzkovateľa') + '</a></li>' +
  '      <li><a class="govuk-footer__link" href="https://idsk.gov.sk/" target="_blank" rel="noreferrer">IDSK</a></li>' +
  '      <li><a class="govuk-footer__link" href="#">' + t('Mapa stránok') + '</a></li>' +
  '      <li><a class="govuk-footer__link" href="#">' + t('Vyhlásenie o prístupnosti') + '</a></li>' +
  '    </ul>' +
  '    <div class="govuk-footer__meta">' +
  '      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">' +
  '        <span class="govuk-footer__licence-description">' +
           t('Prevádzkovateľom služby je Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky.') +
  '        <br>' + t('Vytvorené v súlade s Jednotným dizajnovým manuálom IDSK.') +
  '        </span>' +
  '      </div>' +
  '      <div class="govuk-footer__meta-item">' +
  '        <img class="app-footer__logo" src="img/logo-mssr-footer.svg" alt="' + t('Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky') + '">' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '</footer>';
}

document.addEventListener('DOMContentLoaded', function () {
  const headerSlot = document.getElementById('app-header');
  const footerSlot = document.getElementById('app-footer');
  if (headerSlot) headerSlot.innerHTML = buildHeader();
  if (footerSlot) footerSlot.innerHTML = buildFooter();

  // Prepínač jazyka
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setLang(a.dataset.lang);
    });
  });

  initAll();
});
