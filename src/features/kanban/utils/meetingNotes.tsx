import type { ApiCardMeeting, MeetingNote } from "../../../store/kanbanTypes";

export const createMeetingNote = (
  overrides?: Partial<MeetingNote>,
): MeetingNote => ({
  title: "Meeting 1",
  location: "",
  startedAt: "",
  notes: "",
  ...overrides,
});

export const parseLegacyMeetingNotes = (value?: string | null): MeetingNote[] => {
  if (!value?.trim()) {
    return [createMeetingNote()];
  }

  try {
    const parsed = JSON.parse(value) as {
      meetings?: Array<Partial<MeetingNote>>;
    };

    if (Array.isArray(parsed.meetings) && parsed.meetings.length > 0) {
      return parsed.meetings.map((meeting, index) =>
        createMeetingNote({
          title: meeting.title?.trim() || `Meeting ${index + 1}`,
          location: meeting.location ?? "",
          startedAt: meeting.startedAt ?? "",
          notes: meeting.notes ?? "",
        }),
      );
    }
  } catch {
    // Older cards may still store early activity as plain text.
  }

  return [
    createMeetingNote({
      notes: value,
    }),
  ];
};

export const normalizeMeetings = (
  meetings?: Array<Partial<MeetingNote> | ApiCardMeeting> | null,
  fallbackActivityEarly?: string | null,
) => {
  if (Array.isArray(meetings) && meetings.length > 0) {
    return meetings.map((meeting, index) =>
      createMeetingNote({
        title: meeting.title?.trim() || `Meeting ${index + 1}`,
        location: meeting.location ?? "",
        startedAt: meeting.startedAt ?? "",
        notes: meeting.notes ?? "",
      }),
    );
  }

  return parseLegacyMeetingNotes(fallbackActivityEarly);
};

export const buildActivityEarlySummary = (meetings: MeetingNote[]) =>
  meetings
    .map((meeting, index) => {
      const parts = [
        meeting.title?.trim() || `Meeting ${index + 1}`,
        meeting.location?.trim()
          ? `Location: ${meeting.location.trim()}`
          : "",
        meeting.startedAt?.trim()
          ? `Started: ${meeting.startedAt.trim()}`
          : "",
        meeting.notes?.trim(),
      ].filter(Boolean);

      return parts.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
