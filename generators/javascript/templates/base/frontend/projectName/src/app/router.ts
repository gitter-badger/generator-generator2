import {provideRouter, RouterConfig} from '@angular/router';

import {HomeComponent} from './routes/home';
import {AboutComponent} from './routes/about';
import {SecondComponent} from './routes/about/second';
import {FirstComponent} from './routes/about/first';

const routes:RouterConfig = [
	{path: '',component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'about', component: AboutComponent, children: [
		{path: ''},
		{path: 'second', component: SecondComponent},
		{path: 'first/:id', component: FirstComponent}
	]},
];

export const routerProviders = [
	provideRouter(routes)
];
