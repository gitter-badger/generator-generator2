import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {HomeComponent} from './home';
import {AboutComponent} from './about';

@Component({
	moduleId: module.id,
	selector: 'app-root',
	templateUrl: 'root.component.html',
	styleUrls: ['root.component.css'],
	directives: [HomeComponent, AboutComponent, ROUTER_DIRECTIVES]
})
export class RootComponent {
	title = 'app works!';
}
