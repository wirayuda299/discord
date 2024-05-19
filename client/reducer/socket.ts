import { Message } from "@/types/messages";
import { Permission } from "@/types/server";

export type SocketStates = {
  channel_messages: Message[];
  active_users: string[];
  personal_messages: Message[];
  thread_messages: Message[];
  user_roles: Permission
};

type AllowedActionType =
  | "CHANNEL_MESSAGES"
  | "ACTIVE_USERS"
  | "PERSONAL_MESSAGES"
  | "THREAD_MESSAGES"
  | 'SET_USER_ROLES'

type ActionType = {
  type: AllowedActionType;
  payload: any;
};

export function socketReducer(states: SocketStates, action: ActionType) {
  switch (action.type) {
    case "ACTIVE_USERS":
      return {
        ...states,
        active_users: action.payload,
      };
    case "PERSONAL_MESSAGES":
      return {
        ...states,
        personal_messages: action.payload,
      };
    case "CHANNEL_MESSAGES":
      return {
        ...states,
        channel_messages: action.payload,
      };

    case "THREAD_MESSAGES":
      return {
        ...states,
        thread_messages: action.payload,
      };
    case "SET_USER_ROLES":
      return {
        ...states,
        user_roles: action.payload,
      };

    default:
      throw new Error("Invalid action: " + action.type);
  }
}
