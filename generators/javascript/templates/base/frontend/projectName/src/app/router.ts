import {provideRouter, RouterConfig} from '@angular/router';
import {RootComponent} from './routes';
import {HomeComponent} from './routes/home';
import {AboutComponent} from './routes/about';

const routes:RouterConfig = [
	{path: '',component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'about', component: AboutComponent},
];

export const routerProviders = [
	provideRouter(routes)
];
