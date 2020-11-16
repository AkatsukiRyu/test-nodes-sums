import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  Input,
  forwardRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { BaseDropdown } from '../based-dropdown';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unsubscribable } from '../../../commons/decorators/unsubscribable.decorator';
import { untilDestroyed } from '@zeus-commons';
import { debounceTime, tap } from 'rxjs/operators';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DirectFilterDropdownComponent),
  multi: true,
};

@Component({
  selector: 'zeus-direct-filter-dropdown',
  templateUrl: './direct-filter-dropdown.component.html',
  styleUrls: ['./direct-filter-dropdown.component.sass'],
  providers: [CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Unsubscribable()
export class DirectFilterDropdownComponent extends BaseDropdown
  implements OnInit {
  @Input() public background = 'white';
  public inputController = new FormControl('');

  @Output() public typing = new EventEmitter<string>();

  private _onFilter: boolean;

  public constructor(protected element: ElementRef) {
    super(element);
  }

  public ngOnInit(): void {
    this.watchInputController();
  }

  public clearValue(): void {
    this.value = '';
    this.showValue(this.value);
  }

  public onSelect(item: any): void {
    this.value = item[this.valueBinding];
    this.showValue(item[this.valueBinding]);
    this.toggleDropdown = false;
  }

  public blurSearcher(): void {
    this._onFilter = false;
    const value = this.inputController.value;
    const existed = this._originalOpts.find(
      (opt) => opt[this.labelBinding] === value
    );

    this.value = existed ? existed[this.valueBinding] : '';
    this.showSelectionElement.nativeElement.value = existed
      ? existed[this.labelBinding]
      : '';
  }

  protected showValue(value?: any): void {
    if (this._onFilter) {
      return;
    }

    if (!value) {
      this.showSelectionElement.nativeElement.value = '';
      return;
    }

    const _v =
      this._originalOpts &&
      this._originalOpts.length &&
      this._originalOpts.find((opt) => isEqual(opt[this.valueBinding], value));

    const showValue =
      _v && _v[this.labelBinding]
        ? _v[this.labelBinding]
        : this.value[this.labelBinding]
        ? this.value[this.labelBinding]
        : this.value;

    this.showSelectionElement.nativeElement.value = showValue;
    this.inputController.patchValue(showValue);
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

  private watchInputController(): void {
    this.inputController.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(800),
        tap((value) => {
          this.typing.emit(value);
          this._onFilter = true;
        })
      )
      .subscribe();
  }
}
