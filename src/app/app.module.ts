import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { getAuthServiceConfigProvider } from 'budgetkey-ng2-auth';

import { BudgetKeyCommonModule, THEME_ID_TOKEN, THEME_TOKEN, LANG_TOKEN } from 'budgetkey-ng2-components';

import { AppComponent } from './app.component';
import { SingleItemComponent } from './single-item/single-item.component';
import { DeleteAllItemsComponent } from './delete-all-items/delete-all-items.component';

declare let BUDGETKEY_NG2_COMPONENTS_THEME: any;
declare const BUDGETKEY_THEME_ID: any;
declare const BUDGETKEY_LANG: any;

export const LANG = typeof(BUDGETKEY_LANG) === 'undefined' ? 'he' : BUDGETKEY_LANG;

const providers: any[] = [
  {provide: THEME_ID_TOKEN, useValue: typeof(BUDGETKEY_THEME_ID) === 'undefined' ? null : BUDGETKEY_THEME_ID},
  {provide: LANG_TOKEN, useValue: LANG},
  getAuthServiceConfigProvider('https://next.obudget.org')
];
if (typeof(BUDGETKEY_NG2_COMPONENTS_THEME) !== 'undefined') {
  BUDGETKEY_NG2_COMPONENTS_THEME = Object.assign({}, BUDGETKEY_NG2_COMPONENTS_THEME);
  providers.push({provide: THEME_TOKEN,
                  useValue: BUDGETKEY_NG2_COMPONENTS_THEME});
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BudgetKeyCommonModule,
  ],
  declarations: [
    AppComponent,
    SingleItemComponent,
    DeleteAllItemsComponent,
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
