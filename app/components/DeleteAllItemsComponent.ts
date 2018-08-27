import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
import {ListsService, SEARCHES_LIST, ListItem, THEME_ID_TOKEN} from 'budgetkey-ng2-components';
import { Http, Response } from '@angular/http';


@Component({
  selector: 'delete-all-items',
  template: ` 
    <div class='row'>
        <div class='icon trash' (click)="delete()">
            <span>מחקו הכל</span>
            <img src='assets/img/trash.svg'/>
        </div>
    </div>
  `,
  styles: [`
.row {
    width: 815px;
    display: flex;
    justify-content: flex-end;
    flex-flow: row;
}

.icon {
    cursor: pointer;
    text-align: center;
    opacity: 0.5;	color: #333333;	font-family: "Miriam Libre";	font-size: 16px;	font-weight: bold;
}

span {
    padding: 10px;
    display: inline-block;
}

img {
    margin-top: -3px;
}
`
  ]
})
export class DeleteAllItemsComponent {

    @Output('changed') changed = new EventEmitter<any>();

    constructor(private lists: ListsService) {}

    ngOnInit() {
    }

    delete() {
        this.lists.delete(SEARCHES_LIST, null)
                  .subscribe((_) => {
                    this.changed.emit(null);
                  });
    }
}
