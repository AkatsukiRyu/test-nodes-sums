import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioOption } from './radio-option.model';

@Component({
  selector: 'poseidon-radio',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent implements ControlValueAccessor {
  @Input() public options: RadioOption[];
  @Input() public name: string;
  @Input() public disabled: boolean;
  @Input() public wrapperDisplay: string = 'inline-block';
  @Input() public radioCircleStyle = { height: '20px', width: '20px' };
  @Input() public labelStyle: any;
  @Input('value') public set _value(v: any) {
    this.writeValue(v);
  }

  // tslint:disable-next-line: no-output-on-prefix
  @Output() public onSelected = new EventEmitter<string>();

  public value: any;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  public constructor(private changeDetector: ChangeDetectorRef) {}

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: any): void {
    if (typeof value === 'number' && value >= 0) {
      this.value = value;
      this.changeDetector.detectChanges();
    }

    if (value) {
      this.value = value;
      this.changeDetector.detectChanges();
    }
  }

  public onInputBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  public onInputChange(option: RadioOption): void {
    this.updateValue(option.value);
    this.onSelected.emit(option.value);
  }

  private updateValue(value: any): void {
    this.value = value;

    if (this.onChange) {
      this.onChange(this.value);
    }
  }
}
