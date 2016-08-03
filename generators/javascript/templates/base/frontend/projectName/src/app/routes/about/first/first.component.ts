import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from "rxjs/Rx";

@Component({
	moduleId: module.id,
	selector: 'app-first',
	templateUrl: 'first.component.html',
	styleUrls: ['first.component.css']
})
export class FirstComponent implements OnInit {

	test: Observable<String>;

	constructor(private route:ActivatedRoute,private router: Router) {
		console.log(this.route.snapshot.params['id']);
		this.test = this.router
			.routerState
			.queryParams
			.map(params => params['test'] || 'None');
	}

	ngOnInit():any {
		return undefined;
	}

}
