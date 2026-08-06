type HostUser = {
  userId: string;
  fullName: string;
  email: string;
  color: string;
};

export const recipientsAdapter = {
  toRecipient(user: HostUser) {
    return {
      id: user.userId,
      label: user.fullName,
      name: user.fullName,
      email: user.email,
      color: user.color,
    };
  },
  toRecipients(users: HostUser[]) {
    return users.map((user) => this.toRecipient(user));
  },
};
