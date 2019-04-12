import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BudgetKeyCommonModule, THEME_TOKEN } from 'budgetkey-ng2-components';
import { SingleItemComponent } from './single-item/single-item.component';
import { DeleteAllItemsComponent } from './delete-all-items/delete-all-items.component';
import { APP_BASE_HREF } from '@angular/common';
import { getAuthServiceConfigProvider } from 'budgetkey-ng2-auth';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BudgetKeyCommonModule,
      ],
      declarations: [
        AppComponent,
        SingleItemComponent,
        DeleteAllItemsComponent
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: THEME_TOKEN, useValue: {}},
        getAuthServiceConfigProvider('https://next.obudget.org'),
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
