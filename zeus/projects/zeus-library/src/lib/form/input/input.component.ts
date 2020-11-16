import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNumber } from 'util';

@Component({
  selector: 'zeus-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() public isInteger: boolean;
  @Input() public type: 'text' | 'textarea' = 'text';
  @Input() public placeholder = '';
  @Input() public disabled = false;
  @Input() public textUppercase: boolean;
  @Input() public maxLength = 1050;
  @Input() public max: number = Number.MAX_SAFE_INTEGER;
  @Input() public floatNumberDigit = 0;
  @Input() public min = 0;
  @Input() public inputType: 'text' | 'number' = 'text';
  @Input() public disabledStyle: any;
  @Input() public textAlign: 'left' | 'right' | 'center' = 'left';

  @Input() public set ngValue(val: string | number) {
    this.writeValue(val);
  }

  @Output() public valueChange = new EventEmitter<string>();

  public value: string | number;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  public constructor() {}

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: string | number): void {
    if (value || isNumber(value)) {
      if (isNumber(value) && this.floatNumberDigit) {
        value = (+value as number).toFixed(this.floatNumberDigit);
      }

      this.value = value;
      return;
    }

    this.value = '';
  }

  public onInputBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  @HostListener('window:keyup', ['$event'])
  public keyEvent(event: KeyboardEvent) {
    if (this.inputType === 'number' && this.value) {
      setTimeout(() => {
        const val = this.value;

        if (this.min && val < this.min) {
          this.value = this.min.toString();
          this.onChange(this.value);
          this.onTouched();
          this.valueChange.emit(this.value);
          return;
        }

        if (this.max && val > this.max) {
          this.value = this.max.toString();
          this.onChange(this.value);
          this.onTouched();
          this.valueChange.emit(this.value);
          return;
        }

        if (this.isInteger) {
          this.value = Math.trunc(+val).toString();
          this.onChange(this.value);
          this.onTouched();
          this.valueChange.emit(this.value);
          return;
        }
      }, 400);
    }
  }

  public onInputChange(value: string): void {
    this.updateValue(value);
  }

  private updateValue(value: string): void {
    this.value = value;
    if (this.onChange) {
      this.onChange(this.value);
      this.valueChange.emit(this.value);
    }
  }
}
