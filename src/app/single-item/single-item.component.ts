import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ListItem, ListsService, THEME_ID_TOKEN, SEARCHES_LIST } from 'budgetkey-ng2-components';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.less']
})
export class SingleItemComponent implements OnInit {

  @Input() item: ListItem;
  @Output() changed = new EventEmitter<any>();

  private sharing = false;
  private total_results: number = null;

  constructor(private http: HttpClient,
              private lists: ListsService,
              @Inject(THEME_ID_TOKEN) private themeId: string) {}

  ngOnInit() {
    this.getCurrentResultNum();
    if (this.themeId) {
      let search = this.item.url.split('?')[1];
      if (search) {
        const params = new URLSearchParams(search);
        if (!params.get('theme')) {
          params.set('theme', this.themeId);
          search = params.toString();
          this.item.url = this.item.url.split('?')[0] + '?' + search;
        }
      }
    }
  }

  docType() {
    const p = this.item.properties;
    return (p.docType && p.docType.id) || p.displayDocs;
  }

  docTypeTypes() {
    const p = this.item.properties;
    return (p.docType && p.docType.types) || p.displayDocsTypes;
  }

  docTypeDisplay() {
    const p = this.item.properties;
    return (p.docType && p.docType.name) || p.displayDocsDisplay;
  }

  filters() {
    const p = this.item.properties;
    return (p.docType && p.docType.filters) || p.filters || {};
  }

  timeRange() {
    const p = this.item.properties;
    return (p.period && p.period.value) || p.timeRange;
  }

  timeRangeDisplay() {
    const p = this.item.properties;
    return (p.period && p.period.title) || p.timeRangeDisplay;
  }

  timeRangeStart() {
    const p = this.item.properties;
    return (p.period && p.period.start) || p.startRange || '1900-01-01';
  }

  timeRangeEnd() {
    const p = this.item.properties;
    return (p.period && p.period.end) || p.endRange || '2100-12-31';
  }

  getCurrentResultNum() {
    const URL = 'https://next.obudget.org/search';
    const p = this.item.properties;
    const config = [
      {
        id: this.docType(),
        doc_types: this.docTypeTypes(),
        filters: this.filters()
      }
    ];
    const config_param = encodeURIComponent(JSON.stringify(config));
    this.http
        .get(`${URL}/count/${encodeURIComponent(p.term)}/${this.timeRangeStart()}/${this.timeRangeEnd()}?config=${config_param}`)
        .subscribe((ret: any) => {
          if (ret.search_counts) {
            const counts = ret.search_counts[this.docType()];
            if (counts) {
              this.total_results = counts.total_overall;
            }
          }
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
