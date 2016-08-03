import { Component, OnInit } from '@angular/core';
import {FirstComponent} from './first';
import {SecondComponent} from './second';

@Component({
  moduleId: module.id,
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css'],
	directives : [FirstComponent, SecondComponent]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
