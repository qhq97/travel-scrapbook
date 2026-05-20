export type Trip = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  inviteCode: string;
  createdAt: string;
};

export type EntryComment = {
  author: string;
  body: string;
};

export type Entry = {
  id: string;
  tripId: string;
  type: "photo" | "note" | "quote" | "place";
  author: string;
  title: string;
  body: string;
  location: string;
  image: string;
  mood: string;
  comments: EntryComment[];
  createdAt: string;
};

export type NewTripInput = {
  title: string;
  subtitle?: string;
  cover?: string;
  inviteCode: string;
};

export type NewEntryInput = {
  tripId: string;
  type: "photo" | "note" | "quote" | "place";
  title: string;
  body: string;
  location: string;
  mood: string;
};

export type EntryType = Entry["type"];