import {Component} from '@angular/core';
import {HomeComponent} from './home';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	directives: [HomeComponent, ROUTER_DIRECTIVES]
})
export class AppComponent {
	title = 'app works!';
}
