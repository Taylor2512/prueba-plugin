import 'antd';

declare module 'antd' {
  // Allow `name` on Select props used in our inspector widgets.
  // This augmentation is intentionally small and local to avoid wide-reaching
  // changes; if upstream types change, remove this file.
  export interface SelectProps<T = any> {
    name?: string;
  }
}
