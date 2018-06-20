import {Component} from '@angular/core';
import {ListsService} from 'budgetkey-ng2-components';

@Component({
  selector: 'my-app',
  template: ` 
      <budgetkey-container [showHeader]="true" [showSearchBar]="true">
        היוש
      </budgetkey-container>
  `,
})
export class AppComponent {

  constructor(private lists: ListsService) {
  }
}
