import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ListsService, SEARCHES_LIST, ListItem} from 'budgetkey-ng2-components';
import { Http, Response } from '@angular/http';
import * as _ from 'lodash';


@Component({
  selector: 'single-item',
  template: ` 
    <div class='row'
         [ngClass]='{sharing: sharing}'>
        <div class='main-container'>
            <div class='main'>
                <span class='emphasis'>
                    {{item.title}}
                </span>
                <span class='regular'>
                    חיפוש
                    <ng-container *ngIf='item.properties.displayDocs === "all"'>
                        כל התוצאות
                    </ng-container>
                    <ng-container *ngIf='item.properties.displayDocs !== "all"'>
                        {{ item.properties.displayDocsDisplay }}
                    </ng-container>
                    <ng-container *ngIf='item.properties.timeRange !== "all"'>
                        עם פעילות במהלך
                        {{ item.properties.timeRangeDisplay }}
                    </ng-container>
                </span>
                <span class='goto-container' (click)='navigate()'>
                    <span class='goto'>
                        <ng-container *ngIf='total_results !== null'>
                            <span *ngIf='total_results < 500'>
                                {{ total_results }}
                            </span>
                            <span *ngIf='total_results >= 500'>
                                500+
                            </span>
                        </ng-container>
                        <img src='assets/img/left.svg'/>
                    </span>
                </span>
            </div>
            <div class='sharers'>
                <div class="sharethis-inline-share-buttons"
                    [attr.data-url]="item.url"
                    [attr.data-title]="item.title"
                ></div>
            </div>
        </div>
        <div class='icon share' (click)="share()">
            <img [src]='sharing ? "assets/img/close.svg" : "assets/img/share-2.svg"'/>
        </div>
        <div class='icon trash' (click)="delete()">
            <img src='assets/img/trash.svg'/>
        </div>
    </div>
  `,
  styles: [`
.row {
    margin-bottom: 25px;
}

.main, .row {
    display: flex;
    flex-flow: row;
    align-items: center;
}

.main-container {
    width: 770px;
    position: relative;
    z-index: 0;
}

.main {
    position: relative;
    width: 770px;
    border-radius: 25px;
    background-color: #FF5A5F;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.05);
    padding: 10px 20px;
    margin-left: 2.5px;
    flex: none;
    z-index: 2;
}

.sharers {
    right: 560px;
    top: 0px;
    width: 210px;
    position: absolute;
    height: 50px;
    padding-top: 9px;
    z-index: 1;
}

.main {
    transition-property: width, z-index;
    transition-duration: 0.6s;
}

.sharing .main {
    width: 560px;
}

// .sharing .sharers {
//     z-index: 1;
// }

.emphasis {
    color: #FFFFFF;
    font-family: "Abraham TRIAL";
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.43px; 
    max-width: 380px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 16px;
    flex: none;
}

.regular {
    color: rgba(0,0,0,0.5);	
    font-family: "Abraham TRIAL";	
    font-size: 20px;	
    letter-spacing: 0.43px;
    overflow-x: hidden;
    white-space: nowrap;
}

.goto-container {
    margin-right: auto;
}

.goto {
    color: #FFFFFF;
    font-family: "Abraham TRIAL";
    font-size: 20px;
    letter-spacing: 0.43px;
    background: linear-gradient(270deg, rgba(255,90,95,0) 0%, rgba(255,90,95,0.8) 30px);
    padding-right: 30px;
    margin-right: -30px;
    white-space: nowrap;
    flex: none;
    cursor: pointer;
}

.icon {
    cursor: pointer;
    text-align: center;
    flex: none;
    width: 30px;
}
`
  ]
})
export class SingleItemComponent {

    @Input() item: ListItem;
    @Output('changed') changed = new EventEmitter<any>();

    private sharing = false;
    private total_results: number = null;

    constructor(private http: Http,
                private lists: ListsService) {}

    ngOnInit() {
        this.getCurrentResultNum();
    }

    getCurrentResultNum() {
        let URL = 'https://next.obudget.org/search';
        let p = this.item.properties;
        this.http
            .get(`${URL}/${p.displayDocsTypes.join(',')}/${encodeURIComponent(p.term)}/${p.startRange}/${p.endRange}/0/0`)
        .map((r: Response) => r.json())
        .subscribe((ret: any) => {
            let total = 0;
            if (ret.search_counts) {
                let v: any;
                for (v of _.values(ret.search_counts)) {
                    if (v.total_overall) {
                        total += v.total_overall;
                    }
                }
            }
            this.total_results = total;
        });
    }

    delete() {
        this.lists.delete(SEARCHES_LIST, this.item.id)
                  .subscribe((_) => {
                    this.changed.emit(null);
                  });
    }

    share() {
        this.sharing = !this.sharing;
    }

    navigate() {
        window.location.href = this.item.url;
    }
}
