import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ContentChild,
  TemplateRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { orderBy, map, cloneDeep } from 'lodash-es';
import { PoTableColumn, PoGroupTableData } from '../table.model';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { ArrayUtils } from '../../../commons/utils/array.utils';
import { PoTableHeaderDirective, PoTableRowDirective } from './table-directive';

@Component({
  selector: 'poseidon-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoseidonTableComponent implements OnChanges {
  @Input() public headerBgColor: any;
  @Input() public sorted?: boolean;
  @Input() public data: any[];
  @Input() public rowTemplate: TemplateRef<HTMLElement>;
  @Input() public headerTemplate: TemplateRef<HTMLElement>;
  @Input() public groupTemplate: TemplateRef<HTMLElement>;
  @Input() public isGroup: boolean;
  @Input() public inactive: string;
  @Input() public mouseHover: boolean;
  @Input() public sortDefault: string;

  @Input() public set columns(cols: PoTableColumn[]) {
    this.columns$.next(cloneDeep(cols));
  }

  @Output() public rowSelect = new EventEmitter<any>();

  @ContentChild(PoTableHeaderDirective, { static: true, read: TemplateRef })
  public poHeaderTemplate;
  @ContentChild(PoTableRowDirective, { static: true, read: TemplateRef })
  public poTableRowTemplate;

  public columns$ = new BehaviorSubject<PoTableColumn[]>([]);

  public data$ = new ReplaySubject<any[]>(1);
  public expand = true;

  public constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (this.sortDefault) {
        const cols = this.columns$.getValue();
        const col = cols.find(column => column.trackBy === this.sortDefault);
        col && this.sort(col, col.sort, true);
        return;
      }

      this.data$.next(this.data);
    }
  }

  public trackByIndex(index: number, _: any): number {
    return index;
  }

  public sort(col: PoTableColumn, type: 'ASC' | 'DESC', defaultSorted?: boolean): void {
    if (!this.sorted) {
      return;
    }

    type = !type ? 'ASC' : type;
    const cols = this.columns$.getValue();

    const columns = [];
    map(cols, column => {
      if (col.trackBy === column.trackBy) {
        if (!column.sort) {
          column.sort = type;
        } else if (!defaultSorted) {
          column.sort = column.sort === 'ASC' ? 'DESC' : 'ASC';
        }

        col.sort = column.sort;
      }

      columns.push(column);
    });

    this.columns$.next([...columns]);

    if (this.isGroup) {
      this.sortColumnByChildren(col, type);
      return;
    }

    this.sortColumn(col);
  }

  private sortColumnByChildren(col: PoTableColumn, type: 'ASC' | 'DESC') {
    if (col.isDate) {
      const groups: PoGroupTableData[] = (this.data || []).map((group: PoGroupTableData) => {
        const children = ArrayUtils.sortArrayByDate(group.children, type, col.trackBy);

        return {
          ...group,
          children: [...children]
        };
      });

      this.data$.next(groups);
      return;
    }

    const groupData = this.data.map((group: PoGroupTableData) => {
      const children = orderBy(group.children, [col.trackBy], [type.toLowerCase()]);

      return {
        ...group,
        children: [...children]
      };
    });
    this.data$.next(groupData);
  }

  private sortColumn(col: PoTableColumn) {
    if (col.isDate) {
      const sortDate = ArrayUtils.sortArrayByDate(this.data, col.sort, col.trackBy);
      this.data$.next(sortDate);
      return;
    }

    const items = orderBy(this.data, [col.trackBy], [col.sort.toLowerCase()]);
    this.data$.next(items);
  }
}
