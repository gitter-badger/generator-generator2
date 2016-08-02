/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { RootComponent } from './root.component';

describe(': ProjectName', () => {
  beforeEach(() => {
    addProviders([RootComponent]);
  });

  it('should create the app',
    inject([RootComponent], (app: RootComponent) => {
      expect(app).toBeTruthy();
    }));

  it('should have as title \'app works!\'',
    inject([RootComponent], (app: RootComponent) => {
      expect(app.title).toEqual('app works!');
    }));
});
