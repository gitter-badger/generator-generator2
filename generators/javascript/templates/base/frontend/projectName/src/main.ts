import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { routerProviders, RootComponent, environment } from './app';

if (environment.production) {
  enableProdMode();
}

bootstrap(RootComponent,[
	routerProviders
]).catch(err => console.error(err));
