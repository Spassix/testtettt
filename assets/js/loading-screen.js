!function(){"use strict";
const defaultConfig={enabled:!1,duration:1e3,text:"Chargement Du Menu..",animation:"spinner"};
function hideLoadingScreen(){const e=document.getElementById("loadingScreen");e&&(e.classList.add("hidden"),setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},500))}
function showLoadingScreen(config){let loadingScreen=document.getElementById("loadingScreen");
if(!loadingScreen){loadingScreen=document.createElement("div");loadingScreen.id="loadingScreen";loadingScreen.className="loading-screen";document.body.appendChild(loadingScreen)}
const isVideo=config.background&&/\.(mp4|mov|webm|ogg|m4v|avi)$/i.test(config.background);
const title=config.title||"LA NATION DU LAIT";
const subtext=config.text||"Chargement Du Menu..";
const brand=config.brand||"LANATIONDULAIT";
let html="";
if(isVideo){
html=`<video class="video-bg" autoplay muted loop playsinline><source src="${config.background}" type="${function(e){return{mp4:"video/mp4",webm:"video/webm",ogg:"video/ogg",mov:"video/quicktime",m4v:"video/mp4",avi:"video/x-msvideo"}[e.split(".").pop().toLowerCase()]||"video/mp4"}(config.background)}"></video><div class="loading-overlay-card"><h1 class="loading-title">${title}</h1><div class="loading-progress-container"><div class="loading-progress-bar"><div class="loading-progress-fill"></div></div></div><div class="loading-subtext">${subtext}</div><div class="loading-dots-three"><span></span><span></span><span></span></div><div class="loading-brand">${brand}</div></div>`;
}else{
html=`<div class="loading-overlay-card"><h1 class="loading-title">${title}</h1><div class="loading-progress-container"><div class="loading-progress-bar"><div class="loading-progress-fill"></div></div></div><div class="loading-subtext">${subtext}</div><div class="loading-dots-three"><span></span><span></span><span></span></div><div class="loading-brand">${brand}</div></div>`;
}
loadingScreen.innerHTML=html;
if(config.bgColor)loadingScreen.style.setProperty("--loading-bg",config.bgColor);
if(config.textColor)loadingScreen.style.setProperty("--loading-text",config.textColor);
if(config.accentColor)loadingScreen.style.setProperty("--loading-accent",config.accentColor);
if(config.background&&!isVideo){loadingScreen.classList.add("has-background");loadingScreen.style.setProperty("--loading-bg-media",`url('${config.background}')`)}
loadingScreen.classList.remove("hidden")}
function initLoadingScreen(){const stored=localStorage.getItem("site_loadingscreen");let config=defaultConfig;
if(stored){try{config={...defaultConfig,...JSON.parse(stored)}}catch(e){console.warn("Erreur parsing loadingscreen config:",e)}}
if(!config.enabled){hideLoadingScreen();document.body.style.overflow="auto";return}
showLoadingScreen(config);
const duration=Math.min(config.duration||1e3,3e3);
setTimeout(()=>{hideLoadingScreen();document.body.style.overflow="auto"},duration);
setTimeout(()=>{hideLoadingScreen();document.body.style.overflow="auto"},5e3)}
window.addEventListener("adminDataUpdated",e=>{if("loadingscreen"===e.detail.key){const config=e.detail.data;config.enabled?(showLoadingScreen(config),setTimeout(()=>hideLoadingScreen(),config.duration||3e3)):hideLoadingScreen()}});
"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{setTimeout(initLoadingScreen,100)}):setTimeout(initLoadingScreen,100)}();
