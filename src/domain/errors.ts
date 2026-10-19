// Expected failures of the scheduling rules. Each code maps to something the panel or the agent
// can say to a person; none of them is a bug.

export type DomainErrorCode =
  | "slot_unavailable" // taken, blocked, off the grid or outside the hours (includes the database's 23P01)
  | "inside_min_notice"
  | "beyond_booking_window"
  | "professional_inactive"
  | "service_inactive"
  | "professional_does_not_do_service"
  | "customer_inactive"
  | "too_late_to_cancel" // the agent hands the conversation to a person
  | "too_late_to_reschedule" // same
  | "too_early_to_close"
  | "invalid_status_transition"
  | "not_allowed";

export class DomainError extends Error {
  constructor(readonly code: DomainErrorCode) {
    super(code);
    this.name = "DomainError";
  }
}

/** The database is the final authority on overbooking: its exclusion violation becomes a domain error. */
export function domainErrorFromDb(error: { code?: string } | null | undefined): DomainError | null {
  return error?.code === "23P01" ? new DomainError("slot_unavailable") : null;
}
