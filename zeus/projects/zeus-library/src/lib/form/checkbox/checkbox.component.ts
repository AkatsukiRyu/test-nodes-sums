import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'zeus-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass'],
  providers: [CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() public backgroundColor = 'transparent';
  @Input() public checkStyle: 'check-mark' | 'grey-mark' = 'check-mark';
  @Input() public disabled: boolean;
  @Input() public set ngValue(value: boolean) {
    this.value = value;
  }

  @Output() public selected = new EventEmitter<boolean>();

  private _value: boolean;

  public onchange = (value: boolean) => {};
  public onTouched = () => {};

  public get value(): boolean {
    return this._value;
  }

  public set value(val: boolean) {
    this._value = val;

    this.onchange(this.value);
    this.onTouched();
  }

  @Input() public set checked(check: boolean) {
    this.value = check;
  }

  public onClicked(): void {
    this.value = !this.value;

    this.selected.emit(this.value);
  }

  public writeValue(val: boolean): void {
    this.value = val;
  }

  public registerOnChange(fn: () => void): void {
    this.onchange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
