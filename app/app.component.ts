import {Component, AfterViewInit} from '@angular/core';
import {ListsService, SEARCHES_LIST, ListItem} from 'budgetkey-ng2-components';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../node_modules/budgetkey-ng2-auth';

declare const window: any;


@Component({
  selector: 'my-app',
  template: ` 
      <budgetkey-container [showHeader]="true" [showSearchBar]="true">
        <div class='main'>
        <ng-container *ngIf='init && !hasItems'>
          <img class='logo' src='assets/img/update_stars_empty.svg'/>
          <span class='subtitle'>(פה יופיעו)</span>
          <span class='title'>ההתראות השמורות שלי</span>
          <div class='instructions'>
            <div class='instructions-title'>הגעת לכאן, אבל עוד לא נרשמת להתראות</div>
            <div class='instructions-subtitle'>
              אל חשש, בדף תוצאות החיפוש לחיצה קטנה על הכוכב בשורת החיפוש תרשום אותך 
              לקבלת התראות בדוא״ל שניתן יהיה לערוך בעמוד זה
            </div>
            <img src='assets/img/no_alerts_stars_transition.svg'/>
          </div>
        </ng-container>
        <ng-container *ngIf='init && hasItems'>
            <img class='logo' src='assets/img/update_stars.svg'/>
            <span class='title'>ההתראות השמורות שלי</span>
            <ng-container *ngFor='let item of (items | async)'>
              <single-item *ngIf='item.properties && item.properties.kind==="search"'
                          [item]='item' 
                          (changed)='updateItems()'
              ></single-item>
            </ng-container>
          </ng-container>
        </div>
      </budgetkey-container>
  `,
  styles: [
`
div.main {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-bottom: 50px;
}

.logo {
  margin-top: 50px;
  width: 170px;
}

.title {
  color: #FF5A5F;	
  font-family: "Miriam Libre";
  font-size: 28px;
  font-weight: bold;
  padding-bottom: 25px;
}

.subtitle {
  color: #FF5A5F;	
  font-family: "Miriam Libre";
  font-size: 18px;
  font-weight: 200;
  padding: 10px 0;
}

.instructions {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  background-color: rgba(250,250,250,0.3);
  box-shadow: inset 0 1px 10px 0 rgba(0,0,0,0.05);
  padding-top: 40px;
}

.instructions-title {
  color: #333333;	font-family: "Miriam Libre";	font-size: 22px;	font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.instructions-subtitle {
  color: #3C4948;	font-family: "Abraham TRIAL";	font-size: 16px; font-weight: 300;
  max-width: 460px;
  text-align: center;
  margin-bottom: 25px;
}

`
  ]
})
export class AppComponent implements AfterViewInit {

  private items = new BehaviorSubject<Array<ListItem>>([]);
  private init = false;
  private hasItems = false;

  constructor(private lists: ListsService, private auth: AuthService) {
    this.updateItems();
  }

  updateItems() {
    this.auth.check(window.location.href)
             .subscribe((result) => {
               if (result) {
                if (!result.authenticated) {
                  this.init = true;
                  this.hasItems = false;
                  this.items.next([]);
                }
               }
             });
    this.lists.get(SEARCHES_LIST)
              .subscribe((lc) => {
                this.init = true;
                this.hasItems = !!lc.items;
                this.items.next(lc.items);
                this.refreshShareThis();
              });
  }

  ngAfterViewInit() {
    this.refreshShareThis();
  }

  refreshShareThis() {
    if (window.__sharethis__ && window.__sharethis__.initialize) {
      window.setTimeout(() => {
        window.__sharethis__.initialize();
      }, 1000);
    } else {
      console.log('Failed to find ShareThis buttons');
      window.setTimeout(() => {
        this.ngAfterViewInit();
      }, 3000);
    }
  }

}
