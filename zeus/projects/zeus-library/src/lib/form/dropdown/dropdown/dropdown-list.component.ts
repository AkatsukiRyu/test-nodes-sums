import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unsubscribable, untilDestroyed } from '@poseidon-commons';
import { isEqual } from 'lodash-es';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseDropdown } from '../based-dropdown';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownListComponent),
  multi: true
};

@Component({
  selector: 'poseidon-dropdown',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CONTROL_VALUE_ACCESSOR]
})
@Unsubscribable()
export class DropdownListComponent extends BaseDropdown implements OnInit, OnChanges {
  @Input() public width = '240px';
  @Input() public background = 'white';
  @Input() public textColor = 'black';

  public searchControl: FormControl;

  public constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }

  public writeValue(val: any) {
    super.writeValue(val);
    this.overlay.hide();

    this.showValue(val);
  }

  public ngOnInit(): void {
    this.searchControl = new FormControl('', []);
    this.onSearch();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes) {
      return;
    }

    if (changes.forceDismissDropDown && this.forceDismissDropDown) {
      this.overlay.hide();
    }

    if (changes.overlayStyle && this.overlayStyle) {
      this.overlayStyleClass = `${this.overlayStyleClass} ${this.overlayStyle}`;
    }
  }

  public onSelect(option: any): void {
    this.value = option[this.valueBinding];
    this.selectItem();
  }

  public onSelectGroupItem(option: any, groupIndex: number, itemIndex: number): void {
    this.value = option[this.valueBinding];
    this.selectItem(groupIndex, itemIndex);
  }

  public clearValue() {
    this.value = null;
    this.showValue(this.value);
  }

  protected showValue(value: any): void {
    if (!value) {
      this.showSelectionElement.nativeElement.value = '';
      return;
    }

    if (this.group) {
      const v = this.getValueInGroup();
      this.showSelectionElement.nativeElement.value = !v ? '' : v[this.labelBinding];
      return;
    }

    const _v =
      this._originalOpts && this._originalOpts.length
        ? this._originalOpts.find(opt => {
            const optValue =
              typeof opt[this.valueBinding] === 'string' ? opt[this.valueBinding].trim() : opt[this.valueBinding];

            if (typeof value === 'string') {
              return optValue === value.trim();
            }

            return isEqual(optValue, value);
          })
        : value;

    if (_v) {
      this.showSelectionElement.nativeElement.value = _v[this.labelBinding] ? _v[this.labelBinding] : _v;
      return;
    }

    this.showSelectionElement.nativeElement.value = this.value[this.labelBinding]
      ? this.value[this.labelBinding]
      : this.value;
  }

  protected checkValue(): void {
    if (this.value) {
      this.showValue(this.value);
      return;
    }

    if (!this.value) {
      this.clearValue();
    }
  }

  private onSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        distinctUntilChanged(),
        tap(text => this.search(text))
      )
      .subscribe();
  }

  private getValueInGroup(): string {
    let showValue = '';
    let i = 0;
    while (!showValue && i < this._originalOpts.length) {
      const group = this._originalOpts[i];
      showValue =
        group[this.groupItemBinding] &&
        group[this.groupItemBinding].find(item => isEqual(item[this.valueBinding], this.value));

      i++;
    }

    return showValue;
  }
}
