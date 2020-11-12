import {
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ControlValueAccessor } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { ReplaySubject } from 'rxjs';

import { IconName } from '../../icon/icon-name';
import { DropListCustomDirective } from './drop-down.directive';

export abstract class BaseDropdown implements ControlValueAccessor {
  @ViewChild('showSelection', { static: true })
  public showSelectionElement: ElementRef;

  @ViewChild('toggleOverlay', { static: true })
  public toggleOverlay: ElementRef;

  @ViewChild('op', { static: true })
  protected overlay: OverlayPanel;

  @ViewChild('wrapperContent', { static: true })
  protected wrapperContent: ElementRef;

  @Input() set options(options: any[]) {
    if (!options) {
      return;
    }
    this.options$.next([...options]);
    this._originalOpts = [...options];

    if (this.value) {
      this.showValue(this.value);
    }
  }

  @Input() public group: boolean;
  @Input() public filter = true;
  @Input() public filterBy = 'label, value.name';
  @Input() public labelBinding = 'label';
  @Input() public valueBinding = 'value';
  @Input() public valueKeyBinding = 'id';
  @Input() public groupItemBinding = 'items';
  @Input() public bindingGroupLabel = 'label';
  @Input() public dropDownPlaceholder = '';
  @Input() public placeholder = '';
  @Input() public disabled: boolean;
  @Input() public allowedClear: boolean;
  @Input() public forceDismissDropDown: boolean;
  @Input() public overlayStyle: any;

  @Input() public appendToBody = false;

  @Input() public set model(value: any) {
    this.value = value;
    this.checkValue();
  }

  @ContentChild(DropListCustomDirective, { read: TemplateRef, static: false })
  public dropListCustomTemplate;

  @Output() public valueChange = new EventEmitter<any>();

  public toggleDropdown: boolean;
  public options$ = new ReplaySubject(1);
  public dropdownIcon = IconName.DROPDOWN_ARROW;
  public overlayStyleClass = 'no-padding';

  private _value: any;
  protected _originalOpts: any[];

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    // this.showSelectionElement.nativeElement.value = value;
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  public constructor(protected elementRef: ElementRef) {}

  public onChange: any = (value: any) => {};
  public onTouched: any = () => {};

  public toggleDropDownOptions(dropdownControl: HTMLElement = null) {
    if (this.disabled) {
      return;
    }
    if (!this.dropListCustomTemplate && dropdownControl) {
      const widthControl = dropdownControl.offsetWidth;
      this.wrapperContent.nativeElement.style.width = `${widthControl}px`;
    }

    !this.appendToBody
      ? (this.toggleDropdown = true)
      : this.toggleOverlay.nativeElement.click();
  }

  @HostListener('document:click', ['$event.target'])
  public clickOutSide(target: ElementRef): void {
    if (!this.appendToBody) {
      this.toggleDropdown = this.elementRef.nativeElement.contains(target);
    } else if (this.overlay.container) {
      const onClickDropDownComponent = this.elementRef.nativeElement.contains(
        target
      );
      const onClickOverlayComponent = this.overlay.container.contains(
        target || target.nativeElement
      );

      if (!onClickDropDownComponent && !onClickOverlayComponent) {
        this.overlay.hide();
      }
    }
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public trackByIndex(index: number, _: any): number {
    return index;
  }

  protected search(text: string): void {
    if (!text) {
      this.options$.next([...this._originalOpts]);
      return;
    }

    const keyFilter = this.filterBy.split(',');
    const options = [];

    this._originalOpts.map((op) => {
      const filterOptionItem = (option: any): boolean => {
        let keyIndex = 0;
        let includes = false;

        while (keyIndex < keyFilter.length && !includes) {
          const paths = keyFilter[keyIndex].split('.');
          let i = 0;
          let value = option;

          while (paths[i] && i < paths.length && value) {
            value = value[paths[i].trim()];
            i++;
          }

          includes = value && value.toLowerCase().includes(text.toLowerCase());
          keyIndex++;
        }

        return includes;
      };

      if (this.group) {
        const itemBinding = this.groupItemBinding;
        const items = op[itemBinding].filter((item) => filterOptionItem(item));

        const option = { ...op };
        option[itemBinding] = [...items];

        options.push(option);
      } else if (filterOptionItem(op)) {
        const option = { ...op };

        options.push(option);
      }
    });

    this.options$.next(options);
  }

  protected selectItem(groupIndex?: number, itemIndex?: number): void {
    const value = this.group
      ? this._originalOpts[groupIndex][this.groupItemBinding][itemIndex]
      : this._originalOpts.find((option) =>
          isEqual(option[this.valueBinding], this.value)
        );

    this.showSelectionElement.nativeElement.value =
      (value && value[this.labelBinding]) || '';
    this.toggleDropdown = false;
    this.valueChange.emit(value);
  }

  public abstract clearValue(): void;
  protected abstract showValue(value?: any): void;
  protected abstract checkValue(): void;
}
