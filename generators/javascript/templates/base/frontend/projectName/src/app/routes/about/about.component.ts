import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {FirstComponent} from './first';
import {SecondComponent} from './second';

@Component({
  moduleId: module.id,
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css'],
	directives : [FirstComponent, SecondComponent,ROUTER_DIRECTIVES]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
