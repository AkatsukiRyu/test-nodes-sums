import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  forwardRef,
  Input,
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { BaseDropdown } from '../based-dropdown';
import { Unsubscribable, untilDestroyed } from '@zeus-commons';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultipleSelectComponent),
  multi: true,
};

@Component({
  selector: 'zeus-multi-select-dropdown',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.sass'],
  providers: [CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribable()
export class MultipleSelectComponent extends BaseDropdown implements OnInit {
  @Input() public isStripedItem = false;

  public searchControl: FormControl;

  public constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }

  public ngOnInit(): void {
    this.searchControl = new FormControl('', []);
    this.onSearch();
  }

  public clearFilter(): void {
    this.searchControl.patchValue('');
    this.clearValue();
  }

  public onCheckItems(item: any): void {
    const valueItems = this.value ? (this.value as Array<any>) : [];

    const existed = valueItems.findIndex((it) =>
      isEqual(it, item[this.valueBinding])
    );

    if (existed < 0) {
      valueItems.push(item[this.valueBinding]);
    } else {
      valueItems.splice(existed, 1);
    }

    this.value = [...valueItems];
    this.showSelections(valueItems);
    this.valueChange.emit(valueItems);
  }

  public clearValue(): void {
    this.value = [];
    this.valueChange.emit(this.value);
    this.showSelections([]);
  }

  public writeValue(value: any): void {
    super.writeValue(value);
    this.clearValue();
  }

  protected showValue(value: any): void {}

  protected checkValue(): void {
    if (this.value && !this.value.length) {
      this.clearValue();
    }
  }

  private showSelections(selectedItems: string[]): void {
    if (!selectedItems.length) {
      this.showSelectionElement.nativeElement.value = '';
      return;
    }

    if (!this._originalOpts || !this._originalOpts.length) {
      const val = selectedItems.map((it) => it[this.labelBinding]);
      this.showSelectionElement.nativeElement.value = val.join(', ');
      return;
    }

    const items = this._originalOpts
      .filter((it) => selectedItems.includes(it[this.valueBinding]))
      .map((selected) => selected[this.labelBinding].trim());

    this.showSelectionElement.nativeElement.value = items.join(', ');
  }

  private onSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        distinctUntilChanged(),
        tap((text) => this.search(text))
      )
      .subscribe();
  }
}
