// kort components — window.Kort. Every color, radius and space comes from tokens.css.

export type IconName = 'plus' | 'check' | 'clock' | 'x' | 'dot' | 'ban' | 'trash';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'unconfirmed' | 'noshow' | 'cancelled';

export interface LogoProps {
  /** 'wordmark' (default) or 'icon' (the speech-bubble o on an accent square). */
  variant?: 'wordmark' | 'icon';
  /** Wordmark: width in px (default 120, minimum 64). Icon: side in px (default 48, minimum 32 except favicons). */
  size?: number;
  /** Wordmark ink; defaults to the `text` token via currentColor. */
  color?: string;
  className?: string;
}

export interface ButtonProps {
  /** primary: the one main action of a screen. secondary: other actions. ghost: low-emphasis, inline. danger: destructive. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  children?: React.ReactNode;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  type?: 'button' | 'submit';
  block?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  /** Required when the button has an icon and no text. */
  'aria-label'?: string;
  className?: string;
}

export interface StatusBadgeProps {
  status: AppointmentStatus;
  /** Overrides the default Portuguese label (Agendado, Confirmado, Não confirmado, Faltou, Cancelado). */
  label?: string;
  className?: string;
}

export interface CounterProps {
  count: number;
  /** Text after the number, e.g. "a fechar". */
  label: string;
  className?: string;
}

export interface AppointmentRowProps {
  /** Formatted as 09h30. */
  time: string;
  service: string;
  client: string;
  /** Shown as "client · com professional" when the owner sees everyone's agenda. */
  professional?: string;
  status?: AppointmentStatus;
  onClick?: () => void;
  className?: string;
}

export interface TextFieldProps {
  label: string;
  id?: string;
  type?: string;
  inputMode?: 'text' | 'tel' | 'numeric' | 'decimal' | 'email';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  /** Replaces the hint and paints the field with `danger`. */
  error?: string;
  className?: string;
}
