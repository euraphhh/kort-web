import { CheckIcon, CircleIcon } from "@/components/ui/icons";
import { checkPassword } from "@/lib/auth/password-validation";

// One line per requirement of the new password, updated as the person types. The state is never
// color alone: a check or an empty circle, plus a word read by screen readers (and the met items
// are also struck from the "to do" look by the check).

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul aria-label="Requisitos da senha" className="flex flex-col gap-(--space-2)">
      {checkPassword(password).map((check) => (
        <li
          key={check.id}
          className={`flex items-center gap-(--space-2) text-caption font-medium ${check.met ? "text-state-confirmed" : "text-text-muted"}`}
        >
          {check.met ? (
            <CheckIcon className="size-icon-ui shrink-0" />
          ) : (
            <CircleIcon className="size-icon-ui shrink-0" />
          )}
          <span>{check.label}</span>
          <span className="sr-only">{check.met ? "atendido" : "pendente"}</span>
        </li>
      ))}
    </ul>
  );
}
